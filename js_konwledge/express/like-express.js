const http = require('http');
const slice = Array.prototype.slice;

class LikeExpress {
    constructor() {
        //存放中间件列表
        this.routes = {
            all: [],
            get: [],
            post: []
        }
    }

    register(path) {
        //用于存放数据
        const info = {};
        //根据第一个参数是否为string，即路由，如果不是则将第一个参数设置为默认值‘/’；
        if (typeof path === 'string') {
            info.path = path;
            info.stack = slice.call(arguments, 1);;
        } else {
            info.path = '/';
            info.stack = slice.call(arguments, 0);
        }

        return info;
    }

    use() {
        //use函数需要所有的参数
        const info = this.register.apply(this, arguments);
        this.routes.all.push(info);
    }

    get() {
        const info = this.register.apply(this, arguments);
        this.routes.get.push(info);
    }

    post() {
        const info = this.register.apply(this, arguments);
        this.routes.post.push(info);
    }

    match(method, url) {
        let stack = [];
        if (url === './favicon.ico') {
            return stack;
        }

        //获取routes方式
        let curRoutes = [];
        curRoutes = curRoutes.concat(this.routes.all);
        curRoutes = curRoutes.concat(this.routes[method]);

        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) {
                //命中下面的三个路由
                //url === '/api/get-cookie' && routeInfo.path === '/'
                //url === '/api/get-cookie' && routeInfo.path === '/api'
                //url === '/api/get-cookie' && routeInfo.path === '/api'
                stack = stack.concat(routeInfo.stack);
            }
        })
        return stack;
    }

    handle(req, res, stack) {
        const next = () => {
            //拿到第一个匹配的中间件
            const middleware = stack.shift();
            if(middleware) {
                middleware(req, res, next);
            }
        }
        next()
    }

    callback() {
        return (req, res) => {
            //res.json封装
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json');
                res.end(
                    JSON.stringify(data)
                )
            }
            //method url deal
            const url = req.url;
            const method = req.method.toLowerCase();
            const resultList = this.match(method, url);
            this.handle(req, res, resultList);
        }
    }

    listen(...args) {
        //监听端口
        const serve = http.createServer(this.callback());
        serve.listen(...args);
    }
}

module.exports = () => new LikeExpress();