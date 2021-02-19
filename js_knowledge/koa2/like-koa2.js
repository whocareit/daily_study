const http =  require('http');

//componse middleware
const componse = (middlewareList) => {
    //middleware operation mechanism
    return (ctx) => {
        const dispatch = (i) => {
            const fn = middlewareList[i];
            try {
                return Promise.resolve(
                    fn(ctx, dispatch.bind(null, i + 1))
                )
            } catch(err) {
                return Promise.reject(err);
            }
        }
        return dispatch(0);
    }

}

class LikeKoa2 {
    constructor() {
        this.middlewareList = [];
    }

    use(fn) {
        this.middlewareList.push(fn);
        return this;  
    }

    createcontent(req, res) {
        //return ctx
        const ctx = {
            req,
            res,
        }
        ctx.query = req.query;
        return ctx;
    }

    handleRequest(fn, ctx) {
        return fn(ctx);
    }

    callback() {
        const fn = componse(this.middlewareList);
        
        return (req, res) => {
            const ctx = this.createcontent(req, res);
            return this.handleRequest(fn, ctx);
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback());
        server.listen(...args);
    }
}

module.exports = LikeKoa2;