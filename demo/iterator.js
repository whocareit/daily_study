// class RangeIterator {
//     constructor(start, stop) {
//         this.value = start;
//         this.stop = stop;
//     }

//     [Symbol.iterator]() { return this; }

//     next() {
//         var value = this.value;
//         if(value < this.stop) {
//             this.value++;
//             return {
//                 done: false,
//                 value: value
//             }
//         } 
//         return {
//             done: true,
//             value: undefined
//         } 
//     }
// }

// function range(start, stop) {
//     return new RangeIterator(start, stop)
// }

// // for(var value of range(0, 3)){
// //     console.log(value);
// // }

// function Obj(value) {
//     this.value = value;
//     this.next = null;
// }

// Obj.prototype[Symbol.iterator] = function(){
//     var iterator = { next: next }

//     var current = this;

//     function next() {
//         if(current) {
//             var value = current.value;
//             current = current.next;
//             return { done: false, value: value}
//         } else {
//             return { done: true }
//         }
//     }
//     return iterator;
// }

// var one = new Obj(1);
// var two = new Obj(2);
// var three = new Obj(3);

// one.next = two
// two.next = three

// for(var i of one) {
//     console.log(i)
// }

// const nodeList = {
//     0: '1',
//     2: '2',
//     "length": 2 ,
//     "push": Array.prototype.push
// }
// nodeList.push('3')
// console.log(nodeList)
//打印的结果如下
// {
//     0: '1',
//     2: '3',
//     "length": 2,
//     "push": Array.prototype.push
// }

// let generator = function * () {
//     yield 1;
//     yield * [2, 3, 4];
//     yield 5;
// }

// var iterator = generator();
// for(const i of iterator) {
//     console.log(i);
// }


// var someString = 'hello'
// typeof someString[Symbol.iterator]

// var iterator = someString[Symbol.iterator]();

// for(const i of iterator) {
//     console.log(i);
// }

// let myIterator = {
//     [Symbol.iterator]: function *() {
//         yield 1;
//         yield 2;
//         yield 3;
//     }
// }
// console.log([...myIterator])


// let obj = {
//     * [Symbol.iterator]() {
//         yield 'hello';
//         yield 'world';
//     }
// }
// console.log([...obj])

// function* f() {
//     for(var i = 0; true; i++) {
//         var reset = yield i;
//         if(reset) { i = -1 }
//     }
// }

// var g = f();
// console.log(g.next())
// console.log(g.next())
// console.log(g.next())
// console.log(g.next(true))

// function* foo(x) {
//     var y = 2 * (yield (x + 1));
//     var z = yield (y / 3); 
//     return (x + y + z);
// }

// var b = foo(5);
// console.log(b.next()) // { value:6, done:false }
// console.log(b.next(15)) // { value:8, done:false }
// console.log(b.next(13)) // { value:42, done:true }

function* dataConsumer() {
    console.log('Started');
    console.log(`1, ${yield}`);
    console.log(`2, ${yield}`);
    return `result`
}

let genObj = dataConsumer();
console.log(genObj.next());
console.log(genObj.next('a'));
console.log(genObj.next('b'));