# 深入理解typescript
## 编译上下文
* 作用，用来给文件分组，告诉ts哪些文件是有效的，哪些是无效的。除了有效文件所携带信息外，编译上下文还包含有正在被使用的编译选择的信息。
### tsconfig.json
* tsconfig.json，用于去定义正在被使用的编译选择的信息。使用方式，创建tsconfig.json文件
* 编译选择，可以通过compilerOptions来制定编译选择，如下所示
```
{
  "compilerOptions": {

    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件作为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```
* TypeScript编译,好的IDE支持对ts的即时编译，如果想在使用tsconfig.js时从命令手动运行TypeScript编译器，可以通过下面的方式来处理
    * 运行tsc，会在当前目录或者是父级目录寻找tsconfig.js文件
    * 运行tsc -p ./path-to-project-direction，这个路径可以是相对路径也可以是绝对路径
* 甚至可以使用tsc -w来启用ts编译器的观测模式，在检测到文件改动之后，将会重新编译
### 指定文件
* 可以显示的指定需要编译的文件：
```
{
  "files": [
    "./some/file.ts"
  ]
}
```
* 采用include或者是exclude选择来指定需要包含的文件和排除的文件，如下所示：
```
{
    "include": [
        "./folder"
    ],
    "exclude:: [
        ""./folder/**/*.spec.ts",
        "./folder/someSubFolder""
    ]
}
```
* 一个示例用法： some/folder/**/* 意味着匹配所有的文件夹和所有文件(扩展名为.ts/.tsx,当开启了allowJs: true选择时，扩展名可以是.js/.jsx)

## 声明空间
* 在ts中存在两种声明空间：类型声明空间和变量声明空间
    * 类型声明空间，用来当作类型注解的内容，如在所示：
    ```
    class Foo {};
    interface Bar {};
    type Bas = {};
    ```
    * 变量声明空间，变量声明空间包含可用作变量的内容。如上面所示的class Foo提供了一个类型的Foo到类型声明空间，此外它同样提供了一个变量Foo到变量声明空间当中，如下所示：
    ```
    class Foo {}
    const someVar = Foo;
    const someOthervar = 123;
    ```
## 模块
* 全局模块，在默认情况下，当开始在一个新的TypeScript文件中写下代码时，其处于全局命名空间中。这种方式容易造成文件内的代码命名冲突。推荐使用文件模块
* 文件模块，又被称之为外部模块。如果在ts文件的根级别位置含有import或者export，那么它会在这个文件中创建一个本地的作用域，如下所示：
```
//文件定义在foo.js文件中
export const foo = 123;

//文件定义在一个文件中
import { foo } from './foo';
const bar = foo;
```
### 文件模块详情
* 文件模块拥有强大的功能和较强的可用性
#### commonjs、 amd 、 es modules 、 others
* 首先需要明白关于这些模块系统的不一致性。需要根据不同的module选项来把TypeScript编译成不同的js模块类型。
* 如何书写TypeScript模块
    * 放弃使用import/require语法即import foo = require('foo')写法
    * 推荐使用ES模块语法
* ES5模块语法
    * 使用export关键字导出一个变量或类型
    ```
        export const someVar = 123;
        export type someType = {
            foo: stringl
        }
    ```
    * export的写法除了上述的写法，还有下面这种
    ```
        const someVar = 123;
        type someType = {
            type: string;
        }
        export { someVar someType }
    ```
    * 采用重命名变量的方式导出
    ```
        const someVar = 123;
        export { someVar as aDifferentName };
    ```
    * 使用import关键字导入一个变量或者是一个类型
    ```
        import { someVar, someType } from './foo';
    ```
    * 通过重命令的方式导入变量或者类型：
    ```
        import { someVar as aDifferentName } from './foo';
    ```
    * 除了指定加载某个输出值，还可以使用整体加载，即用星号(*)指定一个对象，所有输出都加载在这个对象上面
    ```
        import * as foo from './foo';
        //此时可以使用'foo.someVar'和‘foo.someType’以及其他任何从‘foo'到处的变量或者类型
    ```
    * 只导入模块
    ```
        import 'core-js';
    ```
    * 从其他模块导入后，整体导出
    ```
        export * from './foo';
    ```
    * 从其他模块导入后，部分导出：
    ```
        export { someVar } from './foo';
    ```
    * 通过重命名，部分导出从另一个模块导入的项目：
    ```
        export { someVar as aDifferentName } from './foo';
    ```
* 默认导入/导出
    * 使用export default
        * 在一个变量之前
        * 在一个函数之前
        * 在一个类之前
    * 导入使用import someName from 'someModule'的语法

* 模块路径，存在两种截然不同的模块：
    * 相对模块路径，通过路径的方式来查找
    * 其他动态查找模块：(如： core-js, typestyle, react或者是react/core)
* 相对模块路径
    * 如果文件 bar.ts 中含有 import * as foo from './foo'，那么 foo 文件必须与 bar.ts 文件存在于相同的文件夹下
    * 如果文件 bar.ts 中含有 import * as foo from '../foo'，那么 foo 文件所存在的地方必须是 bar.ts 的上一级目录；
    * 如果文件 bar.ts 中含有 import * as foo from '../someFolder/foo'，那么 foo 文件所在的文件夹 someFolder 必须与 bar.ts 文件所在文件夹在相同的目录下。
* 动态查找，当导入路径不是相对路径时，模块解析将会模仿Node模块解析器，如：
    * 当使用import * as foo from 'foo',将会按照如下的顺序查找模块：
        * ./node_modules/foo
        * ../node_modules/foo
        * ../../node_modules/foo
        * 直到根目录
    * 当使用import * as foo from 'something/foo',将会按照下面的这种方式去查询
        * ./node_modules/something/foo
        * ../node_modules/something/foo
        * ../../node_modules/something/foo
        * 直到根目录
* 重写类型的动态查找
    * 在项目中，可以通过declare module 'somePath' 声明一个全局模块的方式，来解决查找模块路径的问题，如下所示：
    ```
        declare module  'foo' {
            export var bar: number;
        }
    ```
    * 接着引入该模块的内容
    ```
        import * as foo from 'foo';
    ```
* import/require仅仅是导入类型，如下所示
```
import foo = require('foo');
```
* 实际上，上面的语法表达两层含义：
    * 导入foo模块的所有类型信息
    * 确定foo模块运行时的依赖关系
* 使用例子：懒加载
    * 类型推断需要提前完成，这就意味着，如果想要在bar文件里，使用从其他文件foo导出的类型，将采用下面的方式来处理：
    ```
        import foo = require('foo');
        let bar: foo.someType;
    ```
    * 在某些场景下，只想在需要加载模块foo，此时需要尽在类型注解中使用导入的模块名称，而不是在变量中使用。在编译js时，这些将被移除，接着需要手动导入需要的模块,如下所示：
    ```
        import foo = require('foo');

        export function loadFoo() {
            //懒加载foo，原始的加载仅仅用来做类型注解
            const _foo: tyoeof foo = require('foo');
        }
    ```
    ```
        import foo = require('foo');
        export function loadFoo() {
            require(['foo'], (_foo: typeof foo) => {
                //使用'_foo'替代'foo'来作为变量使用
            })
        }
    ```
    * 上述的这些场景通常在以下的情况使用：
        * 在web app中，当在特定路由上加载js时
        * 在node应用中，只想加载特定模块，用来加快启动速度
    * 使用例子：打破循环依赖
        * 类似于懒加载的使用用例，某些模块加载器(commonjs/node和amd/requires)不能很好的处理循环依赖。在这种情况下，一方面使用延迟加载代码，另一方面预先加载模块
    * 使用例子：确保输入
        * 当加载一个模块，只想引入其附加作用时，如果仅仅是import/require(导入)一些并没有与你的模块或者模块家在器有任何依赖的js代码，在经过ts编译后，这些将会被完全忽视。在这种情况下，可以使用一个ensureImport变量，来确保编译的js依赖与模块。如下所示：
        ```
            import foo = require('./foo');
            import bar = require('./bar');
            import bas = require('./bas');

            const ensureImport: any = foo || bar || bas
        ```
* global.d.ts
    * 该文件，用来将一些接口或者类型放在全局命名空间里，这些定义的接口和类型能在你的所有ts代码里使用
## 命名空间
* 在使用js时常用的命名空间的方式，是采用立即执行函数方式，如下所示：
    ```
    (function(something) {
        smoething.foo = 123;
    })(something || (something = {} ))
    ```
    * 在上面的实例中something || (something = {}) 允许匿名函数function (something) {} 向现有对象添加内容，或者创建一个新对象，然后向该对象添加内容。
    ```
    let something;

    (function(something) {
        something.foo = 123;
    })(something || (something = {}));
    
    console.log(something);
    // { foo: 123 }
    
    (function(something) {
        something.bar = 456;
    })(something || (something = {}));
    
    console.log(something); // { foo: 123, bar: 456 }
    ```
    * 在确保创建的变量不会泄露至全局命名空间时，这种方式在js中很常见，当基于文件模块使用时，无须担心这点，该模式仍然适用于一组函数的逻辑分组。因此在ts中提供了namespace关键字来描述这种分组，如下所示：
    ```
        namespace Utility {
            export function log(msg) {
                console.log(msg);
            }

            export function error(msg) {
                console.log(msg);
            }
        }

        //usage
        Utility.log('Call me');
        Utility.log('maybe');
    ```
    * ts经过编译后js代码如下所示：
    ```
        (function(Utility){
            //....
        })(Utility || (Utility = {}))
    ```