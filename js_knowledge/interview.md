## 前端性能优化相关
## 前端基础部分，占比50%
### html/html5

#### meta
* 作用：搜索引擎优化（SEO），定义页面使用语言，自动刷新并指向新的页面，实现网页转换时的动态效果，控制页面缓冲，网页定级评价，控制网页显示的窗口等！
* name属性主要用于描述网页，对应于content（网页内容），以便于搜索引擎机器人查找、分类（目前几乎所有搜索引擎都使用网上机器人自动查找meta值来给网页分类）。
* meta 的属性有两种：name和http- equiv。

#### 主流浏览器内核
* mozilla内核 (firefox,flock等) -moz
* webkit内核(safari,chrome等) -webkit
* opera内核(opera浏览器) -o
* trident内核(ie浏览器) -ms

#### HTML标签

* 块级标签：默认宽度100%(占满一行)；
    * 块级标签自动换行(独占一行，右边不能有任何东西)；
    * 块级标签可以使用CSS设置宽度高度！
    * 常用的块状元素有：div、 p、 h1**h6、ol、ul、dl、table、address、blockquote、form
* 行级标签：默认宽度由内容撑开(内容多宽、宽度就占多宽)；
    * 行级标签不会自动换行(一行当中，从左往右依次排列)；
    * 行级标签的宽度高度不能设置！ 常用的内联元素有：a、span、br、i、em、strong、label、q、var、cite、code
* 常用的内联块状元素有：img、input。

* DOCTYPE的作用：是一种标准通用标记语言的文档类型声明，且必须声明在文档的第一行，来告知浏览器用何种文档标准来解析这个网页，不同的渲染模式会影响浏览器对CSS和JavaScript的解析标准。
    * 文档的解析模式目前主要有 *两种（注意：还有一种“准标准模式”只在IE8浏览器里，目前主流浏览器已无需考虑）：
        * 怪异模式（quirks mode）：此种模式会模拟更旧的浏览器的行为。如果没有声明DOCTYPE，浏览器默认会以这种模式解析文档。
        * 标准模式（standards mode）：浏览器使用W3C的标准解析渲染页面。

* 前端数据存储的方式
    * 前端有哪几种数据存储方式？（基础题）
* 主要的存储方式有Cookie、LocalStorage、SessionStorage、IndexedDB、WebSQL，它们的优缺点如下：
    * Cookie：在HTML5标准前本地储存的主要方式优点是兼容性好，请求头自带cookie方便可以和服务端进行交互缺点是大小只有4k，请求头携带cookie浪费流量，每个domain限制20个cookie，JS无法直接操作，需要自行封装
    * LocalStorage：以键值对为标准的数据存储方式优点是操作方便，永久性储存（除非手动删除），大小为5M缺点是兼容IE8+
    * SessionStorage：与localStorage基本类似，区别是**sessionStorage当页面关闭后会被清理优点是会话级随存随取，不占用本地空间，操作方便缺点是不能在所有同源窗口中共享，是会话级别的储存方式，兼容IE8+
    * IndexedDB：是被正式纳入HTML5标准的数据库储存方案，它是NoSQL数据库，用键值对进行储存，可以进行快速读取操作优点是存储量更大，非常适合web场景，同时支持JS进行操作，非常方便缺点是兼容性IE8+
    * WebSQL：类似SQLite，是真正意义上的关系型数据库，用sql进行操作优点是关系型数据库，适合大型的离线web应用缺点是JS需要通过transaction操作sql，火狐浏览器不支持

## WebSocket原理，以如何实现持久化连接
* WebSocket是HTML5出的协议，也就是说HTTP协议没有变化，也就是说与HTTP协议没有关系。其支持持久化连接。其是为了兼容现有浏览器的握手规范。可以这样来理解websocket其和http协议有交集，但并不是全部。
* WebSocket的其他特点：
    * 建立在TCP协议之上，服务器端实现比较容易
    * 与HTTP协议有着良好的兼容性，默认的端口也是80和443，并且握手阶段采用HTTP协议，因此握手时不容易屏蔽，并能通过各种HTTP代理服务器
    * 数据格式比较轻量级，性能开销小，通信高效
    * 可以发送文本，也可以发送二进制数据
    * 没有同源限制，客户端可以与任意服务器通信
    * 协议标识符是ws(如果加密，则为wss)，服务器网址就是URL
* Websocket是什么样的协议，具体有什么优点？
    * websocket是一个持久化的协议，相对于HTTP这种非持久化的协议来说。
        1. http生命周期通过Request来界定，也就是说一个Request和一个Response，那么在HTTP1.0中，这次HTTP请求就结束了。在HTTP1.1中进行改进，使得有一个keep-alive，也就是说，在一个http连接中，可以发送多个Request，接受多个Response。但是需要在HTTP中记住，request的数量与response的数量是相等的。
        2. WebSocket中发起请求的请求头的信息如下:
        ```
        GET /chat HTTP/1.1
        Host: server.example.com
        Upgrade: websocket
        Connection: Upgrade
        Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
        Sec-WebSocket-Protocol: chat, superchat
        Sec-WebSocket-Version: 13
        Origin: http://example.com
        ```
        * 其中下面的这两个东西表示告诉服务器发送的请求的协议是Websocket协议
        ```
        Upgrade: websocket
        Connection: Upgrade
        ```
        * Sec-WebSocket-Key是一个Base64 encode的值，这是浏览器随机生成的，用于验证是不是Websocket助理
        * Sec-WebSocket-Protocol是一个用户定义的字符串，用来区分同URL下，不同的服务所需要的协议
        * Sec-WebSocket-Version是告诉服务器所使用的WebSocket Draft(版本)
* webSocket的作用
    * 在这之前需要知道下面的几个内容ajax轮询和long poll的原理
    1. ajax轮询：让浏览器隔个几秒就发送一次请求，询问服务器是否有新消息。这种方式需要服务器有很快的处理速度和资源
    2. long poll：与ajax轮询差不多，都是采用轮询的方式，不过采取的是阻塞模型，也就是说，客户端发送请求后，如果没消息，就一直不返回Response给客户端。直到有消息才返回，返回完后，客户端再次创立连接，周而复始。long poll需要有很高的并发，也就是说同时接待客户的能力
    * 上面的这两种方式都是在不断地建立HTTP连接，然后等待服务器处理，然后可以体现HTTP协议被动性的特点，即服务端不能主动联系客户端，只能有客户端发起
    * WebSocket作用：解决被动性，当服务器完成协议升级后，服务端就可以主动推送信息到客户端。这样做的好处是只需要经过一次HTTP请求，就可以做到源源不断的信息传送

### css/css3
* 盒模型
* 盒模型中有两种是需要去注意的，盒模型都包括以下部分width height border margin padding
    * 区别：
    * 在标准盒模型中，其width包括的只是content区域
    * 在IE盒模型中，其width包含的就是content+border+padding部分

* 清除浮动
    * 当使用float后，就会产生浮动流，浮动流会对之后的页面布局有影响，清除浮动常常使用clear: both;
    * 通常清除浮动的方式，采用伪元素选择器代码如下：
        ```
        元素：after{
        display: 'block;
        content: ‘’;
        clear: both;
        }
        ```

* 伪类与伪元素
    * 两者的区别在于以下的几种情况：
    * 表示方法:
        * css2中伪类、伪元素都是以单冒号(:)表示,css2.1后规定伪类用单冒号，伪元素用双冒号(::)表示，浏览器同样接受
        * css2时已经存在的伪元素(:before, :after, :first-line, :first-letter等)的单冒号写法。对于css2之后的所有新增的伪元素
        * 如(::selection)，应该采用双冒号的写法，但因为兼容性问题。大部分还是采用单冒号
    * 定义不同:
        * 伪类，通常可以添加类来达到效果；伪元素，需要通过添加元素才能达到效果。
        * 可以同时使用多个伪类，但是只能同时使用一个伪元素
    * 本质上:
        * 伪类本质上是为了弥补方法常规css选择器的不足，比便于获得更多的信息
        * 伪元素本质上是创建了一个有内容的虚拟器

* flex布局：

* 常见的布局方式：
    * 静态布局：传统的web设计，网页上的所有元素的尺寸一律用px作为单位
    * 流式布局：页面的宽度按照屏幕分辨率进行适配调整，但是整体的布局不变，网页中主要划分区域的尺寸使用百分数(搭配min_, max_)
    * 自适应布局：分别为不同的屏幕分辨率定义布局，即创建多个静态布局，每一个静态布局对应一个分别率。改变屏幕分辨率可以切换不同的静态布局，但是在每个静态布局中，页面元素不会随窗口大小的调整而发生变化。
    * 响应式布局：通常的作法是流式布局加上弹性布局再加上媒体查询来实现。分别为不同的屏幕分辨率定义布局，同时，在每个布局中应用流式布局的理念，即页面元素宽度随着窗口调整而自动适配

* bfc触发方式： 
    * float的值不为none
    * overflow的值不为visible
    * position的值不为relative和static
    * display的值为table-cell,table-caption,inline-block值中的一个

* css中的继承
    * 每一个属性在定义中都给出了这个属性是否具有继承性，一个具有继承性的属性会在没有指定值的时候，会使用父元素的同属性的值
    来作为自己的值。
    * 一般具有继承性的属性有，字体相关的属性，font-size和font-weight等。
    * 文本相关的属性，color和text-align等。
    * 表格的一些布局属性、列表属性如list-style等。
    * 还有光标属性cursor、元素可见性visibility。
    * 当一个属性不是继承属性的时候，我们也可以通过将它的值设置为inherit来使它从父元素那获取同名的属性值来继承。

* 水平居中一个div块的方式
    * 对于文字text-align: center ， line-height
    * 使用margin： 0 auto的方式
    * position： absolute， 搭配magin-left
    * position： absolute 搭配 translate使用，未知高度
    * display： flex方式

* css3新特性
```
·新增各种CSS选择器（:not(.input) 所有class不是“input”的节点）
·圆角（border-radius: 8px;）
·多列布局（multi-columnlayout）
·阴影和反射（Shadow/Reflect）
·文字特效(text-shadow)
·文字渲染(Text-decoration)
·线性渐变(gradient)
·旋转(transform)
·缩放，定位，倾斜，动画，多背景
```

* 为什么要清除浮动？清除浮动的方式？
```
·清除浮动是为了清除使用浮动元素产生的影响。浮动的元素，高度会塌陷，
而高度的塌陷使我们页面后面的布局不能正常显示。
① 额外标签法（在最后一个浮动标签后，新加一个标签，给其设置clear: both;）(不推荐)
优点：通俗易懂，方便
缺点：添加无意义标签，语义化差
② 父级添加 overflow 属性（父元素添加 overflow: hidden）(不推荐)
优点：代码简洁
缺点：内容增多的时候容易造成不会自动换行，导致内容被隐藏掉，无法显示要溢出的元素
③ 使用 after 伪元素清除浮动 （推荐使用）
.clearfix::after{
  /* 伪元素是行内元素，正常浏览器清除浮动方法 */
  content: "";
  dispaly: block;
  height: 0;
  clear: both;
  visibility: hiden;
}
.clearfix{
  /* *ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行 */
  *zoom: 1; 
}
优点：符合闭合浮动思想，结构语义化正确
缺点：IE6-7不支持伪元素：after,使用zoom：1触发hasLayout
④ 使用before 和 after 双伪元素清除浮动
.clearfix::after, .clearfix::before{
  content: "";
  display: table;
}
.clearfix::after{
  clear: both;
}
.clearfix{
  *zoom: 1;
```

* .CSS优化，提高性能的方法有哪些？
```
·加载性能：
① CSS 压缩：将写好的CSS 进行打包压缩，可以减少很多的体积。
② CSS单一样式：当需要下边距和左边距的时候，很多时候选择：margin: top 0 bottom 0;
但margin-top: top;margin-bottom: bottom;执行的效率更高。
·选择器性能：
① 关键选择器。选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分）。
```


## SVG和Canvas之间的区别
1. 定义上： 
    * svg是一种使用XML的描述2D图形的语言，SVG是基于XML，这意味着SVG DOM中的每个元素都是可用的，可以为某个元素附加javascript事件处理器。在svg中，每个被绘制的图形均被视为对象，如果SVG对象的属性发生变化，那么浏览器能够自动重现图形
    * canvas通过javascript来绘制2D图形，canvas是逐像素进行渲染，在canvas中，一旦图形被绘制完成，将不会继续得到浏览器的关注。如果启始位置发生变化，那么整个场景也需要重新绘制，包括任何或许已被图形覆盖的对象
2. 两个之间的区别
    * Canvas：
        * 依赖分辨率
        * 不支持事件处理器
        * 弱的文本渲染能力
        * 能够以.png或.jpg格式保存结果图像
        * 最适合图像密集型的游戏，其中的许多对象会被频繁重绘
    * SVG：
        * 不依赖于分辨率
        * 支持事件处理器
        * 最适合带有大型渲染区域的应用程序
        * 复杂度高会减慢渲染速度
        * 不适合游戏应用
* sassandless
```
 sass 与 less 都是预编译（预处理）的css语言。

Sass是一种动态样式语言，Sass语法属于缩排语法，比css比多出好些功能(如变量、嵌套、运算,混入(Mixin)、继承、颜色处理，函数等)，更容易阅读。

Less也是一种动态样式语言. 对CSS赋予了动态语言的特性，如变量，继承，运算， 函数.  Less 既可以在客户端上运行 (支持IE 6+, Webkit, Firefox)，也可在服务端运行 (借助 Node.js)。


1.为什么需要预处理css呢？——>CSS只是单纯的属性描述，它并不具有变量、条件语句等，CSS的特性导致了它难组织和维护。

 2. 什么是预处理CSS？——>less和sass可以看做css 拓展出去的两种动态样式语言,可以看做在CSS基础上功能的延伸和拓展。

           其基本思想是，用一种专门的编程语言，为CSS增加了一些编程的特性，将CSS作为目标生成文件，然后开发者就只要使用这种语言进行编码工作。简单点讲就是，你不需要考虑CSS在浏览器之间的兼容性问题。在涌现出来的众多的CSS预处理器语言中，Sass、LESS和Stylus是最优秀的，使用最多的。

三。区别：

         LESS和Sass的他们的实现方式：Less是基于JavaScript，是在客户端处理的。
                                                              Sass是基于Ruby，是在服务器端处理的。

         *PS：大多数开发者不会选择Less,因为JavaScript引擎需要额外的时间来处理代码然后输出修改过的CSS到浏览器，降低了性能，增加了时间损耗。

         推荐：只在开发环节使用LESS。完成了开发，复制粘贴LESS输出到一个压缩器，然后到一个单独的CSS文件来替代LESS文件。另一个选择是使用LESS.app来编译和压缩你的LESS文件。两个选择都将最小化你的样式输出，从而避免由于用户的浏览器不支持JavaScript而可能引起的任何问题。

```

### js
* 算法
```
简单： 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。

1. 
你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。 给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下，能够偷窃到的最高金额。

2.给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。输入: [-2,1,-3,4,-1,2,1,-5,4], 输出: 6 解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。

3. 给定一个无序的整数数组，找到其中最长上升子序列的长度。输入: [10,9,2,5,3,7,101,18] 输出: 4 解释: 最长的上升子序列是 [2,3,7,101]，它的长度是 4。
```
* 解构赋值，使用的场景

* 类数组相关
```
var obj = {
                "0" : 'a',
                "1" : 'b',
                "2" : 'c',
                "length" : 3,
                "push" : Array.prototype.push
  }
```
* async与promise之间的联系

#### Promise相关
* https://es6.ruanyifeng.com/#docs/promise
* 特点：
* 含义
* 常见方法：
* 题目：使用promise怎样去合并多个请求
* 题目2：多个请求之间存在一定的依赖性，a b c d之间，采用promise去处理，怎样处理最好
* 题目：红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？（用 Promse 实现）
```
给定
function red(){
    console.log('red');
}
function green(){
    console.log('green');
}
function yellow(){
    console.log('yellow');
}

```

```
利用 then 和递归实现：
function red(){
    console.log('red');
}
function green(){
    console.log('green');
}
function yellow(){
    console.log('yellow');
}

var light = function(timmer, cb){
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            cb();
            resolve();
        }, timmer);
    });
};

var step = function() {
    Promise.resolve().then(function(){
        return light(3000, red);
    }).then(function(){
        return light(2000, green);
    }).then(function(){
        return light(1000, yellow);
    }).then(function(){
        step();
    });
}

step();
```

* promise的局限性
    1. 错误被吃掉
    2. 单一值
    3. 无法取消
    4. 无法得知 pending 状态
    ```
    https://juejin.cn/post/6844903694069137421#heading-9
    ```


## 函数抖动与函数节流
### 函数防抖
* 含义：指的是触发事件后n秒内函数只能执行一次，如果在n秒内又触发了该事件，则会重新计算函数执行时间
* 使用场景：连续的事件，只需要去触发一次回调函数
    * 搜索框搜索输入，只需要用户最后一次输入外，再发送请求
    * 手机号、邮箱验证输入检测
    * 窗口大小Resize。只需要窗口调整完成后，计算窗口大小，防止重复渲染
* 简单实现方式
```
    const debounce = (func, delay) => {
        let timer;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(func, delay);
        }
    }

    function debounce(handle, delay) {
        var timer = null;
        return function() {
            var _this = this, _arg = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                handle.apply(_this, _arg);
            }, delay)
        }
    }

```
### 函数节流
* 含义： 指的是限定一个函数在一定时间内只能执行一次
* 使用场景：间隔一段事件执行一次回调函数
    * 滚动加载，加载更多或滚动到底部监听
    * 谷歌搜索框，搜索联想功能
    * 高频点击提交，表单重复提交
* 简单实现方式
```
function throttle = (handle, wait) {
    var initTime = 0;
    return function() {
        var nowTime = new Date().getTime();
        if(nowTime - initTime > wait) {
            handle.apply(this, arguments);
        }
    }
}
```

### 两者的相同点与异同点
* 相同点：
    * 都可以通过setTimeout实现
    * 目的都是降低回调执行频率，节省计算资源
* 不同点：
    * 函数抖动，在一段连续操作后，处理回调函数，利用clearTimeout和setTimeout实现。函数节流，在一段连续操作中，每一段时间只执行一次，频率较高的事件中使用来提高性能
    * 函数抖动关注一定时间连续触发，只在最后一次执行，而函数节流侧重于一段时间内只执行一次


## 变量提升
对于变量提升，发生的情况主要是用了var这个声明变量的方式，在es6之后出现的let, const这两种声明变量的方式，并不会出现这种变量声明。
那么对于变量提升，我们需要掌握的其实就是js中预编译的过程，当你了解到预编译之后，对于整个的变量提升就非常的清楚明白了。
掌握预编译首先要掌握的就是在js当中的全局变量与局部变量
*  全局变量
	1. 在全局显示的定义： var(关键字) + （标识符），如 var t = 2;
	2. 隐式的定义：无论你在函数的内部还是在全局中写 t = 2，类似与这种形式的方式，都可以称t为全局变量，具体例子
如： `function (){
        var a = b = 3;}`
此时的b为全局变量，而这里的a就为局部变量
* 局部变量
  在function内部，定义变量时，采用上面所说的显示定义全局变量的方式,如 var a = 3;则此表示的就是局部变量，如上面所举出的那个例子，a为局部变量，b为全局变量。
  
当了解完这两个概念之后，那么就来理解函数的预编译过程,首先讨论是在函数中讨论函数的预编译发生过程，总共有四步：
1. 生成一个AO对象（AO为执行期上下文）
2. 找形参和变量声明，作为AO对象的属性，其值为undefine
3. 形参和实参值相统一
4. 在函数中找函数声明

举个栗子，来加深对方面的四句话的理解
```
function bar(a){
    console.log(a,b); 
    var b = 3;
    console.log(a,b);
    var a = 1;
    console.log(a,b);
    function a(){}
    console.log(a); 
}
bar(3);

// funtion a() {}, undefined
//function a() {}, 3
// 1，3
//1
```

* 构造函数，实例原型以及实例之间的关系：
    1. 构造函数通过prototype指向实例原型，如：Person构造函数通过prototype指向Person.prototype
    2. 实例原型通过constructor指向构造函数，如：Person.prototype通过constructor指向Person构造函数
    3. 实例通过__proto__隐式的指向实例原型，如： person实例通过__proto__指向实例原型

## 事件循环
EventLoop：即事件循环，指浏览器或Node的一种解决js单线程不会阻塞的机制，其是一种执行模型，在不同的地方有不同的实现，浏览器和NodeJs都是基于不同的
技术实现了各自的EventLoop,可以概述为以下两点：
  1. 浏览器的EventLoop是在h5规范中所写
  2. noeJs的EventLoop是基于libvue实现的
  
理解事件循环，首先需要区分两个任务
* 宏任务(macrotask),也叫tasks，一些异步执行的任务的回调会依次的进入macro task queue，等待后续被调用，这些任务包括
 1. setTimeout
 2. setInterval
 3. setImmediate(node独有)
 4. requestAnimation(浏览器独有)
 5. I/O
 6. UI rendering(浏览器独有)
 
 * 微任务(microtasks),也叫jobs，这些异步任务包括
 1.  process.nextTick(node独有)
 2.  Promise.then()
 3. object.observe()
 4. MutationObserve（注意： promise构造函数里的代码是同步执行的）
 
  上面的这些任务，只需要记住就行了
  #### 浏览器中事件循环的机制
  在浏览器中，只有一个执行栈和一个任务队列，在任务队列中放的是宏任务浏览器中事件循环的执行方式为：***每从事件队列中取出一个事件时，有微任务就把微任务执行完，然后才开始执行事件（即从任务队列中去拿一个宏任务）***
举个栗子
```
console.log(1)
setTimeout(function(){
    console.log(2);
},0)
new Promise(() => {
    console.log(3);
    setTimeout(() => {
        console.log(4);
    })
})
console.log(5);

////////
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')

setTimeout(function () {
    console.log('setTimeout')
}, 0)

async1()

console.log('script end')
```
具体的结果可以自己试试，然后结合在浏览器中的事件循环的执行方式来理解对于node中的事件循环机制，会涉及到六个队列，执行的方式也不一样，具体可以在网上看看博客

## AMD、CommonJs、CMD、UMD、ES6
### CommonJs
* 主要运行与服务器端，该规范指出，一个单独的文件就是一个模块。Node.js为主要实践者。它有重要的环境变量为模块化的实现提供支持: module exports require global。require命令用于
输出其他模块提供的功能，module.exports命令用于规范模块的对外借口，输出的是一个值的拷贝，输出之后就不能改变，就会缓存起来，如下所示
```
//模块a.js
const name = 'hello'

module.exports = {
    name,
    github: 'https://github.com'
}

//模块b.js

const path = require('path');
const { name, github } = require('./a');
console.lohg(name, github, path.basename(github))
```
* CommonJs采用同步加载模块，而加载的文件资源大多数在本地服务器当中，所以执行速度或时间没有问题，但是在浏览器端，限于网络原因，更加合理的方案是使用异步加载
### AMD
* AMD是"Asynchronous Module definition"的缩写。采用异步方式加载模块，模块的还在不影响它后面语句的运行。所有以来这个模块的语句，都定义在一个回调函数中，等到
加载完成之后，这个回调函数才会运行。其中RequireJs是实践者。
* 模块功能主要的几个命令：define、require、return和define.amd。define是全局函数，用来定义模块，define(id?, dependencies?, factory)。require命令用于输入
其他模块提供的功能。return命令用于规范模块的对外接口，define.amd属性是一个对象，此属性的存在来表明函数遵循AMD规范
```
//modell.js
define(function() {
    console.log('model1 entry');
    return {
        getHello: function() {
            return 'model1';
        }
    }
})

//model2.js
define(function() {
    console.log('model2 entry');
    return {
        getHello: function() {
            return 'model2';
        }
    }
})

//main.js
define(function() {
    var model1 = require('./model1.js');
    console.log(model1.getHello());
    var model2 = require('./model2.js');
    console.log(mode2.getHello());
})


//加载mainJs
<script src="https://cdn.bootcss.com/require.js/2.3.6/require.min.js"></script>
<script>
    requirejs(['main']);
</script>
```
### CMD
* 该规范的全称(Common Module Definition-通用模块定义)，该规范主要是Sea.js推广中形成，一个文件就是一个模块，可以像Node.js一般书写模块代码。主要用于浏览器中运行，当然可以在Node.js中运行。
其与AMD很类似，不同点在于：AMD推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行
```
// model1.js
define(function (require, exports, module) {
    console.log('model1 entry');
    exports.getHello = function () {
        return 'model1';
    }
});
// model2.js
define(function (require, exports, module) {
    console.log('model2 entry');
    exports.getHello = function () {
        return 'model2';
    }
});
// main.js
define(function(require, exports, module) {
    var model1 = require('./model1'); //在需要时申明
    console.log(model1.getHello());
    var model2 = require('./model2'); //在需要时申明
    console.log(model2.getHello());
});
<script src="https://cdn.bootcss.com/seajs/3.0.3/sea.js"></script>
<script>
    seajs.use('./main.js')
</script>
// 输出 
// model1 entry
// model1
// model2 entry
// model2
```
### UMD
* 全称为(Universal Module Definition)通用模块定义，该模式主要用来解决CommonJS模式和AMD模式代码不能通用的问题，并同时还支持老式的全局变量规范。如下所示：
```
(function (global,factory) {
    typeof exports === 'obeject' && typeof module !== 'undefined' ? module.exports = factory() : 
    typeof define === 'function' && define.amd ? define(fatory) : 
    (global = global || self , global.myBundle = factory());
})(this, (function () {
    'use strict';

    var main = () => {
        return 'hello world'
    }

    return main;
}))

<script src="bundle.js"></script>
<script>
  console.log(myBundle());
</script>

//1. define为函数，并且是否在define.amd, 来判断是否为AMD规范
//2. 判断module是否为一个对象，并且是否存在module.exports来判断是否为CommonJS规范
//3. 如果以上两种都没有，设定为原始的代码规范
```

### ES Modules
* ES modules是js官方的标准化模块系统
    1. 因为是标准，所以未来很多浏览器会支持，可以很方便的在浏览器中使用。(浏览器默加载不能省略.js)
    2. 它同时兼容在node环境下运行
    3. 模块的导入导出，通过import和export来确定。可以和Commonjs模块混合使用
    4. ES modules输出的是值的引用，输出接口动态绑定，而CommonJS输出的是值的拷贝
    5. ES modules模块编译时执行，而CommonJS模块总是在运行时加载
```
// index.js
import { name, github } from './demo.js';

console.log(name(), github());

document.body.innerHTML = `<h1>${name()} ${github()}</h1>`
export function name() {
    return 'qiufeng';
}

export function github() {
    return 'https://github.com/hua1995116';
}
<script src="./index.js" type="module"></script>
```

## MVC、MVP和MVVM
### MVC
* MVC是最经典的开发模式之一，最早是后台来的，随着前端的复杂度的增加，MVC的开发模式也带入了前端。该模式由三部分组成
    * View(视图层)，试图与控制器之间，视图接收用户的操作，传递给控制器，有控制器决定采用那个函数来处理
    * Controller(控制器)，控制器与模型之间，控制器将用户的具体操作，通过直接调用模型提供的方法来操作模型，或者是通过其他服务方法来操作模型
    * Model(模型)，视图与模型之间，模型发生变化时，将会通过观察者模式，通知试图；视图将会从模型中取出数据显示，完成视图刷新
* MVC有两个很明显的问题：
    1. model层和view层直接打交道，导致这两层耦合度很高
    2. 因为所有逻辑都写在controller层，导致controller层特别的臃肿
### MVP
* MVP模式是相对于MVC模式的改良，将Controller层用Presenter层代替，view层和Model层交互被Presenter层给隔断，从理论上去除View层和Model之间的耦合
* 其结构可以说与MVC模式一样，唯一的区别就是其隔绝了View和Model

### MVVM
* MVVM模式就是通过双向绑定的机制，实现数据和UI内容，只要想改其中一方，另一方都能够及时更新的一种设计理念。MVP中的View和Presenter要相互持有，方便调用对方，而在MVVM模式中View和ViewModel通过Binding进行关联，他们之前的关联处理通过DataBinding完成
## Vue双向绑定原理
* 数据绑定：将数据源给绑定到一个类型(对象)实例上的某个属性的方法
* 常见的架构模式有MVC MVP MVVM模式，目前前端框架基本上都是采用MVVM模式实现双向绑定。但是各个框架实现双向绑定的方法不同。当前主要的三种实现方式有
    * 发布订阅模式
    * Angular的脏查机制
    * 数据劫持
* 在Vue中采用的是数据劫持与发布订阅相结合的方式实现双向绑定，数据劫持主要通过Object.defineProperty来实现




## 框架使用，以及具体场景使用部分，占比50%


#### 前后端验证登录的方式
网站有很多权限控制，登录用户和未登录用户显示的内容有差别。
前后端分离后，前端怎样判断用户是否已登录？有哪些方式？

方法一：

```
登录成功后，后端返回一个 cookie，根据这个 cookie 的有无来判断；退出登录时，后端会删除这个 cookie；

方法二：

登录成功后，前端设置 cookie，比如'isLogin = true'，根据isLogin的值去判断；退出登录时删除 cookieisLogin 或设置  'isLogin = false'。

方法三：

前台发送登录请求
后台返回 token，前台得到后台返回的 token，将其写入到 localStorage 中，后续请求中都携带 token
后台判断 token 是否过期，如果过期就对前台的请求响应过期标识或者状态码
前台得到过期标识后，清除 localStorage 中的 token，然后重定向到 login 路由
```

### 小程序开发相关

* 部署相关
# nginx
* 含义：nginx是一个高性能的http和反向代理服务器，特点是占用内存少，并发能力强，事实上nginx的并发能力确实是在同类型的网页服务器中表现较好
* 意义：专门为性能优化而开发，性能是其最重要的考量，实现上非常注重效率，能经受高负载的考验，有报告表明能支持高达5万个并发连接数
## nginx的使用
* 反向代理
 * 正向代理：在客户端(浏览器端)配置代理服务器，通过代理服务器进行互联网访问
 * 反向代理：在客户端(浏览器端)将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器来获取数据的方式
* 负载均衡： 单个服务器解决不了的问题，可以通过增加服务器的数量，然后将请求分发到各个服务器上，将原先的请求集中到单个服务器上的情况改为将请求分发到多个服务器上，将负载分发(近似于平均分发)到不同的服务器
* 动静分离： 为了加快网站的解析速度，可以把动态页面和静态页面由不同的服务器来解析，加快解析速度，降低原来单个服务其的压力
## nginx安装、命令和配置文件
* 在linux中安装nginx：
    1. 使用远程连接工具连接linux操作系统
    2. 安装nginx相关素材(依赖)
        1. pcre
        2. openssl
        3. zlib
        4. nginx
    3. 安装方式：
        1. 安装pcre： wget http://download.sourceforge.net/project/pcre/pcre/8.37/pcre-8.37.tar.gz
            1. 解压文件方式： tar -xvf 安装包名字
            2. 解压完成之后，使用./configure,再回到pcre目录下执行make && make install指令
            3. 查看当前版本号的方式: pcre-config --version
        2. 安装openssl
        3. 安装zlib
        ```
        yum -y install make zlib zlib-devel gcc-c++libtool openssl openssl-devel
        ```
        4. 安装nginx
            1. 安装nginx安装包
            2. 解压tar -xvf 
            3. 执行那个./configure
            4. make && make install
        5. 安装成功之后，再usr中会多出来一个文件夹local/nginx,在nginx中有sbin启动脚本进入该脚本执行nginx即可
        6. 在usr中有个conf文件，该文件中是关于nginx的配置文件相关
    4. 查看开放的端口号的方式：firewall-cmd --list-all
    5. 设置开放的端口号：
        1. firewall-cmd --add-service=http -permanent
        2. sudo firewall-cmd --add-port=80/tcp --permanent
    6. 重置防火墙方式：firewall -cmd --reload
* nginx常用命令
    1. 使用nginx的条件：必须进入到/usr/local/sbin
    2. 查看nginx的版本号： ./nginx -v
    3. 启动nginx的方式： ./nginx
    4. 关闭方式方式： ./nginx -s stop
    5. 重新加载方式: ./nginx -s reload
* nginx配置文件
    1. nginx的配置文件在local/conf/nginx.conf
    2. vi打开文件
    3. 三个组成部分
        1. 全局块： 从配置文件开始到events块之间的内容，主要会设置一些影响nginx服务器整体运行的配置指令，如：worker-process: 1；worker-process的值越大，可以支持的并发处理量越多
        2. events快：涉及到的指令主要影响nginx服务器与用户的网络连接，比如:worker-connection 1024;支持的最大连接数为1024
        3. http块：
            1. 全局块：包括文件的引入、MIME_TYPE定义、日志自定义、连接超时时间，单链接请求上线等
            2. server块：这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机完全一样，该技术的产生是为了节省互联网服务器的硬件成本。每一个http块可以包含多个server块，而每一个server块相当于一个虚拟主机。而每一个server块也分为全局server块和location块


## 深浅拷贝
* 浅拷贝是对对象地址的复制，并没有开辟新的栈，复制的结果是两个对象指向同一个地址，修改其中一个对象的属性，另一个对象的属性就会改变
* 深拷贝是开辟新的栈，两个对象对应不同的地址，修改一个对象的属性，不会改变另一个对象的属性

## js中的隐式类型转化中常见法则
* if会自定转为boolean类型
    * 转为false: '', false, null, undefined, NaN
    * 转为true: true, [], {}
* 参与+会被隐式的转为字符串
    * 被转为空字符串的数据： '', []
    * 被转为字符串的数据：flase, true, NaN, null, undefiend
    * 被转为数据类型标记的数据：{}
* 参与*运算符会被隐式转为数字：
    * 转为0: '', [], false
    * 转为1: true, [1], '1'
    * 转为NaN: {}, {a: 1}

## 内存泄漏
* 内存泄漏指得是任何对象在不再拥有或需要它之后缓存在的情况
* 垃圾回收机制，会定时扫描对象，并计算引用每个对象的其他对象的数量，如果一个对象的引用数量为0(即没有其他对象引用该对象)，或该对象的唯一引用是循环的，那么该对象的内存即可回收
*  造成内存泄漏的几种情况
  1. setTimeout中的第一个参数使用字符串而不是函数时
  2. 闭包
  3. 控制台日志
  4. 循环(两个对象彼此引用，并且彼此保留时，就会产生一个循环)

  ## 浏览器缓存机制
对于缓存其存在的意义在于可以加快相应事件，提高用户的体验，对于一般的html文件，浏览器会自动访问，对于ajax请求所发送的数据，有时也需要缓存，需要注意的是post请求浏览器是不会进行缓存的。
* http状态码304
该状态码代表的意思是服务器不会给我们数据，因此当前浏览器中有缓存的数据，此状态码代表使用缓存，当浏览器看到此状态码就应该去拿缓存中的数据
* 浏览器中缓存方式
1. 协商缓存：根据前后台状态来判定是否要进行缓存
    ETags和If-None-Match
      *  ETags是响应头中的内容，If-None-Match是请求头中内容，首次请求结束后会将ETags设置在If-None-Match中，第二次请求时，则会将ETags传输到服务器中
对比ETags如果相同(表示两次请求的内容相同)，则服务器会返回304状态码，这时浏览器应该取缓存中的数据

   last-Modified和If-Modified-since
   
   * last-Modified是响应头中的内容，If-Modified-since是请求头中的内容，其发生的过程与上面的类似，如果对比两次结果相同，这时服务器就会返回304状态码
   
  
  * 强制缓存：强制设定缓存数据的存储时间，一到时间就清空缓存数据
   1. Cache-control: 请求头部和响应头部都可以包含该字段，此字段是用来设置浏览器缓存的保留时间，可设置为以下值：
   2.  no-Cache: 不缓存
   3. no-Store: 用于防止重要的信息被无意的发布
   4. max-age: 指示客户机可以接收生存期不大于指定时间的响应
   5. min-fresh：指示客户机可接收响应时间小于当前时间加上指定时间的响应
   6.  max-stale: 指示客户机可以接收超出超时间的响应时间
   7.  Expires: 内容保质器，若其和max-age同在则会被覆盖掉，其参数值设定时，可直接设置时间
   




vue相关面试：
v-if和v-show之间的区别：
* v-if和v-show用于视图层进行条件判断视图展示
* v-if的原理是根据判断条件来动态的进行增删DOM元素，v-show是根据判断条件来动态的进行显示和隐藏元素，频繁的进行增删DOM操作会影响页面加载速度和性能，由此我们可以得出结论：当您的项目程序不是很大的时候，v-if和v-show都可以用来进行判断展示和隐藏（这种场景使用v-if只是影响不大，并不是没有影响；
* 只有v-if能和v-else连用进行分支判断，v-show是不能和v-else连用的，如果出现多种条件场景的情况下，可以使用v-if来进行判断

vue中的响应式原理：
```
1.响应式原理
在生成vue实例时，为对传入的data进行遍历，使用Object.defineProperty把这些属性转为getter/setter.

Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。

每个vue实例都有一个watcher实例，它会在实例渲染时记录这些属性，并在setter触发时重新渲染。

https://www.jianshu.com/p/b47e6a93e7e0
```

* vue数据双向绑定原理
## Vue双向绑定原理
* 数据绑定：将数据源给绑定到一个类型(对象)实例上的某个属性的方法
* 常见的架构模式有MVC MVP MVVM模式，目前前端框架基本上都是采用MVVM模式实现双向绑定。但是各个框架实现双向绑定的方法不同。当前主要的三种实现方式有
    * 发布订阅模式
    * Angular的脏查机制
    * 数据劫持
* 在Vue中采用的是数据劫持与发布订阅相结合的方式实现双向绑定，数据劫持主要通过Object.defineProperty来实现
```
https://www.jianshu.com/p/23180880d3aa
```

* 基础题
* 业务题

