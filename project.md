<!--
 * @Author: your name
 * @Date: 2020-11-26 15:36:17
 * @LastEditTime: 2020-12-08 10:22:23
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


