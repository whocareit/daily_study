// var myIterable = {};
// myIterable[Symbol.iterator] = function* () {
//     yield 1;
//     yield 2;
//     yield 3;
// }
// console.log([...myIterable])

const { readFile } = require("fs");

// function* gen() {

// }
// var g = gen();

// console.log(g[Symbol.iterator]() === g)

// function* dataConsumer() {
//     console.log(`1.${yield}`);
//     console.log(`2.${yield}`);
//     return 'result';
// }

// let genObj = dataConsumer();
// genObj.next();
// genObj.next('a');
// genObj.next('b');

// function wrapper(generatorFunction) {
//     return function (...args) {
//         let generatorObj = generatorFunction(...args);
//         generatorObj.next();
//         return generatorObj;
//     }
// }

// const wrapped = wrapper(function* () {
//     console.log(`first input: ${yield}`);
//     return 'DONE';
// })

// wrapped().next('hello!');
// function* fib() {
//     let [prev, curr] = [0, 1];
//     for(;;) {
//         yield curr;
//         [prev, curr] = [curr, prev + curr];
//     }
// }
// for( let n of fib()) {
//     if( n > 1000) break
//     console.log(n);
// }

// function* objectEntries(obj) {
//     let propKeys = Reflect.ownKeys(obj);

//     for(let propKey of propKeys) {
//         yield [propKey, obj[propKey]];
//     }
// }

// let jane = { first: 'Jane', last: 'Doe'}
// for (let [key, value] of objectEntries(jane)) {
//     console.log(`${key}: ${value}`);
// }

// const object1 = {
//     property1: 42,
//     property2: 13
// }

// const array1 = []

// console.log(Reflect.ownKeys(object1));
// console.log(Reflect.ownKeys(array1));

// var g = function* () {
//     try {
//         yield;
//     } catch(e) {
//         if( e != 'a' ) throw e; 
//         console.log('内部捕获', e);
//     }
// }

// var i = g();
// i.next();

// try {
//     throw new Error('a')
//     throw new Error('b')
// } catch(e) {
//     console.log('外部捕获', e);
// }
// 内部捕获 a
// 外部捕获 b


// var gen = function* gen(){
//     yield console.log('hello');
//     yield console.log('world');
// }

// var g = gen();
// g.next()
// g.throw()
// function* gen() {
//     yield 1;
//     yield 2;
//     yield 3;
// }
// var g = gen();
// console.log(g.next());
// console.log(g.return('foo'));
// console.log(g.next())

// const g = function* (x, y) {
//     let result = yield x + y;
//     return result;
// }

// const gen = g(1, 2);
// console.log(gen.next());
// console.log(gen.next(1)); 

// function* foo() {
//     yield 'a';
//     yield 'b';
// }

// function* bar() {
//     yield 'x';
//     for(let i of foo()) {
//         console.log(i);
//     }
//     yield 'y';
// }

// for(let i of bar()) {
//     console.log(i)
// }

// function* bar() {
//     yield 'x';
//     yield* foo();
//     yield 'y';
// }

// function* foo() {
//     yield 'x';
//     yield 'a';
//     yield 'b';
//     yield 'y';
// }

// for(let i of bar()) {
//     console.log(i)
// }

// function* gen() {
//     yield* ['a', 'b', 'c'];
// }
// console.log(gen().next());

// function* gen() {
//     yield* ['a', 'b', 'c'];
// }
// console.log(gen().next())

// function* iterTree(tree) {
//     if(Array.isArray(tree)) {
//         for(let i = 0; i < tree.length; i++) {
//             yield* iterTree(tree[i])
//         }
//     }else{
//         yield* tree;
//     }
// }

// const tree = [ 'a', ['b', 'c', ['g', 'h']], ['d', 'e'] ];

// for(let i of iterTree(tree)) {
//     console.log(i)
// }

// function* g() {}

// g.prototype.hello = function() {
//     return 'hi'
// }

// let obj = g();

// console.log(obj instanceof g)
// console.log(obj.hello())

// function* g() {
//     this.a = 11;
// }

// let obj = g();
// obj.next();
// console.log(obj.a);

// function* F() {
//     this.a = 1;
//     yield this.b = 2;
//     yield this.c = 3;
// }
// var obj = { };
// var f = F.call(obj);   


// console.log(f.next())
// console.log(f.next())
// console.log(f.next())

// console.log(obj.a, obj.b,obj.c);

// fs.readFile(fileA, 'utf-8', function(err, data){
//     fs.readFile(fileA, 'utf-8', function(err, data){
//        // ...
//     })
// }) 

// var readFile = require('fs-readfile-promise');

// readFile(fileA)
// .then(function (data) {
//     console.log(data.toString())
// })
// .then(function () {
//     return readFile(fileB)
// })
// .then(function (data) {
//     console.log(data.toString())
// })
// .catch(function (err) {
//     console.log(err)
// })

// function* asyncJob() {
//     //....
//     var f = yield readFile(fileA);
//     //...
// }

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