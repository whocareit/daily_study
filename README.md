<!--
 * @Author: your name
 * @Date: 2020-11-26 15:36:17
 * @LastEditTime: 2021-01-05 16:55:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /work/daily_study/project.md
-->
## Element.scrollIntoView()
* 作用： 让当前的元素滚动到浏览器窗口的可视区域内
* 语法
```
    element.scrollIntoView(); //等同于element.scrollIntoView
    element.srcollIntoView(alignToTop); //Boolean参数
    element.scrollIntoView(scrollIntoViewOPtions); //object参数 
```
* alignToTop可选一个Boolean值：
    * 如果为true，元素的顶端将和其所在滚动区的可视区域的顶端对齐。相应的 scrollIntoViewOptions: {block: "start", inline: "nearest"}。这是这个参数的默认值。
    * 如果为false，元素的底端将和其所在滚动区的可视区域的底端对齐。相应的scrollIntoViewOptions: {block: "end", inline: "nearest"}。
* scrollIntoViewOptions 可选 一个包含下列属性的对象：
    * behavior 可选定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"。
    * block 可选定义垂直方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "start"。
    * inline 可选定义水平方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "nearest"。
## 随机颜色生成方式
* 需要涉及到随机数的生成方式
    * 生成[1, max] Math.floor(Math.random() * max + 1)
    * 生成[min, max] Math.floor(Math.random(max - min + 1) + min);
```
function getRandomColor():string {
    const colorArray: string[] = [
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple',
    ]
    return colorArray[Math.floor(Math.random()*colorArray.length)]
}
```
## 使用hook去代替生命周期函数的方式
* constructor: 可以通过useState来初始化state
* componentDidMount(),在hook中需要使用下面的这种方式去取代，在useEffect中传递第二个参数，该参数为一个空数组，只会去执行一次，如下面所示
```
useEffect(() => {

},[])
```
* componentDidUpdate(),有两种方式去解决
    * 1. 在每次渲染的时候都去调用hooks，解决的方式如下面所示
    ```
        useEffect(() => {

        })
    ```
    * 2. 用一个特殊变量的去触发hook,如下面所示,count指的就是这个特殊的变量，该hook触发，只会是count的值改变时
    ```
        useEffect(() => {

        },[count])
    ```
* componentWillUnmount(),用hook来代替，需要去return一个callback(回调函数)，如下面的形式所示
```
    useEffect(() => {
        return () => {
            //执行的为componentWillUnmount
        }
    },[])
```
* shouldComponentUpdata()，常使用React.memo来代替,在默认情况下，它将对props对象中的复杂对象进行浅层比较，如果想要去控制比较，可以去提供一个自定义的比较函数作为第二个参数。代替hook的方式如下所示
```
    import React from 'react'
    function areEqual(prevProps, nextProps) {
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
    }
    const Weather = ({weather}) => {
        return (<div>
                <p>{weather.city}</p>
                <p>{weather.temperature}</p>
                {console.log('Render')}
                </div>
        )
    }

    export default React.memo(Weather, areEqual)
```
## --save与--save-dev之间的区别
1. 两者之间的区别：
    * --save是对生产环境所需依赖的声明(开发应用中使用的框架，库)，如：jq，react，vue等
    * --save-dev是对开发环境所需要依赖的声明(构建工具，测试工具)，如：babel，webpack等
2. 如何判断当前需要引入的第三方插件使用什么指令
    * 在安装时，可以按照npm官网中所对应的安装方式中去使用
    * 自己进行判断当前需要引入的第三方插件是在什么环境中去使用
3. 使用方式
    * npm install 在默认的情况下是对生成环境和开发环境进行安装
    * npm install --production只会去安装生产环境中的所有模块save

## 查看树形结构功能所涉及知识点
### hook中的useRef
* 声明变量到useRef中，设置到对应的jsx的dom节点上，就能获取到该dom节点上的信息其current就包含了其中的一些信息，具体可以在使用的场景中给打印下来，使用方式如下：
```
    声明的方式：const svgRef = useRef(null);
    对应节点上： <svg className={styles.svgStyle} ref={svgRef}>
    如在useEffect上去使用：
    if(svgRef && svgRef.current){
        setClientWidth(svgRef.current.clientWidth)
    } 
```
### 监听div容器变化的方式
1. 原生js监听div容器变化的方法
    1. MuttationObserve，用于去监听整个DOM的变化，构造函数为window.MutationObserve,在监听到DOM中的改变并且一系列改变结束后触发对应的回调函数，其与事件的不同是，在DOM变化时，会记录每一个DOM的变化（为一个MutationRecord对象），到DOM变化结束时触发回调函数。DOM变化可能是一系列的（如同时改变高和宽），那么这一系列的变化就会产生一个队列，这个队列会作为参数传递给回调函数。**由于浏览器的差异，其存在一定的差异性**
    ```
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    let observer = new MutationObserver(callback);
    ```
    2. 常用的三个api，observe(element, options)用户监听dom变化；disconnect() 阻⽌ MutationObserver 实例继续接收的通知，直到再次调⽤其observe⽅法；takeRecords() 从MutationObserver的通知队列中删除所有待处理的通知，并将它们返回到⼀个MutationRecord对象构成的新
数组中。
2. react中的hook使用方式：
    * 首先需要借助第三方库函数来使用，使用npm install resize-observe来安装第三方插件，最后使用import { ResizeObserver } from 'resize-observer';导入到文件中，最后通过获取到dom节点，然后来进行监听，方式如下：
    ```
         //使用resize observe来实现svg的自适应
        const svg = document.getElementById('svg')
        if(svg){
            const resizeOberve = new ResizeObserver(entries => {
               for(const entry of entries){
                   const { width } = entry.contentRect;
                   //div盒子改变后的自适应
                   if(width) {
                        setClientWidth(width);
                        for(let item in json) {
                            // setPath(item, json[item])
                            // setGroupPath(json[item])
                        }
                   }
               }
            })
            resizeOberve.observe(svg);
            return (): void => {resizeOberve.unobserve(svg)}
        }
    ```
### 运用svg绘制三次贝塞尔曲线，从而实现类似思维导图那样的展示方式
*  svg，全称(Scalabel vector Graphics),是一种用于描述二维的矢量图形。其实可以理解为一张画布，里面的circle,path,line,ellipse等可以理解为对应的图形。具体图形样式的属性和怎样使用查询文档就可以了解(https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element)[https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element]。
* 在这个功能开发的需求中，只需要我们去了解到使用svg怎样去绘制三次贝塞尔曲线即可，在这里有个网站可以看到三次贝塞尔曲线的绘制(https://cubic-bezier.com/#0,.72,.69,1)[https://cubic-bezier.com/#0,.72,.69,1],那么接下来就是用path这个元素在svg中去绘制三次贝塞尔曲线。具体实例如下：
```
<svg className={styles.svgStyle} ref={svgRef}>
    {
        arr.map((item, index) => <path key={index+`${item} ds`} d={setPath(index + 1, lastcenter,caculateLayer - 1, arr)} stroke="#1890ff" fillOpacity="0"  strokeWidth="2" />)
    }
</svg>
```
* 在上面的这个实际例子当中，使用了path来绘制贝塞尔曲线，在这里定义了一个setPath方法，可以根据传入的坐标值即可绘制出对应的三次贝塞尔曲线。其中的fillOpacity表示把填充色的透明度设置为0，这样才能使得产生的曲线具有对称性，这里的d表示的其实是相对路径，即三次贝塞尔曲线所绘制时，需要生成的四个点的位置`M${center} 0  C${x1} 0 ${result} 30 ${result} 100`所表示的就是d所对应的值**M x1 y1 Cx2 y2 x3 y3 x4 y4**这就是三次贝塞尔曲线绘制的方式，只需要四个点就能生成贝塞尔曲线，具体可以参考网上的一些文章。在这里主要涉及到一个算法，这个算法也非常简单，在上面的数组渲染的过程中会产生10个index，根据index来生成10条具有对称的三次贝塞尔曲线，算法如下：
```
  //设置三次贝塞尔曲线,需要获取到四个点的坐标，因而在这里需要去计算
const setPath = (index: number = 0,center:number,layer: number = 1, arr:CaseDataResItem[],size:number = clientWidth, width:number = 110):string => {
    const len:number = arr.length;
    let distance:number = (size - (len * width)) / (len * 2);
    const baseDistance:number = 2 * distance + width;
    const firstDistance:number = distance + width / 2;
    let result:number = firstDistance;
    if(index !== 1) {
        result = firstDistance + Math.abs(index - 1)*baseDistance;
    } 
    //以中心节点进行划分，左右两边的区域需要对称
    let x1:number =result +  Math.abs(center - result) / 2;
    if(result >= center) {
        x1 = center + Math.abs(center - result) / 2;
    }
    const layIn = `${layer}-${index}`
    if(!json[layIn] || json[layIn] == null) {
        json[layIn] = result;
    }
    return `M${center} 0  C${x1} 0 ${result} 30 ${result} 100`
}
```
* 上面这种根据数组的index来生成三次贝塞尔曲线的方式，是不需要去获取到dom的节点的，这个需要去配合使用到flex布局中的space-around，这个属性的好处在于其每两个项目两侧的间隔相等，所以项目之间的间隔比项目与边框的间隔大一倍。因而才会有上面的setPath方法。那么还有个问题就是怎样才能多层渲染呢，其实也非常的简单，就是采用递归的方式，然后分层，再渲染的过程中，在上一次渲染的过程中，将下一次的中心点坐标给存储进来，这样就可以按照层级结构给渲染出来
### 间距分割方式
* 该方法的主要作用就是获取到这个数的最大位数，具体的实现过程如下：
```
//获取数据之间间隔的方法
const getInterval  = (params: number) => {
    if(params < 10) {
        return 10;
    }
    const len = params.toString().length;
    let temp:string = `1`;
    for(let i = 1; i < len; i++) {
        temp += `0`
    }
    return Number(temp)
}
```
### Object对象的方法的使用
* Object.keys(object || {}).length > 0所表示的含义是当前的object对象的属性不是空

### 递归实现dom节点的渲染
* 在这里需要使用到的就是const fragment: React.ReactNode = []这个去创建相应的dom节点，然后将相应的结构push进行，在加载的时候将这个方法放在组件return的内容当中，如下所示：
```
const getRenderLast = (tree: TreeRenderType,caculateLayer: number = 1) => {
    const fragment: React.ReactNode[] = []
    const { currentData, struct, type, key, display, treeStruct, lastPosition} = tree; 
    if(Object.keys(tree || {}).length  > 0){
        const arrStatus = nodeStructLayer[caculateLayer]
        nodeStructLayer[caculateLayer] = {
            currentNode: tree, 
            arrButtonstatus: arrStatus && Object.keys(arrStatus.arrButtonstatus || {}).length  > 0 ? arrStatus.arrButtonstatus : getButtonArrStatus(currentData)
        }
    }
    caculateLayer++
    if(struct === 0) {
        fragment.push(
            <Fragment key={key}>
                {getManyNode(currentData, lastPosition, caculateLayer)}
                {Object.keys(treeStruct || {}).length  > 0 ? getRenderLast(treeStruct, caculateLayer) : ''}
            </Fragment>
        )
    }
    if(struct === 3 || struct === 2) {
        fragment.push(
            <Fragment key={key}>
                {getManyNode(currentData, lastPosition, caculateLayer, type, display)}
                {Object.keys(treeStruct || {}).length  > 0 ? getRenderLast(treeStruct, caculateLayer) : ''}
            </Fragment>
        )
    }

    if(struct === 1) {
        fragment.push(
            <Fragment  key = {key}>
                    {groupListNode(currentData, lastPosition , caculateLayer, display)}
                    {Object.keys(treeStruct || {}).length  > 0 ? getRenderLast(treeStruct, caculateLayer) : ''}
            </Fragment>
        )
    }
    
    return fragment
}
```
### 当在组件中涉及到需要使用一个全局变量来做缓存结构时的做法
* 在这时需要注意的就是该变量存储的内容是否对全局的其他的地方也有相同的引用，因而在此时可以采用一下的两种方式来做
    * 采用闭包的方式来处理，在闭包中去设置这个全局的变量，然后将之前的组件给抛出，这样生成的就不是一个全局变量，但是需要注意的就是，一定要手动的去清除缓存中的内容，不然就会出现数据量过大而造成数据加载缓慢的效果
    * 直接是在当前组件渲染完成之后，去清空缓存中的内容
### antd中Tooltip组件
* 该组件的作用用于与hover效果一样，当鼠标点击放在被该组件包裹的范围时，就会去显示Tooltip中的title中的名字
### antd中的Drawer组件
* 其主要的含义为抽屉，当点击按钮时，就会自动弹出抽屉，比较好的好处就是他采用的是绝对布局的方式，为了性能上的考虑，在实现这个功能时，不为了窗口变化而带来的自适应布局影响所划出的贝塞尔曲线，因而在此时就采用绝对布局的方式

## 一种处理时间的方式
* 对于时间的处理，可以将处理好的小时，分钟以及秒存在一个数组之中，最后在展示时通过调用该方法，并且使用数组的join方法，插入相应的表示符，即可。如“-”或者是“：”这两种符号
* 对于时间的处理，需要看具体的数据是什么，如果是时间戳就需要采用相应的时间戳的处理方式。具体需要按照情况来定

## ts中如何去写一个自定义video或者是自定义audio
### 自定义h5播放器样式
* 通过ref获得的对象是一个HTMLVideoElement对象
```
const hRef = useRef<HTMLVideoElement>();
```
* 有关于video标签原生样式的说明，autoplay：视频加载就绪后，就会马上播放;controls: 向用户展示原生控件样式。loop: 是否循环播放当前视频内容; muted：规定视频的音频输出应该被静音
* Element.getBoundingClientRect() 方法，返回元素的大小及其相对于视口的位置，需要看具体的盒子模型是标准的还是严格模式下的，所得到的具体尺寸是受到当前的盒子模型所影响
* 在video中获取到类似与player这样的操作方式，需要通过使用useRef来获取到dom节点从而进行操作
* 播放器需要去监听的三个事件，视频加载就绪(loadedmetadata)，时间更新(timeupdate), 视频结束播放(ended)，在这视频加载就绪时，需要去加载出视频的时间，在更新时间事件时，需要去记录当前更新时间是在什么时候。视频结束播放时需要去改变当前的按钮状态以及将播放时间进度设置为0
```
useEffect(() => {
    const player = hRef.current;

    const handleMetaDataLoad = (e) => {
      const target = e.target as HTMLVideoElement;
      setDuration(target.duration)
    }

    const handleTimeupdate = (e) => {
      const target = e.target as HTMLVideoElement;
      setCurrenttime(target.currentTime);
    }

    const handlePlayEnd = (e) => {
      setPlaying(false);
      setCurrenttime(0);
    }

    player.addEventListener('loadedmetadata', handleMetaDataLoad, false);

    player.addEventListener('timeupdate', handleTimeupdate, false);

    player.addEventListener('ended', handlePlayEnd, false);

    return () => {
      player.removeEventListener('loadedmetadata', handleMetaDataLoad, false);
      player.removeEventListener('timeupdate', handleTimeupdate, false);
      player.removeEventListener('ended', handlePlayEnd, false);
    }

},[])
```
* 点击更改播放按钮的状态，只需要增加点击事件即可,这里有个小技巧，就是在设置值时采用!playing,就会取得其传入的相反值
```
const handleVideoPlay = () => {
    const player = hRef.current
    if( playing ) {
      player.pause();
    } else {
      player.play();
    }
    setPlaying(!playing);
  }
```
* 设置进度条的方式，采用鼠标点击事件，来进行处理。通过里面的percent来获取到当前实时的百分比。在ts中，鼠标点击事件的处理方式如下所示
```
const  handleDurationClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLVideoElement;
    const { left } = target.parentElement.getBoundingClientRect();
    const percent = (e.clientX - left) / target.parentElement.clientWidth;
    const currentTime = percent * duration;
    
    setCurrenttime(currentTime);
    hRef.current.currentTime = currentTime;
  }

```
* useImperativeHandle这个hook，用于在使用ref时自定义暴露给父组件的实际值
```
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```
### 自定义音频播放器方式
* 如何去获取到音频的player，采用下面的这种方式即可
```
    const hRef = useRef<HTMLVideoElement>();
```

### 关于实际项目中的一些使用技巧上的操作方式
* 在通常情况下，如果在需要采用表达式的方式来书写一个if语句，可以采用下面的这种方式来处理
```
    if(!getStatus(val)) { getResult(val, renderItem, 1) }
    //等同于
    !getStatus(val) && getResult(val, renderItem, 1)
```

* 项目中关于数据渲染的处理方式，在通常的情况下，数据在最终渲染时一定是数据好的最后结果，这样的好处在与相比较与在渲染的过程中来处理数据而言，其页面
加载的速度更快，所呈现出来的效果更好

* 强迫浏览器创建图层，在Blink和WebKit的浏览器中，⼀当⼀个节点被设定了透明度的相关过渡效果或动画时，浏览器会将其作为⼀个单独的图层，但很多开发者使⽤
translateZ(0)或者translate3d(0,0,0)去使浏览器创建图层。这种⽅式可以消除在动画开始之前的图层创建时间，使得动画尽快开始（创建图层和绘制图层还是⽐较慢
的），⽽且不会随着抗锯⻮⽽导出突变。不过这种⽅法需要节制，否则会因为创建过多的图层导致崩溃

### antd中warning解决
* 在upload.tsx文件中有两个关于warning问题，下面从源码中来处理，源码链接如上[https://github.com/ant-design/ant-design/blob/master/components/upload/Upload.tsx](https://github.com/ant-design/ant-design/blob/master/components/upload/Upload.tsx)
```
 React.useEffect(() => {
    devWarning(
      'fileList' in props || !('value' in props),
      'Upload',
      '`value` is not a valid prop, do you mean `fileList`?',
    );

    devWarning(
      !('transformFile' in props),
      'Upload',
      '`transformFile` is deprecated. Please use `beforeUpload` directly.',
    );
  }, []);
```
* 在上面的源码warning部分有一个devWaring方法，该方法有三个参数
    * 第一个参数是返回的是一个boolean值
    * 第二个参数是组件名称
    * 第三个是提示文案
* 关于以上两个warning的解决方式，第一个是需要传入valuePropName属性与name属性值即可解决，第二个解决方式则是需要传入transformFile属性即可解决