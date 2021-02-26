//创建绑定函数
// const modules = {
//     x: 42,
//     getX: function() {
//       return this.x;
//     }
// };
// console.log(modules)
  
// const unboundGetX = modules.getX;
// console.log(unboundGetX()); 

// const boundGetX = unboundGetX.bind(modules);
// console.log(boundGetX());

//偏函数
// function list() {
//     return Array.prototype.slice.call(arguments);
// }

// function addArguments(arg1, arg2) {
//     return arg1 + arg2;
// }

// var list1 = list(1, 2, 3);
// console.log(list1);

// var result1 = addArguments(1, 2);
// console.log(result1);

// var leadingThirtysevenList = list.bind(null, 37);

// var addThirtySeven = addArguments.bind(null, 37);

// var list2 = leadingThirtysevenList();
// console.log(list2);

// var list3 = leadingThirtysevenList(1, 2, 3);
// console.log(list3);

// var result2 = addThirtySeven(5);
// console.log(result2);

// var result3 = addThirtySeven(5, 10);
// console.log(result3);


// Function.prototype.newBind = function() {
//     var self = this,
//         context = [].shift.call(arguments),
//         args = [].slice.call(arguments);
//     return function() {
//         return self.apply(context, [].concat.call(args, arguments))
//     }
// }


// const modules = {
//     x: 42,
//     getX: function() {
//       return this.x;
//     }
// };
// console.log(modules)
  
// const unboundGetX = modules.getX;
// console.log(unboundGetX()); 
// const boundGetX = unboundGetX.newBind(modules);
// console.log(boundGetX());

// function f() {
//     console.log(Array.prototype.shift.call(arguments));
//     console.log([].shift.call(arguments));
    
//     console.log([].slice.call(arguments));
// }

// f({a: 1, b: 2}, 3 ,4 ,5)

// const PROMISESTATUS = {
//     PENDING: 'pending',
//     FULFILLED: 'fulfilled',
//     REJECTED: 'rejected',
// };

// const isFunction = (fn) => typeof fn === 'function';
// class MyPromise {
//     constructor(handle) {
//         if(!isFunction(handle)) {
//             throw new Error('myPromise must accept a function as a paramter');
//         }

//         // 状态添加
//         this._status = PROMISESTATUS.PENDING;
//         this._value = undefined;

//         //添加回调函数队列
//         this._fulfilledQueues = [];
//         this._rejectedQUeues = [];
//         try {
//             handle(this._resolve.bind(this), this._reject.bind(this));
//         } catch(e) {
//             this._reject(e);
//         }
//     }

//     //resolve方法
//     _resolve(val) {
//         if(this._status !== PROMISESTATUS.PENDING) return;
//         this._status = PROMISESTATUS.FULFILLED;
//         this._value = val;
//     }

//     //reject方法
//     _reject(val) {
//         if(this._status !== PROMISESTATUS.PENDING) return;
//         this._status = PROMISESTATUS.REJECTED;
//         this._value = val;
//     }

//     then(onFulfilled, onRejected) {
//         const { _value, _status } = this;
//         return new MyPromise((onFulfilledNext, onRejectedNext) => {
//             // 封装一个成功时执行的函数
//             let fulfilled = value => {
//                 try {
//                     if (!isFunction(onFulfilled)) {
//                         onFulfilledNext(value)
//                     } else {
//                         let res = onFulfilled(value);
//                         if ( res instanceof MyPromise) {
//                             res.then(onFulfilledNext, onRejectedNext)
//                         } else {
//                             onFulfilledNext(res);
//                         }
//                     }
//                 } catch(e) {
//                     onRejectedNext(e);
//                 }
//             }

//             let rejected = error => {
//                 try {
//                    if (!isFunction(onRejected)) {
//                         onRejectedNext(error);
//                    } else {
//                         let res = onRejected(error);
//                         if ( res instanceof MyPromise) {
//                             res.then(onFulfilledNext, onRejectedNext);
//                         } else {
//                             onRejectedNext(res);
//                         }
//                    }
//                 } catch(e) {
//                     onRejectedNext(e);
//                 }
//             }
//             switch(_status) {
//                 case PROMISESTATUS.PENDING:
//                     this._fulfilledQueues.push(fulfilled);
//                     this._rejectedQUeues.push(rejected);
//                     break;
//                 case PROMISESTATUS.FULFILLED:
//                     fulfilled(_value);
//                     break;
//                 case PROMISESTATUS.REJECTED:
//                     rejected(_value);
//                     break;
//             }
//         })
//     }
// }

// let promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject('fail')
//     }, 1000)
//   })
//   promise2 = promise1.then(res => res, '这里的onRejected本来是一个函数，但现在不是')
//   promise2.then(res => {
//     console.log(res)
//   }, err => {
//     console.log(err)  
// })

// function createStore (stateChange) {
//     let state = null;
//     const listeners = [];
//     const subscribe = listener => listeners.push(listener);
//     const getState = () => state;
//     const dispatch = (action) => {
//         state = stateChange(state, action);
//         listeners.forEach(listener => listener());
//     }
//     dispatch({});
//     return { getState, dispatch, subscribe };
// }

// import { Component } from 'react';
// import PropTypes from 'prop-types'

// export const connect = (mapStateToProps, mapDispatchToProps) => (WrapperComponent) => {
//     class Connect extends Component {
//         static contextTypes = {
//             store: PropTypes.object
//         }

//         constructor() {
//             super();
//             this.state = {
//                 allProps: {}
//             }
//         }

//         componentDidMount() {
//             const { store } = this.context
//             this._updateProps();
//             store.subscribe(() => this._updateProps())
//         }

//         _updateProps() {
//             const { store } = this.context;
//             let stateProps = mapStateToProps ? mapStateToProps(store.getState(), this.props) : {}
//             let dispatchProps = mapDispatchToProps ? mapDispatchToProps(store.dispatch, this.props) : {}
//             this.setState({
//                 allProps: {
//                     ...stateProps,
//                     ...dispatchProps,
//                     ...this.props
//                 }
//             })
//         }


//         render() {
//             return(
//                 <WrapperComponent {...this.state.allProps}/>
//             )
//         }
//     }

//     return Connect;
// }

// var url = 'https://example.com/profile';
// var data = { username: 'example' };

// fetch(url, {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: new Headers({
//         "Content-Type": "application/json"
//     })
// }).then(res => res.json)
//   .catch(error => console.error('Error:', error))
//   .then(response => console.log('Success:', response));

// var formData = new FormData();
// var photos = document.querySelector("iuput[type='file'][multiple]");
// formData.append('title', 'My Vegas Vacation');

// for(let i = 0; i < photos.files.length; i++) {
//     formData.append('photo', photos.files[i]);
// }

// fetch('https://example.com/posts', {
//     method: 'POST',
//     body: formData
// })
// .then(response => response.json)
// .then(response => console.log('Success: ', JSON.stringify(response)))
// .catch(error => console.error('Error: ',error))

// fetch('flowers.jpg').then(function (response) {
//     if(response.ok) {
//         return response.blob();
//     }
//     throw new Error('Network response was not ok.');
// }).then(function (myBlob) {
//     var objectURL = URL.createObjectURL(myBlob);
//     myImage.src = objectURL;
// }).catch(function (error) {
//     console.log('There has been a problem with you fetch operation: ', error.message);
// })

// var myHeaders = new Headers();

// var myInit = { 
//     method: 'GET',
//     headers: myHeaders,
//     mode: 'cors',
//     cache: 'fefault'
// };

// var myRequest = new Request('flowers.jps', myInit);

// fetch(myRequest).then(function(response) {
//     return response.blob();
// }).then(function(myBlob) {
//     var objectURL = URL.createObjectURL(myBlob);
//     myImage.src = objectURL;
// })


// //模块a.js
// const name = 'hello'

// module.exports = {
//     name,
//     github: 'https://github.com'
// }

// //模块b.js

// const path = require('path');
// const { name, github } = require('./a');
// console.lohg(name, github, path.basename(github))


// //modell.js
// define(function() {
//     console.log('model1 entry');
//     return {
//         getHello: function() {
//             return 'model1';
//         }
//     }
// })

// //model2.js
// define(function() {
//     console.log('model2 entry');
//     return {
//         getHello: function() {
//             return 'model2';
//         }
//     }
// })

// //main.js
// define(function() {
//     var model1 = require('./model1.js');
//     console.log(model1.getHello());
//     var model2 = require('./model2.js');
//     console.log(mode2.getHello());
// })

// <script src="https://cdn.bootcss.com/require.js/2.3.6/require.min.js"></script>
// <script>
//     requirejs(['main']);
// </script>

// (function (global,factory) {
//     typeof exports === 'obeject' && typeof module !== 'undefined' ? module.exports = factory() : 
//     typeof define === 'function' && define.amd ? define(fatory) : 
//     (global = global || self , global.myBundle = factory());
// })(this, (function () {
//     'use strict';

//     var main = () => {
//         return 'hello world'
//     }

//     return main;
// }))

// <script src="bundle.js"></script>
// <script>
//   console.log(myBundle());
// </script>

// //增加请求拦截
// axios.interceptors.request.use(function (config) {
//     //Do something before request is sent
//     return config;
// }, function (error) {
//     //Do something with request error
//     return Promise.reject(error);
// })


// //增加响应拦截
// axios.interceptors.response.use(function (response) {
//     //任何状态码在2XX之内的都会去触发这个方法
//     //Do something with response data
//     return response;
// }, function (error) {
//     //任何状态码在2XX之外的都会去触发这个方法
//     //Do something with response error
//     return Promise.reject(error);
// })

// var modeng = {};

// var age;

// Object.defineProperty(modeng, 'age', {
//     get: function() {
//         console.log('获取年龄');
//         return age;
//     },

//     set: function(newVal) {
//         console.log('设置年龄');
//         age = newVal;
//     }
// })
// modeng.age = 18;
// console.log(modeng.age);

//Observe实现
// function defineReactive(data, key, value) {
//     //递归调用，监听所有属性
//     observe(value);
//     var dep = new Dep();
//     Object.defineProperty(data, key, {
//         get: function() {
//             if (dep.target) {
//                 dep.addSub(Dep.target);
//             }
//             return value;
//         },
//         set: function(newVal) {
//             if (value !== newVal) {
//                 value = newVal;
//                 //通知订阅器
//                 dep.notify();
//             }
//         }
//     })
// }

// function observe(data) {
//     if (!data || typeof data !== "object") {
//         return;
//     }
//     Object.keys(data).forEach(key => {
//         defineReactive(data, key, data[key]);
//     })
// }

// function Dep() {
//     this.subs = [];
// }

// Dep.prototype.addSub = function (sub) {
//     this.subs.push(sub);
// }

// Dep.prototype.notify = function () {
//     console.log('属性变化通知Watcher执行更新视图函数');
//     this.subs.forEach(sub => {
//         sub.update();
//     })
// }

// Dep.target = null;

// var modeng = {
//     age: 18
// }
// observe(modeng);
// modeng.age = 20;

//Watcher实现
// function Watcher(vm, prop, callback) {
//     this.vm = vm;
//     this.prop = prop;
//     this.callback = callback;
//     this.value = this.get();
// }

// Watcher.prototype = {
//     update: function() {
//         const value = this.vm.$data[this.prop];
//         const oldVal = this.value;
//         if (value !== oldVal) {
//             this.value = value;
//             this.callback(value);
//         }
//     },
//     get: function() {
//         //储存订阅器
//         Dep.target = this; 
//         //因为属性被监听，这一步会执行监听器里的get方法
//         const value = this.vm.$data[this.prop];
//         Dep.target = null;
//         return value;
//     }
// }

//整Watcher以及Observe
// function Mvue(options, prop) {
//     this.$options = options;
//     this.$data = options.data;
//     this.$prop = prop;
//     this.$el = document.querySelectorAll(options.el);
//     this.init();
// }

// Mvue.prototype.init = function() {
//     observer(this.$data);
//     this.$textContent = this.$data[this.$prop];
//     new Watcher(this, this.$prop, value => {
//         this.$el.$textContent = value;
//     })
// }


//传过来的数据模式
{/* <div id="app">{{name}}</div>
const vm = new Mvue({
    el: "#app",
    data: {
        name: "我是摩登"
    }
}, "name"); */}

//Compile
// function Compile(vm) {
//     this.vm = vm;
//     this.el = vm.$el;
//     this.fragment = null;
//     this.init();
// }

// Compile.prototype = {
//     init: function() {
//         this.fragment = this.nodeFragment(this.el);
//     },
//     nodeFragment: function(el) {
//         const fragment = document.createDocumentFragment();
//         let child = el.firstChild;
//         //将子节点，全部移动到文档碎片当中
//         while (child) {
//             fragment.appendChild(child);
//             child = el.firstChild;
//         }
//         return fragment;
//     },
//     compileNode: function(fragment) {
//         let childNodes = fragment.childNodes;
//         [...childNodes].forEach(node => {
//             if (this.isElementNode(node)) {
//                 this.compile(node);
//             }

//             let reg = /\{\{(.*)}\}/;
//             let text = node.textContent;

//             if (reg.test(text)) {
//                 let prop = reg.exec(text)[1];
//                 //替换模板
//                 this.compileText(node, prop);
//             }
            
//             //编译子节点
//             if (node.childNodes && node.childNodes.length) {
//                 this.compileNode(node);
//             }
//         })
//     },
//     compile: function(node) {
//         let nodeAttrs = node.attributes;
//         [...nodeAttrs].forEach(attr => {
//             let name = attr.name;
//             if (this.isDirective(name)) {
//                 let value = attr.value;
//                 if (name === "v-model") {
//                     this.compileModel(node, value);
//                 }
//             }
//         })
//     },
//     compileModel: function(node,prop) {
//         let val = this.vm.$data[prop];
//         this.updateModel(node, val);

//         new Watcher(this.vm, prop, (value) => {
//             this.updateModel(node, value);
//         })

//         node.addEventListener('input', e => {
//             let newValue = e.target.value;
//             if (val === newValue) {
//                 return;
//             }
//             this.vm.$data[prop] = newValue;
//         });
//     },
//     compileText: function(node, prop) {
//         let text = this.vm.$data[prop];
//         this.updateView(node, text);
//         new Watcher(this.vm, prop, (value) => {
//             this.updateView(node, value);
//         });
//     },
//     updateModel: function(node, value) {
//         node.value = typeof value === 'undefined' ? '' : value;
//     },
//     updateView: function(node, value) {
//         node.textContent = typeof value === 'undefined' ? '' : value;
//     },
//     isDirective: function(attr) {
//         return attr.indecOf('v-') !== -1;
//     },
//     isElementNode: function(node) {
//         return node.nodetype === 1;
//     },
//     isTextNode: function(node) {
//         return node.nodeType === 3;
//     }
// }

// function Mvue(options) {
//     this.$options = options;
//     this.$data = options.data;
//     this.$el = document.querySelectorAll(options.el);
//     //数据代理
//     Object.keys(this.$data).forEach(key => {
//         this.proxyData(key);
//     });
//     this.init();
// }

// Mvue.prototype.init = function() {
//     observer(this.$data);
//     new Compile(this);
// }

// Mvue.prototype.proxyData = function() {
//     Object.defineProperty(this, key, {
//         get: function() {
//             return this.$data[key];
//         },
//         set: function(value) {
//             this.$data[key] = value;
//         }
//     })
// }


// function bar(a) {
//     console.log(a,b);
//     var b = 3;
//     console.log(a, b);
//     var a = 1;
//     console.log(a, b);
//     function a() {}
//     console.log(a, b);
// }
// // bar(3);


// function flat(arr) {
//     let cur = [];
//     arr.forEach(ele => Array.isArray(ele) ? cur = cur.concat(flat(ele)) : cur.push(ele));
//     return cur;
// }

// // console.log(flat([1, [ 12 ,4, [ 123,[1, 2, 3], 34, 56], 34]]))

// // var arr1 = [1, 2, 3, 4];

// // console.log(arr1.map(x => [x * 2]));

// // console.log(arr1.flatMap(x => [ [x * 2 ]]));

// // console.log([1, 3, 34, 45, 67, 90].some(ele => ele > 99))

// const arr = [10, 45, 34, 12, 34, 56];
// // console.log(arr.sort((a, b) => a - b));
// // console.log(arr);
// // console.log(arr.slice(1, 3));
// console.log(arr.splice(1, 2, 11, 12));
// console.log(arr);

// const str = 'hello domino'

// console.log(str.charAt(1));
// console.log('a'.charCodeAt() > 255);

// console.log('1'.concat(str));

// console.log(str.endsWith('no'));
// console.log(str.includes('domino'));

// const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';

// const searchTerm = 'dog';
// const indexOfFirst = paragraph.indexOf(searchTerm);
// console.log(indexOfFirst);

// const name2 = '\u0041\u006d\u0065\u0301\u006c\u0069\u0065';

// const name2NFC = name2.normalize('NFD');
// console.log(name2);
// console.log(name2NFC);

// const str1 = `I have a dream is to be a basketball's player`;
// console.log(str1.padEnd(56,'.'));

// const str = '2';
// console.log(str.padStart(3, '0'));

// console.log('123'.repeat(4));

// const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?';

// console.log(p.replace('dog', 'monkey'));

// const regex = /Dog/i;
// console.log(p.replace(regex, 'fereet'));

// function deepClone(target, origin) {
//     var target = target || {}, toStr = Object.prototype.toString;
//     for (let item in origin) {
//         if(origin.hasOwnProperty(item)){
//             if(origin[item] !== null && typeof origin[item] === 'object') {
//                 if(toStr.call(origin[item]) === '[object Array]') {
//                     target[item] = [];
//                 } else {
//                     target[item] = {};
//                 }
//                 deepClone(target[item], origin[item]);
//             } else {
//                 target[item] = origin[item];
//             }
//         }
//     }
//     return target;
// }

// let obj = {
//     ad: 1,
//     cd: {
//         ad: {
//             ad: {
//                 ad: {
//                     ad: 1
//                 }
//             }
//         }
//     }
// }
// console.log(deepClone({}, obj))

// const obj = {};

// Object.defineProperty(obj, 'demo', {
//     value: 21,
//     writable: true
// })

// console.log(obj);

// var arr = ["a", "b", "c"];
// console.log(Object.getOwnPropertyNames(arr).sort());

//Object.getprototypeOf
// const prototype1 = {};
// const object1 = Object.create(prototype1);
// console.log(Object.getPrototypeOf(object1) === prototype1);

//函数柯里化实现
// function FixedParams(fn) {
//     var args = [].slice.call(arguments, 1);
//     return function() {
//         var newArgs = args.concat([].slice.call(arguments, 0));
//         return fn.apply(this, newArgs);
//     }
// }

// function newCurry(fn, length) {
//     var length = fn.length || length;
//     return function() {
//         if(arguments.length < length) {
//             var combined = [fn].concat([].slice.call(arguments, 0));
//             return newCurry(FixedParams.apply(this, combined), length - arguments.length);
//         } else {
//             return fn.apply(this, arguments);
//         }
//     }
// }
// function add(a, b, c, d, e) {
//     return a + b + c + d + e;
// }

// const ne = newCurry(add, 5);
// console.log(ne(1)(2)(3)(4)(7));

//组合函数实现方式
// function compose() {
//     const args = [].slice.call(arguments);
//     let len = args.length - 1;
//     return function (x) {
//         let result = args[len](x);
//         while(len--) {
//             result = args[len](result);
//         }
//         return result;
//     }
// }

// function add(a) {
//     return a*a;
// }

// function mul(a) {
//     return a+a;
// }
// console.log(compose(add, mul)(2));

// function throttle(handler, wait) {
//     var initTime = 0;
//     return function() {
//         var nowTime = new Date().getTime();
//         if (nowTime - initTime > wait) {
//             handler.apply(this, arguments);
//             initTime = nowTime;
//         } 
//     }
// }


// function debounce(handle, delay) {
//     var timer = null;
//     return function() {
//         var _self = this, _that = arguments;
//         clearTimeout(timer);
//         timer = setTimeout(function(){
//             handle.apply(_self, _that);
//         }, delay)
//     }
// }

// function compose() {
//     let args = [].slice.call(arguments);
//     let len = args.length - 1;
//     return function(x) {
//         let result = args[len](x);
//         while(len--) {
//             result = args[len](result);
//         }
//         return result;
//     }
// }

// var xmlHttp;
// if(window.XMLHttpRequest) {
//     xmlHttp = new XMLHttpRequest();
// } else {
//     xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
// }

//js继承

//原型继承
// function Person(name, age) {
//     this.name = name;
//     this.age = age;
// }

// function Student(school) {
//     this.school = school;
// }
// Student.prototype = new Person();

// const person = new Person();
//缺点：多个实例对引用类型的操作会被篡改

//构造函数继承
// function Car(name, color, size) {
//     this.name = name;
//     this.color = color;
//     this.size = size;
// }

// function BMM(name, color, size, model) {
//     Car.call(this, name, color, size);
//     this.model = model;
// }
//缺点，只能继承父类实例属性和方法，不能继承原型属性/方法

//组合函数继承
// function Animal(type, size, food) {
//     this.type = type;
//     this.size = size;
//     this.food = food;
// }

// Animal.prototype.sayName = function() {
//     console.log(this.name);
// }

// function Dog(type, size, food, age) {
//     Animal.call(this, type, size, food);
//     this.age = age;
// }

// Dog.prototype = new Animal();
//在使用子类创建实例对象时，其原型中会存在两份相同的属性/方法

//圣杯模式继承
// var inherit = (function(){
//     var F = function() {};
//     return function(Target, Origin) {
//         F.prototype = Origin.prototype;
//         Target.prototype = new F();
//         Origin.prototype.constructor = Target;
//         Target.prototype.uper = Origin.prototype;
//     }
// })()

//jsonp原理实现
// function addScriptTag(src) {
//     var script = document.createElement('script');
//     script.setAttribute('type', 'text/javascript');
//     script.src = src;
//     document.body.appendChild(script);
// }

// window.onload = function() {
//     addScriptTag("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=apple&callback=result");
// }

// function result(data) {
//     console.log(data);
// }

// function abc(str) {
//     let arr = [];
//     for(let i = 0; i < str.length; i++) {
//         arr[str.charCodeAt(i) - 65] += 1;
//     }
//     console.log(arr)
//     for(let i = 0; i < str.length; i++) {
//         if(arr[str.charCodeAt(i) - 65] == 1) {
//             return i;
//         }
//     }
//     return -1;
// }

// console.log(abc('google'));


//call实现
// Function.prototype.newCall = function(){
//     var ctx = arguments[0] || window;
//     ctx.fn = this;
//     var arr = [];
//     for(let i = 1; i < arguments.length; i++) {
//         arr.push('arguments['+ i +']');
//     }
//     var result = eval('ctx.fn('+arr.join(',')+')')
//     delete ctx.fn;
//     return result;
// }

//apply
// Function.prototype.newApply = function(fn, array) {
//     var ctx = fn || window;
//     ctx.fn = this;
//     if(!array) {
//         var result = ctx.fn();
//         delete ctx.fn;
//         return result;
//     } else {
//         var arr = [];
//         for(let i = 0; i < array.length; i++) {
//             arr.push('array['+i+']');
//         }
//         var result = eval('ctx.fn('+arr.join(',')+')');
//         delete ctx.fn;
//         return result;
//     }
// }

//使用立即执行函数来实现圣杯模式的继承
// var inherit = (function(){
//     function F(){}
//     return function(Origin, Target) {
//         F.prototype = Origin.prototype;
//         Target.prototype = new F();
//         Target.prototype.constructor = Target;
//         Target.prototype.uper = Origin.prototype;
//     }
// })()

// Function.prototype.newBind = function() {
//     var self = this,
//         context = [].shift.call(arguments),
//         argument = [].slice.call(arguments)
//     return function() {
//         return self.apply(context, argument);
//     }
// }

// Array.prototype.flatten = function() {
//     let result = [];
//     this.forEach(function(item) {
//         Object.prototype.toString.call(item) === '[object Array]' ? result = result.concat(item.flatten()) : result.push(item);
//     })
//     return result;
// }

// console.log([1, 2, 3, [2, 3, 4, 5, [2, 3]]].flatten())

// const PROMISE_STATUS = {
//     PENDING: 'pending',
//     FULFILLED: 'fulfilled',
//     REJECTED: 'rejected'
// }

// const isFunction = fn => typeof fn === 'function';

// class myPromise {
//     constructor(handle) {
//         if(!isFunction(handle)) {
//             throw new Error('myPromise must access a fucntion!');
//         }

//         try {
//             handle(this._fulfilled.bind(this), this._rejected.bind(this));
//         } catch(e) {
//             this._rejected(e);
//         }
//         this._value = undefined;
//         this._status = PROMISE_STATUS.PENDING;

//         this._fulfilledQueue = [];
//         this._rejectedQueue = [];
//     }

//     _fulfilled(value) {
//         if(this._status !== PROMISE_STATUS.PENDING) return;
//         this._status = PROMISE_STATUS.FULFILLED;
//         this._value = value;
//     }

//     _rejected(value) {
//         if(this._status !== PROMISE_STATUS.PENDING) return;
//         this._status = PROMISE_STATUS.REJECTED;
//         this._value = value;
//     }

//     then(onFulfilled, onRejected) {
//         let { _status, _value } = this;
//         return new myPromise((onFulfilledNext, onRejectedNext) => {

//             let resolve = value => {
//                 try {
//                     if(!isFunction(onFulfilled)){
//                         onFulfilledNext(value);
//                     } else {
//                         let res = onFulfilled(value);
//                         if(res instanceof myPromise) {
//                             res.then((onFulfilledNext, onRejectedNext))
//                         } else {
//                             onFulfilledNext(res);
//                         }
//                     }
//                 } catch(e) {
//                     onRejectedNext(e)
//                 }
//             }

//             let reject = value => {
//                 try {
//                     if(!isFunction(value)) {
//                         onRejectedNext(value);
//                     } else {
//                         let res = onRejected(res);
//                         if(res instanceof myPromise) {
//                             res.then((onFulfilledNext, onRejectedNext));
//                         }
//                     }
//                 } catch(e) {
//                     onRejectedNext(e)
//                 }
//             }


//             switch(_status) {
//                 case PROMISE_STATUS.PENDING :
//                     this._fulfilledQueue.push(resolve);
//                     this._rejectedQueue.push(reject);
//                     break;
//                 case PROMISE_STATUS.FULFILLED :
//                     resolve(_value);
//                     break;
//                 case PROMISE_STATUS.REJECTED : 
//                     reject(_value);
//                     break;
//             }
//         })
//     }
// }

//redux实现，getState, dispatch, subscribe
// function createState(stateChange) {
//     let state = null;
//     const listeners = [];
//     const subscribe = (listener) => listeners.push(listener);
//     const getState = () => state;
//     const dispatch = (action) => {
//         state = stateChange(state, action);
//         listeners.forEach(listener => listener());
//     }
//     dispatch({});
//     return { getState, dispatch, subscribe };
// }


// //connect函数简单实现过程
// import { Component } from 'react';
// import { PropTypes } from 'prop-types';

// const connect = (mapStateToProps, mapDispatchToProps) => (WrapperComponent) => {
//     class Connect extends Component {

//         static contextTypes = {
//             store: PropTypes.object
//         }

//         constructor() {
//             super();
//             this.state = {
//                 allProps: {}
//             }
//         }

//         componentDidMount() {
//             const { store } = this.context;
//             this._updateProps();
//             store.subscribe(this._updateProps());
//         }

//         _updateProps() {
//             const { store } = this.context;
//             let stateProps = mapStateToProps ? mapStateToProps(store.getState(), this.props) : {};
//             let dispatchProps = mapDispatchToProps ? mapDispatchToProps(store.dispatch, this.props) : {};
//             return {
//                 ...stateProps,
//                 ...dispatchProps,
//                 ...this.props
//             }
//         }



//         render() {
//             return (
//                 <WrapperComponent />
//             )
//         }
//     }

//     return Connect;
// }
// const http = require('http');
// const slice = Array.prototype.slice;

// class LikeExpress {
//     constructor() {
//         this.routes = {
//             all: [],
//             get: [],
//             post: []
//         }
//     }

//     register(path) {
//         const info = {};
//         if(typeof path === 'string') {
//             info.path = path;
//             info.stack = slice.call(arguments, 1);
//         } else {
//             info.path = '/';
//             info.stack = slice.call(arguments, 0);
//         }
//         return info;
//     }

//     use() {
//         const info = this.register.apply(this, arguments);
//         this.routes.all.push(info);
//     }

//     get() {
//         const info = this.register.apply(this, arguments);
//         this.routes.get.push(info);
//     }

//     post() {
//         const info = this.register.apply(this, arguments);
//         this.routes.post.push(info);
//     }

//     match(method, url) {
//         let stack = [];

//         if(url === '/favicon.ico') {
//             return stack;
//         }

//         let curRoute = [];
//         curRoute = curRoute.concat(this.routes.all);
//         curRoute = curRoute.concat(this.routes[method]);
//         curRoute.forEach(infoRoute => {
//             if(url.indexOf(infoRoute.path) === 0) {
//                 stack = stack.concat(infoRoute.stack);
//             }
//         })
//         return stack;
//     }

//     handle(req, res, stack){
//         const next = () => {
//             const middleware = stack.shift();
//             if(middleware) {
//                 middleware(req, res, next);
//             }
//         }
//         next()
//     }

//     callback() {
//         return (req, res) => {
//             res.json = data => {
//                 res.setHeader('Content-type', 'application/json');
//                 res.end(JSON.stringify(data));
//             }
//             const url = req.url;
//             const method = req.method.toLowerCase();
//             const resultList = this.match(method, url);
//             handle(req, res, resultList);
//         }
//     }

//     listen(args) {
//         const serve = http.createServer(this.callback())
//         serve.listen(...args);
//     }
// }

// const compose = (middlewarelist) => {
//     return (ctx) => {
//         const dispatch = (i) => {
//             const fn = middlewarelist[i];
//             try{
//                 return Promise.resolve(fn(ctx, dispatch.bind(null, i+1)));
//             } catch(e) {
//                 return Promise.reject(e);
//             }
//         }
//         dispatch(i);
//     }
// }
// const http = require('http');
// class LikeKoa {
//     constructor() {
//         this.middlewareList = [];
//     }

//     use(fn) {
//         this.middlewareList.push(fn);
//         return this;
//     }

//     createContent(req, res) {
//         const ctx = {
//             req,
//             res
//         }
//         ctx.query = req.query;
//         return ctx;
//     }

//     callback() {
//         const fn = compose(this.middlewareList)
//         return (req, res) => {
//             const ctx = createContent(req, res);
//             return fn(ctx)
//         }
//     }

//     listen(args) {
//         const serve = http.createServer(this.callback())
//         serve.listen(...args);
//     }
// }

//单例模式: 只能获得唯一一个对象
// var Single = (function() {
//     var instance;

//     function Init() {
//         return {

//         }
//     }

//     return {
//         getInstance: function() {
//             if(!instance) {
//                 instance = new Init();
//             }
//             return instance;
//         }
//     }
// })()

// var single1 = Single.getInstance();
// var single2 = Single.getInstance();


//工厂模式
// function Animal(opts) {
//     var obj = new Object();
//     obj.color = opts.color;
//     obj.name = opts.name;
//     obj.getInfo = function () {
//         return 'name ' + obj.name + '  color ' + obj.color;
//     }
//     return obj;
// }

// var cat = Animal({name: 'cat', color: 'dog'});
// console.log(cat.getInfo());

//构造函数模式：优点，解决重复序列化问题，又解决对象识别问题
// function Animal(name, color) {
//     this.name = name;
//     this.color = color;
//     this.getInfo = function() {
//         return this.name + 'and' + this.color;
//     }
// }
// const cat = new Animal('cat', 'white');
// console.log(cat);

//订阅/发布模式，订阅者，调度中心，发布者
// class Event {
//     handles = {}
//     constructor() {}

//     addEventListener(type, handle) {
//         if(!(type in this.handles)) {
//             this.handles[type] = [];
//         }

//         this.handles[type].push(handle);
//     }

//     dispatchEvent(type, ...params) {

//         if(!(type in this.handles)) {
//             throw new Error('该事件没有被注册');
//         }

//         this.handles[type].forEach(item => item(...params));
//     }

//     removeEventListener(type, handle) {
//         if(!(type in this.handles)) {
//             throw new Error('无效事件');
//         }

//         if(!handle) {
//             delete this.handles[type];
//         } else {
//             const idx = this.handles[type].findIndex(ele => ele === handle);

//             if(idx == -1) {
//                 return new Error('无该绑定事件');
//             } 
//             this.handles[type].splice(idx, 1);
//             if(this.handles[type].length === 0) {
//                 delete this.handles[type];
//             }
//         }
//     } 
// }

// let x = 99;
// function foo(p = x + 1) {
//     console.log(p);
// }

// foo();
// x = 100;
// foo();


function demo(x, y = 5) {
    console.log({x, y});
}

demo({});
demo({x: 1});
demo({x: 2, y: 5})