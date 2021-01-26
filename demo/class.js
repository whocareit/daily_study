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

// const MyClass = class me {
//     getName() {
//         return 'jjfhdj'
//     }
// }

// let child = new MyClass();

// class Parent {

// }

// class  Child extends Parent {

// }

// class Point {
//     toString(){
//         return 'hello world'
//     }
// }

// class ColorPoint extends Point {
//     constructor(color) {
//         super(x, y);
//         this.color = color;
//     }

//     toString() {
//         return this.color + ' ' + super.toString();
//     }
// }

// let cp = new ColorPoint(1, 2, 3);

// console.log(cp.toString());

// class A {}
// class B extends A {
//     constructor() {
//         super();
//     }
// }

// class A {
//     p() {
//         return 2;
//     }
// }

// class B extends A {
//     constructor() {
//         super();
//         console.log(super.p());
//     }
// }

// let b = new B();

// class A {
//     constructor(){
//         this.x = 1;
//     }

//     print() {
//         return console.log(this.x);
//     }
// }

// class B extends A {
//     constructor() {
//         super();
//         this.x = 2;
//     }

//     m(){
//         super.print()
//     }
// }

// let b = new B()
// b.m()

// class Parent {
//     static myMethod(msg) {
//         console.log('static', msg);
//     }

//     myMethod(msg) {
//         console.log('instance', msg);
//     }
// }


// class Child extends Parent {
//     static myMethod(msg) {
//         super.myMethod(msg)
//     }

//     myMethod(msg){
//         super.myMethod(msg)
//     }
// }

// Child.myMethod(1)

// var child = new Child();
// child.myMethod(2);


// class A {

// }

// class A extends B {
//     constructor() {
//         super();
//         console.log(super)
//     }
// }