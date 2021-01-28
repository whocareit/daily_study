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
## call与apply以及bind
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

### Function.prototype.bind()
* bind()方法创建一个新的函数，在bind()被调用时，这个新函数的this被指定为bind()的第一个参数，而其余参数将作为新函数的参数，供调用时使用。如下面的案例所示
* 创建绑定函数
```
const modules = {
    x: 42,
    getX: function() {
      return this.x;
    }
};
console.log(modules)
  
const unboundGetX = modules.getX;
console.log(unboundGetX()); 

const boundGetX = unboundGetX.bind(modules);
console.log(boundGetX());
// undefined
// 42
```
* 偏函数,bind另一个简单的用法是使用一个函数拥有预设的初始函数。只要将这些参数(如果有的话)作为bind()的参数写在this后面。当绑定函数被调用时，这些参数会被插入到目标函数的参数
列表的开始位置，传递给绑定函数的参数会跟在它们后面
```
function list() {
    return Array.prototype.slice.call(arguments);
}

function addArguments(arg1, arg2) {
    return arg1 + arg2;
}

var list1 = list(1, 2, 3);
console.log(list1);

var result1 = addArguments(1, 2);
console.log(result1);

var leadingThirtysevenList = list.bind(null, 37);

var addThirtySeven = addArguments.bind(null, 37);

var list2 = leadingThirtysevenList();
console.log(list2);

var list3 = leadingThirtysevenList(1, 2, 3);
console.log(list3);

var result2 = addThirtySeven(5);
console.log(result2);

var result3 = addThirtySeven(5, 10);
console.log(result3);

```
* bind原理实现,在这里需要补充下Array.prototype.slice.call(arguments)能将具有length属性的对象(key值为数字)转成数组。[] 是Array的示例，所以可以直接使用[].slice（）方法。
```
Function.prototype.newBind = function() {
    var self = this,
        context = [].shift.call(arguments),
        args = [].slice.call(arguments);
    return function() {
        return self.apply(context, [].concat.call(args, arguments))
    }
}


const modules = {
    x: 42,
    getX: function() {
      return this.x;
    }
};
console.log(modules)
  
const unboundGetX = modules.getX;
console.log(unboundGetX()); 
const boundGetX = unboundGetX.newBind(modules);
console.log(boundGetX());
```
### 三者之间的区别：
* 共同点：都可以改变函数执行的上下文环境；
* 不同点：bind: 不立即执行函数，一般用在异步调用和事件； call/apply： 立即执行函数。
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

## Promise原理实现
* 首先需要明白Promise的特点为以下内容：
    * Promise具有三个状态pending(就绪) fulfilled(成功) rejected(失败)
    * 状态一旦改变，就不会再改变，改变状态只能有两种可能，pending->fulfilled  pending->rejected
* 因此基于上面的内容，就可以直接封装Promise函数，如下所示
```
//promise中的三种状态描述
const PROMISESTATUS = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
};

//该方法的作用是用于判断这个参数是不是一个函数
const isFunction = (fn) => typeof fn === 'function';

class MyPromise {
    constructor(handle) {
        //首先判断函数是否是函数，不是函数直接抛出错误信息
        if(!isFunction(handle)) {
            throw new Error('myPromise must accept a function as a paramter');
        }

        // 状态添加
        //status表示当前的实例的状态，value表示resolve或者是rejeted抛出的值
        this._status = PROMISESTATUS.PENDING;
        this._value = undefined;

        try {
            //直接在构造函数中处理
            handle(this._resolve.bind(this), this._reject.bind(this));
        } catch(e) {
            this._reject(e);
        }
    }

    //resolve方法
    _resolve(val) {
        //表示pending->fulfilled状态
        if(this._status !== PROMISESTATUS.PENDING) return;
        this._status = PROMISESTATUS.FULFILLED;
        this._value = val;
    }

    //reject方法
    _reject(val) {
        //表示pengding->rejeted状态
        if(this._status !== PROMISESTATUS.PENDING) return;
        this._status = PROMISESTATUS.REJECTED;
        this._value = val;
    }
}

```
* Promise.prototype.then，该方法的作用是为Priomise实例添加状态改变时的回调函数。对于其实现的源码如下所示
```
//相同部分如上所示：
const PROMISESTATUS = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
};

const isFunction = (fn) => typeof fn === 'function';
class MyPromise {
    constructor(handle) {
        if(!isFunction(handle)) {
            throw new Error('myPromise must accept a function as a paramter');
        }

        // 状态添加
        this._status = PROMISESTATUS.PENDING;
        this._value = undefined;

        //添加回调函数队列
        this._fulfilledQueues = [];
        this._rejectedQUeues = [];
        try {
            handle(this._resolve.bind(this), this._reject.bind(this));
        } catch(e) {
            this._reject(e);
        }
    }

    //resolve方法
    _resolve(val) {
        if(this._status !== PROMISESTATUS.PENDING) return;
        this._status = PROMISESTATUS.FULFILLED;
        this._value = val;
    }

    //reject方法
    _reject(val) {
        if(this._status !== PROMISESTATUS.PENDING) return;
        this._status = PROMISESTATUS.REJECTED;
        this._value = val;
    }

    //then方法最后返回的是一个新的Promise实例
    then(onFulfilled, onRejected) {
        //或许当前实例的value值与status值
        const { _value, _status } = this;
        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            // 封装一个成功时执行的函数
            let fulfilled = value => {
                try {
                    if (!isFunction(onFulfilled)) {
                        onFulfilledNext(value)
                    } else {
                        let res = onFulfilled(value);
                        if ( res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            onFulfilledNext(res);
                        }
                    }
                } catch(e) {
                    onRejectedNext(e);
                }
            }

            let rejected = error => {
                try {
                   if (!isFunction(onRejected)) {
                        onRejectedNext(error);
                   } else {
                        let res = onRejected(error);
                        if ( res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            onRejectedNext(res);
                        }
                   }
                } catch(e) {
                    onRejectedNext(e);
                }
            }
            switch(_status) {
                case PROMISESTATUS.PENDING:
                    this._fulfilledQueues.push(fulfilled);
                    this._rejectedQUeues.push(rejected);
                    break;
                case PROMISESTATUS.FULFILLED:
                    fulfilled(_value);
                    break;
                case PROMISESTATUS.REJECTED:
                    rejected(_value);
                    break;
            }
        })
    }
}

let promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('fail')
    }, 1000)
  })
  promise2 = promise1.then(res => res, '这里的onRejected本来是一个函数，但现在不是')
  promise2.then(res => {
    console.log(res)
  }, err => {
    console.log(err)  
  })
```