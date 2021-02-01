// let something;

// (function(something) {
//     something.foo = 123;
//   })(something || (something = {}));
  
//   console.log(something);
//   // { foo: 123 }
  
//   (function(something) {
//     something.bar = 456;
//   })(something || (something = {}));
  
//   console.log(something); // { foo: 123, bar: 456 }

// import(/* webpackChunkName: "momentjs" */ 'moment')
//     .then(moment => {
//         //懒加载的模块拥有所有类型，并且能按期工作
//         //类型检查会工作，代码引用也会工作 ：100:
//         const time = moment().format();
//         console.log('Typescript >= 2.4.0 Dynamic Import Expression:');
//         console.log(time);
//     })
//     .catch(err => console.log("Failed to load moment",err))
// {
//     "compilerOptions": {
//         "target": "es5",
//         "module": "esnext",
//         "lib": [
//         "dom",
//         "es5",
//         "scripthost",
//         "es2015.promise"
//         ],
//         "jsx": "react",
//         "declaration": false,
//         "sourceMap": true,
//         "outDir": "./dist/js",
//         "strict": true,
//         "moduleResolution": "node",
//         "typeRoots": [
//         "./node_modules/@types"
//         ],
//         "types": [
//         "node",
//         "react",
//         "react-dom"
//         ]
//     }
// }

