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