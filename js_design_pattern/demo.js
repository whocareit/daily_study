// var Single = (function(){
//     var instance;
//     function init(){
//         //定义私有方法和属性
//         //操作逻辑
//         return {
//             //定义公共方法和属性
//         }
//     }

//     return {
//         getInstance: function() {
//             if(!instance) {
//                 instance = init();
//             }
//             return instance;
//         }
//     }
// })();

// var obj1 = Single.getInstance();
// var obj2 = Single.getInstance();

// function Animal(opts){
//     var obj = new Object();
//     obj.color = opts.color;
//     obj.name = opts.name;
//     obj.getInfo = function() {
//         return '名称' + obj.name + '颜色' + obj.color;
//     }
//     return obj;
// }

// var cat = Animal({ name: '狗', color: '黑色'});
// console.log(cat.getInfo())

// function Animal(name, color) {
//     this.name = name;
//     this.color = color;
//     this.getName = function() {
//         return this.name;
//     }
// }

// var cat = new Animal('cat', 'white');
// console.log(cat.getName())

// class Event {
//     constructor() {}
//     //定义事件容器，用来装事件数组(订阅者可以是多个)
//     handlers = {}

//     //事件添加方法，参数有事件名和事件方法
//     addEventListener (type, handler) {
//         //首先判断handlers内有没有type事件容器，没有则创建一个新数组容器
//         if (! (type in this.handlers)) {
//             this.handlers[type] = [];
//         }
//         //将事件存入
//         this.handlers[type].push(handler);
//     }

//     //触发事件两个参数(事件名，参数)
//     dispatchEvent (type, ...params) {
//         //如果没有注册该时间则跑出错误
//         if (!(type in this.handlers)) {
//             return new Error('该事件没有被注册');
//         }
//         //便利触发方式
//         this.handlers[type].forEach(ele => {
//             ele(...params);
//         });
//     }

//     //事件移除
//     removeEventListener (type, handler) {
//         //无效事件抛出
//         if (!(type in this.handlers)) {
//             return new Error('无效事件')
//         }
//         if (!handler) {
//             delete this.handlers[type];
//         } else {
//             const idx = this.handlers[type].findIndex(ele => ele === handler);
//             //刨除异常事件
//             if (idx == -1) {
//                 return new Error('无绑定该事件');
//             }
//             //移除事件
//             this.handlers[type].splice(idx, 1)
//             if(this.handlers[type].length === 0) {
//                 delete this.handlers[type];
//             }
//         }
//     }
// }

// var events = new Event();

// function load(params) {
//     console.log('load', params);
// }

// events.addEventListener('load', load);

// function load1(params) {
//     console.log('load1', params);
// }

// events.addEventListener('load1', load1);

// events.dispatchEvent('load', 'load事件触发');

// events.removeEventListener('load', load1);

// events.removeEventListener('load');

// console.log(events.handlers)

// function Person() {}

// Person.prototype.name = "bill";
// Person.prototype.address = "Hangzhou";
// Person.sayName = function() {
//     console.log(this.name);
// }

// const person1 = new Person();

// //测试代码
// console.log(person1.name);
// console.log(person1.sayName);

// person1.name = "666";

// //测试代码
// console.log(person1.name);
// console.log(person1.sayName);

// function Animal(name, color) {
//     this.name = name;
//     this.color = color;

//     console.log("name:" + this.name + "color" + this.color);
// }

// Animal.prototype.getInfo = function() {
//     console.log('名称：' + this.name);
// }

// function largeCat (name, color) {
//     Animal.call(null, name, color);

//     this.color = color;
// }


// function create (parentObj) {
//     function F(){}
//     F.prototype = parentObj;
//     return new F();
// }


// largeCat.prototype = create(Animal.prototype);

// largeCat.prototype.getColor = function() {
//     return this.color;
// }

// var cat = new largeCat('Person','white');

// console.log(cat);

// //加权映射关系
// var levelMap = {
//     S: 10,
//     A: 8,
//     B: 6,
//     C: 4
// }

// //组策略
// var scoreLevel = {
//     basicScore: 80,
//     S: function() {
//         return this.basicScore + levelMap['S'];
//     },
//     A: function() {
//         return this.basicScore + levelMap['A'];
//     },
//     B: function() {
//         return this.basicScore + levelMap['B'];
//     },
//     C: function() {
//         return this.basicScore + levelMap['C'];
//     }
// }

// //调用
// function getScore(level) {
//     return scoreLevel[level] ? scoreLevel[level]() : 0;
// }
// console.log(
//     getScore('S'),
//     getScore('A'),
//     getScore('B'),
//     getScore('C'),
//     getScore('D')
// ); 

//表单验证方法

// 错误提示
// var errotMsgs = {
//     default: '输入数据格式不正确',
//     minLength: '输入数据长度不足',
//     isNumber: '请输入数字',
//     required: '内容不为空'
// };

// // 规则集
// var rules = {
//     minLength: function(value, length, errorMsg) {
//         if (value.length < length) {
//             return errorMsg || errorMsgs['minLength']
//         }
//     },
//     isNumber: function(value, errorMsg) {
//         if (!/\d+/.test(value)) {
//             return errorMsg || errorMsgs['isNumber'];
//         }
//     },
//     required: function(value, errorMsg) {
//         if (value === '') {
//             return errorMsg || errorMsgs['required'];
//         }
//     }
// };

// //校验器
// function Validator(){
//     this.items = [];
// }

// Validator.prototype = {
//     constructor: Validator,

//     //添加校验规则
//     add: function(value, rule, errorMsg) {
//         var arg = [value];

//         if (rule.indexOf('minLength') !== -1) {
//             var temp = rule.split(':');
//             arg.push(temp[1]);
//             rule = temp[0];
//         }

//         arg.push(errorMsg);

//         this.items.push(function() {
//             // 进行校验
//             return rules[rule].apply(this, arg);
//         });
//     },
    
//     // 开始校验
//     start: function() {
//         for (var i = 0; i < this.items.length; ++i) {
//             var ret = this.items[i]();
            
//             if (ret) {
//                 console.log(ret);
//                 // return ret;
//             }
//         }
//     }
// }

// // 测试数据
// function testTel(val) {
//     return val;
// }

// var validate = new Validator();

// validate.add(testTel('ccc'), 'isNumber', '只能为数字'); // 只能为数字
// validate.add(testTel(''), 'required'); // 内容不为空
// validate.add(testTel('123'), 'minLength:5', '最少5位'); // 最少5位
// validate.add(testTel('12345'), 'minLength:5', '最少5位');

// var ret = validate.start();

// console.log(ret);

//protect proxy

//主体，发送消息
// function sendMsg(msg) {
//     console.log(msg);
// }

// //代理, 对消息进行过滤
// function proxySendMsg(msg) {
//     //没有消息则直接返回
//     if (typeof msg === 'undefined') {
//         console.log('deny');
//         return;
//     }

//     msg = (" " + msg).replace(/泥\s*煤/g, '');
//     sendMsg(msg)
// }

// sendMsg('泥煤呀泥 煤呀'); // 泥煤呀泥 煤呀
// proxySendMsg('泥煤呀泥 煤'); // 呀
// proxySendMsg(); // deny

// function debounce(fn, delay) {
//     const delay =  delay | 20;

//     let timer = null;

//     return function() {
//         const arg = arguments;

//         //每次操作之前，清除上一次的定时器
//         clearTimeout(timer);
//         timer = null;
//         timer = setTimeout(function() {
//             fn.apply(this, arg);
//         }, delay)
//     }
// }
// var count = 0;
// function scrollHandle(e) {
//     console.log(e.type, ++count);
// }


// //代理
// var proxyScrollHandle = (function() {
//     return debounce(scrollHandle, 500);
// })

// window.onscroll = proxyScrollHandle;

// function add() {
//     var arg = [].slice.call(arguments);
    
//     return arg.reduce(function(a, b) {
//         return a + b;
//     })

// }

// //代理
// var proxyAdd = (function() {
//     var cache = [];

//     return function() {
//         var arg = [].slice.call(arguments).join(',');

//         if (cache[arg]) {
//             return cache[arg];
//         } else {
//             var ret = add.apply(this, arguments);
//             return ret;
//         }
//     }
// })();

// console.log(
//     add(1, 2, 3, 4),
//     proxyAdd(10, 20, 30, 40)
// )

// function each(obj, cb) {
//     var value;

//     if (Array.isArray(obj)) {
//         for (var i = 0; i < obj.length; i++) {
//             value = cb.call(obj[i], i, obj[i]);

//             if (value === false) {
//                 break;
//             }
//         }
//     } else {
//         for (var i in obj) {
//             value = cb.call(obj[i], i, obj[i]);

//             if (value === false) {
//                 break;
//             }
//         }

        
//     }
// }

// each([1, 2, 3], function(index, value) {
//     console.log(index, value);
// });

// each({a: 1, b: 2}, function(index, value) {
//     console.log(index, value);
// });

//对象的自增命令，提供执行、撤销、重做功能
//采用对象创建处理的方式，定义自增
// function IncrementCommand() {
//     // 当前值
//     this.val = 0;
//     // 命令栈
//     this.stack = [];
//     // 栈指针位置
//     this.stackPosition = -1;
// };

// IncrementCommand.prototype = {
//     constructor: IncrementCommand,

//     // 执行
//     execute: function() {
//         this._clearRedo();
        
//         // 定义执行的处理
//         var command = function() {
//             this.val += 2;
//         }.bind(this);
        
//         // 执行并缓存起来
//         command();
        
//         this.stack.push(command);

//         this.stackPosition++;

//         this.getValue();
//     },
    
//     canUndo: function() {
//         return this.stackPosition >= 0;
//     },
    
//     canRedo: function() {
//         return this.stackPosition < this.stack.length - 1;
//     },

//     // 撤销
//     undo: function() {
//         if (!this.canUndo()) {
//             return;
//         }
        
//         this.stackPosition--;

//         // 命令的撤销，与执行的处理相反
//         var command = function() {
//             this.val -= 2;
//         }.bind(this);
        
//         // 撤销后不需要缓存
//         command();

//         this.getValue();
//     },
    
//     // 重做
//     redo: function() {
//         if (!this.canRedo()) {
//             return;
//         }
        
//         // 执行栈顶的命令
//         this.stack[++this.stackPosition]();

//         this.getValue();
//     },
    
//     // 在执行时，已经撤销的部分不能再重做
//     _clearRedo: function() {
//         this.stack = this.stack.slice(0, this.stackPosition + 1);
//     },
    
//     // 获取当前值
//     getValue: function() {
//         console.log(this.val);
//     }
// };

// var incrementCommand = new IncrementCommand();

// // 模拟事件触发，执行命令
// var eventTrigger = {
//     // 某个事件的处理中，直接调用命令的处理方法
//     increment: function() {
//         incrementCommand.execute();
//     },

//     incrementUndo: function() {
//         incrementCommand.undo();
//     },

//     incrementRedo: function() {
//         incrementCommand.redo();
//     }
// };


// eventTrigger['increment'](); // 2
// eventTrigger['increment'](); // 4

// eventTrigger['incrementUndo'](); // 2

// eventTrigger['increment'](); // 4

// eventTrigger['incrementUndo'](); // 2
// eventTrigger['incrementUndo'](); // 0
// eventTrigger['incrementUndo'](); // 无输出

// eventTrigger['incrementRedo'](); // 2
// eventTrigger['incrementRedo'](); // 4
// eventTrigger['incrementRedo'](); // 无输出

// eventTrigger['increment'](); // 6