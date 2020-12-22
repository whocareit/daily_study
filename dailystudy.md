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
* 在对象的解构赋值中