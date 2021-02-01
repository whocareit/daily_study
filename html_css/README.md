## css3中的过渡与css3中的动画之间的区别
* 定义上：
    * css3过渡是元素从一种样式逐渐改变为另一种的效果
    * 动画是使元素从一种样式逐步变化为另一种样式的效果，可以改变任意多的样式任意多的次数
* 用法上：
    * css3动画，采用百分比的方式或者是使用from和to来体现动画的变化。name duration timing-function delay iteration-count direction play-state fill-mode如下所示：
    ```
        div {
            animation: myfirst 5s;
            -moz-animation: myfirst 5s;	/* Firefox */
            -webkit-animation: myfirst 5s;	/* Safari 和 Chrome */
            -o-animation: myfirst 5s;	/* Opera */
        }

        @keyframes myfirst
            {
            0%   {background: red;}
            25%  {background: yellow;}
            50%  {background: blue;}
            100% {background: green;}
            }

            @-moz-keyframes myfirst /* Firefox */
            {
            0%   {background: red;}
            25%  {background: yellow;}
            50%  {background: blue;}
            100% {background: green;}
            }

            @-webkit-keyframes myfirst /* Safari 和 Chrome */
            {
            0%   {background: red;}
            25%  {background: yellow;}
            50%  {background: blue;}
            100% {background: green;}
            }

            @-o-keyframes myfirst /* Opera */
            {
            0%   {background: red;}
            25%  {background: yellow;}
            50%  {background: blue;}
            100% {background: green;}
        }
    ```
    * css3过渡，需指名需要把效果添加到哪个css属性上，需要规定效果的时长。依次的动画效果顺序是：property duration timing-function delay  如下面的案例所示：
    ```
    div {
        width:100px;
        height:100px;
        background:yellow;
        transition-property:width;
        transition-duration:1s;
        transition-timing-function:linear;
        transition-delay:2s;
        /* Firefox 4 */
        -moz-transition-property:width;
        -moz-transition-duration:1s;
        -moz-transition-timing-function:linear;
        -moz-transition-delay:2s;
        /* Safari and Chrome */
        -webkit-transition-property:width;
        -webkit-transition-duration:1s;
        -webkit-transition-timing-function:linear;
        -webkit-transition-delay:2s;
        /* Opera */
        -o-transition-property:width;
        -o-transition-duration:1s;
        -o-transition-timing-function:linear;
        -o-transition-delay:2s;
    }
    div:hover {
        width:200px;
    }
    ```