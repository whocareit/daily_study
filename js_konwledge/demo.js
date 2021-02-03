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

