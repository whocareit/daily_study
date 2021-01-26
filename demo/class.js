// function Point(x, y) {
//     this.x = x;
//     this.y = y;
// }

// Point.prototype.toString = function() {
//     return '(' + this.x + ', ' + this.y + ')';
// }

// //等同于
// class Point {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//     }

//     toString() {
//         return '(' + this.x + ', ' + this.y + ')';
//     }
// }

// class Ponit {

// }

// class Point {
//     constructor() {

//     }
// }

// var point = new Point(1, 2);

// class Point {
    
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//     }

//     toString() {
//         return '(' + this.x + ', ' + this.y + ')';
//     }

// }

// var point = new Point(2, 3);
// console.log(point.toString());
// console.log(point.hasOwnProperty('x')) // true
// console.log(point.hasOwnProperty('y'))// true
// console.log(point.hasOwnProperty('toString')) // false
// console.log(point.__proto__.hasOwnProperty('toString') )// true

// var p1 = new Point(1, 2);
// var p2 = new Point(3, 2);

// console.log(p1.__proto__ === p2.__proto__)

// class MyClass {
//     constructor() {

//     }

//     get prop() {
//         return this.x
//     }

//     set prop(value) {
//         console.log('setter' + value)
//     }
// }

// let ins = new MyClass();
// ins.prop = 123;

// console.log(ins.prop);

// let methodName = 'getArea';

// class Square {
//     constructor() {

//     }

//     [methodName]() {

//     }
// }

const MyClass = class me {
    getName() {
        return 'jjfhdj'
    }
}

let child = new MyClass();