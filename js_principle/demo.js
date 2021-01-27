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

function f() {
    console.log(Array.prototype.shift.call(arguments));
    console.log([].shift.call(arguments));
    
    console.log([].slice.call(arguments));
}

f({a: 1, b: 2}, 3 ,4 ,5)