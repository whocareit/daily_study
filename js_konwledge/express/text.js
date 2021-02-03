const { nextTick } = require('process');
const express = require('./like-express');

const app = express();

app.use((req, res, next) => {
    console.log('request start........', req.method, req.url);
    next();
})

app.use((req, res, next) => {
    //Protend to deal with cookie
    req.cookie = {
        userId: 'hdjjfk'
    }
    next();
})

app.use((req, res, next) => {
    //Protend to deal with post data
    //Asynchronous processing
    setTimeout(() => {
        req.body = {
            a: 123456,
            b: 'shsh'
        }
        next();
    })
})

app.use('/api',(req ,res ,next) => {
    console.log('处理  api 路由。。。。');
    next();
})

app.get('/api',(req ,res ,next) => {
    console.log('处理 get api 路由....');
    next();
})

app.post('/api',(req ,res ,next) => {
    console.log('处理 post api 路由....');
    next();
})


//login checking
const loginCheck = (req, res, next) => {
    setTimeout(() => {
        console.log('login check fail');
        res.json({
            erron: -1,
            msg: 'login fail'
        })

    })
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('deal /api/get-cookie');
    res.json({
        erron: 0,
        data: req.cookie
    });
})

app.post('/api/get-post-data',(req ,res ,next) => {
    console.log('deal /api/get-post-data');
    res.json({
        erron: 0,
        data: req.body
    })
})

app.use((req ,res ,next) => {
    console.log('deal 404 not found');
    res.json({
        erron: -1,
        msg: '404 not found'
    })
})

//listen 3000 port
app.listen(8001,() => {
    console.log('server is running on 8001 port');
})