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
### 实例方法：padStart() padEnd()
* 在es2017中引入字符串补全长度的功能，如果某个字符串不够指定长度，会在头部或者是尾部自动补全。其中padStart()用于头部补全，padEnd()用于尾部补全，如下面的案例所示：
```
'x'.padStart(5, 'ab') //'ababx'
'x'.padEnd(5, 'ab') //'xabab'
```
* 在上述的两个方法中，有两个参数，第一个参数是字符串生效的最大长度，第二个参数是用来补全的字符串，需要注意的是**如果原字符串的长度，等于或者是大于最长长度，则字符串补全不生效，返回原来的字符换**
，如果用来补全的字符串与原字符串，两者之和长度超过了最大长度，则会截去超出位数的补全字符串，如果省略掉第二个参数，默认使用空格补全长度

### 实例方法：trimStart(),trimEnd()
* 在es2019中对字符串新增的两个方法，他们的行为和trim方法一致，trimStart()用于去消除字符串头部的空格，trimEnd()消除尾部的空格，返回的都是新的字符串，不会去修改原始的字符串
```
const s = '  abc  ';

s.trim() // "abc"
s.trimStart() // "abc  "
s.trimEnd() // "  abc"
```

### 实例方法：matchAll()
* 该方法返回一个正则表达式在当前字符串的所有匹配

### 实例方法：replaceAll()
* 之前的方法所提供的replace()只能替换匹配的第一个，对于之前的方式，如果要全部匹配需要使用到的就是正则表达式。在es2021中引入了replaceAll()，可以一次性替换掉所有符合匹配的匹配项
```
'aabbcc'.replaceAll('b', '_')
// 'aa__cc'
```
* 对于该方法的说明，返回一个新的字符串，不会改变原字符串

## 数值的扩展
### 二进制和八进制表示法
* 在es6中提供了二进制和八进制数值的新的写法，分别需要使用前缀0b(或0B)和0o(或0O)表示，如下案例所示
```
0b111110111 === 503 // true
0o767 === 503 // true
```
* 如果要将0b和0o前缀的字符串数值转为十进制，要使用Number方法,原因是因为Number方法第二个参数就是默认的为转化为十进制，如下所示
```
    Number('0b111') // 7
    Number('0o10') //8
```
### Number.isFinite(), Number.isNaN()
* 这两个方法的分别作用如下：
* Number.isFinite()用来检查一个数值是否为有限的(finite)，即不是Infinity,需要去注意的就是**如果参数类型不是数值,Number.isFinite一律返回false**如下面的案例所示
```
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
Number.isFinite('15'); // false
Number.isFinite(true); // false
```
* Number.isNaN用来检查一个值是否为NaN，**需要注意的是如果参数不是NaN，全部返回true**,如下面的案例所示：
```
Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9/NaN) // true
Number.isNaN('true' / 0) // true
Number.isNaN('true' / 'true') // true
```
* 上述的两个方法与传统的全局方法isFinite()和isNaN()相比较，传统的方法需要先调用Number（
,将非数值的值转化为数值，再进行判断，而这两个新方法只对数值有效

### Number.parseInt()和Number.parseFloat()
* es6中将全局的parseInt()和parseFloat()给移植到Number对像上面，行为完全保持不变
```
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
```

### Number.isInteger()
* 该方法用来判断一个数值是否为整数
```
Number.isInteger(25) //true
Number.isInteger(23.9) // false
```
* 如果参数不是数值，该方法直接返回false
* 需要去注意的就是以下的这点**如果数值的精度超过了这个限制，第54及其以后的位就会被丢弃，这种情况下该方法就不适用**

### Number.EPSILON
* es6在Number对象上，新增了一个极小的常数Number.EPSILON，该常数在1与大于1的最小浮点数之间

### 安全整数和Number.isSafeInteger()
* 在js中能够准确表示的整数范围在-2^53到2^53之间(不包含两个端点)，超过这两个范围就无法准确的表示这个值
```
Math.pow(2, 53) // 9007199254740992

9007199254740992  // 9007199254740992
9007199254740993  // 9007199254740992

Math.pow(2, 53) === Math.pow(2, 53) + 1
// true
```
* 因而在es6中引入了Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限，如下面的案例所示
```
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1
// true
Number.MAX_SAFE_INTEGER === 9007199254740991
// true

Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER
// true
Number.MIN_SAFE_INTEGER === -9007199254740991
// true
```

### Math.trunc()
* 该方法用来去除一个数的小数部分，返回整数部分,如下面的案例所示
```
Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0
```
* 对于这给个方法有以下的几点说明
    * 对于非数值,Math.trunc内部使用Number方法将其转为数值
    ```
    Math.trunc('123.456') // 123
    Math.trunc(true) //1
    Math.trunc(false) // 0
    Math.trunc(null) // 0
    ```
    * 对于控制和无法截取整数的值，返回NaN
    ```
    Math.trunc(NaN);      // NaN
    Math.trunc('foo');    // NaN
    Math.trunc();         // NaN
    Math.trunc(undefined) // NaN
    ```
    * 对于没有部署这个方法的环境。可以采用下面的方式来模拟这个方法
    ```
    Math.trunc = Math.trunc || function(x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    }
    ```

### Math.sign()
* 该方法用来判断一个数到底是正数、负数、还是零，对于非数值，会将其转化为数值，会返回五种值
    * 参数是正数，返回+1
    * 参数是负数，返回-1
    * 参数是0，返回0
    * 参数是-0， 返回0
    * 参数是其他值，返回NaN
```
Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN
```
* 如果参数是非数值，会自动转为数值，对于那些无法转为数值的值，会返回NaN
```
Math.sign('')  // 0
Math.sign(true)  // +1
Math.sign(false)  // 0
Math.sign(null)  // 0
Math.sign('9')  // +1
Math.sign('foo')  // NaN
Math.sign()  // NaN
Math.sign(undefined)  // NaN
```
* 对于没有部署这个方法的环境，可以采用下面的方式来模拟
```
Math.sign = Math.sign || function(x) {
    x = +x;
    if(x == 0 || isNaN(x) {
        return x;
    })
    return x > 0 ? 1 : -1;
}
```

### Math.cbrt()
* 该方法用于去计算一个数的立方根，如下面所示
```
Math.cbrt(-1) // -1
Math.cbrt(0)  // 0
Math.cbrt(1)  // 1
Math.cbrt(2)  // 1.2599210498948732
```
* 对于非数值，Math.cbrt()方法内部也是先使用Number()方法转化为数值
* 对于没有部署的这个方法的环境，可以用下面的代码来模拟
```
Math.abrt = Math.abrt || function(x) {
    const y = Math.pow(Math.abs(x), 1/3);
    return x < 0 ? -y : y;
}
```

### Math.clz32()
* 该方法将参数转为32位无符号整数的形式，然后返回这个32位值里面有多个前导0，如下面的案例所示
```
Math.clz32(0) // 32
Math.clz32(1) // 31
Math.clz32(1000) // 22
Math.clz32(0b01000000000000000000000000000000) // 1
Math.clz32(0b00100000000000000000000000000000) // 2
```

### Math.imul()
* 该方法返回两个数以32位带符号整数形式相乘的结果，返回的也是一个32位的带符号整数
```
Math.imul(2, 4) //8
Math.imul(-1, 8)  // -8
Math.imul(-2, -2) // 4
```

### Math.fround()
* 该方法返回一个数的32为单精度浮点数形式
* 对于32位单精度格式来说，数值精度是24个二进制位(1位隐藏位于23位有效位)，所以对于-2^24至2……24之间的整数(不包含两个端点)，返回结果与参数本身一致
```
Math.fround(0) //0
Math.fround(1) //1
Math.fround(2**24 - 1) // 1677215 
```

### Math.hypot()
* 该方法返回所有参数的平方和的平方根
```
Math.hypot(3, 4);        // 5
Math.hypot(3, 4, 5);     // 7.0710678118654755
Math.hypot();            // 0
Math.hypot(NaN);         // NaN
Math.hypot(3, 4, 'foo'); // NaN
Math.hypot(3, 4, '5');   // 7.0710678118654755
Math.hypot(-3);          // 3
```

### 对数方法
* 在es6中新增了4个对数相关方法
    * Math.expm1(), 返回e^x - 1
    * Math.log1p(), 返回1+x的自然对数，即Math.log(1 + x)。如果x小于-1，返回NaN
    * Math.log10(), 返回10为低的x的对数，如果小于0，则返回NaN
    * Math.log2(), 返回以2为底的x的对数。如果x小于0，返回NaN

### 双曲函数
* 在es6中新增了6个双曲函数方法
    * Math.sinh(x) 返回x的双曲正弦
    * Math.cosh(x) 返回x的双曲余弦
    * Math.tanh(x) 返回x的双曲正切
    * Math.asinh(x) 返回x的反双曲正弦
    * Math.acosh(x) 返回x的反双曲余弦
    * Math.atanh(x) 返回x的反双曲正切

### 指数运算符
* es6中新增了一个指数运算符(**)
```
2**4 // 16
2**3**2 // 512
```

### BigInt数据类型
* 该数据类型是2020引入的一种新的数据类信号，用于解决超过整数精度的位置表示，用n来表示这种数据类型
* BigInt可以进行进制的转化，其和普通的整数时两种值，他们之间不相等，如果使用typeof对BigIt类型的数据返回bigint，BigInt可以使用负号，但是不能够使用正号，因为会与asm.js起冲突
```
0b1101n // 二进制
0o777n // 八进制
0xFFn // 十六进制

42n === 42 // false

-42n // 正确
+42n // 报错
```

### BigInt对象
* js提供原生的BigInt对象，可以用作构造函数生成BigInt类型的数值，转化规则基本与Number()一致，将其他类型的值转为BigInt
```
BigInt(123) // 123n
BigInt('123') // 123n
BigInt(false) // 0n
BigInt(true) // 1n
```
* BigInt()构造函数必须要有参数，而且参数必须可以正常转为数值，下面的这些用法会报错
```
new BigInt() // TypeError
BigInt(undefined) //TypeError
BigInt(null) // TypeError
BigInt('123n') // SyntaxError
BigInt('abc') // SyntaxError
```
* 如果参数是小数，也会报错
```
BigInt(1.5) // RangeError
BigInt('1.5') // SyntaxError
```

* BigInt对象中所含有的实例方法
    * BigInt.prototype.toString()
    * BigInt.prototype.valueOf()
    * BigInt.prototype.toLocaleString()
    * BigInt.asUintN(width, BigInt):给定的 BigInt 转为 0 到 2width - 1 之间对应的值。
    * BigInt.asIntN(width, BigInt)：给定的 BigInt 转为 -2width - 1 到 2width - 1 - 之间对应的值。
    * BigInt.parseInt(string[, radix])：近似于Number.parseInt()，将一个字符串转换成指定进制的 BigInt。
* 转化规则，可以使用Boolean, Number()和String()三个方法，将BigInt转为布尔值、数值和字符串类型
```
Boolean(0n) // false
Boolean(1n) // true
Number(1n)  // 1
String(1n)  // "1"
```
* 数学运算，BigInt类型的+ - * 和** 这四个二元运算符，与Number类型的行为一致，除了在使用/会舍弃掉小数部分，返回一个整数

* 其他运算，BigInt对应的布尔值，与Number类型的一致，即0n会转为false，1n会转为true,如下面的案例所示
```
if (0n) {
  console.log('if');
} else {
  console.log('else');
}
// else
```
* 比较运算符和相等运算符允许BigInt与其他类型的值进行混合运算，因为这样不会丢失精度
```
0n < 1 // true
0n < true // true
0n == 0 // true
0n == false // true
0n === 0 // false
```

## 函数的扩展
### 函数参数的默认值
* 在es6之前，不能直接为函数的参数只当默认值，只能采用变通的方式，如下面所示
```
function log(x, y) {
    y = y || 'world'
    console.log(x, y)
}
```
* 但是在es6允许为函数的参数设置默认值，即直接写在参数定义的后面，如下所示
```
function log(x, y = 'world') {
    console.log(x, y);
}
```
* 使用上述的方式来写由以下的两个好处：
    * 可以使得阅读代码的人，立刻认识到哪些参数可以省略，不用看函数体
    * 有利于将来代码的优化
* 参数变量是在默认声明的，所以不能用let和const再次声明，如下所示
```
function foo(x = 5) {
    let x = 1; //error
    const x = 2; //error
}
```
* 在使用参数默认值时，函数不能有同名参数,如下所示
```
function foo(x, x, y) {
    //不报错
}
function foo(x, x, y = 1) {
    //报错
}
```
* 此外需要注意的一个地方就是，参数默认值不是传值的，而是每次都重新计算默认表达式的值，也就是说，参数默认值是惰性求值的。如下所示：
```
let x = 99;
function foo(p = x + 1) {
    console.log(p);
}

foo();
x = 100;
foo();
```

### 与解构赋值默认值结合使用
* 参数默认值可以与解构赋值的默认值多结合起来使用，如下面所示
```
function foo(x, y = 5) {
    console.log(x, y);
}
foo({})
foo({x: 1})
foo({x: 1, y = 3})
foo() //会报参数错误
```
* 在上面的这种方式重，只使用了对象的解构赋值默认值，没有使用函数参数的默认值。只有当函数foo的参数是一个对象时，变量x和y才会通过解构赋值生成。如果函数foo调用时没有提供参数，变量x和y就不会生成，从而报错，因此可以采用下面的这种方式来进行避免
```
function foo({x, y = 5} = {} {
    console.log(x, y);
})
```
* 第二种解构默认值的方式，如下面所示
```
function fetch(url, { body = '', method = 'GET' , headers = {}} = {}) {
    console.log(method);
}
```

### 参数默认值的位置
* 通常情况下，定义了默认值的参数，应该是在函数的尾参数，因此这样比较容易看出来，到底是省略了哪些此参数。如果非尾部的参数设置了默认值，实际上这个参是没有办法省略的。如下所示
```
function f(x = 1, y) {
    return [x, y];
}
f() // [1, undefined]
f(,1) // 报错
```
* 如果传入Undefined，就会去触发该参数是不是等于默认值，null则没有这个效果

### 函数的length属性
* 指定了默认值后，函数的length属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，length属性将失真。如下面的案例所示
```
(function(a) {}).length // 1
(function(a = 1) {}).length // 0
(function(a, b, c = 1)).length // 2
```
* 关于length属性的含义是：该函数预期传入的函数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数。这样在下面提到的rest参数也不会被记入length属性当中
```
(function(...args){}).length // 0
```
* 如果设置了默认值的参数不是尾参数，那么length属性也就不会在记入后面的参数了，如下所示
```
(function(a = 0, b, c) {}).length // 0
(function(a, b, c = 2)).length // 2;
```

### 作用域
* 一旦设置了参数的默认值，函数在进行声明初始化时，参数会形成一个单独的作用域。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的
```
var x = 1;
function f(x, y = x) {
    console.log(y);
}
f(2) //2
```
* 在上面的代码中，参数y的默认值等于变量x。调用函数f时，参数形成一个单独的作用域。在这个作用域中，默认值变量x指向第一个参数x，而不是全局变量x，所以输出2。在看下面的案例
```
var x = 1;
function f(y = x) {
    let x = 2;
    console.log(y);
}
f() //1
```
* 在上面的案例中，函数f调用时，函数y=x形成了一个单独的作用域，在这个作用域中，变量x本身没有定义，所以执行外层的全局变量x。函数调用时，函数体内内部的局部变量x影响不到默认值变量x

* 应用：利用函数默认值，可以指定某一个参数不能够省略，如果省略就抛出一个错误
```
function throwIMissing() {
    throw new Error('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
    return mustBeProvided;
}
```

### rest参数
* 在es6中引入了rest参数(形式为...变量名)，用于去获取函数的多余参数，这样就不需要使用arguments对象。rest参数搭配的变量是一个数组，该变量将多余的参数放入数组中，如下面的案例所示
```
function add(...values) {
    let sum = 0;
    for(let i of values) {
        sum += i;
    }
    return sum;
}
add(2, 5, 10) // 17;
```
* **注意rest参数之后不能再有其他参数(即只能是最后一个参数)，否则就会报错**，如下面所示
```
function f(a, ...b, c) {
    //error
}
```

### 严格模式
* 在es5开始，函数内部可以设定为严格模式，如下所示
```
function doSomething (a, b) {
    "use strict";
}
```
* 在es6中做出了一点修改，如果函数参数使用了默认值、解构赋值、或者扩展运算符，那么在函数内部就不能显示的谁当为严格模式，否则就会报错
```
// 报错
function doSomething(a, b = a) {
  'use strict';
  // code
}

// 报错
const doSomething = function ({a, b}) {
  'use strict';
  // code
};

// 报错
const doSomething = (...a) => {
  'use strict';
  // code
};

const obj = {
  // 报错
  doSomething({a, b}) {
    'use strict';
    // code
  }
};
```

### name属性
* 函数的name属性，返回该函数的函数名，如下所示
```
function foo() {

}
foo.name // foo
```
* 这个属性早就被浏览器所广泛支持，但是到了es6，才将其卸载标准当中
* 需要注意的是，es6对这个属性的行为做了一些修改，如果将一个匿名和赋值给一个变量，es5
的name属性，会返回空字符串，而es6的name属性会返回实际的函数名称, 如下面的案例所示
```
var f = function () {}

//es5
f.name // ''

//es6
f.name // 'f'
```
* 如果将一个具有名字的函数赋值给一个变量，那么在es5和es6中的name属性都会返回这个具名函数原本的名称。
```
const bar = function baz() {};

// ES5
bar.name // "baz"

// ES6
bar.name // "baz"
```
* Function构造函数返回的函数实例，name属性的值为anonymous
```
(new Function).name //anonymous
```
* bind返回的函数，name属性值会加上bound前缀
```
function foo() {}
foo.bind({}).name // "bound foo"
```

### 箭头函数
* 箭头函数的基本用法，在es6中允许使用"箭头"，(=>)定义函数，如下所示
```
var f = v => v;

// 等同于
var f = function (v) {
  return v;
};
```
* 如果箭头函数不需要参数或需要多个参数，就可以使用一个原括号来代表参数部分
```
var f = () => 5;
// 等同于
var f = function () { return 5 };

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function(num1, num2) {
  return num1 + num2;
};
```
* 如果箭头函数的代码块部分多余了一条语句，就要使用大括号将他们包裹起来，并且使用return语句
```
var sum = (num1, num2) => { return num1 + num2; }
```
* 或者使用()的形式表示返回值
```
let getTempItem = id => ({ id: id, name: "Temp" });
```
* 箭头函数可以与变量解构结合,如下面的案例所示
```
const full = ({first, last}) => first + '' + last;

//等同于下面的这种形式
function full(person) {
    return person.first + "" + person.last;
}
```
* 在使用箭头函数的过程中需要注意的点
    * 函数体内到的this对象，就是定义时所在的对象，而不是使用时所在的对象
    * 不可以当作构造函数，也就是说，不可以使用new命令，否则就会报错
    * 不可以使用arguments对象，当对象在函数体内不存在时，如果要用，可以使用rest参数代替
    * 不可以使用yield命令，因为箭头函数不能用不做Generator函数
* 在使用箭头函数的过程中可以让this指向固定化，这种特性有利于封装回调函数。下面是一个案例
```
var handler = {
  id: '123456',

  init: function() {
    document.addEventListener('click',
      event => this.doSomething(event.type), false);
  },

  doSomething: function(type) {
    console.log('Handling ' + type  + ' for ' + this.id);
  }
};
```
* 在下面的这个案例中用于去判断打印出的值，如下所示
```
function foo() {
  return () => {
    return () => {
      return () => {
        console.log('id:', this.id);
      };
    };
  };
}

var f = foo.call({id: 1});

var t1 = f.call({id: 2})()(); // id: 1
var t2 = f().call({id: 3})(); // id: 1
var t3 = f()().call({id: 4}); // id: 1
```
* 为什么会得到上面所述的值呢，因为在箭头函数中只有一个this，它们的this其实都是最外层foo函数到的this
* 除了this,以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments、super、new.target
```
function foo() {
  setTimeout(() => {
    console.log('args:', arguments);
  }, 100);
}

foo(2, 4, 6, 8)
// args: [2, 4, 6, 8]
```
* 另外，由于箭头函数中没有自己的this,所以不能够用call()  apply() bind()这些方法去改变this指向

### 不适用的场景
* 在使用箭头函数的过程中需要注意以下的两点，因为箭头函数让this从动态变为了静态
    * 第一个场合时定义对象的方法时，并且该方法内部包括this
    ```
    const cat = {
    lives: 9,
    jumps: () => {
        this.lives--;
        }
    }
    ```
    * 第二个场合是需要动态this的时候，也不应该使用箭头函数
    ```
    var button = document.getElementById('press');
    button.addEventListener('click', () => {
    this.classList.toggle('on');
    });
    ```

### 嵌套的箭头函数
* 在箭头函数的内部，还可以使用箭头函数来进行嵌套，如下面所示
```
let insert = (value) => ({into: (array) => ({after: (afterValue) => {
  array.splice(array.indexOf(afterValue) + 1, 0, value);
  return array;
}})});

insert(2).into([1, 3]).after(1); //[1, 2, 3]
```

### 函数参数的尾逗号
* 在es2017允许函数的最后一个参数是有逗号，在此之前，函数定义和调用时，都不允许最后一个参数后面出现逗号。如下所示
```
function clownsEverywhere(
  param1,
  param2,
) { /* ... */ }

clownsEverywhere(
  'foo',
  'bar',
);
```

### Function.prototype.ToString()
* 在es2019中对函数实例的toString()方法做出修改，toString()方法返回函数代码本身，以前会省略注释和空格，如下所示
```
function /* foo comment */ foo () {}

foo.toString()
// function foo() {}
```

### catch命令的参数省略
* js语言的try...catch结构，在之前都明确的要求catch后面必须跟参数，接受try代码快抛出的错误对象，在es2019做出了改变，允许可以省略参数，如下所示
```
try {
  // ...
} catch {
  // ...
}
```

## 数组扩展方法
### 扩展运算符
* 扩展运算符是三个点(...)，好比rest参数的逆运算，将一个数组转为用逗号分隔的参数序列，如下所示
```
console.log(...[1,2,3])
console.log(1,...[2,3,4],5)
```

### 替代函数的apply方法
* 由于扩展运算符可以展开数组，所以不需要apply方法，将数组转为函数的参数，如下所示
```
// ES5 的写法
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6的写法
function f(x, y, z) {
  // ...
}
let args = [0, 1, 2];
f(...args);
```

### 扩展运算符的应用
* 复制数组，数组是复合的数据类型，直接复制的话，只是复制了执行底层数据结构的指针，而不是克隆一个全新的数组。
```
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```
* 合并数组，扩展数组提供了数组合并的新写法，不去使用concat函数，而是使用扩展运算符不过这两种方式都是浅拷贝，因此在使用时需要注意
```
const a1 = [{ foo: 1 }];
const a2 = [{ bar: 2 }];

const a3 = a1.concat(a2);
const a4 = [...a1, ...a2];

a3[0] === a1[0] // true
a4[0] === a1[0] // true
```
* 与结构赋值结合，扩展运算符可以与解构赋值结合起来生成新的数组
```
// ES5
a = list[0], rest = list.slice(1)
// ES6
[a, ...rest] = list
```
* 字符串，扩展运算符还可以将字符串转为真正的数组，如下所示
```
[...'hello] // ['h', 'e', 'l', 'l', 'o']
```
* 实现了iterator接口的对象，任何定义了遍历器接口的对象，都可以用扩展运算符将其转为真正的数组，如下所示
```
let nodeList = document.querySelectorAll('div');
let array = [...nodeList]
```
* 对于那些没有部署Iterator接口的类数组，扩展运算符就无法将其转为真正的数组
```
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
}
```
* 在上面的实例中，arrayLike是一个类数组，但是没有奴书Iterator接口，扩展运算符就会报错，这是可ui改为Array.from方法将arrayLike转为真正的数组

* Map和Set解构,Generator函数
* 扩展运算符内部调用的是数组解构的Iterator接口，因此只要具有Iterator接口的对象，都可以使用扩展运算符，比如Map结构，如下所示：
```
let map = new Map([
    let map = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
]);
let arr = [...map.keys()]; //[1, 2, 3]
```
* Generator函数运行后，返回一个遍历对象，因此也可以使用扩展运算符
```
const go = function *() {
    yield 1;
    yield 2;
    yield 3;
}
[...go()]; // [1, 2, 3]
```
* 在这段代码中，变量go是一个generator函数，执行返回的是一个遍历器对象，对这个遍历器对象执行扩展运算符，就会将内部遍历得到的值，转为一个数组，如果对没有Iterator接口的函数，使用扩展运算符，将会报错

### Array.from()
* Array.from()方法用于将两类对象转为真正的数组：类数组和Iterable的对象(包括Map和Set数据结构)
* 对于传入参数的说明
 * 如果参数是一个真正的数组，Array.from会返回一个一模一样的数组
 * 需要注意的是扩展运算符也可以将某些数据结构转为数组，如类数组中含有Iterable接口的
 * Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个㢝进行处理，将处理后的值放入返回的数组，如下所示
 ```
 Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]
 ```

* 如果map函数里面用到了this关键字，还可以传入Array.from的第三个参数，用来绑定this
* Array.from还可以将各种值转为真正的数组，并且还提供map功能。这实际上一位着，只有一个原始的数据结构，你就可以先对它的值进行处理，然后转换成规范的数组结构，进而就可以使用数量众多的数组方法
```
Array.from({length: 2}, () => 'jack')
```
* Array.from()的另一个应用是，将字符串转为数组，然后返回字符串的长度，因为它能正确处理各种Unicode字符，可以避免js将大于\uFFFF的Unicode字符，算作两个字符的bug

### Array.of()
* 该方法用于将一组值，转化为数组
```
Array.of(3, 11, 8);// [3, 11, 8]
Array.of(2); //[2]
Array.of(3).length // 1
```
* 这个方法的主要目的，是弥补数组构造函数Array()的不足，因为参数个数的不同，会导致Array()的行为差异
```
Array() // []
Array(3) //[ , , ,]
Array(3, 11, 8) // [3, 11, 8]
```
* Array.of总是返回参数值组成的数组，如果没有参数，就返回一个空数组，该方法的模拟过程如下：
```
function ArrayOf() {
    return [].slice.call(arguments);
}
```

### 数组的实例copyWithin()
* 数组实例的copyWithin()方法，在当前数组内部，将指定位置的成员复制到其他位置(会覆盖掉原有成员)，然后返回当前数组，也就是说，使用这个方法，会修改掉当前的数组
```
Array.prototype.copyWithin(target, start = 0, end = this.length)
```
* 该方法的参数说明
    * target(必须)： 从该位置开始替换数据，如果是负值，则表示倒数
    * start(可选)：从该位置开始读取数据，默认为0，如果是负数，表示从末尾开始计算
    * end(可选)： 到该位置前停止读取数据，默认等于数组 长度。如果是负值，表示从末尾开始计算
* 这三个参数都是数值，如果不是，会自动转为数值，如下面的案例所示
```
[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]

// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]
```

### 数组实例的find()和findIndex()
* 数组的find方法，用于找出第一个符合条件的数组成员。他的参数是一个回调函数，所有数组成员一次执行该回调函数，直到找到第一个返回值的true的成员，然后返回该成员。如果没有找到符合条件的成员，直接返回undefined
```
[1, 4, -5, 10].find(n => n < 0)
//-5
```
* 数组的findIndex方法与数组的find方法类似，如果不符合条件就返回-1，符合条件就返回当前数组的成员的位置

### 数组实例的fill()
* fill方法使用给定一个定值，填充一个数组
```
['a', 'b', 'c'].fill(7)
//[7, 7, 7]

new Array(3).fill(7);
//[7, 7, 7]
```
* fill方法还可以接受剩余的两个参数，用来指定填充的起始位置和结束位置，如下所示
```
['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']
```

### 数组实例的entires()  keys() values()
* 上述的三个方法都用于遍历数组，都可以用for...of循环进行遍历，唯一的区别在于keys是对键名的遍历，values是对键值的遍历，entries是对键值对的遍历，如下所示
```
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```

### 数组实例的includes()方法
* Array.prototype.includes方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。
```
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
```
* 该方法的第二个参数的起始位置，默认为0，如果第二个参数为负数，则表示倒数的位置，没有该方法之前采用的是indexOf方法

### 数组实例的flat(), flatMap()
#### flat
* flat方法，数组扁平化，将多维数组转化为一个一维数组的过程，该方法返回一个新的数组，对原数据没有影响
* 对于flat方法的说明，在默认情况下该方法表示只能拉平一层，传入多少的数值就表示需要扁平化多少层，也可以使用Infinity关键字作为参数，这样就表示能将一个不管是几维的数组都能转化为一个一维的数组
* 如果在原数组有空位，则flat方法会跳过空位

#### flatMap()
* 该方法对原数组的每个成员执行一个函数(相当于执行Array.prototype.map())，然后对返回值组成的数组执行flat方法。该方法返回一个新数组，不改变原数组
```
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
```

### 数组的空位
* 数组的空位，指的是某一个位置没有任何值。比如Array构造函数返回的数组都是空位
* 在es5中对于空位的处理
    * forEach filter reduce every some都会跳过空位
    * map会跳过空位，但会保留这个值
    * join和toString会将空位是为undefined, 而undefined和null会被处理成空字符串
```
[,'a'].forEach((x,i) => console.log(i)); // 1

// filter方法
['a',,'b'].filter(x => true) // ['a','b']

// every方法
[,'a'].every(x => x==='a') // true

// reduce方法
[1,,2].reduce((x,y) => x+y) // 3

// some方法
[,'a'].some(x => x !== 'a') // false

// map方法
[,'a'].map(x => 1) // [,1]

// join方法
[,'a',undefined,null].join('#') // "#a##"

// toString方法
[,'a',undefined,null].toString() // ",a,,"
```
* 在es6中明确将空位转为undefined
    * Array.form方法会将数组的空位，转为undefined
    * 扩展运算符也会将空位转为undefined
    * copyWithin会连空位一起拷贝
    * fill会将空位是为征程的数组位置
    * for...of循环会遍历空位
    * entries, keys, values, find, findIndex会将空位处理成undefined

## 对象的扩展
### 属性的简洁表达式
* 在es6中允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。下面是一些常用的实际案例
```
function f(x, y) {
  return {x, y};
}

// 等同于

function f(x, y) {
  return {x: x, y: y};
}

f(1, 2) // Object {x: 1, y: 2}
```
* 实际运用中的CommonJS模块输出一组变量的方式
```
let ms = {};

function getItem (key) {
  return key in ms ? ms[key] : null;
}

function setItem (key, value) {
  ms[key] = value;
}

function clear () {
  ms = {};
}

module.exports = { getItem, setItem, clear };
// 等同于
module.exports = {
  getItem: getItem,
  setItem: setItem,
  clear: clear
};
```
* 属性的setter和getter,实际上也是采用的这种方式来书写
```
const cart = {
  _wheels: 4,

  get wheels () {
    return this._wheels;
  },

  set wheels (value) {
    if (value < this._wheels) {
      throw new Error('数值太小了！');
    }
    this._wheels = value;
  }
}
```

### 属性名表达式
* 在js中有两种取对象属性的方式
```
const obj = {
    foo: 123
}

//first method
obj.foo

//second method
obj['foo']
```

* 在es6中允许字面量对应对象时，可以采用表达式的方式作为对象的属性名，即把表达式放在括号之中
```
let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};
```
* 在对象中采用表达式的方式还可以用于定义方法名
```
let obj = {
    ['h' + 'ello']() {
        return 'hi';
    }
}
obj.hello();
```
* 需要注意是属性名表达式如果是一个对象，默认情况喜爱会自动将对象转为字符串，这一点在使用的过程中要非常的小心

### 属性的可枚举性和遍历
* 可枚举性，对象的每个属性都有一个描述对象，用来控制该属性的行为Object.getOwnPropertyDescripty方法可以获取该属性的描述对象
```
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
```
* 在上面这四个属性中的enumerable属性，称为可枚举性，如果该属性是false，就表示某些操作会忽略掉当前属性
* 目前有四个操作会忽略到enumerable为false的属性
    * for...in属性，只遍历对象自身的和继承的可枚举的属性
    * Object.keys(),返回对象自身的所有可枚举的属性的键名
    * JSON.stringify(),只串行化对象自身的可枚举的属性
    * Object.assign(): 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性

属性的遍历
* 在es6中一共有5种方法可以遍历对象的属性
    * for...in，循环遍历对象自身的和继承的可枚举属性，不含Symbol
    * Object.keys(obj),返回一个数组，包括对象自身的(不包含继承的)所有可枚举属性的键名,Symbol属性
    * Object.getOwnPropertyNames(obj),返回一个数组，包含对象自身的所有属性，不包含Symbol属性的键名，但是包含不可枚举属性的键名
    * Object.getOwnPropertySymbols(obj),返回一个数组，包含对象自身的所有 Symbol 属性的键名。
    * Reflect.ownKeys(obj)， 返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

### super关键字
* this关键字总是指向函数所在的当前对象，es6又新增了另一个类似的关键字super，指向当前对象的原型对象
```
const proto = {
    foo: 'hello'
}

const obj = {
    foo: 'world,
    find() {
        return super.foo;
    }
}

Object.setPrototypeOf(obj, proto);
obj.find() //"hello"
```
* Object.setProyotypeOf(当前对象，当前对象的原型)，用于设置当前对象的原型指向
* **注意在使用super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会出现报错**，如下所示的三种情况都会出现报错：
```
const obj = {
    foo: super.foo
}

const obj = {
    foo: () => super.foo;
}


const obj = {
    foo: function() {
        return super.foo
    }
}
```
* 在上面的三种方式中，都会报错。原因是因为对于js引擎来说，这里的super都是没有用在对象的方法之中，第一种方式用在属性林年，第二种
和第三种写法是super用在一个函数当中，然后赋值给foo属性

### 对象的扩展运算符
* 对象的解构赋值，用于从一个对象取值，相当于将目标对象自身的所有可遍历的、但是尚未被读取的属性，分配到指定的对象上面。所有的键和
它们的值都会被拷贝到新的对象上去，如下面的案例所示
```
let { x, y, ...z } = {x: 1, y: 2, a: 3, b: 4}
x // 1
y // 2
z // {a: 3, b: 4}
```
* 解构赋值要求等号右边是一个对象，如果等号右边是undefined或null，就会报错，因为它们无法转为对象，如下面的案例所示
```
let { ...z } = null;
let { ...z } = undefined;
```
* 解构赋值必须是最后一个参数，否则也会报错，如下面的案例所示,两种方式的书写都会出现报错
```
let { ...x, y, z } = someObject; 
let { x, ...y, ...z } = someObject;
```
* **需要注意的是，解构赋值的拷贝是浅拷贝，即如果一个键的值事是复合类型的值，那么解构赋值拷贝的是这个值的引用，而不是这个值的副本**，如下面的案例所示
```
let obj = { a: { b: 1 } };
let { ...x } = obj;
obj.a.b = 2;
console.log(x.a.b) // 2
```
* 此外扩展运算符的解构赋值，不能复制继承自原型对象的属性
* 扩展运算符，对象的扩展运算符用于取出参数对象的所有可遍历属性，拷贝到当前对象之中，如下面的案例所示
```
let z = { a: 3, b: 4};
let n = {...z};
```
* 由于数组是特殊的对象，所以对象的扩展运算符可以用于数组，如果扩展运算符后面是一个空对象，则没有任何效果，如果扩展运算符后面不是对象，则自动将其转为对象。
但是如果扩展运算符后面是字符串，它会自定转化为一个类似数组的对象，因此返回的不是空对象，对象的扩展符等同于使用Object.assign()，如下所示：
```
let aClone = { ...a }
//等同于
let aClone = Object.assign({}, a);
```
* 拷贝对象原型属性，可以采用下面的方式来进行处理,如下面的案例所示
```
//method1
const clone1 = {
    __proto__: Object.getPrototypeOf(obj),
    ...obj
}

//method2
const clone2 = Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    obj
)

//method3
const clone3 = Obeject.create(
    Object.getPrototype(obj),
    Object.getOwnPropertyDescriptors(obj)
)
```

* 扩展运算符换可以用于去合并两个对象，如下所示：（Object.assign方法：用于将所有可枚举属性的值从一个或多个源对象分配到目标对象，返回目标对象）
```
let ab = { ...a, ...b};
//等同于
let ab = Object.assign({}, a, b)
```
* 如果用户自定义的属性，放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉。如下所示
```
let aWithOverrides = { ...a, x: 1, y: 2 }
//等同于
let aWithOverrides = { ...a, ...{ x: 1, y: 2 }}
//等同于
let x = 1, y = 2, aWithOverrides = { ...a, x, y }
//等同于
let aWithOverrides = Obeject.assign({}, a, , { x: 1, y: 2})
```
* 与扩展运算符一样，对象的扩展运算符后面可以跟表达式
* 扩展运算符的参数对象之中，如果有取值函数get，这个函数会执行的, 如下所示
```
let a = {
    get x() {
        throw new Error('now throw yet');
    }
}
let aWith = { ...a } //报错
```

### 链判断运算符
* 如果读取对象内部的某个属性，往往需要判断一下该对象是否存在，在通常的情况下也会使用三元运算符用于判断对象是否存在，如下面的两种案例所示
    * 采用&&
    ```
    // 错误的写法
    const  firstName = message.body.user.firstName;

    // 正确的写法
    const firstName = (message
    && message.body
    && message.body.user
    && message.body.user.firstName) || 'default';
    ```
    * 采用三元运算符
    ```
    const fooInput = myForm.querySelector('input[name=foo]')
    const fooValue = fooInput ? fooInput.value : undefined
    ```
* 如上面的这两种方式来进行层层判断是非常麻烦的，因此在es2020引入了“链判断运算符”（?.）简化上面的这种书写方式，如下面案例所示
```
const firstName = message?.body?.user?.firstName || 'default';
const fooValue = myForm.querySelector('input[name=foo]')?.value
```
* 对于上述的案例说明，在使用该链判断运算符时，表示先判断的对象是否为null或undefined，如果是，就往下面计算，不是则返回undefined
* 使用这个运算符需要注意下面的几点
    * 短路机制，?.运算符相当于一种短路机制，只要不满足条件，就不再往下面进行
    ```
    a?.[++x]
    // 等同于
    a == null ? undefined : a[++x]
    ```
    * delete运算符
    ```
    delete a?.b
    //等同于
    a === null ? undefined : delete a.b
    ```
    * 括号的影响，如果属性链有圆括号，链判断运算符对圆括号外部没有影响，支队圆括号内部有影响，如下所示
    ```
    (a?.b).c
    //等同于
    (a === null ? undefined : a.b).c
    ```
    * 报错场合
    ```
    // 构造函数
    new a?.()
    new a?.b()

    // 链判断运算符的右侧有模板字符串
    a?.`{b}`
    a?.b`{c}`

    // 链判断运算符的左侧是 super
    super?.()
    super?.foo

    // 链运算符用于赋值运算符左侧
    a?.b = c
    ```
    * 右侧不得为十进制数值，为了保证兼容之前的代码，允许foo?.3:0被解析成foo ? .3 : 0，因此当链判断运算符后面跟一个十进制的数值时，
    会被认为可能是一个三元运算符
### Null判断运算符
* 读取对象属性时，如果某个属性的值是null或undefined，有时候需要为他们指定默认值，常通过||运算符指定默认值，如下所示
```
const headerText = response.settings.headerText || 'Hello, world!';
const animationDuration = response.settings.animationDuration || 300;
const showSplashScreen = response.settings.showSplashScreen || true;
```
* 在上面的这三种方式中，如果属性的值为空字符串或false或0,默认值也会失效，因此为了避免这种情况的发生，在es2020中引入了一个新的Null判断符(??)，
它的行为与||行为一致，但是只有运算符左侧的值为null或者是undefined时，才会返回右侧的值，如下所示。
```
const headerText = response.settings.headerText ?? 'Hello, world!';
const animationDuration = response.settings.animationDuration ?? 300;
const showSplashScreen = response.settings.showSplashScreen ?? true;
```

## 对象的新增方法
### Object.is()
* es5比较两个值是否相等，只有两个运算符: 相等运算符 == 与 严格相等运算符 ===, 它们都有各自的缺点，前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0，
js缺乏一种运算，在所有的环境中，只要两个值是一样的，就应该相等
* 在es6提出了"some-value equality"算法，用来解决这个问题。Object.is就是部署这个算法的新方法。用来比较两个值是否严格相等，与严格相等比较的行为基本一致,实际案例
```
Object.is('foo', 'foo')
// true
Object.is({}, {})
// false
```
* 不同之处有两个:  一是+0不等于-0，而是NaN等于自身，如下所示
```
+0 === -0 // true
NaN === NaN // false

Object.is(+0, -0) //false
Object.is(NaN, NaN) //true
```

### Object.assign()
* 该方法用于对象的合并，将源对象的所有可枚举属性，复制到目标对象(target)，该方法第一个目标对象，后面的参数是源对象。
**注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性**，如下所示：
```
const target = { a: 1, b: 1 };

const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```
* 对于参数的说明需要注意下面的几点：
    * 如果只有一个参数，该方法会直接返回该参数
    * 如果参数不是对象，则会先转换成对象，然后返回
    * 由于undefined和null无法转成对象，然后返回
* 注意点：
    * 浅拷贝，Object.assign()方法实行的是浅拷贝。也就是说，如果源对象某个属性值是对象，那么得到的就是这个对象的引用
    * 同名属性的替换，对于嵌套的对象，一旦遇到同名属性，该方法处理的方式是用于替换，而不是添加
    * 该方法可以用来处理数组，但是会把数组视为对象
    * 取值函数的处理，该方法只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制，如下所示
    ```
    const source = {
    get foo() { return 1 }
    };
    const target = {};

    Object.assign(target, source)
    ```
* 该方法的用途
    * 为对象添加属性
    ```
    class Point {
        constructor(x, y) {
            Object.assign(this, {x, y});
        }
    }
    ```
    * 为对象添加方法
    ```
    Object.assign(SomeClass.prototype, {
    someMethod(arg1, arg2) {
        ···
    },
    anotherMethod() {
        ···
    }
    });

    // 等同于下面的写法
    SomeClass.prototype.someMethod = function (arg1, arg2) {
    ···
    };
    SomeClass.prototype.anotherMethod = function () {
    ···
    };
    ```
    * 克隆对象
    ```
    function clone(origin) {
        return Object.assign({}, origin);
    }
    ```
    * 这种方法克隆，只能克隆原始对象自身的值，不能克隆它继承的值。如果想要保持继承链，可以采用下面的代码
    ```
    function clone(origin) {
        let originProto = Object.getPrototypeOf(origin);
        return Object.assign(Object.create(originProto), origin);
    }
    ```
    * 合并多个对象
    ```
    const merge = (target, ...sources) => Object.assign(target, ...sources);
    ```
    * 为属性指定默认值
    ```
    const DEFAULTS = {
        logLevel: 0,
        outputFormat: 'html'
    };

    function processContent(options) {
        options = Object.assign({}, DEFAULTS, options);
        console.log(options);
        // ...
    }
    ```
### Object.getOwnPropertyDescriptors()
* 在es5中的Object.getOwnPropertyDescriptor()方法会返回某个属性描述对象，在es2017中引入的Object.getOwnPropertyDescriptors()方法，
返回指定对象所有自身属性(非继承属性)的描述对象
```
const obj = {
  foo: 123,
  get bar() { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } }
```

### __proto__属性，Object.setPrototypeOf(),Object.getPrototypeOf()
* __proto__属性，用来读取或设置当前对象的原型对象。目前所有的浏览器包含IE11都部署了这个属性。由于这个属性是浏览器所广泛支持，才被加入到es6中。这个属性
在除了浏览器之外的属性不一定被部署。因此无论是从语义，还是兼容性的角度，都不要去使用这个属性，而是使用下面的Object.setPrototypeOf(),Object.getPrototypeOf()
Object.create()代替
* Object.setPrototypeOf,用于来设置一个对象的原型对象，返回参数对象本身。
```
//该方法所等同于的函数
function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;
}

//es6中推荐使用方式
// 格式
Object.setPrototypeOf(object, prototype)

// 用法
const o = Object.setPrototypeOf({}, null);
```
* 对于Object.setPrototypeOf()方法参数的说明，如果第一个参数不是对象，会自动转为对象，由于返回的还是第一个参数，所以这个操作不会产生任何效果，由于undefined和null无法
转化为对象，所以如果第一个参数是undefined或是null就会报错
* Object.getPrototypeOf()方法，用于去读取一个对象的原型对象，如下所示
```
Object.getPrototypeOf(obj);
```
* 对于Object.getPrototypeOf()方法的参数说明，如果参数不是对象，会被自动转为对象，如果参数是undefined或null，它们无法转为对象，就会报错

### Object.keys(), Object.Values(), Object.entries()
* Object.keys()方法，返回一个数组，成员的参数对象自身的所有可遍历属性的键名
* Object.values()方法，返回一个数组，成员是参数对象自身所有可遍历属性的键值
* Object.entries()方法，返回一个数组，成员是参数对象本身的所有可遍历属性键值对数组

### Obeject.fromEntries()
* 该方法的作用是将一个键值对数组转化为对象，该方法的在主要目的就是将键值对结构还原为对象，因此特别适合与将Map结构转化为对象

## Symbol
* 是ES6中引入的一种新的原始数据类型Symbol，表示独一无二的值，是js中的第七种数据类型，其余六种是undefined null String Number Boolean Object,Symbol值是通过Symbol函数生成，这也就是说，对象
的属性现在可以有两种类型一种是原来就有的字符串，另外一种就是新增的Symbol类型，凡是属性名属于Symbol类型，都是独一无二的，另外可以保证不会与其他属性名产生冲突。如下面的案例所示
```
    let s = Symbol();
    typeof s // symbol类型
```
* 对于该类型的Symbol函数说明，该函数前不能使用new命令，否则就会报错。这是因为生成Symbol是一个原始的值，不是对象。也就是说，由于Symbol值不是对象，所以不能添加属性。基本上，是一种类似与字符串的数据
结构。该函数可以接受一个字符串作为参数，表示对Symbol实例的描述，主要是为了在控制台显示，或者转化为字符串时，比较容易区分
* 对于这个Symbol函数以及Symbol值的说明，如果Symbol函数的参数是一个对象，就会调用该对象的toString，将其转为字符串，然后才生成一个Symbol值。需要注意的就是Symbol函数的参数只是表示当前Symbol值的描述，
因此相同参数的Symbol函数的返回值是不想等的，如下面所示：
```
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

s1 === s2 // false

// 有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');

s1 === s2 // false
```
* Symbol值不能与其他类型的值进行运算，会报错，如下所示
```
let sym = Symbol('My symbol');

"your symbol is " + sym
// TypeError: can't convert symbol to string
`your symbol is ${sym}`
// TypeError: can't convert symbol to string
```
* Symbol值可以显示转为字符串，如下所示
```
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
```
* 此外Symbol值可以转为布尔值，但是不能转为数值
```
let sym = Symbol();
Boolean(sym) //true
!sym //false

Number(sym) //typeError
```

### Symbol.prototype.description
* 在创建Symbol的时候，可以添加一个描述
```
const sym = Symbol('foo')
```
* 在上面的代码中，sym描述就是字符串foo，但是读取这个描述需要将Symbol显示转为字符串，即下面的写法
```
const sym = Symbol('foo');

String(sym) // "Symbol(foo)"
sym.toString() // "Symbol(foo)"
```
* 上面的这种描述不是很方便，在es2019中提供了一个实例属性，直接返回Symbol的描述，如下所示
```
const sym = Symbol('foo');

sym.description // "foo"
```

### 作为属性名的Symbol
* 由于每一个Symbol值都不是相等的，这就意味着Symbol值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模板
构成的情况非常的有用，能防止某个键被不小心改写或者是覆盖掉,如下所示：
```
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```
* 需要注意的一点就是Symbol值作为对象属性名时，不能用点运算符，如下所示
```
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"
```
* 在上面的这段代码中，因为点运算符后面总是字符串，所以不会读取mySymbol作为标识名所指代的那个值，导致a的属性名实际上是一个字符串，而不是一个Symbol值。同理，
在对象的内部，使用Symbol值定义属性时，Symbol值必须放在方括号之中
```
let s = Symbol();

let obj = {
  [s]: function (arg) { ... }
};

obj[s](123);
```
* 在上面的这段代码中国，如果s不放在方括号之中，该属性的键名就是字符串s，而不是s所代表的Symbol值。采用增强的对象写法。此外Symbol类型还可以用于定义一组常量，保证
这组常量的值都是不想等的，如下面的案例所示
```
const log = {};

log.levels = {
  DEBUG: Symbol('debug'),
  INFO: Symbol('info'),
  WARN: Symbol('warn')
};
console.log(log.levels.DEBUG, 'debug message');
console.log(log.levels.INFO, 'info message');
```
### 实例：消除魔术字符串
* 魔术字符串指的是，在代码中多次出现、与代码形成强耦合的某个具体的字符串或者数值。风格良好的代码，应该尽量消除魔术字符串，该由含义清晰的变量代替。

### 属性名的遍历
* Symbol作为属性名，遍历对象时，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stirngify返回，但是，它也不是
私有属性，有一个Object.getOwnPropertySymbols()方法,可以获取指定对象所有的Symbol属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的Symbol值
```
const obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

const objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols
// [Symbol(a), Symbol(b)]
```
* 下面一个例子，Object.getOwnPropertySymbols()方法与for...in循环、Object.getOwnPropertyNames方法进行对比的例子，如下所示：
```
const obj = {}
const foo = Symbol('foo')

obj[foo] = 'bar'

for(let i in obj) {
    console.log(i);
}

Object.getOwnPropertyNames(obj) // []
Object.getOwnPropertySymbols(obj) // [symbol(foo)]
```

### Symbol.for(), Symbol.keyFor()
* 有时希望重新使用同一个Symbol值，Symbol.for()方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值，如果有就返回这个Symbol值，否则就新建一个以该字符串
为名称的Symbol值，并且将其注册到全局，如下所示
```
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
```
* Symbol.for()与Symbol()这两种写法，都会生成新的Symbol。它们之间的区别是，前者会被登记在全局环境中提供搜索，后者不会。Symbol.for()不会每次都调用就返回一个新的Symbol类型的值，而是
会先检查给定的key是否已经存在，如果不存在才会新建一个值
* Symbol.keyFor()，该方法返回一个已登记的Symbol类型值的key,如下面的案例所示
```
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```
* 需要注意的是，Symbol.for()为Symbol值登记的名字，是全局环境的，不管有没有在全局环境运行。

### 实例：模块的singleton模式
* 该模式指的是调用一个类，任何时候返回的都是同一个实例。

### 内置的Symbol值
* 除了定义自己使用的Symbol值外，es6还提供了11个内置的Symbol值，指向语言内部使用的方法
    * Symbol.hasInstance，对象的Symbol.hasInstance属性，指向一个内部方法。当其他对象使用instanceof运算符，用于判断该对象的实例时，会调用这个方法。如下所示：
    ```
    class MyClass {
    [Symbol.hasInstance](foo) {
        return foo instanceof Array;
    }
    }

    [1, 2, 3] instanceof new MyClass() // true
    ```
    * 上面代码中，MyClass是一个类，new MyClass()会返回一个实例。该实例的Symbol.hasInstance方法，会在进行instanceof运算时自动调用，判断左侧的运算子是否为Array的实例。
* Symbol.isConcatSpreadable,对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开
    ```
    let arr1 = ['c', 'd'];
    ['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
    arr1[Symbol.isConcatSpreadable] // undefined

    let arr2 = ['c', 'd'];
    arr2[Symbol.isConcatSpreadable] = false;
    ['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']
    ```
* Symbol.species,对象的Symbol.species属性，指向一个构造函数，创建衍生对象时，需要使用到该属性
    ```
    class MyArray extends Array {
        static get [Symbol.species]() { return Array; }
    }

    const a = new MyArray();
    const b = a.map(x => x);

    b instanceof MyArray // false
    b instanceof Array // true
    ```
* Symbol.match 指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。
* Symbol.replace, 指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值.
* Symbol.search, 指向一个方法，当该对象被String.prototype.search方法调用时，会返回该方法的返回值。
* Symbol.split  指向一个方法，当该对象被String.prototype.split方法调用时，会返回该方法的返回值。
* Symbol.iterator 指向该对象的默认遍历器方法。
* Symbol.toPrimitive 指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。
* Symbol.toStringTag, 指向一个方法。在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，它的返回值会出现
在toString方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制[object Object]或[object Array]中object后面的那个字符串。
* Symbol.unscopables 指向一个对象。该对象指定了使用with关键字时，哪些属性会被with环境排除。

## Set和Map数据结构
### Set数据结构
* Set，是es6提供的一种新的数据结构，类似于数组，但成员的值都是唯一的，没有重复的值。其本身一个构造函数，用来生成Set数据结构，如下所示
```
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
    console.log(i);
}

// 2 3 4 5
```
* 在上面的代码中通过add()方法向Set结构加入成员，通过结构可以看出Set结构不会添加重复的值
* Set函数可以接受一个数组(或者具有iterable接口的其他数据结构)作为参数，用来初始化，如下所示
```
const set = new Set([1, 2, 3, 4, 4, 2]);
[...set] // [1, 3]
```
* 使用Set数据结构来去除数组重复成员，以及去除字符串重复字符的方式
```
//数组去重的方式
[...new Set(array)]

//字符串去重的方式
[...new Set('ababsa')].join('');
```
* 在使用Set这个数据结构时，需要注意的就是其内部判读两个值是否不同，使用的算法叫做“same-value-zero equality”，类似于精确相等运算符，主要区别在与Set加入值时认为NaN是等于其自身

### Set实例的属性和方法
* 在Set结构中有以下属性：
    * Set.prototype.constructor: 构造函数，默认就是Set函数
    * Set.prototype.size: 返回Set实例的成员总数
* Set实例的方法分为两大类：操作方法(用于操作数据)和遍历方法(用于遍历成员)
    * Set.prototype.add(value): 添加某个值，返回Set结构本身
    * Set.prototype.delete(value): 删除某个值，返回一个布尔值，表示删除是否成功
    * Set.prototype.has(value): 返回一个布尔值，表示该值是否为Set成员
    * Set.prototype.clear(): 清除所有成员，没有返回值
* Array.from方法可以将Set结构转为数组，因而可以使用该方法来实现数组去重如下面的案例所示
```
const items = new Set([1, 2, 3, 4, 5, 6])
const array = Array.from(items);
```
* 遍历操作，Set结构的实例有四个遍历方法，可以用于遍历成员
    * Set.prototype.keys(): 返回键名的遍历器；
    * Set.prototype.values(): 返回键值的遍历器
    * Set.prototype.entries(): 返回键值对的遍历器
    * Set.prototype.forEach(): 使用回调函数遍历每一个成员
* 需要注意的是**set的遍历顺序就是插入顺序**这个特性在有时是非常有用的，比如使用Set保存一个回调函数列表，调用时就能保证添加顺序调用
    1. keys(), values(), entries(),这三个方法都是遍历器对象。由于Set结构没有键名，只有键值，所以keys方法和values方法的行为完全一致
    ```
    let set = new Set(['red', 'green', 'blue']);

    for (let item of set.keys()) {
    console.log(item);
    }
    // red
    // green
    // blue

    for (let item of set.values()) {
    console.log(item);
    }
    // red
    // green
    // blue

    for (let item of set.entries()) {
    console.log(item);
    }
    // ["red", "red"]
    // ["green", "green"]
    // ["blue", "blue"]
    ```
    * Set结构的实例默认可遍历，他的默认遍历器生成函数就是它的values方法。这意味着，可以省略values方法，直接用for...of循环遍历Set
    2. forEach(),Set结构的实例和数组一样，也拥有forEach方法，用于对每个成员执行某种操作，没有返回值，如下所示
    ```
    let set = new Set([1, 4, 9]);
    set.forEach((value, key) => console.log(key+ ':' + value))
    ```
    3. 遍历的应用，扩展运算符内部使用for...of循环，所以也可以用Set结构，因而采用扩展运算符和Set结构相结合，就可以去除数组的重复成员

### WeakSet
* 含义：与Set类似，也是不重复的值的集合，但是它与Set有两个区别，首先WeakSet的成员只能是对象，而不能是其他类型的值。其次就是WeakSet中的对象都是弱引用，即不考虑垃圾回收机制不考虑WeakSet对该对用的引用。换句话说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象是否还存在与WeakSet之中
* 语法说明：WeakSet是一个构造函数，可以使用new命令，创建WeakSet数据结构，作为构造函数，WeakSet可以接受一个数组或类似数组的对象作为参数。(实际上，任何具有Iterable接口的对象，都可以作为weakSet的参数)，该数组的所有成员，都会自动成为WeakSet实例对象的成员，如下所示：
```
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```
* WeakSet结构有下面的三个方法
    * WeakSet.prototype.add(value): 向WeakSet实例中添加一个新成员
    * WeakSet.prototype.delete(value): 清除WeakSet实例的指定成员
    * WeakSet.prototype.has(value): 返回一个布尔值，表示某个值是是否在WeakSet实例之中
* 在WeakSet中没有Size属性，没有办法遍历它的成员，因为成员都是弱引用的，随时可能消失，遍历机制无法保证成员的存在，很有可能刚刚遍历结束，成员就取不到了。WeakSet的一个用处，是存储DOM节点，而不用担心这些节点从文档中移除，而引发的内存泄露
### Map
* 含义和基本用法，在js中的对象，本质上是键值对的集合(Hase结构)，但是传统上只能用字符串当作键，这给它的使用带来很大的限制。因此，为了解决这个问题，es6提供了Map数据结构，它类似与对象，也是键值对的集合，但是键的范围不限于字符串，各种类型的值(包括对象)都可以当作键。简而言之就是Obejct结构提供了“字符串-值”的对应关系，Map结构提供了“值-值”的对应。是一种更加完善的hash结构。如下所示：
```
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```
* Map数据结构的构造函数可以接受数组，任何具有Iterator接口，并且每个成员都是一个双元素的数组的结构，都可以当作Map构造函数的参数，也就是说Set和Map都可以用来生成新的Map，如下所示：
```
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```
* 对于该构造函数的参数说明，如果对同一个键多次赋值，后面的值将覆盖前面的值，如果读取一个未知的键，则返回undefined。**只有对同一个对象的引用，Map结构才将其是为同一个键**，这一点在使用的时候要非常的小心，如下所示
```
const map = new Map();

map.set(['a'], 555)
map.get(['a']) //undefined
```
* 在上面的代码中，表面上是针对同一个键，但是实际上这两个不同的数组实例，内存地址是不一样的，因此get方法无法读取该键，返回undefined
* 实例的属性和操作方法，在Map结构的实例有以下属性和操作方法，如下所示：
    1. size属性，该属性返回Map结构的成员总数
    ```
    const map = new Map();
    map.set('foo', true);
    map.set('bar', false);

    map.size // 2
    ```
    2. Map.prototype.set(key, value): 该方法设置key对应的value，然后返回整个Map结构，如果key已经有值，则键值会被更新，否则就新生成该键，如下所示
    ```
    let map = new Map()
    .set(1, 'a')
    .set(2, 'b')
    .set(3, 'c');
    ```
    3. Map.prototype.get(key),get方法读取key对应的键值，如果找不到key就返回undefined
    4. Map.prototypr.has(key),has方法返回一个布尔值，表示某个键是否在当前的Map对象之中
    5. Map.prototype.delete(key), delete方法删除某个键值，返回true表示删除成功，如果失败，则返回false
    6. Map.prototype.clear(), clear方法清除所有成员，没有返回值
* 遍历方法，在Map结构原生提供了三个遍历器生成函数和一个遍历方法
    * Map.prototype.keys(): 返回键名的遍历器
    * Map.prototypr.values(): 返回键值的遍历器
    * Map.prototype.entries(): 返回所有成员的遍历器
    * Map.prototype.foreach(): 遍历Map的所有成员
* 需要特别注意的是，Map的遍历顺序就是插入排序
* 将Map结构转为数组结构，比较快速的方法是使用扩展运算符(...)，如下所示
```
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```
* 与其他数据结构的互相转化
    * Map转为数组，将Map转化为数组的最方便的方法，就是使用扩展运算符(...)，如下所示：
    ```
    const myMap = new Map()
    .set(true, 7)
    .set({foo: 3}, ['abc']);
    [...myMap]
    // [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
    ```
    * 数组转为Map，将数组转为Map构造函数，就可以转为Map
    ```
    new Map([
    [true, 7],
    [{foo: 3}, ['abc']]
    ])
    // Map {
    //   true => 7,
    //   Object {foo: 3} => ['abc']
    // }
    ```
    * Map转为对象，如果所有Map的键都是字符串，它可以无损地转为对象
    ```
    function strMapToObj(strMap) {
        let obj = Object.create(null);
        for(let [k, v] of strMap) {
            obj[k] = v;
        }
        return obj;
    }
    ```
    * 如果有非字符串的键名，那么这个键名会被转化为字符串，再作为对象的键名
    * 对象转为Map，对象转为Map可以通过Object.entries(),如下所示：
    ```
    let obj = { "a": 1, "b": 2 };
    let map = new Map(Object.entries(obj))
    ```
    * Map转为JSON，这个时候需要分两种情况，一种情况是，Map的键名都是字符串，这时可以选择转为对象JSON，另外一种情况是，Map的键名有非字符串，这时可以选择转为
    数组JSON。
    ```
    //first one

    function strMapToObj(strMap) {
        let obj = Object.create(null);
        for(let [k, v] of strMap) {
            obj[k] = v;
        }
        return obj;
    }

    function strMapToJson(strMap) {
        return JSON.stringify(strMapToObj(strMap))
    }

    //second method 
    function mapToArrayJson (map) {
        return JSON.stringify([...map]);
    }
    let myMap = new Map().set(true, 7).set({foo: 3},['abc']);
    mapToArrayJson(myMap);
    ```
    * JSON转为Map，JSON转为Map，在正常情况下，所有键名都是字符串，如下所示
    ```
    function jsonToStrMap(jsonStr) {
    return objToStrMap(JSON.parse(jsonStr));
    }

    jsonToStrMap('{"yes": true, "no": false}')
    // Map {'yes' => true, 'no' => false}
    ```

## WeakMap
* 含义：与Map结构类似，也是用于生成键值对的集合，如下所示：
```
// WeakMap 可以使用 set 方法添加成员
const wm1 = new WeakMap();
const key = {foo: 1};
wm1.set(key, 2);
wm1.get(key) // 2

// WeakMap 也可以接受一个数组，
// 作为构造函数的参数
const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // "bar"
```
* WeakMap与Map的之间的两点区别
    * WeakMap只接受对象作为键名(null除外)，不接受其他类型的值作为键名
    * WeakMap的键名所指向的对象，不计入垃圾回收机制
* WeakMap的设计目的：有时想要在某个对象上存放一些数据，但是这会形成对于这个对象的引用。如下所示：
```
const e1 = document.getElementById('foo');
const e2 = document.getElementById('bar');
const arr = [
  [e1, 'foo 元素'],
  [e2, 'bar 元素'],
];
```
* 在上面的这个实际例子中，一旦需要这两个对象，就必须手动去删除这个引用，否则垃圾回收机制就不会释放e1和e2所占用的内存。
* 因而WeakMap就是解决这个问题而产生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。
* 该结构的使用场景：如果要往对象上添加数据，又不想去干扰垃圾回收机制，就可以使用WeakMap这个数据结构
* WeakMap的语法，该语法与Map在API上的区别主要是两个，一个是没有遍历操作(即没有keys(), values(), entries()方法），也没有size属。因为没有办法
列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行有关

## Proxy
* Proxy概述：用于修改某些操作的默认行为，等同于在语言层面上做出修改，所以属于一种“元编程”，即对编程语言的处理。
* 对于Proxy的理解，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此可以提供一种机制，可以对外界的访问进行过滤和改写。这种类似的模式在当前的项目开发中，也
使用在服务器的代理，以及在请求处理之前，这种方式在处理的过程中，就是先进行了一层过滤。如下面的案例所示：
```
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});

obj.count = 1; 
//setting count
++obj.count 
// getting count
// setting count
// setting count
// 2
```
* 在上面的这段代码中，主要是对空对象架设了一层拦截，重新定义了get和set这两种行为，因而通过上面的运行结果就可知道这个拦截器在这里所起到的作用是是什么
* 对于es6中原生所提供的Proxy构造函数的说明，其用来生成Proxy实例，如下所示：
```
const proxy = new Proxy(target, handler);
```
* 对于上面Proxy对象的说明，Proxy对象所有的用法，都是上面这种形式，但是不同点在于handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target
参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。如下所示：
```
const  proxy = new Proxy({} , {
    get: function(target, propKeys) {
        return 35;
    }
})

console.log(proxy.time)
console.log(proxy.name)
console.log(proxy.title)
```
* 在上面的这段代码中，Proxy接受两个参数。第一个参数是所要代理的目标对象，即如果没有Proxy的介入，操作原来要访问的就是这个对象；第二个参数就是一个配置对象，对于每一个
被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。在上面的这段代码中get方法分别是对目标对象和所要访问的属性进行处理，所以无论是什么属性，最后得到的值一定
就是35。需要注意的是**要使得Proxy起作用，必须针对Proxy实例进行操作，而不是针对目标对象进行操作，如果没有对handler设置任何拦截，那就等于直接通向了原对象**
* 对于Proxy的使用技巧，将Proxy对象，设置到object.proxy属性，从而可以在object对象上调用。
```
const object = { proxy: new Proxy(target, handler)}
```
* Proxy实例也可以作为其他对象的原型对象。如下所示
```
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});

let obj = Object.create(proxy);
obj.time // 35
```
* 对于同一个拦截器，可以设置多种操作，如下所示：
```
const handler = {
    get: function (target, name) {
        if(name === 'prototype') {
            return Object.prototype
        }
        return 'Hello, ' + name;
    },

    apply: function (target, thisBing, args) {
        return args[0];
    },

    construct: function (target, args) {
        return { value: args[1] };
    }
}

const fproxy = new Proxy(function (x, y) {
    return x + y;
}, handler);

console.log(fproxy(1, 2));
console.log(new fproxy(1, 2));
console.log(fproxy.prototype === Object.prototype);
console.log(fproxy.foo === "Hello, foo");
```

### Proxy实例的方法
1. get()，该方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象，属性名和proxy实例本身，其中最后一个参数可选，形式如下：
```
get(target, propKey, receiver): 拦截对象属性的读取，比如proxy.foo和proxy['foo']
```
* get方法的使用及其使用案例，如下所示
```
const person = {
    name: '张三'
}

const proxy = new Proxy(person, {
    get: function(target, propKey) {
        if (propKey in target) {
            return target[propKey];
        } else {
            throw new Error(`don't have this props `) 
        }
    }
})

console.log(proxy.name);
console.log(proxy.age);
```
### Promise
#### Promise相关
* 含义：是异步编程的一种解决方案，用于对回调函数和事件的处理
* 两大特点：
  * 对象的状态不受外界影响。三种状态： pending, fulfilled, rejected
  * 一旦状态改变，就不会改变。其状态改变的可能只能是两种：从pending变为fulfilled，另外一种是从pending变为rejected。如果状态发生改变就
  不会改变。
* 缺点：
  * 无法取消Promise，一旦新建就会立即执行，无法从中途取消。
  * 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部
  * 当处于pending状态时，无法得知目前进展到哪一个阶段
* 基本用法，Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject函数，如下面的例子所示：
```
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
```
* resolve函数与reject函数的作用：
  * resolve: 将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去
  * reject: 将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

* 两个Promise之间的使用，一个Promise会影响另外一个Promise，如下面的案列所示：
```
const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
})

p2.then(result => console.log(result)).catch(error => console.log(error));
```
* 在上面的这段代码中，p1是Promise，在3秒之后变为rejectd状态。p2的状态是在1秒之后改变，resolve方法是返回的p1。由于p2返回的是另外一个Promise，导致p2自己的状态
无效，由于p1的状态决定了p2的状态。所以后面的then语句都变成针对后者。**需要注意的是resolve和reject并不会终结Promise的参数函数的执行**

* Promise机制中的执行顺序，如下案例所示：
```
setTimeout(()=>{
    console.log(5)
},0)
new Promise((resolve, reject) => {
    setTimeout(()=>{
        console.log(4)
    },0)
    resolve(2);
    console.log(1)
}).then(r => {
    console.log(r);
})
console.log(3)
//1 3 2 5 4
```
* 在当前的这个案例中，首先执行的就是微任务，因此首先会打印出1 3 之后resolve中的内容会被放在本次事件循环的末尾，然后就会打印出2， setTimeout为宏任务，会被放在下一个循环队列之中
因此，按照顺序依次打印出5 4。所以最后的结果就是 1 3 2 5 4

#### then方法相关
* then方法：当Promise实例生成之后，可以接收两个回调函数，第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为
rejected时调用。这两个函数都是可选的，不一定要提供。它们都接受Promise对象传出的值作为参数。如下所示：
```
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```
* then方法返回的是一个新的Promise实例，因此对于then方法可以采用链式写法，即then之后再调用另外一个then
#### catch方法相关
* Promise.prototype.catch()方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数
* 通过下面的一个实际例子对于该catch方法进行相关的说明,如下所示：
```
new Promise((resolve, reject) => {
    resolve(1);
}).then((resolve, reject) => {
    reject(console.log('reject'))
}).catch((err) => {
    console.log('发生错误')
})
```
* 在上面的这个例子中，由于当前的Promise返回的是一个resolve状态，因而就会直接调用then方法执行，在执行的过程中由于then是reject状态，此时就会去执行当前语句，然后此时的catch
也会捕捉到这个状态。如果Promise返回的是reject就是直接执行catch不会去执行之后的内容，也就是表明此时的返回了一个拒绝的Promise

* 常用方式在一般的情况下，不要在then方法中定义reject状态的回调函数(即then的第二个参数)，总是使用catch方法

* 与传统的try/catch代码块不同是，如果没用使用catch()方法指定错误处理的回调函数，Promise对象抛出的错误不会传递到外层代码，即不会有任何反应
```
const someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
        resolve(x + 2)
    })
}

someAsyncThing().then(function() {
    console.log('everything is great');
})

setTimeout(() => console.log(123), 2000);
```
* 在上面的代码中，someAsyncThing函数产生的Promise对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示ReferenceError: x is not defined，但是不会推出进程、终止脚本
执行，2秒之后还是会输出123。这就是说Promise内部的错误不会影响到Promise外部的代码

#### finally方法相关
* finally()方法用于指定不管Promise对象最后状态如何，都会执行的操作。该方法是ES2018引入，如下所示
```
server.listen(port)
  .then(function () {
    // ...
  })
  .finally(server.stop);
```
* 上面的案例中是服务器使用Promise处理请求，然后使用finall方法关掉服务器

#### Promise.all方法相关
* 该方法的作用是用于将多个Promise实例，包装成一个新的Promise实例，如下所示：
```
const p = Promise.all([p1, p2, p3]);
```
* 在上面的代码中，Promise.all()方法接受一个数组作为参数，p1 p2 p3都是Promise实例。如果不是，就会先调用Promise.resolve方法，将参数转为Promise实例，再进一步处理。另外Promise.all()方法
的参数可以不是数组，但是必须是Iterator接口，且返回的每个成员都是Promise实例
* p的状态由p1 p2 p3这三个状态共同决定，分成两种情况
    * 只有p1 p2 p3的状态都为fulfilled, p的状态才会变成fulfilled，此时p1 p2 p3的返回值组成一个数组，传递给p的回调函数
    * 只要p1 p2 p3之中有一个为rejected, p的状态就会变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数
* 如下面的案例所示：
```
// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON('/post/' + id + ".json");
});

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
});
```
* 在上面的代码中，Promise包含了6个Promise实例的数组，只有这6个实例的状态变为fulfilled，或者其中有一个变为rejected，才会调用Promise.all方法后面的回调函数

* 需要注意的是，如果作为参数的Promise实例，自己定义了catch方法，那么它一旦被rejected, 并不会触发Promise.all()的catch方法
```
const p1 = new Promise((resolve, reject) => {
    resolve('hello');
})
.then(res => res)
.catch(e => e)

const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
})
.then(res => res)
.catch(e => e)

Promise.all([p1, p2])
.then(res => console.log(res))
.catch(e => console.log(e))
```
* 在上面的代码中，p1会resolved，p2首先会rejected，但是p2有自己的catch方法，该方法返回的是一个新的Promise实例，p2指向的实际上是这个实例，该实例执行完catch方法后，
也会变成resolved，导致Promise.all()方法参数里面的两个实例都会resolved,因此会调用then方法指定的回调函数，而不是调用catch方法返回指定的回调函数。

#### Promise.race方法
* Promise.race()方法同样是将多个Promise实例，包装成一个新的Promise实例
```
const p = Promise.race([p1, p2, p3]);
```
* 在上面的代码中，只要p1, p2, p3之中一个实例率先改变状态，p的状态就跟着改变。率先改变的Promise实例的返回值，就传递给p的回调函数
* Promise.race()方法的参数与Promise.all()方法一样，如果不是Pomise实例，就会调用Promise.resolve方法，将参数转为Promise实例，再进一步处理。如下所示：
```
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```
* 在上面的这个实例中，如果在5秒中之内没有触发更新，就会执行reject中的状态

#### Promise.allSettled方法
* Promise.allSettled方法接受一组Promise实例作为参数，包装成一个新的Promise实例。只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会
结束。如下所示：
```
const promise = [
  fetch('/api-1'),
  fetch('/api-2'),
  fetch('/api-3'),
];
await Promise.allSettled(promise);
removeLaodingIndicator();
```
* 在上面的这段代码中，是对与服务器发送三个请求，等到请求结束，不管请求成功还是失败，加载的滚动图标就会消失。该方法返回的新的Promise实例，一旦结束，状态总是fulfilled，不会变成
rejected。状态变成fulfilled后，Promise的监听函数接收到的参数是一个数组，每一个成员对应一个传入Promise.allSettled()的Promise实例

```
const resolved = Promise.resolve(42)
const rejected = Promise.reject(-1)

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then((status) => {
    console.log(status);
})
//[
// { status: 'fulfilled', value: 42 },
//  { status: 'rejected', reason: -1 }
//]
```
* 上面代码中，Promise.allSettled()的返回值allSettledPromise，状态只可能变成fulfilled。它的监听函数接收到的参数是数组results。该数组的每个成员都是一个对象，对应传入Promise.allSettled()的两个 Promise 实例。每个对象都有status属性，该属性的值只可能是字符串fulfilled或字符串rejected。fulfilled时，对象有value属性，rejected时有reason属性，对应两种状态的返回值。
* 该方法返回的是一个数组，该数组中含有对应的Promise实例的状态以及其状态值

#### Promise.any方法
* 该方法接受一组Promise实例作为参数，包装成一个新的Promise实例返回。只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；如果所有参数实例都变成rejected状态，包装实例会变成rejected状态，如下面的案例所示
```
const promises = [
  fetch('/endpoint-a').then(() => 'a'),
  fetch('/endpoint-b').then(() => 'b'),
  fetch('/endpoint-c').then(() => 'c'),
];
try {
  const first = await Promise.any(promises);
  console.log(first);
} catch (error) {
  console.log(error);
}
```
* 在上面的代码中，promise.any方法返回的参数数组包括三个Promis操作。其中只要有一个变成fulfilled状态，那么Promise.any()返回的Promise对象就变成fulfilled。如果所有操作都变成rejectd，那么await
命令就会抛出错误。其抛出的错误是一个AggregateError实例，相当于一个数组，每个成员对应一个被rejected的操作所抛出的错误

#### Promise.resolve()
* 当需要将现有对象转为Promise对象，Promise.resolve()方法就起到这个作用
```
const jsPromise = Promise.resolve($.ajax('...'));
```
* Promise.resolve()方法的参数分成四种情况
    * 参数是Promise实例，那么Promise.resolve将不做任何修改、原封不动的返回这个实例
    * 参数是一个thenable对象，thenable对象指的是具有then方法的对象，Promise.resolve方法会将这个对象转为Promise对象，然后立即执行thenable对象的then方法，比如下面这个对象
    ```
        let thenable = {
            then: function(resolve, reject) {
                resolve(42);
            }
        }
    ```
    * 参数不具有then()方法的对象，或根本就不是对象。如果参数是一个原始值，或者是一个不具有then()方法的对象，则Promise.resolve()方法返回一个新的Promise对象，状态为resolved，如下所示：
    ```
    const p = Promise.resolve('Hello')
    p.then(function(s) {
        console.log(s)
    })
    ```
    * 不带任何参数。Promise.resolve()方法允许调用时不带参数，直接返回一个resolved状态的Promise对象。所以，如果希望得道一个Promise对象，比较方便的方法就是直接调用Promise.resolve()方法

#### Promise.reject()
* Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。如下所示
```
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了
```

#### Promise的应用
1. 加载图片，可以将图片的加载写成一个promise,一旦加载完成，Promise的状态就会发生改变
```
const preloadImage = function(path) {
    return new Promise(function(resolve, reject) {
        const image = new Image();
        image.onload = resolve;
        image.onerror = reject;
        image.src = path;
    })
}
```
#### Generator 函数与 Promise 的结合 
```
function getFoo () {
  return new Promise(function (resolve, reject){
    resolve('foo');
  });
}

const g = function* () {
  try {
    const foo = yield getFoo();
    console.log(foo);
  } catch (e) {
    console.log(e);
  }
};

function run (generator) {
  const it = generator();

  function go(result) {
    if (result.done) return result.value;

    return result.value.then(function (value) {
      return go(it.next(value));
    }, function (error) {
      return go(it.throw(error));
    });
  }

  go(it.next());
}

run(g);
```
#### Promise.try方法
* 实际开发中，经常遇到一种情况：不知道或者不想区分，函数f是同步函数还是异步操作，但是想用 Promise 来处理它。因为这样就可以不管f是否包含异步操作，都用then方法指定下一步流程，用catch方法处理f抛出的错误。一般就会采用下面的写法。
```
Promise.resolve().then(f)
```
* 上面的写法有一个缺点，就是如果f是同步函数，那么它会在本轮事件循环的末尾执行
```
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next
// now
```
* 上面代码中，函数f是同步的，但是用 Promise 包装了以后，就变成异步执行了。那么有没有一种方法，让同步函数同步执行，异步函数异步执行，并且让它们具有统一的 API 呢？回答是可以的，并且还有两种写法
    * 第一种写法是用async函数
    * 使用new Promise()
* 因而Promise.try被提出来解决这两种方式的不足

### Iterator和for...of循环
#### Iterator的概念
* 在js中表示数据集合的数据结构，有数组 对象以及，Map和Set这四种数据集合，用户可以组合使用这四种数据结构。Iterator的就是一种机制，是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署了Iterator接口，就可以
完成遍历操作(即一次处理该数据结构的所有成员)
* Iterator的作用有三个：
    * 为各种数据结构，提供一个统一的、简便扽访问接口
    * 使得数据结构的成员能够按某种次序排列
    * es6中创造的一种新的遍历命令for...of循环，Iterator接口主要提供for...of消费
* Iterator的遍历过程如下
    * 首先创建一个指针对象，指向当前数据结构的起始位置。Iterator对象的本质就是一个指针对象
    * 其会调用next()方法，这样当前的指针就会指向数据结构的第二个成员
    * 不断采用next()直到运行到当前数据结构的结束位置
* 一个模拟的实际例子，如下所示：
```
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```

#### 默认Iterator借口
* Iterator接口的目的，就是为所有的数据结构，提供一种统一的访问机制，即for...of循环。当使用for...of循环便利某种数据结构时，该循环会自动去寻找Iterator接口，一种数据结构只要部署了Iterator接口，就可以称这种数据结构是可
遍历的。在ES6中规定，默认的Iterator接口部署在数据结构的Symbol.iterator属性，或者一个数据结构只要具有Symbol.iterator属性，就可以认为其是可遍历的。Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数，就会
返回一个遍历器。对于属性名Symbol.iterator，它是一个表达式，返回Symbol对象的iterator属性，这是个预定义好的、类型为Symbol的特殊值。如下所示：
```
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```
* 在ES6中有些数据结构原生具备Iterator接口，既不用做任何处理，就可以被for...of循环遍历。原生具备的Iterator接口的数据结构如下：Array Map Set String TypedArray arguments NodeList对象，如下所示：
```
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```
* 在上面的代码中对于原生部署Iterator接口的数据结构，不用自己写遍历器生成函数,for...of循环会自动遍历它们。除上述说到的几个数据结构之外，都需要在自己Symbol.iterator属性上面部署，这样才会被for...of循环遍历

* 一个对象如果要具备可被for...of循环调用的Iterator接口，就必须在Symbol.iterator的属性上部署遍历器生成方法。如下所示：
```
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    }
    return {done: true, value: undefined};
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}
```

#### 调用Iterator接口的场合
* 在某些场合会默认调用Iterator接口(即Symbol.iterator方法)，除了for...of循环之外，还有下面的几个场合会调用Iterator
    * 解构赋值，对数组和Set结构进行解构赋值时，会默认调用Symbol.iterator方法
    * 扩展运算符，扩展运算符也会调用默认的Iterator接口，如下所示：
    ```
    // 例一
    var str = 'hello';
    [...str] //  ['h','e','l','l','o']

    // 例二
    let arr = ['b', 'c'];
    ['a', ...arr, 'd']
    // ['a', 'b', 'c', 'd']
    ```
    * yield*, yield* 后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口，如下所示：
    ```
    let generator = function* () {
    yield 1;
    yield* [2,3,4];
    yield 5;
    };

    var iterator = generator();

    iterator.next() // { value: 1, done: false }
    iterator.next() // { value: 2, done: false }
    iterator.next() // { value: 3, done: false }
    iterator.next() // { value: 4, done: false }
    iterator.next() // { value: 5, done: false }
    iterator.next() // { value: undefined, done: true }
    ```
    * 其他场合，由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了Iterator接口。for..of Array.form Map Set  Promise.all Promise.race等
    * 字符串的Iterator接口，字符串是一个类似数组的对象，也原生具有Itrator接口,如下所示：
    ```
    var someString = "hi";
    typeof someString[Symbol.iterator]
    // "function"

    var iterator = someString[Symbol.iterator]();

    iterator.next()  // { value: "h", done: false }
    iterator.next()  // { value: "i", done: false }
    iterator.next()  // { value: undefined, done: true }
    ```
    * Iterator接口与Generator函数，如下面的案例所示：
    ```
    let myIterable = {
    [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
        yield 3;
    }
    };
    [...myIterable] // [1, 2, 3]

    // 或者采用下面的简洁写法

    let obj = {
    * [Symbol.iterator]() {
        yield 'hello';
        yield 'world';
    }
    };

    for (let x of obj) {
    console.log(x);
    }
    // "hello"
    // "world"
    ```
#### 遍历器对象的return(), throw()
* 遍历器对象除了具有next()方法，还可以具有return()方法和throw()方法，如果是自己写的next()方法，那么其是必须部署的，return方法和throw方法是否部署是可选的。return()方法的使用场合是，如果for...of循环提前推出，
就会调用return()方法，如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return方法。如下所示：
```
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false };
        },
        return() {
          file.close();
          return { done: true };
        }
      };
    },
  };
}
```
#### for...of循环
* 一种数据结构只要部署了Symbol.iterator属性，就视为具有iterator接口，就可以用for...of循环遍历他成员。也就是说，for...of循环内部调用的是数据结构Symbol.iterator方法
* 数组，原生具有iterator接口(默认部署了Symbol.iterator属性)，for...of循环本质就是调用这个接口产生的遍历器，如下面的案例所示：
```
const arr = ['red', 'green', 'blue'];

for(let v of arr) {
  console.log(v); // red green blue
}

const obj = {};
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr);

for(let v of obj) {
  console.log(v); // red green blue
}
```
* Set和Map结构，也原生具有Iterator这个接口，可以直接使用for...of循环
* 类数组
* 对象中部署Symbol.iterator结构等

### Generator函数的语法
* 形式上，Generator函数是一个普通函数，但是有两个特征，一是function关键字与给函数名之间有一个星号；而是，函数体内部使用yield表达式，定义不同的内部状态
```
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```
#### yield表达式
* 由于Genarator函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。**需要注意的是，yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，**遍历对象的next方法的运行逻辑如下：
    * 遇到yield表达式，就暂停执行后面的操作，并将紧跟yield后面的那个表达式的值作为返回的对象的value属性值
    * 下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式
    * 如果没有遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值
    * 如果该函数没有return语句，则返回的对象的value属性值为undefined
* 如下面的案例所示，yield表达式123+456，不会立即求值，只会在next方法指针移到这一句时，才会求值：
```
function* gen() {
  yield  123 + 456;
}
```
* yield表达式与return语句既有相似之处，也有区别，相似之处在于，都能返回紧跟在语句后面的那个表达式的值。区别在于每次遇到yield，函数暂停执行，下一次再从该位置继续向后执行，而return语句不具备位置记忆功能

* Generator函数可以不用yield表达式，这时就变成了一个单纯的暂缓执行函数
```
function* f() {
    console.log()
}
var generator = f();

setTimeout(function() {
    generator.next()
}, 2000)
```
* 在上面的代码中，函数f如果是普通函数，在为变量generator赋值时就会执行，但是函数f是一个Generator函数，就变成只有调用next方法时，函数f才会执行。另外需要注意，yield表达式只能用在generator函数里面，用在其他地方会报错

#### 与Iterator接口之间的关系
* 任意一个对象的Symbol.iterator方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。由于Generator函数就是该遍历器生成函数，因此可以把Generator函数
赋值给对象的Symbol.iterator属性，从而使得该对象具有Iterator接口
```
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
}
console.log([...myIterable])
```
* 在上面的代码中，generator函数赋值给Symbol.iterator属性，从而使得myIterator对象具有itrator接口，可以被...运算符遍历了
* Generator函数执行后，返回一个遍历器对象，该对象本身也具有Symbol.iterator属性，执行后返回自身，如下所示：
```
function* gen() {

}

var g = gen();

g[Symbol.iterator]() === g;
```
* 在上面的代码中, gen是一个Generator函数，调用它会生成一个遍历器对象g。它的Symbol.iterator属性，也是一个遍历器对象生成函数，执行后返回它自己

#### next方法的参数
* yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。如下所示：
```
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```
* 这个功能有很重要的语法意义，generator函数从暂停状态到恢复到运行，他的上下文的context是不变的。通过next方法的参数，就有办法在generator函数开始运行之后，在继续向函数体内
注入值，也就是说。可以在generator函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。如下所示：
```
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

* 通过next方法的参数，向generator函数内部输入值的例子，如下所示：
```
function* dataConsumer() {
    console.log(`1.${yield}`);
    console.log(`2.${yield}`);
    return 'result';
}

let genObj = dataConsumer();
genObj.next();
genObj.next('a');
genObj.next('b');
```
* 在上面的这个例子中，每次都通过next方法向generator函数输入值，然后打印出来，如果想要第一次调用next方法时，就能够输入值，可以在generator函数外面包一层，如下所示：
```
function wrapper(generatorFunction) {
    return function (...args) {
        let generatorObj = generatorFunction(...args);
        generatorObj.next();
        return generatorObj;
    }
}

const wrapped = wrapper(function* () {
    console.log(`first input: ${yield}`);
    return 'DONE';
})

wrapped().next('hello!');
```
#### for...of循环
* for...of循环可以自动遍历Generator函数运行时生成的Iterator对象，且此时不再需要调用next方法，如之前在上一节说的内容所示，在这里就不过多的叙述
* 使用Generator函数与for...of循环，实现斐波拉契数列的例子：
```
function* fib() {
    let [prev, curr] = [0, 1];
    for(;;) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}
for( let n of fib()) {
    if( n > 1000) break
    console.log(n);
}
```
* 在上面的这个例子中，使用了for...of语句，在此时不需要使用next方法。利用for...of循环，可以写出遍历对象的方法，原生的js对象没有遍历接口，无法使用for...of循环，通过
Generator函数为它加上这个接口，就可以使用。如下所示：
```
function* objectEntries(obj) {
    let propKeys = Reflect.ownKeys(obj);

    for(let propKey of propKeys) {
        yield [propKey, obj[propKey]];
    }
}

let jane = { first: 'Jane', last: 'Doe'}
for (let [key, value] of objectEntries(jane)) {
    console.log(`${key}: ${value}`);
}
```
* 补充说明Reflect.ownKeys()方法，该方法返回一个包含对象所有属性关键字的数组，如下所示：
```
const object1 = {
    property1: 42,
    property2: 13
}

const array1 = []

console.log(Reflect.ownKeys(object1));
console.log(Reflect.ownKeys(array1));
```

#### Generator.prototype.throw()
* Generator函数但会的遍历器对象，都有个throw方法，可以在函数体外抛出错误，然后在Generator函数体内捕获
```
var g = function* () {
    try {
        yield;
    } catch(e) {
        console.log('内部捕获', e);
    }
}

var i = g();
i.next();

try {
    i.throw('a');
    i.throw('b')
} catch(e) {
    console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```
* 在上面的代码中，遍历器对象i连续抛出两个错误。第一个错误被Generator函数体内的catch语句捕获。第二次跑出错误，由于Generator函数内部的catch语句已经执行过了，不会再
捕获到这个错误了，所以这个错误就被抛出了Generator函数体，被函数体外的catch语句捕获
```
var g = function* () {
    try {
        yield;
    } catch(e) {
        if( e != 'a' ) throw e; 
        console.log('内部捕获', e);
    }
}

var i = g();
i.next();

try {
    throw new Error('a')
    throw new Error('b')
} catch (e) {
    console.log('外部捕获', e);
}
```
* 这个案例中之所以捕获了a，是因为函数体外的catch语句块，捕获了跑出的a的错误以后，就不会在继续try代码块里面剩余的语句
```
var gen = function* gen(){
    yield console.log('hello');
    yield console.log('world');
}

var g = gen();
g.next()
g.throw()
```
* 在上面的这段代码中，g.throw方法被捕获之后，自动执行一次next方法，所以会打印b,另外可以清楚只要Generator函数内部部署了try...catch代码块，那么遍历器的throw方法抛出的错误，不影响
下一次遍历，另外throw命令与g.throw方法是无关的，两者互不影响

#### Generator.prototype.return()
* generator函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历Generator函数,如下所示：
```
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}
var g = gen();
console.log(g.next());
console.log(g.return('foo'));
console.log(g.next())
//{ value: 1, done: false }
//{ value: 'foo', done: true }
//{ value: undefined, done: true }
```
* 在上面的代码中，遍历器对象g调用renturn方法后，返回的值value属性就是return()方法的参数foo。并且，Generator函数的遍历就终止，返回done属性为true,之后再调用时，不再提供参数。即最后的返回值中的value属性为undefined

#### next() throw() return()的共同点
* 这三个方法本质上是同一件事，可以放在一起理解，他们之间的作用都是让Generator函数恢复执行，并且使用不同的语句替换yield表达式。next()是将yield表达式替换成一个值。如下所示：
```
const g = function* (x, y) {
    let result = yield x + y;
    return result;
}

const gen = g(1, 2);
console.log(gen.next());
console.log(gen.next(1)); 
//{value: 3, done: false}
//{value: 1, done: ture}
```
* 在上面的代码中，第二个参数next(1)方法就相当于将yield表达式替换成一个值1.如果next方法没有参数，就相当于替换成undefined

#### yield* 表达式
* 如果在Generator函数内部，调用另一个Generator函数，需要在前者的函数体内部，自己手动完成遍历。如下所示：
```
function* foo() {
    yield 'a';
    yield 'b';
}

function* bar() {
    yield 'x';
    for(let i of foo()) {
        console.log(i);
    }
    yield 'y';
}

for(let i of bar()) {
    console.log(i)
}
```
* 在es6中提供了yield*表达式，作为解决方法，用来在一个Generator函数里面执行另一个Generator函数，如下所示：
```
function* bar() {
    yield 'x';
    yield* foo();
    yield 'y';
}

function* foo() {
    yield 'x';
    yield 'a';
    yield 'b';
    yield 'y';
}

for(let i of bar()) {
    console.log(i)
}
```
* 如果yield* 后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员。如下所示：
```
function* gen() {
    yield* ['a', 'b', 'c'];
}
console.log(gen().next());
//{ value: 'a', done: false }
```
* 实际情况下，任何数据结构只要有Iterator接口，就可以被yield* 遍历
```
function* gen() {
    yield* ['a', 'b', 'c'];
}
console.log(gen().next())
//{ value: 'a', done: 'false' }
```

* 使用yield*命令可以很方便地取出嵌套数组的所有成员
```
function* iterTree(tree) {
    if(Array.isArray(tree)) {
        for(let i = 0; i < tree.length; i++) {
            yield* iterTree(tree[i])
        }
    }else{
        yield* tree;
    }
}

const tree = [ 'a', ['b', 'c', ['g', 'h']], ['d', 'e'] ];

for(let i of iterTree(tree)) {
    console.log(i)
}
```

#### 作为对象属性得Generator函数
* 如果一个对象的属性是Generator函数，可以简写成下面的形式，如下所示：
```
let obj = {
    * myGeneratorMethod() {

    }
}
```
* 它的完整形式如下，与上面的写法是等价的
```
let obj = {
    myGeneratorMethod: function() {

    }
}
```

* Generator函数的this
* Generator函数总是返回一个遍历器，ES6规定的这个遍历器Generator函数的实例，也继承了Generator函数的prototype对象上的方法,如下所示：
```
function* g() {}

g.prototype.hello = function() {
    return 'hi'
}

let obj = g();

console.log(obj instanceof g) //true
console.log(obj.hello()) // 'hi'
```
* 上面代码表明，Generator函数g返回的遍历器obj，是g的实例。而且继承了g.prototype。但是，如果把g当作普通的构造函数，并不会生效，因为g返回的总是遍历
器对象，而不是this对象
```
function* g() {
    this.a = 11;
}

let obj = g();
obj.next();
console.log(obj.a);
```
* 在上面的代码中，Generator函数g在this对象上添加了一个属性a，但是obj对象拿不到这个属性
* Generator函数g在this对象上添加一个属性a，但是obj对象拿不到这个属性，下面一个变通方法，首先生成一个空对象，使用call方法绑定Generator函数内部的this.这样，构造函数调用以后，这个空对象就是
Generator函数的实例对象了。如下所示：
```
function* F() {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}
var obj = { };
var f = F.call(obj);   


console.log(f.next())
console.log(f.next())
console.log(f.next())

console.log(obj.a, obj.b,obj.c);
```

### Generatora函数的异步应用
* 传统的异步编程方法大概有以下的四种：
    * 回调函数
    * 事件监听
    * 发布/订阅
    * Promise对象
* 异步：简单理解就是将一个任务分成多段，先执行第一段，后再执行其他任务的方式，等做好准备后，在回过头来执行第二段
* 回调函数，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务时，就直接调用这个函数
* Promise：主要是为了解决依次读取两个以上的文件，出现多重嵌套的问题，如下所示：
```
fs.readFile(fileA, 'utf-8', function(err, data){
    fs.readFile(fileA, 'utf-8', function(err, data){
       // ...
    })
})
```
* 代码是横向发展而不是纵向发展，很快就会乱成一团，无法进行管理，因为多个一步操作形成强耦合，只要有一个操作需要修改，他的上层回调和下层回调函数，可能都要跟着修改，这种情况就被成为称为回调
函数地狱。Promise对象的出现就是为了解决的这个问题而提出的，他不是新的语法功能而是一种新的写法，允许将回调函数的嵌套，改成链式调用，采用Promise，连续读取多个文件，写法如下：
```
var readFile = require('fs-readfile-promise');

readFile(fileA)
.then(function (data) {
    console.log(data.toString())
})
.then(function () {
    return readFile(fileB)
})
.then(function (data) {
    console.log(data.toString())
})
.catch(function (err) {
    console.log(err)
})
```

#### Generator函数
* 协程，多个线程互相协作，完成异步任务
* 协程有点像函数，又有点像线程，运行的流程大致如下：
    * 第一步，协程A开始执行
    * 第二步，协程A执行到一半，进入暂停，执行权转移到协程B
    * 第三步，(一段时间后)协程B交还执行权
    * 第四部，协程A恢复执行
* 上面流程的协程A，就是异步任务，因为它分成了两段(多段)执行。如下面的代码所示：
```
function* asyncJob() {
    //....
    var f = yield readFile(fileA);
    //...
}
```
* 上面代码的函数asyncJob是一个协程，当执行到yiled命令处时，执行权将交给其他协程，等到执行权返回，再从暂停的地方继续往后执行

#### Generator函数的数据交换和错误处理
* generator函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，还具有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。
如下所示：
```
function* gen(x){
  try {
    var y = yield x + 2;
  } catch (e){
    console.log(e);
  }
  return y;
}

var g = gen(1);
g.next();
g.throw('出错了');
// 出错了
```
#### 异步任务的封装：
* 使用generator函数，执行一个真实的异步任务，如下所示：
```

var fetch = require('node=fetch')

function* gen() {
    var url = 'https://api.github.com/users/github';
    var result = yield fetch(url);
    console.log(result.bio);
}

//执行gen方法
var g = gen();
var result = g.next();

result.value.then(function(data){
    return data.json();
}).then(function(data){
    g.next(data);
})
```
* 对于上面的案例来说，首先是使用了generator函数封装了一个异步函数，而后就是采用异步的方式来调用这个方法

#### thunk函数
* Thunk函数是自动执行Generator函数的一种方法
* 参数的求值策略，两种求值策略，通过以下的案例,来说明参数的求值策略
```
var x = 1;

function  f(m) {
    return m * 2;
}

f(x + 5)
```
* 求值策略
    * 传值调用，即在进入函数体之前，就计算x+5，再将这个值传入函数f之中，c语言就是这种策略
    * 传名调用，即直接将表达式x+5传入函数体中，只在用它时求职。Haskell语言就采用这种策略
* Thunk函数的含义：编译器的"传名调用实现"，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做Thunk函数

* js中Thunk函数是传值调用，它的的Thunk函数含义有所不同，在js中Thunk函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数



### async函数
#### async函数与generator之间的区别
* generator函数中依次读取两个文件的方式
```
const { reject } = require('async');
const fs = require('fs');

const readFile = function (fileName) {
    return new Promise(function(resolve, rejecty) {
        fs.readFile(fileName, function(error, data) {
            if(error) return reject(error);
            resolve(data);
        })
    })
}

const gen = function* () {
    const f1 = yield readFile('/etc/fstab');
    const f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
}

//equare
const gen1 = async function() {
    const f1 = await readFile('/etc/fstab');
    const f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
}
```
* **在上面的实际例子中，比较可以发现async函数就是将Generator函数的星号(*)替换成了async，将yield替换成了await，但是async函数对Generator函数的改进，体现在下面的四点：**
    * 内置执行器，Generator函数的执行必须靠执行器，才有co模块，而async函数自带执行器。也就是说，async函数的执行，与普通函数一模一样，只要一行
    * 更好的语义，aysnc表示函数里面有执行操作，await表示紧跟在后面的表达式需要等待结果
    * 更广泛的适用性，co模板约定，yield命令后面只能是Thunk函数或Promise对象，而async函数的await命令后面，可以是Promise对象和原始类型的值(数值、字符串和布尔值，但这时会自动转化成立即resolved的Promise对象)
    * 返回值是Promise，async函数的返回值是Promise对象，这比Generator函数的返回值是Iterator对象方便多了，可以使用then方法指定下一步操作
#### 基本用法：
* async函数返回一个Promise对象，就可以使用then方法添加回调函数。当函数执行时，一旦遇到await函数就会先返回，等到一步操作完成，再接着执行函数体内后面的语句。如下所示：
```
async function getStockPriceByName(name) {
    const symbol = await getStockSymbol(name);
    const stockPrice = await getStockPrice(symbol);
    return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
    console.log(result);
})
```
* 上面的代码是一个获取股票报价的函数，函数前面的async关键字，表明该函数内部有异步操作。调用该函数时，会立即返回一个Promise对象。
```
function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}


asyncPrint('hello world', 50);
```
* 在上面的这段代码中指定在什么时间去输出相应的内容

* async函数多种使用形式：
```
async function foo() {}

//函数表达式
const foo = async function() {}

//对象的方法
let obj = { async foo() {} };

// obj.foo().then(...)

//class的方法
class Storage {
    constructor() {
        this.cachePromise = caches.open('avatars');
    }

    async getAvator(name) {
        const cache = await this.cachePromise;
        return cache.match(`/avatars/${name}.jpg`);
    }
}

const storage = new Storage();
storage.getAvator('jake').then();

//箭头函数
const foo = async() => { }
```

#### 返回Promise对象
* async函数返回一个Promise对象，async函数内部return语句返回的值，会成为then方法回调函数的参数。
```
async function f() {
    return 'hello world';
}

f().then(v => console.log(v));
//hello world
```
* 在上面的代码中，函数f内部return命令返回的值，会被then方法回调函数接收到。async函数内部抛出错误，会都导致返回的Promise对象状态变为reject状态。抛出的错误对象会被
catch方法回调函数接收到
```
async function f(){
    throw new Error('出错了');
}

f().then(
    v => console.log('resolve', v),
    e => console.log('reject', e)
)
```

#### Promise对象的状态变化
* async函数返回的Promise对象，必须等到内部所有await命令后面的Promise对象执行完，才会发生状态改变，除非遇到return语句或者抛出错误。也就是说，只有async函数内部的异步操作执行完成，才会
执行then方法执行的回调函数。如下所示：
```
async function getTitle(url) {
    let response = await fetch(url);
    let html = await response.text();
    return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log);
```
* 在上面的代码中，函数getTitle内部有三个操作：抓取网页、取出文本、匹配页面标题。只有这三个操作全部完成，才会执行then方法里面的console.log

#### await命令
* await命令，正常情况下，await命令后面是一个Promise对象，返回该对象的结果。如果不是Promise对象，就直接返回对应的值。如下所示：
```
async function f() {
    return await 123;
}
f().then(res => console.log(res))
//123
```
* 另外一种情况是，await命令后面是一个thenable对象(即定义then方法的对象)，那么await会将其等同于Promise对象
```
class Sleep {
    constructor(timeout) {
        this.timeout = timeout;
    }

    then(resolve, reject) {
        const startTime = Date.now();
        setTimeout(
            () => resolve(Date.now() - startTime),
            this.timeout
        )
    }
}
(async () => {
    const sleepTime = await new Sleep(1000);
    console.log(sleepTime)
})()
```
* 在上面的代码中，await命令后面是一个Sleep对象的实例。这个实例不是Promise对象，但是因为定义了then方法，await会将其视为Promise处理
* 休眠效果实现
```
function sleep(interval) {
    return new Promise(resolve => {
        setTimeout(resolve, interval)
    })
}

async function one2FiveInAsync() {
    for(let i = 1; i <= 5; i++) {
        console.log(i);
        await sleep(1000);
    }
}

one2FiveInAsync()
```
* await命令后面的Promise对象如果变为reject状态，则reject的参数会被catch方法回调函数接收到。如下所示：
```
async function f() {
    await Promise.reject('erroring，，，，，，');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e));
```
* 任何一个await语句后面的Promise对象变为reject状态，那么整个async函数都会中断执行。如下所示：
```
async function f() {
    await Promise.reject('error');
    await Promise.reject('hello world');
}
f()
.then(res => console.log(res))
.catch(e => console.log(e))
// error
```
* 当希望即使一个前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个await放在try...catch结构里面，这样不管这个异步操作是否成功，第二个await都会执行。如下所示：
```
async function f() {
    try {
        await Promise.reject('error')
    } catch(e) {
        return await Promise.reject('hello world')
    }
}
f()
.then(v => console.log(v))
.catch(e => console.log(e))
//hello world
```
#### 错误处理
* 如果await后面的异步操作出错，那么等同于async函数返回的Promise对象被reject，如下所示：
```
async function f() {
    await new Promise(function (resolve, reject) {
        throw new Error('error');
    })
}
f()
.then(res => console.log(res))
.catch(e => console.log(e))
```
#### 使用注意点
* await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try...catch代码块中
* 多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发，如下所示：
```
let foo = await getFoo()
let bar = await getBar()
//用下面的方式来处理
let [foo, bar] = await Promise.all([foo(), bar()]);
//或者
let fooPromise = getFoo();
let barPromise = getBar();
```
* await命令只能在async函数当中，如果用在普通函数，就会报错

#### async函数的实现原理
* 就是将Generator函数和自动执行器，包装在一个函数中
```
async function f() {
    //
}

//等同于

function fn(args) {
    return spawan(function* (){

    })
}

function spawan(genF) {
    return new Promise(function(resolve, reject) {
        const gen = genF();
        function step(nextF) {
            let next;
            try {
                next = nextF();
            } catch(e) {
                return reject(e);
            }
            if(next.done) {
                return resolve(next.value);
            }
            Promise.resolve(next.value).then(function(v) {
                step(function() { return gen.next(v); })
            }, function(e) {
                step(function() { return gen.throw(e); })
            })
        }
        step(function(){ return gen.next(undefined); });
    })
}
```
