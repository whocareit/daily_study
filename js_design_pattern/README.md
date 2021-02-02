<!--
 * @Author: your name
 * @Date: 2021-02-02 10:06:23
 * @LastEditTime: 2021-02-02 10:06:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /work/daily_study/js_design_pattern/README.md
-->
# js设计模式
## 单例模式
* 在执行当前的Single只能获得唯一一个对象。该模式是一种常用的软件设计模式。在它的核心结构中只包含一个被称为单例的特殊类。通过单例模式可以保证系统中，应用该模式的一个类只有一个实例。即一个类只有一个对象
实例。如下所示：
```
var Single = (function(){
    var instance;
    function init(){
        //定义私有方法和属性
        //操作逻辑
        return {
            //定义公共方法和属性
        }
    }

    return {
        getInstance: function() {
            if(!instance) {
                instance = init();
            }
            return instance;
        }
    }
})();

var obj1 = Single.getInstance();
var obj2 = Single.getInstance();
```
* 上面就是整个单例模式的生成过程，在上面的这个例子中，实现的方式是采用一个立即执行函数，创建了一个唯一的instance，init函数就是存放的类的唯一一个，如果没有就用该方法，有则调用的是之前的，这样就能产生唯一的实例。

## 工厂模式
* 定义一个创建对象的接口，让其子类自己决定实例化哪一个工厂类，工厂模式使其创建过程延迟到子类进行。如下所示：
```
 function Animal(opts){
    var obj = new Object();
    obj.color = opts.color;
    obj.name = opts.name;
    obj.getInfo = function() {
        return '名称' + obj.name + '颜色' + obj.color;
    }
    return obj;
}

var cat = Animal({ name: '狗', color: '黑色'});
console.log(cat.getInfo())
```
* 其主要解决接口选择问题，在使用过程中需要注意的是**复杂对象适合使用工厂模式，而简单对象，特别是只需要通过new就可以完成创建的对象，无需使用工厂模式**

## 构造函数模式
* es中的构造函数可以用来创建特定特定类型的对象，像Array和Object这样的原生构造函数，在运行时会自动出现在执行环境中。此外，也可以创建自定义的构造函数，从而定义自定义对象的属性和方法。使用构造函数的方法
即解决了重复实例化的问题，又解决了对象识别问题。如下所示：
```
function Animal(name, color) {
    this.name = name;
    this.color = color;
    this.getName = function() {
        return this.name;
    }
}

var cat = new Animal('cat', 'white');
console.log(cat.getName())
```

## 订阅/发布模式
* 发布-订阅模式里面主要包含三个模块，发布者，订阅者和调度中心。发布者发布信息到这个调度中心，而后订阅者通过这个调度中心来获取发布者发布的内容
* 其实质就是将发布者和订阅者解偶，在实际的过程中，发布者只管将需要发布的内容发布到这个调度中心，订阅者只需要去获取，订阅者和发布者之间在逻辑部分相互不影响，唯一的关系就是这个调度中心
* 跨文件使用订阅/发布模式，如果三个文件，发布者处于一个文件，订阅者在其他的多个文件，那么调度中心就需要在全局。在使用过程中，只管调用调度中心相应的方法注册和订阅
* 这种模式，订阅者可以是多个，发布者这是一个
* 订阅/发布模式的具体案例如下所示：
```
class Event {
    constructor() {}
    //定义事件容器，用来装事件数组(订阅者可以是多个)
    handlers = {}

    //事件添加方法，参数有事件名和事件方法
    addEventListener (type, handler) {
        //首先判断handlers内有没有type事件容器，没有则创建一个新数组容器
        if (! (type in this.handlers)) {
            this.handlers[type] = [];
        }
        //将事件存入
        this.handlers[type].push(handler);
    }

    //触发事件两个参数(事件名，参数)
    dispatchEvent (type, ...params) {
        //如果没有注册该时间则跑出错误
        if (!(type in handlers)) {
            return new Error('该事件没有被注册');
        }
        //便利触发方式
        this.handlers[type].forEach(ele => {
            ele(...params);
        });
    }

    //事件移除
    removeEventListener (type, handler) {
        //无效事件抛出
        if (!(type in this.handlers)) {
            return new Error('无效事件')
        }
        if (!handler) {
            delete this.handlers[type];
        } else {
            const idx = this.handlers[type].findIndex(ele => ele === handler);
            //刨除异常事件
            if (idx == -1) {
                return new Error('无绑定该事件');
            }
            //移除事件
            this.handlers[type].splice(idx, 1)
            if(this.handlers[type].length === 0) {
                delete this.handlers[type];
            }
        }
    }
}
```
* 其实上面的整个过程就是一个调度中心的作用，发布者通过调用上面的addEventListener方法来发布信息，而后订阅者则从上面的dispatch中去订阅到信息，实际调用过程如下：
```
var events = new Event();

function load(params) {
    console.log('load', params);
}

events.addEventListener('load', load);

function load1(params) {
    console.log('load1', params);
}

events.addEventListener('load1', load1);

events.dispatchEvent('load', 'load事件触发');

events.removeEventListener('load', load1);

events.removeEventListener('load');

console.log(events.handlers)
```
## 原型模式
* 用于创建重复的对象，同时又能保证性能。这种模式的意图是用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象，如下所示：
```
function Person() {}

Person.prototype.name = "bill";
Person.prototype.address = "Hangzhou";
Person.sayName = function() {
    console.log(this.name);
}

const person1 = new Person();

//测试代码
console.log(person1.name);
console.log(person1.sayName);

person1.name = "666";

//测试代码
console.log(person1.name);
console.log(person1.sayName);
```

## 混合模式
* 简单来说就是将原型模式与构造函数模式相互结合。在构造函数中所定义的是实例的属性，而原型模式定义的是共享的属性。如下所示：
```
function Animal(name, color) {
    this.name = name;
    this.color = color;

    console.log("name:" + this.name + "color" + this.color);
}

Animal.prototype.getInfo = function() {
    console.log('名称：' + this.name);
}

function largeCat (name, color) {
    Animal.call(null, name, color);

    this.color = color;
}

function create (parentObj) {
    function F(){}
    F.prototype = parentObj;
    return new F();
}

largeCat.prototype = create(Animal.prototype);

largeCat.prototype.getColor = function() {
    return this.color;
}

var cat = new largeCat('Person','white');

console.log(cat);
```

## 策略模式
* 含义，定义一系列的算法，把它们一个个封装起来，并且使他们可以相互替换
* 核心，将算法的使用和算法的实现的分离开来，一个基于策略模式的程序至少有两部分组成：
    * 第一部分一组策略类，策略类封装具体的算法，并负责具体的计算过程
    * 第二部分是环境类Context，Context接受客户的请求，随后把请求委托给某一个策略类，要做到这一点，需要Context位置对某个策略类对象的引用
* 实现案例
```
//加权映射关系
var levelMap = {
    S: 10,
    A: 8,
    B: 6,
    C: 4
}

//组策略
var scoreLevel = {
    basicScore: 80,
    S: function() {
        return this.basicScore + levelMap['S'];
    },
    A: function() {
        return this.basicScore + levelMap['A'];
    },
    B: function() {
        return this.basicScore + levelMap['B'];
    },
    C: function() {
        return this.basicScore + levelMap['C'];
    }
}

//调用
function getScore(level) {
    return scoreLevel[level] ? scoreLevel[level]() : 0;
}

console.log(
    getScore('S'),
    getScore('A'),
    getScore('B'),
    getScore('C'),
    getScore('D')
); 
```
* 在上面的案例中，scoreLevel就是策略类，内部有具体的计算逻辑，后面的调用就是Context，所以需要我们在策略类中设定好对某个策略类对象的调用方式
* 应用，比较经典的应用就是表单的验证方法，可查看当前文件夹下的demo.js文件
* 优点：可以有效地避免多重条件语句，将一系列方法封装起来也更直观，利于维护。缺点：往往策略集比较多，需要事先就了解定义好所有的情况

## 代理模式
* 含义：为对象提供一个代用品或占位符，以便控制对它的访问
* 核心：当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，实际上访问的是替身对象。替身对象对请求作出一些处理之后，再把请求转给本体对象。代理和本地的接口具有一致性，本体定义了关键功能，而代理是提供或拒绝对它的访问，或者在访问本体之前做一些额外的事情
* 实现：代理模式主要有三种：保护代理，虚拟代理，缓存代理
* 保护代理，主要实现了访问主体的限制行为，如下所示：
```
//主体，发送消息
function sendMsg(msg) {
    console.log(msg);
}

//代理, 对消息进行过滤
function proxySendMsg(msg) {
    //没有消息则直接返回
    if (typeof msg === 'undefined') {
        console.log('deny');
        return;
    }

    msg = (" " + msg).replace(/泥\s*煤/g, '');
    sendMsg(msg)
}

sendMsg('泥煤呀泥 煤呀'); // 泥煤呀泥 煤呀
proxySendMsg('泥煤呀泥 煤'); // 呀
proxySendMsg(); // deny
//在当前的案例中，通过代理对数据进行过滤，最后发出，这样属于保护代理的过程
```
* 虚拟代理，在控制对主体的访问时，在对主体访问前和访问中时，由虚拟代理来扮演主体，如下案例所示：
```
function debounce(fn, delay) {
    const delay =  delay | 20;

    let timer = null;

    return function() {
        const arg = arguments;

        //每次操作之前，清除上一次的定时器
        clearTimeout(timer);
        timer = null;
        timer = setTimeout(function() {
            fn.apply(this, arg);
        }, delay)
    }
}
var count = 0;
function scrollHandle(e) {
    console.log(e.type, ++count);
}


//代理
var proxyScrollHandle = (function() {
    return debounce(scrollHandle, 500);
})

window.onscroll = proxyScrollHandle;
```
* 缓存代理，可以为一些开销大的运算结果提供暂时的缓存，提升效率，如下所示
```
function add() {
    var arg = [].slice.call(arguments);
    
    return arg.reduce(function(a, b) {
        return a + b;
    })

}

//代理
var proxyAdd = (function() {
    var cache = [];

    return function() {
        var arg = [].slice.call(arguments).join(',');

        if (cache[arg]) {
            return cache[arg];
        } else {
            var ret = add.apply(this, arguments);
            return ret;
        }
    }
})();

console.log(
    add(1, 2, 3, 4),
    proxyAdd(10, 20, 30, 40)
)
```

## 迭代器模式
* 含义：提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示
* 核心：在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素
* 实现方式，如下所示：
```
function each(obj, cb) {
    var value;

    if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
            value = cb.call(obj[i], i, obj[i]);

            if (value === false) {
                break;
            }
        }
    } else {
        for (var i in obj) {
            value = cb.call(obj[i], i, obj[i]);

            if (value === false) {
                break;
            }
        }

        
    }
}

each([1, 2, 3], function(index, value) {
    console.log(index, value);
});

each({a: 1, b: 2}, function(index, value) {
    console.log(index, value);
});
```

## 命令模式
* 含义：用一种松耦合的方式来设计程序，使得请求者和请求接收者能够消除彼此之间的耦合关系，命令指的是一个执行某些特定事情的指令
* 核心：命令中带有excute执行，undo撤销、redo重做等相关命令方法，建议显示地指示这些方法名
* 实现：简单的命令模式实现可以直接使用对象字面量的形式定义一个命令
```
//对象的自增命令，提供执行、撤销、重做功能
//采用对象创建处理的方式，定义自增
function IncrementCommand() {
    // 当前值
    this.val = 0;
    // 命令栈
    this.stack = [];
    // 栈指针位置
    this.stackPosition = -1;
};

IncrementCommand.prototype = {
    constructor: IncrementCommand,

    // 执行
    execute: function() {
        this._clearRedo();
        
        // 定义执行的处理
        var command = function() {
            this.val += 2;
        }.bind(this);
        
        // 执行并缓存起来
        command();
        
        this.stack.push(command);

        this.stackPosition++;

        this.getValue();
    },
    
    canUndo: function() {
        return this.stackPosition >= 0;
    },
    
    canRedo: function() {
        return this.stackPosition < this.stack.length - 1;
    },

    // 撤销
    undo: function() {
        if (!this.canUndo()) {
            return;
        }
        
        this.stackPosition--;

        // 命令的撤销，与执行的处理相反
        var command = function() {
            this.val -= 2;
        }.bind(this);
        
        // 撤销后不需要缓存
        command();

        this.getValue();
    },
    
    // 重做
    redo: function() {
        if (!this.canRedo()) {
            return;
        }
        
        // 执行栈顶的命令
        this.stack[++this.stackPosition]();

        this.getValue();
    },
    
    // 在执行时，已经撤销的部分不能再重做
    _clearRedo: function() {
        this.stack = this.stack.slice(0, this.stackPosition + 1);
    },
    
    // 获取当前值
    getValue: function() {
        console.log(this.val);
    }
};

var incrementCommand = new IncrementCommand();

// 模拟事件触发，执行命令
var eventTrigger = {
    // 某个事件的处理中，直接调用命令的处理方法
    increment: function() {
        incrementCommand.execute();
    },

    incrementUndo: function() {
        incrementCommand.undo();
    },

    incrementRedo: function() {
        incrementCommand.redo();
    }
};


eventTrigger['increment'](); // 2
eventTrigger['increment'](); // 4

eventTrigger['incrementUndo'](); // 2

eventTrigger['increment'](); // 4

eventTrigger['incrementUndo'](); // 2
eventTrigger['incrementUndo'](); // 0
eventTrigger['incrementUndo'](); // 无输出

eventTrigger['incrementRedo'](); // 2
eventTrigger['incrementRedo'](); // 4
eventTrigger['incrementRedo'](); // 无输出

eventTrigger['increment'](); // 6
```
## 组合模式
* 含义：用小的自对象来构建更大的对象，而这些小的子对象本身也许是由更小的“孙对象”构成的
* 核心：调用组合对象的execute方法，将部分合成一个整体，但是需要注意的是**组合模式不是父子关系，是由一种HAS-A的关系，将请求委托给它所包含的所有叶对象。基于这种委托，就需要保证组合对象和叶对象拥有相同的接口**此外，也需要保证用一致的方式对待列表中的每个对象，即叶对象属于同一类，不需要过多特殊的额外操作
* 优点：可以方便地构造一棵树来表示对象的部分-整体 结构。在树的构造最终完成之后，只需要通过请求树的最顶层对象，便能对整课树做统一一致的操作。缺点：创建出来的对象长得都差不多，可能会使得代码不好理解，创建太多的对象对性能也会有一些影响
* 实现案例如下所示：
```
function Folder(name) {
    this.name = name;
    this.parent = null;
    this.files = [];
}

Folder.prototype = {
    constructor: Folder,

    add: function(file) {
        file.parent = this;
        this.files.push(file);

        return this;
    },

    scan: function() {
        // 委托给叶对象处理
        for (var i = 0; i < this.files.length; ++i) {
            this.files[i].scan();
        }
    },

    remove: function(file) {
        if (typeof file === 'undefined') {
            this.files = [];
            return;
        }

        for (var i = 0; i < this.files.length; ++i) {
            if (this.files[i] === file) {
                this.files.splice(i, 1);
            }
        }
    }
};


// 文件 叶对象
function File(name) {
    this.name = name;
    this.parent = null;
}

File.prototype = {
    constructor: File,

    add: function() {
        console.log('文件里面不能添加文件');
    },

    scan: function() {
        var name = [this.name];
        var parent = this.parent;

        while (parent) {
            name.unshift(parent.name);
            parent = parent.parent;
        }

        console.log(name.join(' / '));
    }
};

var web = new Folder('Web');
var fe = new Folder('前端');
var css = new Folder('CSS');
var js = new Folder('js');
var rd = new Folder('后端');

web.add(fe).add(rd);

var file1 = new File('HTML权威指南.pdf');
var file2 = new File('CSS权威指南.pdf');
var file3 = new File('JavaScript权威指南.pdf');
var file4 = new File('MySQL基础.pdf');
var file5 = new File('Web安全.pdf');
var file6 = new File('Linux菜鸟.pdf');

css.add(file2);
fe.add(file1).add(file3).add(css).add(js);
rd.add(file4).add(file5);
web.add(file6);

rd.remove(file4);

// 扫描
web.scan();
```

## 模版方法模式
* 含有：模版方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类
* 核心： 在抽象父类中封装子类的算法框架，它的init方法可作为一个算法的模版，指导子类以何种顺序去执行哪些方法。由父类分离出公共部分，要求子类重写某些父类的（易变化的）抽象方法
* 实现：该模版方法模式一般的实现方式为继承，如下所示：
```
function Sport() {}

Sport.prototype = {
    constructor: Sport,
    
    init: function() {
        this.stretch();
        this.jog();
        this.deepBreath();
        this.start();

        var free = this.end();

        if (free !== false) {
            this.stretch();
        }
    },

    stretch: function() {
        console.log('拉伸');
    },

    jog: function() {
        console.log('慢跑');
    },

    deepBreath: function() {
        console.log('深呼吸');
    },

    start: function() {
        console.log('开始');
    },

    end: function() {
        console.log('结束运动');
    }
}

function Basketball() {

}

Basketball.prototype = new Sport();

//重写相关方法
Basketball.prototype.start = function() {
    console.log('先投三分');
}

Basketball.prototype.end = function() {
    console.log('sports end');
}

const basketball = new Basketball();
basketball.init();
```

## 享元模式
* 含义：享元模式是一种用于性能优化的模式，它的目标是尽量减少共享对象的数量
* 核心：1. 运用共享技术来有效支持dealing细粒度的对象； 2. 强调将对象的属性划分为内部状态(属性)和外部状态(属性)。内部状态用于对象的共享，通常是不变的；而外部状态则剥离开来，由具体的场景决定
* 使用场景：在程序中使用了大量的相似对象时，可以利用享元模式来优化，减少对象的数量。

## 职责链模式
* 含义：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。
* 核心：请求发送者只需要知道链中的第一个节点，弱化发送者和一组接收者之间的强联系，可以便捷地在职责链中增加或删除一个节点，同样地，指定谁是第一个节点也是很便捷的
* 实现：以展示不同类型的变量为例，设置一条职责链，可以免去多重if条件分支
```
function ChainItem(fn) {
    this.fn = fn;
    this.next = null;
}

ChainItem.prototype = {
    constructor: ChainItem,

    //设置下一项
    setNext: function(next) {
        this.next = next;
        return next;
    },

    //开始执行
    start: function() {
        this.fn.apply(this, arguments);
    },

    //转到链的下一项执行
    toNext: function() {
        if (this.next) {
            this.start.apply(this.next, arguments);
        } else {
            console.log('无匹配的执行项目');
        }
    }
}

//展示数字
function showNumber(num) {
    if (typeof num === 'number') {
        console.log('number', num);
    } else {
        this.toNext(num);
    }
}

// 展示字符串
function showString(str) {
    if (typeof str === 'string') {
        console.log('string', str);
    } else {
        this.toNext(str);
    }
}

// 展示对象
function showObject(obj) {
    if (typeof obj === 'object') {
        console.log('object', obj);
    } else {
        this.toNext(obj);
    }
}

var chainNumber = new ChainItem(showNumber);
var chainString = new ChainItem(showString);
var chainObject = new ChainItem(showObject);

// 设置链条
chainObject.setNext(chainNumber).setNext(chainString);

chainString.start('12'); // string 12
chainNumber.start({}); // 无匹配的执行项目
chainObject.start({}); // object {}
chainObject.start(123); // number 123
```

## 中介者模式
* 含义：所有相关对象都通过中介者对象来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知中介者对象即可
* 核心：使网状的多对多关系变成了相对简单的一对多关系(复杂的调度处理都交给中介者)
* 实现：多个对象，指的不一定得是实例化对象，也可以理解成互相独立的多个项。当这些项在处理时，需要知晓并通知其他项的数据来处理。如果每个项都直接处理，程序会非常复杂，修改某个地方就得在多个项内部修改。将这个处理过程抽离出来，封装中介者即可。如下所示：
```
var A = {
    score: 10,

    changeTo: function(score) {
        this.score = score;

        this.getRank();
    },

    getRank: function() {
        var scores = [this.score, B.score, C.score].sort(function(a, b) {
            return a < b;
        })

        console.log(scores.indexOf(this.score) + 1);
    }

}

var B = {
    score: 20,

    changeTo: function(score) {
        this.score = score;

        // 通过中介者获取
        rankMediator(B);
    }
};

var C = {
    score: 30,

    changeTo: function(score) {
        this.score = score;

        rankMediator(C);
    }
};

//中介者，计算排名
function rankMediator(person) {
    var scores = [A.score, B.score, C.score].sort(function(a, b) {
        return a < b;
    });

    console.log(scores.indexOf(person.score) + 1);
}

// A通过自身来处理
A.changeTo(100); // 1

// B和C交由中介者处理
B.changeTo(200); // 2
C.changeTo(50); // 3
```
## 装饰者模式
* 含义：以动态地给某个对象添加一些额外的职责，而不会影响从这个类中派生的其他对象，是一种即用即付的方式，能够在不改变对象自身的基础上，在程序运行期间给对象动态的添加职责。
* 核心：为对象动态的加入行为，经过多重包装，可以形成一条装饰链
* 实际案例：
```
var A = {
    score: 10
};

A.score = '分数：' + A.score;
```

## 状态模式
* 含义：事物内部状态改变往往会带来事物行为改变。在处理的时候，将这个处理委托给当前的状态对象即可，该状态对象会负责渲染它自身的行为
* 核心：区分事物内部的状态，把事物的每种状态都封装成单独的类，跟此种状态有关的行为都被封装在这个类的内部
* 优点：状态切换的逻辑分布在状态类中，易于维护。缺点：多个状态类，对于性能来说也是一个缺点，这个缺点可以使用享元模式来做进一步优化，将逻辑分散在状态类中，可能不会很轻易的就能看出状态机的变化逻辑
* 实现：以一个人的工作状态，刚醒、精神、疲惫几个状态切换着
```

// 工作状态
function Work(name) {
    this.name = name;
    this.currentState = null;

    // 工作状态，保存为对应状态对象
    this.wakeUpState = new WakeUpState(this);
    // 精神饱满
    this.energeticState = new EnergeticState(this);
    // 疲倦
    this.tiredState = new TiredState(this);

    this.init();
}

Work.prototype.init = function() {
    this.currentState = this.wakeUpState;
    
    // 点击事件，用于触发更新状态
    document.body.onclick = () => {
        this.currentState.behaviour();
    };
};

// 更新工作状态
Work.prototype.setState = function(state) {
    this.currentState = state;
}

// 刚醒
function WakeUpState(work) {
    this.work = work;
}

// 刚醒的行为
WakeUpState.prototype.behaviour = function() {
    console.log(this.work.name, ':', '刚醒呢，睡个懒觉先');
    
    // 只睡了2秒钟懒觉就精神了..
    setTimeout(() => {
        this.work.setState(this.work.energeticState);
    }, 2 * 1000);
}

// 精神饱满
function EnergeticState(work) {
    this.work = work;
}

EnergeticState.prototype.behaviour = function() {
    console.log(this.work.name, ':', '超级精神的');
    
    // 才精神1秒钟就发困了
    setTimeout(() => {
        this.work.setState(this.work.tiredState);
    }, 1000);
};

// 疲倦
function TiredState(work) {
    this.work = work;
}

TiredState.prototype.behaviour = function() {
    console.log(this.work.name, ':', '怎么肥事，好困');
    
    // 不知不觉，又变成了刚醒着的状态... 不断循环呀
    setTimeout(() => {
        this.work.setState(this.work.wakeUpState);
    }, 1000);
};

var work = new Work('曹操');
```

## 适配器模式
* 含义： 解决两个软件实体间的接口不兼容的问题，对不兼容的部分进行适配
* 核心： 解决两个已有接口之间不匹配的问题
* 案例如下所示：
```
//渲染数据，格式限制为数组
function renderData(data) {
    data.forEach(function(item) {
        console.log(item);
    });
}

//对非数组的进行转化适配
function arrayAdapter(data) {
    if (typeof data !== 'object') {
        return [];
    }

    if (Object.prototype.toString.call(data) === '[object Array]') {
        return data;
    }

    var temp = [];
    for (var item in data) {
        if (data.hasOwnProperty(item)) {
            temp.push(data[item]);
        }
    }
    return temp;
}
var data = {
    0: 'A',
    1: 'B',
    2: 'C'
};

renderData(arrayAdapter(data)); // A B C
```

## 外观模式
* 含义：为子系统中的一组接口提供一个一致界面，定义一个高层接口，这个接口使子系统更加容易使用
* 核心：可以通过请求外观接口来达到访问子系统，也可以选择越过外观来直接访问子系统
* 实现案例，如下所示：
```
function start() {
    console.log('start');
}

function doing() {
    console.log('doing');
}

function end() {
    console.log('end');
}

//外观函数
function execute() {
    start();
    doing();
    end();
}

//调用init开始执行
function init() {
    execute();
}

init();
```