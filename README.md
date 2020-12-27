# Ajax
## Ajax-创建XMLHttpRequest对象的方式
* 由于XMLHttpRequest对象存在兼容性问题，主要是老版本的IE6和IE7使用的是ActiveX对象。该实例创建的方式如下：
```
let xmlHttp;
if(window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
}else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
}
```
## Ajax-向服务器发送请求的方式
* 使用open和send方法来向服务器发送请求，实现的方式如下所示
```
    xmlHttp.send("GET", "test.txt", true);
    xmlHttp.open();
```
* 在上面的实例方法中使用了open和send方法，两个方法中传入的参数解释如下
    * send: open(method, url, async),method表示请求的类型，GET还是POST；url：指的是文件在服务器上的位置；async：true(异步)和false(同步)
    * open(string): 将请求发送到服务器，string仅仅用在POST请求当中
* 两种方式发送的实例如下
    * get请求：
    ```
        xmlHttp.send("GET", "demo_get.asp?T=" + Math.random(), true);
        xmlHttp.open()
    ```
    * post请求
    ```
        xmlHttp.send("POST", "ajax_test.asp", true);
        xmlHttp.setRequestHeader("Content-type", "application/json");
        xmlHttp.open("fname=Bill&lname=GEates");
    ```
## Ajax-服务器响应
* 服务器响应方式，需要使用到XMLHttpRequest对象的responseText和responseXml
    * responseText: 获得字符串形式的响应数据
    * responseXml：获的Xml形式的响应数据
## Ajax-onreadystatechange事件
* 当请求被发送到服务器时，需要执行一些基于响应的任务，当readyState改变时，就会去触发onreadystatechange事件
* XMLHttpRequest对象的三个重要的属性
    * onreadystatechange： 存储函数，当readyState属性改变时，就会去触发这个函数
    * readyState几个状态，从0到4发生变化
        * 0： 请求初始化
        * 1： 服务器连接已经建立
        * 2： 请求接收中
        * 3： 请求处理中
        * 4： 请求处理完成，并且响应已就绪
    * status
        * 200： "OK"
        * 404: 未找到网页
* 当响应成功后就会去有下面的实例发生
    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            ....//执行你想要的操作
        }
    }
# js基础几个原理运用
## call与apply
* 两个的方法的异同点，改变this指向，传参列表不同
### call方法原理实现方式
* 首先需要知道eval方法，该方法的作用是去执行里面的js代码
* 其传递多个参数，第一个参数表示this执行，后面表示的是传入的参数列表，实现原理如下：
```
    Function.prototype.newCall = function() {
        var ctx = arguments[0] || window;
        ctx.fn = this;
        var arr = [];
        for(var i = 1; i < arguments.length; i++> {
            arr.push('arguments['+ i +']');
        })
        var result = eval('ctx.fn('+arr.join(',')+')')
        delete ctx.fn;
        return result;
    }
```
### apply方法原理实现方式
* 其传递两个参数，第一个参数表示this执行，第二个参数是一个数组，存放参数列表中的内容
```
    Function.prototype.newApply = function(ctx, arr) {
        var ctx = arguments[0] || window;
        ctx.fn = this;
        if(!arr) {
            var result = ctx.fn();
            delete ctx.fn;
            return result;
        } else {
            var args = [];
            for(let i = 0; i < arr.length; i++) {
                arr.push('arguments['+ i +']');
            }
            var result = eval('ctx.fn('+ args.join(',') +')');
            delete ctx.fn;
            return result;
        }
    }
```

## 函数抖动与函数节流
### 函数防抖
* 含义：指的是触发事件后n秒内函数只能执行一次，如果在n秒内又触发了该事件，则会重新计算函数执行时间
* 使用场景：连续的事件，只需要去触发一次回调函数
    * 搜索框搜索输入，只需要用户最后一次输入外，再发送请求
    * 手机号、邮箱验证输入检测
    * 窗口大小Resize。只需要窗口调整完成后，计算窗口大小，防止重复渲染
* 简单实现方式
```
    const debounce = (func, wait) => {
        let timer;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(func, wait);
        }
    }
```
### 函数节流
* 含义： 指的是限定一个函数在一定时间内只能执行一次
* 使用场景：间隔一段事件执行一次回调函数
    * 滚动加载，加载更多或滚动到底部监听
    * 谷歌搜索框，搜索联想功能
    * 高频点击提交，表单重复提交
* 简单实现方式
const throttle = (func, wait) => {
    let timer;
    return () => {
        if(timer) {
            return;
        }
        timer = setTimeout(() => {
            func();
            timer = null;
        }, wait)
    }
}

## 函数柯里化与数组扁平化
### 函数柯里化
* 对于函数柯里化的理解，通俗来说就是在函数参数传递的过程中可以通过多此的参数传递，使得这个函数的参数个数达到饱和。
* 函数柯里化的实现原理：
```
//将函数的参数划分为两部分
function FixedCurry(fn) {   
    //将类数组之后的元素给放在当前的这个数组当中
    const  _args = [].slice.call(arguments, 1);
    return function() {
        const newArgs = _args.concat([].slice.call(arguments, 0));
        return fn.apply(this, newArgs)
    }
}

//采用递归的思想，重复上述的这个过程
const newCurry = function (fn, length) {
    if(arguments.length < length) {
        const combined = [fn].concat([].slice.call(arguments, 0));
        return newCurry(FixedCurry.apply(this, combined), length - arguments.length);
    } else {
        return fn.apply(this, arguments)
    }
}
```
### 数组扁平化
* 数组扁平化的函数就是将一个多维数组转化为一个一维数组的过程
```
    //判断参数是否为一个数组的方式，可以采用isArray,也可以采用下面的方式来封装
    function isArray(obj){
        return Object.prototype.toString.call(obj) === '[object Array]
    }
    //数组扁平化方法，采用两种方式来实现
    Array.prototype.flatten = function(){
        const result = [];
        this.forEach(function(item)) {
            isArray(item) ? result = result.concat(item.flatten) : result.push(item);
        }
        return result;
    }

    function flatten(arr) {
        const result = arr || [];
        return arr.reduce(function(prev, next){
            return isArray(next) ? result = result.concat(flatten(next)): result.concat(next)
        },[]);
    }
```

## 纯函数与记忆函数
### 纯函数
* 含义：对于纯函数的理解其实非常简单，在一个函数中，该函数接收某种类型的输入就会得到相同类型的输出
* 好处：使用纯函数编程的方式就只需要去考虑输入与输出
* 案列：在redux中的reducer就是一个纯函数，具体可以参考这个
### 记忆函数
* 含义：能够将上一次输出的结果保存下来给下一次函数下一次使用。其实其本质就是设置一个缓存的解构，以空间来换取时间的过程
* 具体实例，以斐波拉契数列为例，实例如下：
```
    function factorial(n) {
        const cache = {};
        return function _fib(n){
            if(cache[n]) {
                return cache[n]
            }else{
                if(n === 1 || n === 2) {
                    cache[n] = 1;
                    return 1;
                }else{
                    cache[n] = n*_fib(n - 1);
                    return cache[n];
                }
            }
        _fib(n)
    }
```

### 两者的相同点与异同点
* 相同点：
    * 都可以通过setTimeout实现
    * 目的都是降低回调执行频率，节省计算资源
* 不同点：
    * 函数抖动，在一段连续操作后，处理回调函数，利用clearTimeout和setTimeout实现。函数节流，在一段连续操作中，每一段时间只执行一次，频率较高的事件中使用来提高性能
    * 函数抖动关注一定时间连续触发，只在最后一次执行，而函数节流侧重于一段时间内只执行一次

# es6
## let和const命令
* 当使用这两个命令后存在以下的事情发生
    * 不存在变量提升，在es5之前变量可以在声明之前被使用，即值为undefined，这种方式就叫变量提升，但是在let和const命名中，如果需要使用变量名称那么就需要在let和const声明之后才能被使用，否则就会报错
    * 暂时性死区，只要在块级作用域内存在let或者是const命令，那么所声明的变量就会绑定在这个块级作用域之中，如果在块级作用域之外去使用变量，那么这个变量就不能够被使用
    * 不允许重复声明，在es5之前可以变量提升时，如果多个变量重复定义是被允许的。但是在es6之后，如果使用了let和const指令，那么在当前的作用域内声明了这个变量，那么当再次去声明相同的变量时，就会出现报错，这种方式是不能够允许的
    * 块级作用域，let和const命令其实就是js新增的块级作用域，当在多个块级作用域中声明相同的变量时，那么各个块级作用域中的变量是不会受到相互影响的如在下面的案例中展示
    ```
    {{{{
        {let ins = "hello world" console.log(ins) // hello world}
        console.log(ins) //报错，在当前的块级作用域中并不存在ins
    }}}}
    ```
    * 块级作用域于函数声明，在es5中，函数只能在顶层的作用域和函数作用域中去声明，不能在块级作用域中去声明，在语法上就会报错，但是在浏览器中并不会报错如在下面的案例中
    ```
    if(true) {
        function() {} //会报错
    }

    try{
        function f() {}
    } catch(e) {

    }
    ```
    * es6中其改变了块级作用域内声明函数的处理规则
        * 允许在块级作用域内声明函数
        * 函数声明时，会被提升到全局作用域或者时函数作用域的头部
        * 同时，函数声明会被提升到所在的块级作用域的头部
    * let与const命名之间的区别，let用于去表示一个变量，即该变量的值，可以在任意时刻被改变。const指令则不同，需要在最初就定义好变量的值，并且在之后的操作过程中，该变量的值不能够被改变
* es6中六种声明变量的方式
        * 在es5中的var和function
        * es6中的let和const指令
        * import和class两种去声明变量名
* 顶层对象，在浏览器的环境中指的是window对象，在Node中指的则是global对象，在js中顶层对象的属性赋值与全局变量的赋值被认为是同样的事情，即如果你声明了一个全局属性，那么该属性在js中就会被认为是加在了顶层的对象当中

## 变量的解构赋值
* 在es6中，允许按照一定的模式，从对象和数组中去提取值，对变量进行赋值，这种方式被称为解构赋值
### 数组的解构赋值
* 在数组的结构赋值中，按照对应的位置，对变量进行赋值，如下面案列所示
```
    let [a, b, c] = [1, 2, 3]
    //a = 1; b = 2, c = 3
```
* 在上面的这个案例中，其本质上的这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予右边的值
* 嵌套数组中的结构赋值，如果在解构的过程中，解构不成功就会是undefined，如下面的案例所示
```
 let [foo, [[bar], baz]] = [1, [[2], 3]];
 //foo = 1; bar = 2; baz = 3
 let [x, , y] = [1, 2, 3]
 //x = 1; y = 3
 let[x, y, ...z] = ['s']
 //x = 's' y = undefined; z = []
```
* 默认值，在解构赋值的过程中是允许指定默认值得，判断一个位置是否有值，在es6中严格使用===，只有当一个数组成员严格等于undefined时，默认值才会生效。如下面得案列所示
```
    let [x = 1] = [undefined]
    //x = 1;
    let [x = 1] = [null]
    //x = null
    let [x = 1, y = x] = [];
    //x = 1; y = 1;
    let [x = 1, y = 2] = [2];
    //x = 2; y = 2
    let [x = 1, y = 2] = [2, 3];
    //x = 2; y = 3;
    let [x = y; y = 1] = [];
    //此时会报错，原因是y的值在最开始的时候就是undefined
```
### 对象的解构赋值
* 在对象的解构赋值中与数组有一个最大的不同点，就是数组的元素解构是按照顺序执行的，变量的取值由位置所决定；而对象的属性是没有次序的，变量必须与属性名一样，才能够得到正确的值。如下面的案例所示
```
    let { foo, bar, baz } = { bar: '456', foo: '123' }
    //foo: '123, bar: '456', baz的值为undefined
```
* 在上面的案例中，如果在解构的过程中，并没有解构成功的话，那么变量的值就为undefined
* 对象在解构的过程中，可以将对象中含有的方法很自然而然的给解构出来，比如在Math这个对象中有log sin cos等方法，那么在对象的解构下，就可以用下面的方法来展示
```
    //案列一
    const { sin, cos, log } = Math;
    console.log(sin(123)); //此时就会打印出对应的值
    //案例二
    const { log } = console;
    log(123)//此时在控制台就会打印出123
```
* 在对象的解构赋值的内部机制中，是先找到同名的属性，然后再赋值给对应的变量，真正被赋值的是后者而不是前者，如下面的案列所示
```
    let { foo: baz } = { foo: '123', bar: '345'}
    console.log(baz) // '123'
    console.log(foo) // foo is not defined
```
* 对象解构赋值过程中指定默认值，如果解构的值解构出的为undefined那么在解构的过程中，那么在存在默认值的情况下就会指定该属性为默认值。如下面的案例所示
```
    const { x = 3 } = {}
    console.log(x) // 3
    const {x, y = 5} = {x : 3};
    console.log(x, y) // 3, 5
```
* 注意点，如果将一个已经声明的变量用于解构赋值，那么久需要使用()，如下面的案例所示
```
    let x;
    { x } = { x: 1 }
    
    //正确的写法
    let x;
    ({x} = {x: 1});
```
### 字符串的对象解构
* 在字符串的解构过程中，其实就是将字符串转化为了一个类似数组的对象，如下面的案例所示：
```
    const [a, b, c, d, e] = 'hello'
    //a = 'h'; b = 'e'; c = 'l'; d = 'l' e = 'o'
```
### 数值和布尔值的解构赋值
* 在解构赋值的时，如果等号右边时数值和布尔值，就会先转化为对象，如下面的案例所示
```
    let { toString: s } = 123;
    s === Number.prototype.toString;

    let {toString: s} = false;
    s === Boolean.prototype.toString;
```
### 函数参数的解构赋值
* 在函数参数的解构赋值中，其过程就类似与数组和对象的解构一样，如下面的案例所示
```
function add([x, y]) {
    return x + y;
}

[[1, 2], [3, 4]].map(([a, b]) => a + b)
```

### 不能使用圆括号的情况
* 在解构赋值的过程中有三种情况是不能够使用圆括号的
    * 变量声明语句
    * 函数参数
    * 赋值语句的表达式

### 解构赋值的用途
* 交换变量的值，以下面的实例所示
```
    let x = 1, y = 2;
    [x, y] = [y, x];
    console.log(x, y);
    // x = 2, y = 1
```
* 解构函数返回的多个值，当在函数返回的是一个对象或者是数组时，就可以采用对象解构的方式，来获取值
```
    function example(){
        return [1, 2, 3]
    }
    let [a, b, c] = example();
    //a = 1, b = 2, c = 3
```
* 函数参数的定义，传入一组数据给函数，函数通过解构的方式解构出该组数据
```
    //参数是一组有次序的值时,可以采用数组的形式赋值
    function f([x, y, z]) {
        console.log(x, y, z)
    }
    f([1, 2, 3]);
    //参数是一组无序的值时，可以采用对象的方式来及逆行解构
    function f({x, y, z}) {
        console.log(x, y, z);
    }
    f({z: 1, y: 3, x: 2})
```
* 提取类似于json这样的数据时
```
    let json = {
        id: 42,
        status: '200',
        data:['123', '234']
    }
    let { id, status, data } = json
    console.log(id, status, data)
```
* 函数的默认值，以下面的案例所示
```
    jQuery.ajax = function(url, {
        async= true,
        beforeSend = function() {},
        cache = true,
        complete = function() {},
        global = true,
        ...
    } = {})
```
* 遍历Map结构，使用for...of...循环遍历
```
const map = new Map()
map.set('first', 'hello');
map.set('second', 'world');
for(let [key, value] of map) {
    console.log(`${key}-${value}`)
}
```
* 输入模块的指定方法，在加载模块时，直接采用对象结构的方式来加载
```
    const { SourceMapConsumer, SourceMap } = require("source-map") 
```

## 字符串的扩展
### 字符串的Unicode表示法
* 在es6中加强了对unicode的支持，允许采用\uxxxx形式来表示一个字符，其中xxxx表示字符的unicode码点。但是这种表示方法只限于码点在\u0000~\uFFFF之间的字符，超过这个就需要采用双字节累表示。如下面的案列所示
```
    "\u0661"
    "\uD842\uDFB7"
```
* 对于这种超过码点的方式，在es6中做出了一点的改进，只需要将码点放在大括号中，就能正确的解读该字符
```
'\u{1F680}' === '\uD83D\uDE80'
```
### 字符串的遍历器接口
* 在es6中为字符串添加了遍历器接口，使得字符串可以适用for...of...循环遍历
```
for (let codePoint of 'foo') {
    console.log(codePoint);
}
// 'f'
// 'o'
// 'o'
```
* 适用for...of...还可以去识别码点大于0xFFFF的码点，for...in...循环就无法去识别这样的码点
```
let text = String.from.fromCodePoint(0x20BB7);
for(let i of text) {
    console.log(i)
}
```

### 直接输入U+2028和U+2029
* 在js的字符串中允许直接输入字符，以及输入字符的转义形式。如下面的案列所示
```
'中' === '\u4e2d' //true
```
* 但是在js中规定有5个字符不能在字符串中去直接使用，需要采用转义的形式来。这个规定本身没有任何问题，主要是在json格式中其允许在字符串中可以直接使用 U+2028（行分隔符）和 U+2029（段分隔符）。但是json格式已经被冻结，没有办法去修改。因而在es2019中允许js字符串直接输入上述的两个符号
    * U + 005C：反斜杠
    * U + 000D: 回车
    * U + 2028：行分隔符
    * U + 2029: 段分隔符
    * U + 000A: 换行符

### JSON.stringify()方法的改造
* 按照标准，JSON数据必须是UTF-8编码，但是在JSON.stringify()方法中可能返回不符合规定的UTF-8比奥准的字符串，具体来说就是utf-8标准规定，0xD800和0XDFFF之间的码点，不能单独使用，必须配对来使用。
* JSON.stringify()的问题在于，它可能返回0xD800到0xDFFF之间的单个码点，因而在es2019中中为了确保返回的是合法的utf-8字符，es2019改变了JSON.stringify()的行为。如果遇到0xD800到0XDFFF之间的单个码点，或者不存在的配对形式，他会返回转义字符串

### 模板字符串
* 对于传统的js而言，输出模板通常就是采用单双引号的写法来写如下面的案列所示
```
$('#result').append(
  'There are <b>' + basket.count + '</b> ' +
  'items in your basket, ' +
  '<em>' + basket.onSale +
  '</em> are on sale!'
);
```
* 对于上述的这种单双引号写法有几点的注意方式
    * 在书写的过程中如果需要换行，就需要采用+的方式
    * 表示一个变量时，也需要去采用+的方式
    * 如果是字符串的嵌套表示，需要单双引号一起配套使用
    * 空格在上述的方式中，如果有多个只表示一个
* 对于上述的这种方式来说，在书写的过程就会有很多的麻烦，因为在es6中就有模板字符串来增强对字符串的可操作性，使用反引号(`)表示。它可以当作是普通的字符串来使用，也可以来定义多行的字符串，或者在字符串中嵌入变量。如下面的案列所示
```
// 普通字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
 not legal.`

console.log(`string text line 1
string text line 2`);

// 字符串中嵌入变量
let name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`
```
* 在采用模板字符串的表示过程中，空格和换行都是被保留的，不会出现之前使用单双引号方式来表示的问题
* 模板字符串中嵌入变量的方式，需要将变量名写在${}这个符号之中,如下面的案列所示
```
const time = `!!!!!!!`
 console.log(`hello world ${time}`)
```
* 在这种的写法中，可以在其内部放入任意的js表达式，可以进行运算，以及引用对象的属性。如下面所示
```
let x = 1;
let y = 2;

`${x} + ${y} = ${x + y}`
// "1 + 2 = 3"

`${x} + ${y * 2} = ${x + y * 2}`
// "1 + 4 = 5"

let obj = {x: 1, y: 2};
`${obj.x + obj.y}`
```
* 在模板字符串中调用函数，如下面的案列所示
```
function fn() {
    return `hello world`
}
`foo ${fn()} bar`
```
* 模板字符串之间的嵌套使用,如下面的案列所示
```
const tpl = 123, temp = 456
console.log(`result is ${tpl + `${temp}`}`)
```
### 实例：模板编译
* 模板编译函数，如下面所示
```
function compile(template){
  const evalExpr = /<%=(.+?)%>/g;
  const expr = /<%([\s\S]+?)%>/g;

  template = template
    .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
    .replace(expr, '`); \n $1 \n  echo(`');

  template = 'echo(`' + template + '`);';

  let script =
  `(function parse(data){
    let output = "";

    function echo(html){
      output += html;
    }

    ${ template }

    return output;
  })`;

  return script;
}
```
### 标签模板
* 对于模板字符串的功能，其不仅可以用来表示字符串，也可以在紧跟在一个函数名的后面，该函数将用来处理这个模板字符串，这种被称为"标签模板"功能
* 对于标签模板的理解，标签模板其实不是模板，而是函数调用的一种特殊形式。"标签"指的就是函数，紧跟在后面的模板字符串就是它的参数
```
alert`hello`
//等同于
alert(['hello'])
```
* 如果是模板字符里面有变量，就不是简单的调用了，而是会将模板字符串先处理成多个参数，再调用函数，如下面的案例所示
```
let a = 5;
let b = 10;
tag`Hello ${a + b} world ${a*b}`
//等同于
tag(['Hello ', ' world ', ''], 15, 50);
```
* 使用标签模板，可以插入其他语言以及用法如java或者是jsx
### 模板字符串的限制
* 在标签模板中，可以内嵌其他语言，但是模板字符串默认会将字符串转义，导致无法嵌入其他语言

## 字符串的新增方法
### String.fromCodePoint()
* es5中提供了String.fromCharCode()方法，用于Unicode码点返回对应字符，但是这个方法不能识别码点大于0xFFFF的字符。因而在es6中提供了String.fromCodePoint()方法，可以识别大于0xFFFF的字符，弥补了之前的String.fromCharCode()方法的不足
### String.raw()
* 在es6中为原生的String对象，提供了一个raw()方法。该方法返回一个斜杠都被转义的字符串，往往用于模板字符串的处理方法
```
String.raw`Hi\n${2+3}!`
// 实际返回 "Hi\\n5!"，显示的是转义后的结果 "Hi\n5!"

String.raw`Hi\u000A!`; //true
```
### 实例方法：codePointAt()
* 在js内部，字符以UTF-16的合适存储， 每个字符固定为2个字节。对于有的需要4个字节存储的字符。js会以为他们是两个字符。因而在es6中使用codePointAt()方法，能够处理正确4个字节存储的字符，返回一个码点
```
let s = '𠮷a';

s.codePointAt(0) // 134071
s.codePointAt(1) // 57271

s.codePointAt(2) // 97
```
* 该方法的参数，是字符在字符串中的位置(从0开始)，如果存在顺序上得问题，那么解析出来就不正确
### normalize()
* 用于去表示类似欧洲语言中有语调符号和重音符号的，在Unicode中提供了两种方法，一种是直接提供带重音的符号。另外一种是提供合成符号，即原字符与重音符号的合成，两个字符合成一个字符。这两种表示方法，在视觉和语义上都是等价的，但是在js中不能识别。
```
'\u01D1'==='\u004F\u030C' //false

'\u01D1'.length // 1
'\u004F\u030C'.length // 2
```
* 因而在es6中提供了字符串实列的normalize()方法，用来将字符的不同表示方式统一为同样的形式，这个过程就叫做Unicode正规化
### 实列方法: includes(), startsWith(), endsWith()
* 在原有的js中只有indexOf方法，可以用来确定一个字符串是否包含在另外一个字符串中，es6中又提供了三种方式
    * includes: 返回布尔值，表示是否找到参数字符串
    * startsWidth: 返回布尔值，表示参数字符串是否在原字符串的头部
    * endsWith: 返回布尔值，表示参数字符串是否在原字符串的尾部
* 如下面的实例所示
```
let s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true
```
* 这三个方法都支持第二个参数，表示开始搜索的位置，如下所示
```
let s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```
### 实例方法: repeat()
* 该方法返回一个新的字符串，表示原字符串重复n次，但是对于参数有以下几点说明
    * 参数是小数，会被取整
    * 参数是负数或者Infinity，会报错
    * 参数是0到-1之间的小数，等同于0
    * 参数是NaN等同于0
    * 参数是字符串，则会转化为数字
* 以下面的实例进行说明
```
'na'.repeat(2.9) // "nana"
'na'.repeat(Infinity)
// RangeError
'na'.repeat(-1)
// RangeError
'na'.repeat(-0.9) // ""
'na'.repeat(NaN) // ""
'na'.repeat('na') // ""
'na'.repeat('3') // "nanana"
```

