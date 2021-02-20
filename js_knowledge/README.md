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
```
    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            ....//执行你想要的操作
        }
    }
```
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
    const debounce = (func, delay) => {
        let timer;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(func, delay);
        }
    }

    function debounce(handle, delay) {
        var timer = null;
        return function() {
            var _this = this, _arg = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                handle.apply(_this, _arg);
            }, delay)
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
```
function throttle = (handle, wait) {
    var initTime = 0;
    return function() {
        var nowTime = new Date().getTime();
        if(nowTime - initTime > wait) {
            handle.apply(this, arguments);
        }
    }
}
```

### 两者的相同点与异同点
* 相同点：
    * 都可以通过setTimeout实现
    * 目的都是降低回调执行频率，节省计算资源
* 不同点：
    * 函数抖动，在一段连续操作后，处理回调函数，利用clearTimeout和setTimeout实现。函数节流，在一段连续操作中，每一段时间只执行一次，频率较高的事件中使用来提高性能
    * 函数抖动关注一定时间连续触发，只在最后一次执行，而函数节流侧重于一段时间内只执行一次

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

## 组合函数实现
* 其作用就是将多个函数的功能给组合在一起，具体实现方式如下
```
function compose() {
    let args = [].slice.call(arguments);
    let len = args.length - 1;
    return function(x) {
        let result = args[len](x);
        while(len--) {
            result = args[len](result);
        }
        return result;
    }
}

//具体使用案例如下：
function add(a) {
    return a*a;
}

function mul(a) {
    return a+a;
}
console.log(compose(add, mul)(2));
```
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

## redux原理简单模拟
### redux简单概述
* store，就是保存数据的地方，可以将其看成一个容器，redux中提供了createStore这个函数，来生成store，如下所示：
```
import { createStore } from 'redux';

//这里的fn是reducer
const store = createStore(fn);
```
* state，对象中所包含的所有数据。可以通过store.getState()来获取到
```
import { createStore } from 'redux';

const store = createStore(fn);
const state = store.getState();
```
* store.dispatch(),视图层通过dispatch(action)去触发数据更新，如下所示：
```
import { createStore } from 'redux';
const store = createStore(fn);

store.dispatch({
    type: '',
    paload: ''
})
```
* reducer,store收到action以后，必须给出一个新的State。如下所示：
```
const reducer = function (state, action) {
    return new_state;
}
```
* store.subcribe(),用于监听函数，一旦state发生变化，就自动执行这个函数
### 简单原理实现
* createStore函数实现
```
function createStore(stateChange) {
    let state = null;
    const listeners = [];
    const subscribe = listener => listeners.push(listener);
    const getState = () => state;
    const dispatch = (action) => {
        state = stateChange(state, action);
        listeners.forEach(listener => listener());
    }
    dispatch({});
    return { getState, dispatch, subscribe };
}
```
* connect函数简单实现
```
import { Component } from 'react';
import PropTypes from 'prop-types'

export const connect = (mapStateToProps, mapDispatchToProps) => (WrapperComponent) => {
    class Connect extends Component {
        static contextTypes = {
            store: PropTypes.object
        }

        constructor() {
            super();
            this.state = {
                allProps: {}
            }
        }

        componentDidMount() {
            const { store } = this.context
            this._updateProps();
            store.subscribe(() => this._updateProps())
        }

        _updateProps() {
            const { store } = this.context;
            let stateProps = mapStateToProps ? mapStateToProps(store.getState(), this.props) : {}
            let dispatchProps = mapDispatchToProps ? mapDispatchToProps(store.dispatch, this.props) : {}
            this.setState({
                allProps: {
                    ...stateProps,
                    ...dispatchProps,
                    ...this.props
                }
            })
        }


        render() {
            return(
                <WrapperComponent {...this.state.allProps}/>
            )
        }
    }

    return Connect;
}
```

## fetch
* 提供了一个获取资源的接口(包括跨域请求)，fetch提供了对request和response对象的通用定义。使之今后可以被使用到更多地应用场景中：无论是service worker、catch api又或者是其他
处理请求和响应的方式，甚至是任何一种需要在程序中生成响应的方式。同时还为有关联性的概念，例如CORS和HTTP原生头信息，提供了一种新的定义，取代它们原生那种分离的定义。在发送请求或者是获取
资源时，需要使用WindowOWorkerGlobalScope.fetch()方法。其在很多接口中都被实现了，更具体的说，是在Window和WorkerGlobalScope接口上。因此在几乎所有环境中都可以用这个方法获取到资源。
### fetch接口
* WindowOrWorkerGlobalScope.fetch(),包含fetch方法，用于获取资源
* Headers,相当于response/request的头信息，可以使你查询到头信息，或者针对不同的结果做不同的操作
* Request,相当于一个资源请求
* Response,相当于请求的响应

### using fetch
* fetch提供了一个新的js接口，用于访问和操作http管道的一些具体部分，例如请求和响应。它还提供了一个全局fetch()方法，该方法提供了一种简单，合理的方式来跨网络异步请求获取资源
* 需要注意fetch规范与jQuery.ajax()主要用三种方式的不同
    * 当接收到一个代表错误的HTTP状态码时，从fetch()返回的Promise不会被标记为reject(但是会将resoleve的返回值的ok属性设置为false())，仅当网络故障时或请求被阻止时，才会被标记reject
    * fetch()可以不接受cookies;可以使用fetch()建立起跨域会话
    * fetch()不会发送cookies。除非使用credentials的初始化选择
* 一个fetch的简单实例
```
fetch('http://example.com/movies.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        console.log(myJson);
    })
```
* fetch可以接受第二个可选参数，一个可以控制不同配置的init对象，如下所示：
```
fucntion postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json',
        },
        mothed: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
    })
}
```
* init配置项中的内容，一个配置项对象，包括对所有请求的设置。可选的参数有：
    * method: 请求使用的方法，如GET、POST
    * headers：请求的头信息，形式为Headers的对象或包含ByteString值的对象字面量
    * body：请求的body信息：可能是一个Blob、BufferSource、FormData、URLSearchParams或者USVString对象。**注意GET或HEAD方法的请求不能包含body信息**
    * mode：请求的模式，如cors、no-cors或者same-origin
    * credentials：请求的credentials，如omit same-rigin或者include。为了在当前域名内自动发送cookie，必须提供这个选择。
    * cache: 请求的cache模式：default、no-store、relaod、no-cache、force-cache或者only-if-cached
    * redirect: 可用的redirect模式
    * referrer
    * referrerPolicy：指定HTTP头部referer字段的值
    * intergrity
* 发送带凭证的请求,为了让浏览器发送包含凭据的请求(即使是跨域源)，要将credentials：'include'添加到传递给fetch()方法的init对象
```
fetch('https://example.com', {
    credentials: 'include'
})
```
* 上传JOSN数据,使用fetch()POST json数据
```
var url = 'https://example.com/profile';
var data = { username: 'example' };

fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
        "Content-Type": "application/json"
    })
}).then(res => res.json)
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
```

* 上传文件，可以通过HTML<input type="file" multiple>元素，FormData()和fetch()上传文件
```
var formData = new FormData();
var photos = document.querySelector("iuput[type='file'][multiple]");
formData.append('title', 'My Vegas Vacation');

for(let i = 0; i < photos.files.length; i++) {
    formData.append('photo', photos.files[i]);
}

fetch('https://example.com/posts', {
    method: 'POST',
    body: formData
})
.then(response => response.json)
.then(response => console.log('Success: ', JSON.stringify(response)))
.catch(error => console.error('Error: ',error))
```
* 检测请求是否成功，当遇到网络故障，fetch()promise将会reject，带上一个TypeError对象。虽然这个情况经常是遇到了权限问题或类似问题-比如404不是一个网络故障。想要精确的判断fetch()是否成功，需要包含
promise resolved的情况，此时再判断Response.ok是不是为true，如下所示：
```
fetch('flowers.jpg').then(function (response) {
    if(response.ok) {
        return response.blob();
    }
    throw new Error('Network response was not ok.');
}).then(function (myBlob) {
    var objectURL = URL.createObjectURL(myBlob);
    myImage.src = objectURL;
}).catch(function (error) {
    console.log('There has been a problem with you fetch operation: ', error.message);
})
```
* 自定义请求对象，除了传给fetch()一个资源的地址，还可以通过使用Request()构造函数来创建一个request对象，然后再作为参数传给fetch(),如下所示：
```
var myHeaders = new Headers();

var myInit = { 
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'fefault'
};

var myRequest = new Request('flowers.jps', myInit);

fetch(myRequest).then(function(response) {
    return response.blob();
}).then(function(myBlob) {
    var objectURL = URL.createObjectURL(myBlob);
    myImage.src = objectURL;
})
```
#### Response对象
* Response实例是在fetch()处理完promise之后返回的
* 常用response属性有以下内容：
    * Response.status-整数为response的状态码
    * Response.statusText-字符串，该值与HTTP状态码消息对应
    * Response.ok-该属性是用来检查response的状态是都在200-299这个范围内，该返回值是一个boolean

#### body
* 不管是请求还是响应都包含body对象。body也可以是以下任意类型的实例
    * ArrayBuffer
    * ArrayBufferView
    * Blob/File
    * string
    * URLSearchParams
    * FormData
* Body类定义了以下方法(这些方法都被Request和Response所实现)以获取body内容。这样方法都会返回一个被解析后的Promise对象和数据
    * arrayBuffer()
    * blob()
    * json()
    * text()
    * formData()

## AMD、CommonJs、CMD、UMD、ES6
### CommonJs
* 主要运行与服务器端，该规范指出，一个单独的文件就是一个模块。Node.js为主要实践者。它有重要的环境变量为模块化的实现提供支持: module exports require global。require命令用于
输出其他模块提供的功能，module.exports命令用于规范模块的对外借口，输出的是一个值的拷贝，输出之后就不能改变，就会缓存起来，如下所示
```
//模块a.js
const name = 'hello'

module.exports = {
    name,
    github: 'https://github.com'
}

//模块b.js

const path = require('path');
const { name, github } = require('./a');
console.lohg(name, github, path.basename(github))
```
* CommonJs采用同步加载模块，而加载的文件资源大多数在本地服务器当中，所以执行速度或时间没有问题，但是在浏览器端，限于网络原因，更加合理的方案是使用异步加载
### AMD
* AMD是"Asynchronous Module definition"的缩写。采用异步方式加载模块，模块的还在不影响它后面语句的运行。所有以来这个模块的语句，都定义在一个回调函数中，等到
加载完成之后，这个回调函数才会运行。其中RequireJs是实践者。
* 模块功能主要的几个命令：define、require、return和define.amd。define是全局函数，用来定义模块，define(id?, dependencies?, factory)。require命令用于输入
其他模块提供的功能。return命令用于规范模块的对外接口，define.amd属性是一个对象，此属性的存在来表明函数遵循AMD规范
```
//modell.js
define(function() {
    console.log('model1 entry');
    return {
        getHello: function() {
            return 'model1';
        }
    }
})

//model2.js
define(function() {
    console.log('model2 entry');
    return {
        getHello: function() {
            return 'model2';
        }
    }
})

//main.js
define(function() {
    var model1 = require('./model1.js');
    console.log(model1.getHello());
    var model2 = require('./model2.js');
    console.log(mode2.getHello());
})


//加载mainJs
<script src="https://cdn.bootcss.com/require.js/2.3.6/require.min.js"></script>
<script>
    requirejs(['main']);
</script>
```
### CMD
* 该规范的全称(Common Module Definition-通用模块定义)，该规范主要是Sea.js推广中形成，一个文件就是一个模块，可以像Node.js一般书写模块代码。主要用于浏览器中运行，当然可以在Node.js中运行。
其与AMD很类似，不同点在于：AMD推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行
```
// model1.js
define(function (require, exports, module) {
    console.log('model1 entry');
    exports.getHello = function () {
        return 'model1';
    }
});
// model2.js
define(function (require, exports, module) {
    console.log('model2 entry');
    exports.getHello = function () {
        return 'model2';
    }
});
// main.js
define(function(require, exports, module) {
    var model1 = require('./model1'); //在需要时申明
    console.log(model1.getHello());
    var model2 = require('./model2'); //在需要时申明
    console.log(model2.getHello());
});
<script src="https://cdn.bootcss.com/seajs/3.0.3/sea.js"></script>
<script>
    seajs.use('./main.js')
</script>
// 输出 
// model1 entry
// model1
// model2 entry
// model2
```
### UMD
* 全称为(Universal Module Definition)通用模块定义，该模式主要用来解决CommonJS模式和AMD模式代码不能通用的问题，并同时还支持老式的全局变量规范。如下所示：
```
(function (global,factory) {
    typeof exports === 'obeject' && typeof module !== 'undefined' ? module.exports = factory() : 
    typeof define === 'function' && define.amd ? define(fatory) : 
    (global = global || self , global.myBundle = factory());
})(this, (function () {
    'use strict';

    var main = () => {
        return 'hello world'
    }

    return main;
}))

<script src="bundle.js"></script>
<script>
  console.log(myBundle());
</script>

//1. define为函数，并且是否在define.amd, 来判断是否为AMD规范
//2. 判断module是否为一个对象，并且是否存在module.exports来判断是否为CommonJS规范
//3. 如果以上两种都没有，设定为原始的代码规范
```

### ES Modules
* ES modules是js官方的标准化模块系统
    1. 因为是标准，所以未来很多浏览器会支持，可以很方便的在浏览器中使用。(浏览器默加载不能省略.js)
    2. 它同时兼容在node环境下运行
    3. 模块的导入导出，通过import和export来确定。可以和Commonjs模块混合使用
    4. ES modules输出的是值的引用，输出接口动态绑定，而CommonJS输出的是值的拷贝
    5. ES modules模块编译时执行，而CommonJS模块总是在运行时加载
```
// index.js
import { name, github } from './demo.js';

console.log(name(), github());

document.body.innerHTML = `<h1>${name()} ${github()}</h1>`
export function name() {
    return 'qiufeng';
}

export function github() {
    return 'https://github.com/hua1995116';
}
<script src="./index.js" type="module"></script>
```

## axios依赖包
* 是一种基于Promise的方式，对http协议在浏览器端和node中的使用
* 其具有以下的这些缺点：
    * 采用XMLHttpRequest从浏览器端
    * 在node中使用http请求
    * 支持PromiseAPI
    * 有request以及response接口
    * 转化request以及response请求
    * 取消request
    * 自动转化json数据
    * 客户端支持防止XSRF攻击的保护
* 安装方式，使用yarn或者npm包，或者是bower，使用cdn的方式都可
* 拦截器，可以拦截请求或者是响应在事件被then或者是catch之前。如下所示：
```
//增加请求拦截
axios.interceptors.request.use(function (config) {
    //Do something before request is sent
    return config;
}, function (error) {
    //Do something with request error
    return Promise.reject(error);
})


//增加响应拦截
axios.interceptors.response.use(function (response) {
    //任何状态码在2XX之内的都会去触发这个方法
    //Do something with response data
    return response;
}, function (error) {
    //任何状态码在2XX之外的都会去触发这个方法
    //Do something with response error
    return Promise.reject(error);
})
```
* 如果需要在之后移除拦截器，你可以调用eject方法来处理，如下所示
```
const myInterceptor = axios.interceptor.request.use(function () {})
axios.interceptors.request.eject(myInterceptor)
```
* 在客户端的实例中添加拦截器的方式
```
const instance = axios.create();
instance.interceptors.request.use(function () { })
```

## MVC、MVP和MVVM
### MVC
* MVC是最经典的开发模式之一，最早是后台来的，随着前端的复杂度的增加，MVC的开发模式也带入了前端。该模式由三部分组成
    * View(视图层)，试图与控制器之间，视图接收用户的操作，传递给控制器，有控制器决定采用那个函数来处理
    * Controller(控制器)，控制器与模型之间，控制器将用户的具体操作，通过直接调用模型提供的方法来操作模型，或者是通过其他服务方法来操作模型
    * Model(模型)，视图与模型之间，模型发生变化时，将会通过观察者模式，通知试图；视图将会从模型中取出数据显示，完成视图刷新
* MVC有两个很明显的问题：
    1. model层和view层直接打交道，导致这两层耦合度很高
    2. 因为所有逻辑都写在controller层，导致controller层特别的臃肿
### MVP
* MVP模式是相对于MVC模式的改良，将Controller层用Presenter层代替，view层和Model层交互被Presenter层给隔断，从理论上去除View层和Model之间的耦合
* 其结构可以说与MVC模式一样，唯一的区别就是其隔绝了View和Model

### MVVM
* MVVM模式就是通过双向绑定的机制，实现数据和UI内容，只要想改其中一方，另一方都能够及时更新的一种设计理念。MVP中的View和Presenter要相互持有，方便调用对方，而在MVVM模式中View和ViewModel通过Binding进行关联，他们之前的关联处理通过DataBinding完成
## Vue双向绑定原理
* 数据绑定：将数据源给绑定到一个类型(对象)实例上的某个属性的方法
* 常见的架构模式有MVC MVP MVVM模式，目前前端框架基本上都是采用MVVM模式实现双向绑定。但是各个框架实现双向绑定的方法不同。当前主要的三种实现方式有
    * 发布订阅模式
    * Angular的脏查机制
    * 数据劫持
* 在Vue中采用的是数据劫持与发布订阅相结合的方式实现双向绑定，数据劫持主要通过Object.defineProperty来实现
* Object.defineProperty方法中的get与set的使用，案例如下：
```
var modeng = {};

var age;

Object.defineProperty(modeng, 'age', {
    get: function() {
        console.log('获取年龄');
        return age;
    },

    set: function(newVal) {
        console.log('设置年龄');
        age = newVal;
    }
})
modeng.age = 18;
console.log(modeng.age);
//设置年龄
//获取年龄
//18
```
* 分析，MVVM模式的核心在与数据与视图是保持同步的，意思就是说数据改变时，会自动更新视图，视图发生改变是会更新数据。所以需要做的就是怎样去检测到数据的变化然后更新视图，如何检测到试图的变化然后去更新数据。通过上面所诉，可以采用Object.defineProperty的set函数来通知视图更新。
* 具体实现方式：Vue是通过数据劫持结合发布订阅模式来实现双向绑定的，数据劫持的方式是通过Object.defineProperty中的get和set方式来实现。此时还需要一个监听器Observe来监听属性的变化。当属性发生变化后，需要一个Watcher订阅者来更新视图，同时还需要一个compile指令解析器，用来解析节点元素的指令与初始化视图。所以需要下面的三部分
    * Observe监听器：用来监听属性的变化通知订阅者
    * Watcher订阅者：收到属性的变化，然后更新视图
    * Compiler解析器：解析指令，初始化模板，绑定订阅者
* 监听器Observe，其作用就是去监听数据的每一个属性，由于这这个过程中可能会有很多个订阅者Watcher所以需要创建容器Dep去做一个统一的管理，具体实现如下：
```
function defineReactive(data, key, value) {
    //递归调用，监听所有属性
    observe(value);
    var dep = new Dep();
    Object.defineProperty(data, key, {
        get: function() {
            if (dep.target) {
                dep.addSub(Dep.target);
            }
            return value;
        },
        set: function(newVal) {
            if (value !== newVal) {
                value = newVal;
                //通知订阅器
                dep.notify();
            }
        }
    })
}

function observe(data) {
    if (!data || typeof data !== "object") {
        return;
    }
    Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key]);
    })
}

function Dep() {
    this.subs = [];
}

Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
}

Dep.prototype.notify = function () {
    console.log('属性变化通知Watcher执行更新视图函数');
    this.subs.forEach(sub => {
        sub.update();
    })
}

Dep.target = null;
// var modeng = {
//     age: 18
// }
// observe(modeng);
// modeng.age = 20;
```
* 订阅者Watcher的实现，其主要的作用是接受属性变化的通知，然后去执行更新函数去更新视图，因此需要做的就是下面的两步
    * 把Watcher添加到Dep容器中，这里使用到监听器的get函数
    * 接收到通知，执行更新函数
```
function Watcher(vm, prop, callback) {
    this.vm = vm;
    this.prop = prop;
    this.callback = callback;
    this.value = this.get();
}

Watcher.prototype = {
    update: function() {
        const value = this.vm.$data[this.prop];
        const oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.callback(value);
        }
    },
    get: function() {
        //储存订阅器
        Dep.target = this; 
        //因为属性被监听，这一步会执行监听器里的get方法
        const value = this.vm.$data[this.prop];
        Dep.target = null;
        return value;
    }
}
```
* 将Watcher和Observer相结合起来
```
function Mvue(options, prop) {
    this.$options = options;
    this.$data = options.data;
    this.$prop = prop;
    this.$el = document.querySelectorAll(options.el);
    this.init();
}

Mvue.prototype.init = function() {
    observer(this.$data);
    this.$textContent = this.$data[this.$prop];
    new Watcher(this, this.$prop, value => {
        this.$el.$textContent = value;
    })
}

//使用demo
{/* <div id="app">{{name}}</div>
const vm = new Mvue({
    el: "#app",
    data: {
        name: "我是摩登"
    }
}, "name"); */}
```
* Compile解析器，其主要作用是一个用来解析指令初始化模板，添加订阅者，绑定更新的函数。因为在解析DOM节点的过程中会频繁的操作DOM，所以利用文档片段(DocumnetFragmebt)来帮助我们去解析DOM优化性能，如下所示：
```
function Compile(vm) {
    this.vm = vm;
    this.el = vm.$el;
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init: function() {
        this.fragment = this.nodeFragment(this.el);
    },
    nodeFragment: function(el) {
        const fragment = document.createDocumentFragment();
        let child = el.firstChild;
        //将子节点，全部移动到文档碎片当中
        while (child) {
            fragment.appendChild(child);
            child = el.firstChild;
        }
        return fragment;
    },
    compileNode: function(fragment) {
        let childNodes = fragment.childNodes;
        [...childNodes].forEach(node => {
            if (this.isElementNode(node)) {
                this.compile(node);
            }

            let reg = /\{\{(.*)}\}/;
            let text = node.textContent;

            if (reg.test(text)) {
                let prop = reg.exec(text)[1];
                //替换模板
                this.compileText(node, prop);
            }
            
            //编译子节点
            if (node.childNodes && node.childNodes.length) {
                this.compileNode(node);
            }
        })
    },
    compile: function(node) {
        let nodeAttrs = node.attributes;
        [...nodeAttrs].forEach(attr => {
            let name = attr.name;
            if (this.isDirective(name)) {
                let value = attr.value;
                if (name === "v-model") {
                    this.compileModel(node, value);
                }
            }
        })
    },
    compileModel: function(node,prop) {
        let val = this.vm.$data[prop];
        this.updateModel(node, val);

        new Watcher(this.vm, prop, (value) => {
            this.updateModel(node, value);
        })

        node.addEventListener('input', e => {
            let newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            this.vm.$data[prop] = newValue;
        });
    },
    compileText: function(node, prop) {
        let text = this.vm.$data[prop];
        this.updateView(node, text);
        new Watcher(this.vm, prop, (value) => {
            this.updateView(node, value);
        });
    },
    updateModel: function(node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    },
    updateView: function(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },
    isDirective: function(attr) {
        return attr.indecOf('v-') !== -1;
    },
    isElementNode: function(node) {
        return node.nodetype === 1;
    },
    isTextNode: function(node) {
        return node.nodeType === 3;
    }
}
```
* 当尝试去修改数据时，有时通过vm.$data.name去修改数据，而不是直接用Vue中的vm.name去修改，此时就需要改变数据代理，如下所示：
```
function Mvue(options) {
    this.$options = options;
    this.$data = options.data;
    this.$el = document.querySelectorAll(options.el);
    //数据代理
    Object.keys(this.$data).forEach(key => {
        this.proxyData(key);
    });
    this.init();
}

Mvue.prototype.init = function() {
    observer(this.$data);
    new Compile(this);
}

Mvue.prototype.proxyData = function() {
    Object.defineProperty(this, key, {
        get: function() {
            return this.$data[key];
        },
        set: function(value) {
            this.$data[key] = value;
        }
    })
}
```

## express中间件简单模拟
* 中间件：中间件就是匹配路由之前或者匹配路由完成做的一系列操作
* express文档中对于中间件的描述：
    * 执行任何代码
    * 修改请求和响应对象
    * 终结请求-响应循环
    * 调用堆栈中的下一个中间件
* express将中间件分成了5类，原理相同，但是用法不同
    * 应用级中间件
    * 路由级中间件
    * 错误处理中间件
    * 内置中间件
    * 第三方中间件
* express中的中间件的简单模拟,具体代码查看当前目录下的express文件夹，like-express就是简单的模拟express的中间件原理

## koa2中间件简单模拟
* express文档中对于中间件的描述：
    * 执行任何代码
    * 修改请求和响应对象
    * 终结请求-响应循环
    * 调用堆栈中的下一个中间件
* express将中间件分成了5类，原理相同，但是用法不同
    * 应用级中间件
    * 路由级中间件
    * 错误处理中间件
    * 第三方中间件
* koa2中的中间件的简单模拟,具体代码查看当前目录下的express文件夹，like-koa2就是简单的模拟考koa2的中间件原理


## WebSocket原理，以如何实现持久化连接
* WebSocket是HTML5出的协议，也就是说HTTP协议没有变化，也就是说与HTTP协议没有关系。其支持持久化连接。其是为了兼容现有浏览器的握手规范。可以这样来理解websocket其和http协议有交集，但并不是全部。
* WebSocket的其他特点：
    * 建立在TCP协议之上，服务器端实现比较容易
    * 与HTTP协议有着良好的兼容性，默认的端口也是80和443，并且握手阶段采用HTTP协议，因此握手时不容易屏蔽，并能通过各种HTTP代理服务器
    * 数据格式比较轻量级，性能开销小，通信高效
    * 可以发送文本，也可以发送二进制数据
    * 没有同源限制，客户端可以与任意服务器通信
    * 协议标识符是ws(如果加密，则为wss)，服务器网址就是URL
* Websocket是什么样的协议，具体有什么优点？
    * websocket是一个持久化的协议，相对于HTTP这种非持久化的协议来说。
        1. http生命周期通过Request来界定，也就是说一个Request和一个Response，那么在HTTP1.0中，这次HTTP请求就结束了。在HTTP1.1中进行改进，使得有一个keep-alive，也就是说，在一个http连接中，可以发送多个Request，接受多个Response。但是需要在HTTP中记住，request的数量与response的数量是相等的。
        2. WebSocket中发起请求的请求头的信息如下:
        ```
        GET /chat HTTP/1.1
        Host: server.example.com
        Upgrade: websocket
        Connection: Upgrade
        Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
        Sec-WebSocket-Protocol: chat, superchat
        Sec-WebSocket-Version: 13
        Origin: http://example.com
        ```
        * 其中下面的这两个东西表示告诉服务器发送的请求的协议是Websocket协议
        ```
        Upgrade: websocket
        Connection: Upgrade
        ```
        * Sec-WebSocket-Key是一个Base64 encode的值，这是浏览器随机生成的，用于验证是不是Websocket助理
        * Sec-WebSocket-Protocol是一个用户定义的字符串，用来区分同URL下，不同的服务所需要的协议
        * Sec-WebSocket-Version是告诉服务器所使用的WebSocket Draft(版本)
* webSocket的作用
    * 在这之前需要知道下面的几个内容ajax轮询和long poll的原理
    1. ajax轮询：让浏览器隔个几秒就发送一次请求，询问服务器是否有新消息。这种方式需要服务器有很快的处理速度和资源
    2. long poll：与ajax轮询差不多，都是采用轮询的方式，不过采取的是阻塞模型，也就是说，客户端发送请求后，如果没消息，就一直不返回Response给客户端。直到有消息才返回，返回完后，客户端再次创立连接，周而复始。long poll需要有很高的并发，也就是说同时接待客户的能力
    * 上面的这两种方式都是在不断地建立HTTP连接，然后等待服务器处理，然后可以体现HTTP协议被动性的特点，即服务端不能主动联系客户端，只能有客户端发起
    * WebSocket作用：解决被动性，当服务器完成协议升级后，服务端就可以主动推送信息到客户端。这样做的好处是只需要经过一次HTTP请求，就可以做到源源不断的信息传送

## 前端实用小技巧
* 多表达式多if判断
```
//长
if (x === 'abc' || x === 'def' || x === 'ghi' || x ==='jkl') {
  //logic
}
//短
if(['abc', 'def', 'ghi', 'jkl'].includes(x)) {

}
```

* 简写if-else
```
let test: boolean;
if (x > 100) {
    test = true;
} else {
    test = false;
}

//等效于
let test = (x > 100) ? true: false;
//等效与
let test = x > 10;
```

* 合并声明变量
```
//长
let test1;
let test2 = 1;

//等效于
let test1, test2 = 1;
```

* 合并变量赋值
```
//长
let lest1 = 1,test2 = 2, test = 3;
//短
let [test1, test2, test3] = [1, 2, 3];
```

* &&运算符
```
if (test1) {
    callMethod();
}

//等同于
test1 && callMethod();
```

* 短函数调用
```
const fun1 = () => console.log('fun1');
const fun2 = () => console.log('fun2');
//长
let test = 1;
if (test == 1) {
    fun1();
} else {
    fun2();
}
//短
(test == 1 ? fun1 : fun2)();
```

* switch简记法
```
//长
switch (data) {
    case 1:
        test1();
    break;

    case 2:
        test2();
    break;

    case 3: 
        test3();
    break;
}

//短
const data = {
    1: test1,
    2: test2,
    3: test
}

data[something] && data[something]();
```

* 默认参数值
```
function add(test1, test2) {
    if (test1 === undefined) {
        test1 = 1;
    } 
    if (test2 === undefined) {
        test2 = 2;
    }
    return test1 + test2;
}

//短
const add = (test1 = 1, test2 = 2) => test1 + test2;
```

* 扩展运算符
```
//长-合并数组
const data = [1, 2, 3];
const test = [4, 5, 6].concat(data);

//短-合并数组
const data = [1, 2, 3];
const test = [1, 2, 3, ...data];

//长-拷贝数组
const test1 = [1, 2, 3];
const data = test1.slice();

//短-拷贝数组
const test1 = [1, 2, 3];
const data = [...test1];
```

* 在数组中查找最大值和最小值
```
const arr = [1, 2, 3];
Math.max(...arr);
Math.min(...arr);
```

* 应用程序缓存
    * h5中引入了应用程序缓存(application cache)，这意味着web应用可以进行缓存，并可在没有因特网连接时进行访问，其为应用程序缓存带三个优势：
        * 离线浏览-用户可在应用离线时应用它们
        * 速度-已缓存资源加载得更快
        * 减少服务器负载-浏览将只从服务器下载更新过或更改过的资源
    * HTML5中Cache Manifest基础，如果想要启动应用程序缓存，需要在对应的<html>标签中包含manifest属性，属性值为".appcache"为后缀名的文件
    * Manifest文件：是简单的文本文件，告知浏览器被缓存的内容(以及不缓存的内容)，该文件可分为三部分
        * CACHE MANIFEST - 在标题下列出的文件将在首次下载后进行缓存
        ```
        //该文件下的第一行，必须是
        CACHE MANIFEST
        /theme.css
        /logo.gif
        /main.js
        
        //该文件下，当manifest文件加载后，浏览器会从网站的根目录下载这个三个文件。然后无论用户何时断开网络，这些资源依然是可以用的
        ```
        * NETWORK - 在此标题下列出的文件需要与服务器的连接，且不会被缓存
        ```
        NETWORK
        login.asp

        //这里的login.asp永远不会被缓存，并且离线时不可用的，如果下面是*，则表示所有依靠网络的资源/文件都需要因特网连接
        ```
        * FALLBACK - 在此标题下列出的文件规定当页面无法访问时的回退页面(比如404页面)
        ```
        FALLBACK
        /html5/ /404.html
        
        //表示的含义是当网络不好时，用"offine.html"替代/html/目录中的所有文件,第一个是URL资源，第二个是替补
        ```
    * 更新缓存，一旦应用被缓存，它就会保持缓存直到发生下面的情况
        * 用户清空浏览器缓存
        * manifest文件被修改
        * 由程序来更新应用缓存
# nginx
* 含义：nginx是一个高性能的http和反向代理服务器，特点是占用内存少，并发能力强，事实上nginx的并发能力确实是在同类型的网页服务器中表现较好
* 意义：专门为性能优化而开发，性能是其最重要的考量，实现上非常注重效率，能经受高负载的考验，有报告表明能支持高达5万个并发连接数
## nginx的使用
* 反向代理
 * 正向代理：在客户端(浏览器端)配置代理服务器，通过代理服务器进行互联网访问
 * 反向代理：在客户端(浏览器端)将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器来获取数据的方式
* 负载均衡： 单个服务器解决不了的问题，可以通过增加服务器的数量，然后将请求分发到各个服务器上，将原先的请求集中到单个服务器上的情况改为将请求分发到多个服务器上，将负载分发(近似于平均分发)到不同的服务器
* 动静分离： 为了加快网站的解析速度，可以把动态页面和静态页面由不同的服务器来解析，加快解析速度，降低原来单个服务其的压力
## nginx安装、命令和配置文件
* 在linux中安装nginx：
    1. 使用远程连接工具连接linux操作系统
    2. 安装nginx相关素材(依赖)
        1. pcre
        2. openssl
        3. zlib
        4. nginx
    3. 安装方式：
        1. 安装pcre： wget http://download.sourceforge.net/project/pcre/pcre/8.37/pcre-8.37.tar.gz
            1. 解压文件方式： tar -xvf 安装包名字
            2. 解压完成之后，使用./configure,再回到pcre目录下执行make && make install指令
            3. 查看当前版本号的方式: pcre-config --version
        2. 安装openssl
        3. 安装zlib
        ```
        yum -y install make zlib zlib-devel gcc-c++libtool openssl openssl-devel
        ```
        4. 安装nginx
            1. 安装nginx安装包
            2. 解压tar -xvf 
            3. 执行那个./configure
            4. make && make install
        5. 安装成功之后，再usr中会多出来一个文件夹local/nginx,在nginx中有sbin启动脚本进入该脚本执行nginx即可
        6. 在usr中有个conf文件，该文件中是关于nginx的配置文件相关
    4. 查看开放的端口号的方式：firewall-cmd --list-all
    5. 设置开放的端口号：
        1. firewall-cmd --add-service=http -permanent
        2. sudo firewall-cmd --add-port=80/tcp --permanent
    6. 重置防火墙方式：firewall -cmd --reload
* nginx常用命令
    1. 使用nginx的条件：必须进入到/usr/local/sbin
    2. 查看nginx的版本号： ./nginx -v
    3. 启动nginx的方式： ./nginx
    4. 关闭方式方式： ./nginx -s stop
    5. 重新加载方式: ./nginx -s reload
* nginx配置文件
    1. nginx的配置文件在local/conf/nginx.conf
    2. vi打开文件
    3. 三个组成部分
        1. 全局块： 从配置文件开始到events块之间的内容，主要会设置一些影响nginx服务器整体运行的配置指令，如：worker-process: 1；worker-process的值越大，可以支持的并发处理量越多
        2. events快：涉及到的指令主要影响nginx服务器与用户的网络连接，比如:worker-connection 1024;支持的最大连接数为1024
        3. http块：
            1. 全局块：包括文件的引入、MIME_TYPE定义、日志自定义、连接超时时间，单链接请求上线等
            2. server块：这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机完全一样，该技术的产生是为了节省互联网服务器的硬件成本。每一个http块可以包含多个server块，而每一个serveer块相当于一个虚拟主机。而每一个server块也分为全局server块和location块
## nginx配置实例
### 反向代理
#### 实例一
* 再window中反向代理的配置过程：
    1. 首先在window得电脑中需要配置域名与IP之间的关系
    2. 在window系统中的windows/System32/drives/etc中的HOSTS中配置，ip地址加上对应的域名，如下所示：
    ```
    192.168.17.129 www.123.com
    ```
    3. 在nginx中做反向代理服务器的配置。在http块中的server块中进行，listen表示访问的端口号，server_name表示nginx中的代理服务器的ip，location中的块中proxy_pass 访问的域名与其对应的端口号
#### 实例二
* 实现效果：使用nginx反向代理，根据访问的路径跳转到不同端口的服务中，如下所示：
```
访问http://127.0.0.1:9001/edu/ 直接跳转到127.0.0.1:8081
访问http://127.0.0.1:9001/vod/ 直接跳转到127.0.0.1:8082
```
* 配置方式
    1. 准备工作
        1. 需要准备两个服务器端口，并将两个服务器都启动起来
        2. 创建文件夹和准备页面，即前端中所访问的页面
    2. 如何在nginx中去设置配置文件，进行反向代理，如下所示：
    ```
        server {
            listen 9001;
            server_name 192.168.17.129;

            location ~ /edu/ {
                proxy_pass http://127.0.0.1:8080;
            }

            location ~ /vod/ {
                proxy_pass http://127.0.0.1:8081;
            }
        }
    ```
    3. 开放需要访问的端口号9001 8081 8080
### 负载均衡
* 实现效果：在浏览器地址栏中输入http://192.168.17.128/edu/a.html，负载均衡，平均8080和8081端口中
* 准备工作：
    1. 准备两台服务器，一台8080，另外一台8081
    2. 在两台服务里面的的webapps目录中，创建名称是edu文件夹，在edu文件夹中创建页面a.html，用于测试
    3. nginx的配置文件如下所示：
    ```
    http {
        ...
        upstream myserver {
            server 115.28.52.63:8080;
            server 115.28.52.63:8081;
        }

        server {
            location / {
                proxy_pass myserver;
            }
        }
    }
    ```
    4. nginx中负载均衡的几种方式
        * 轮循方式：每种请求按照时间顺序注意分配到不同的后端服务器中，如果后端服务器down掉，能自动剔除
        * weight：weight代表权重，权重越高被分配到的客户端越多，如下所示：
        ```
        upstream myserver {
            server 112.89.23.23:8080 weight=1;
            server 112.89.23.23:8081 weight=2;
        }
        ```
        * ip_hash:每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器(换句话说就是第一次访问之后，下次就会访问第一次访问的这个ip地址)
        ```
        upstream myserver {
            ip_hash;
            server 112.23.45.67:8001;
            server 112.23.45.57:8081;
        }
        ```
        * fair：按照后端服务器的响应时间来分配请求，响应时间短的优先分配
        ```
        upstream myserver {
            server 112.32.45.67:8081
            server 113.34.56.56:8080
            fair
        }
        ```
### 动静分离
* 动静分离的两种方式：
    1. 纯粹把静态文件独立成单独的域名，放在独立的服务器上
    2. 动态和静态文件混合在一起发布，然后再通过nginx分开
* 动静分离时的转发方式：通过location指定不同的后缀名实现不同的请求转发。通过expires参数设置，可以使浏览器缓存过期时间，减少与服务器之间的请求和流量。如果设置请求发生在未过期，则返回状态码304,表示直接从浏览器的缓存中去取数据。否则就需要服务器下发
* 准备工作：在linux系统中准备静态资源，用于进行访问
* 具体在nginx中的配置方式如下：
```
location /www/ {
    root /data/;
    index index.html index.htm;
}

location /image/ {
    root /data/;
    autoindex on;
}
//其中的autoindex表示打开当前目录下的所有文件
```
### 高可用集群
* 使用场景，当nginx在down机之后去用备用机器的方式
* 配置高可用的准备刚工作
    1. 需要两台服务器 192.168.17.129和192.168.17.131
    2. 在两台服务器上安装nginx
    3. 在两台服务器上安装keepalived,安装方式如下：
    ```
    安装方式：
    1. yum install keepalived -y
    2. 直接下载安装包，然后拖动
    查询安装方式：
    rpm -q -a keepalived
    3. 安装完成之后在usr/etc/keepalived.conf中
    ```
* 关于在keepalived.conf中的配置文件的说明
```
//全局配置
global defs {
    notification_emial {
        ...
    }
    notification_email_from ...
    smtp_server 192.168.17.129
    smtp_connect_timeout 30
    //通过这个能访问到主机名字
    router_id LVS_DEVELBACK
}
//脚本检测配置
vrrp_script chk_http_port {
    script: /usr/local/src/nginx_check.sh"
    interval 2 #(检测脚本执行的间隔)
    weight 2
}

vrrp_instance VI_1 {
    state_BCKUP #备用服务器BACKUP 主MASTER
    interface ens33 #网卡的名字
    priority 90 #主、备机取不同的优先级，主机值较大，备用机值较小
    advert_int 1 # 默认值为1，检测主机或者是备用机的信号
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        192.168.17.50 //VRRP H虚拟地址，表示虚拟机的地址
    }
}
```
## nginx原理解析
1. nginx的组成由master和worker共组成，只能有一个master但是可以有多个worker
2. worker的工作方式，是采用争抢式的方式来进行的，多个woker去争抢一个请求
3. master-worker机制的好处：首先对于每个worker进程来说，独立的进程，不需要加锁，所以能够省掉锁带来的开销，同时在编程以及问题的查找时，也会方便很多。其次采用独立的进程，可以让相互之间不会影响，一个进程退出后，其他进程还在工作，服务不会中断，master机制则很快启动新的worker进程。
4. 需要设置多少个worker比较合适: nginx同redis类似都采用了io多路复用机制，每个worker进程中都只有一个主线程，通过异步非阻塞的方式来处理请求，即使是成千上万个请求也不在话下，每个worker的线程可以把一个cpu的性能发挥到及至，因而在通常情况下worker数和服务器的cpu数相等最为适宜
5. 连接数worker_connection
* 第一个：发送请求，占用了worker的几个连接数，答案是两个或者四个
* 第二个：nginx有一个master，有四个worker，每个worker支持最大的连接数据1024，其所支持的最大并发数是多少
    * 普通的静态访问最大并发数是：worker_connection*worker_process / 2
    * 如果http作为反向代理来说，最大并发数是worker_connection*worker_process / 4

## SVG和Canvas之间的区别
1. 定义上： 
    * svg是一种使用XML的描述2D图形的语言，SVG是基于XML，这意味着SVG DOM中的每个元素都是可用的，可以为某个元素附加javascript事件处理器。在svg中，每个被绘制的徒刑均被视为对象，如果SVG对象的属性发生变化，那么浏览器能够自动重现图形
    * canvas通过javascript来绘制2D图形，canvas是逐像素进行渲染，在canvas中，一旦图形被绘制完成，将不会继续得到浏览器的关注。如果起位置发生变化，那么整个场景也需要重新绘制，包括任何或许已被徒刑覆盖的对象
2. 两个之间的区别
    * Canvas：
        * 依赖分分辨率
        * 不支持事件处理器
        * 弱的文本渲染能力
        * 能够以.png或.jpg格式保存结果图像
        * 最适合图像密集型的游戏，其中的许多对象会被频繁重绘
    * SVG：
        * 不依赖于分辨率
        * 支持事件处理器
        * 最适合带有大型渲染区域的应用程序
        * 复杂度高会减慢渲染速度
        * 不适合游戏应用
## String中的方法
* String.prototype.charAt(index)，返回当前位置的字符
* String.prototype.charCodeAt(), 返回0到65535之间的整数，有一种场景就是汉字的Unicode码点是大于255的
* String.prototype.charPointAt(pos), 返回一个UniCode码点值的非负整数，pos表示这个字符串中需要转码的元素的位置
* String.prototype.concat()，该方法将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回
* String.prototype.endsWith()，该方法用来判断当前字符串是否是以另外一个给定字符串的子字符串“结尾的"的，根据判断结果返回true或false
* String.prototype.includes(), 该方法用于判断一个字符串是否包含在另一个字符串中，根据情况返回true或false
* String.prototype.indexOf(), 该方法返回调用它的String对象中第一次出现的指定值的索引
* String.prototype.lastIndexOf(), 该方法返回调用String对象的指定值的最后一次出现的索引，在第一个字符串中的指定位置从后向前搜索。如果没有找到这个特定值则返回-1
* String.prototype.match(), 该方法检索返回一个字符串匹配正则表达式的结果
* String.prototype.matchAll(), 该方法返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器
* String.prototype.normalize(), 该方法会按照制定的一种Unicode正规形式将当前字符串正规化
* Stirng.prototype.padEnd(), 该方法会用一个字符串填充当前字符串，返回填充后达到指定长度的字符串。从当前字符串的末尾(右侧)开始填充
* String.prototype.padStart(), 该方法用另一个字符串填充当前字符串，以便于达到给定的长度，从当前字符串的左侧开始填充
* String.prototype.repeat(), 该方法构造并返回一个新字符串，该字符串包含被链接在一起指定数量的字符串的副本
* String.prototype.replace(), 该方法返回一个替换值，替换部分或所有的模式匹配项后的新字符串。模式可以是一个字符串，也可以是一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数
* String.prototype.replaceAll(), 该方法返回一个新字符串，新字符串所有满足pattern的部分都被replacement替换
* String.prototype.search(), 该方法执行正则表达式和String对象之间的一个搜索匹配
* String.prototype.slice(), 该方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串
* String.prototype.split(), 该方法使用制定和的分隔符字符串将一个String对象分割成子字符串数组，以一个自定的分隔符来决定每个拆分的位置
* String.prototype.startsWith(), 该方法用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回true或者是false
* String.prototype.substr(), 该方法返回一个字符串中从指定位置开始到指定字符数的字符
* String.prototype.substring(), 该方法返回一个字符串在开始索引到结束索引之间的一个子集，或从开始索引直到字符串的末尾的一个子集
* String.prototype.toLowerCase(), 该方法将返回一个全部为小写的字符串
* String.prototype.trim(), 该方法去除该字符串中的前后空格
* String.prototype.toUpperCase(), 该方法将原字符串改为大写


## Obeject中的方法
* Object.assign(), 该方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象，它将返回目标对象。如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性
* Object.create(), 该方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
* Object.defineProperties()，该方法直接在一个对象上定义新的属性或修改现有属性，并返回该对象
* Object.defineProperty(), 该方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象
* Object.entries(), 该方法返回一个给定对象自身可枚举属性的键值对数组，其排列与使用for...in循环遍历该对象时返回的顺序一致。
* Object.freeze(), 该方法可以冻结一个对象，一个被冻结的对象，再也不能被修改
* Object.fromEntries(), 该方法把键值对列表转化为一个对象
* Object.getOwnPropertyDescriptor(), 该方法返回指定对象上一个自有属性对应的属性描述符
* Object.getOwnPropertyNames()， 该方法返回一个指定对象的所有自身属性的属性名(包括不可枚举属性但不包括Symbol值作为名称的属性)组成的数组
* Object.getOwnPropertySymbols(), 该方法返回一个给定对象自身所有的Symbol属性的数组
* Object.getPrototypeOf(), 该方法返回指定对象的原型
* Object.is(),该方法用于判断两个值是否为同一个值，描述如下：
```
//满足下面的条件两个值相等
1. 都是undefined
2. 都是null
3. 都是true或false
4. 都是相同长度的字符串并且相同字符串相同顺序排列
5. 都是相同对象(每个对象有相同的引用)
6. 都是数字，并且+0 都是-0 都是NaN
7. 与==运算不同，==运算符在判断相等前对两边的变量(如果不是相同类型)会进行强制类型转化，而Object.is不会强制转化两边的值
8. 与===运算不同，将-0和+0视为相等，而将Number.NaN与NaN视为不等
```
* Object.isExtensible()， 该方法判断一个对象是否为可扩展的
* Object.keys()， 该方法返回一个由给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致
* Obeject.prototype.hasOwnProperty()， 该方法返回一个布尔值，指示对象自身属性中是否具有指定的属性
* Obeject.prototype.isPrototypeOf(), 该方法用于测试一个对象是否存在与另一个对象的原型上
## 浏览器中的多线程
* js是单线程的，但是浏览器是多线程的，多个县城相互配合以保持同步，浏览器下的线程有  
    * javascript引擎线程，用于去解析javascript代码
    * GUI线程(与javascript线程是互斥的)
    * 事件线程(onclick, onchange等)
    * 定时器线程
    * 异步http线程，负责数据请求
    * EventLoop轮询处理线程，事件被触发时该线程会把事件添加到待处理队列的队尾
* 浏览器中，主线程和异步线程之间是怎样配合的：主线程发送一个一步请求，相应的工作线程接收到请求并告知主线程已收到通知(异步函数返回);主线程可以继续执行后面的代码，同时工作线程执行异步任务；工作线程完成工作之后，通知主线程；主线程收到通知后，执行一定的动作(调用回调函数)