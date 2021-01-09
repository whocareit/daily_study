// const  proxy = new Proxy({} , {
//     get: function(target, propKeys) {
//         return 35;
//     }
// })

// console.log(proxy.time)
// console.log(proxy.name)
// console.log(proxy.title)
// console.log('================')

// const obj = new Proxy({}, {
//     get: function (target, propKey, receiver) {
//         console.log(`getting ${propKey}!`);
//         return Reflect.get(target, propKey, receiver)
//     },
//     set: function (target, propKey, value, receiver) {
//         console.log(`setting ${propKey}!`);
//         return Reflect.set(target, propKey, value, receiver)
//     }
// })
// obj.count = 1;
// console.log(++obj.count)
// console.log('=========second')

// const handler = {
//     get: function (target, name) {
//         if(name === 'prototype') {
//             return Object.prototype
//         }
//         return 'Hello, ' + name;
//     },

//     apply: function (target, thisBing, args) {
//         return args[0];
//     },

//     construct: function (target, args) {
//         return { value: args[1] };
//     }
// }

// const fproxy = new Proxy(function (x, y) {
//     return x + y;
// }, handler);

// console.log(fproxy(1, 2));
// console.log(new fproxy(1, 2));
// console.log(fproxy.prototype === Object.prototype);
// console.log(fproxy.foo === "Hello, foo");
// console.log('=============liuhu')

// const person = {
//     name: '张三'
// }

// const proxy = new Proxy(person, {
//     get: function(target, propKey) {
//         if (propKey in target) {
//             return target[propKey];
//         } else {
//             throw new Error(`don't have this props `) 
//         }
//     }
// })

// console.log(proxy.name);
// console.log(proxy.age);