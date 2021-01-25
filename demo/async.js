// const { reject } = require('async');
// const fs = require('fs');

// const readFile = function (fileName) {
//     return new Promise(function(resolve, rejecty) {
//         fs.readFile(fileName, function(error, data) {
//             if(error) return reject(error);
//             resolve(data);
//         })
//     })
// }

// const gen = function* () {
//     const f1 = yield readFile('/etc/fstab');
//     const f2 = yield readFile('/etc/shells');
//     console.log(f1.toString());
//     console.log(f2.toString());
// }

// //equare
// const gen1 = async function() {
//     const f1 = await readFile('/etc/fstab');
//     const f2 = await readFile('/etc/shells');
//     console.log(f1.toString());
//     console.log(f2.toString());
// }

// async function getStockPriceByName(name) {
//     const symbol = await getStockSymbol(name);
//     const stockPrice = await getStockPrice(symbol);
//     return stockPrice;
// }

// getStockPriceByName('goog').then(function (result) {
//     console.log(result);
// })

// function timeout(ms) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms)
//     })
// }

// async function asyncPrint(value, ms) {
//     await timeout(ms);
//     console.log(value);
// }


// asyncPrint('hello world', 50);

//函数声明
// async function foo() {}

// //函数表达式
// const foo = async function() {}

// //对象的方法
// let obj = { async foo() {} };

// // obj.foo().then(...)

// //class的方法
// class Storage {
//     constructor() {
//         this.cachePromise = caches.open('avatars');
//     }

//     async getAvator(name) {
//         const cache = await this.cachePromise;
//         return cache.match(`/avatars/${name}.jpg`);
//     }
// }

// const storage = new Storage();
// storage.getAvator('jake').then();

// //箭头函数
// const foo = async() => { }


// async function f() {
//     return 'hello world';
// }

// f().then(v => console.log(v));

// async function f(){
//     throw new Error('出错了');
// }

// f().then(
//     v => console.log('resolve', v),
//     e => console.log('reject', e)
// )

async function getTitle(url) {
    let response = await fetch(url);
    let html = await response.text();
    return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log);