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

// async function getTitle(url) {
//     let response = await fetch(url);
//     let html = await response.text();
//     return html.match(/<title>([\s\S]+)<\/title>/i)[1];
// }
// getTitle('https://tc39.github.io/ecma262/').then(console.log);

// async function f() {
//     return await 123;
// }
// f().then(res => console.log(res))

// class Sleep {
//     constructor(timeout) {
//         this.timeout = timeout;
//     }

//     then(resolve, reject) {
//         const startTime = Date.now();
//         setTimeout(
//             () => resolve(Date.now() - startTime),
//             this.timeout
//         )
//     }
// }
// (async () => {
//     const sleepTime = await new Sleep(1000);
//     console.log(sleepTime)
// })()

// function sleep(interval) {
//     return new Promise(resolve => {
//         setTimeout(resolve, interval)
//     })
// }

// async function one2FiveInAsync() {
//     for(let i = 1; i <= 5; i++) {
//         console.log(i);
//         await sleep(1000);
//     }
// }

// one2FiveInAsync()

// async function f() {
//     await Promise.reject('erroring，，，，，，');
// }

// f()
// .then(v => console.log(v))
// .catch(e => console.log(e));

// async function f() {
//     await Promise.reject('error');
//     await Promise.reject('hello world');
// }
// f().then(res => console.log(res))
// .catch(e => console.log(e))
// async function f() {
//     try {
//         await Promise.reject('error')
//     } catch(e) {
//         return await Promise.reject('hello world')
//     }
// }
// f()
// .then(v => console.log(v))
// .catch(e => console.log(e))

// async function f() {
//     await new Promise(function (resolve, reject) {
//         throw new Error('error');
//     })
// }
// f()
// .then(res => console.log(res))
// .catch(e => console.log(e))

// let foo = await getFoo()
// let bar = await getBar()
// //用下面的方式来处理
// let [foo, bar] = await Promise.all([foo(), bar()]);
// //或者
// let fooPromise = getFoo();
// let barPromise = getBar();

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