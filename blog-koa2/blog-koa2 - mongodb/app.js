const Koa = require('koa')
const app = new Koa()
const views = require('koa-views') //views文件夹
const json = require('koa-json') //postdata的json格式
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser') //postdata发送的数据放在body里
const logger = require('koa-logger') //日志
const session = require('koa-generic-session')
const redisStore = require('koa-redis')

// -------------
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')


const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')

const { REDIS_CONF } = require('./conf/db')

// error handler,错误监测
onerror(app)


// middlewares,中间件
// --------------------------相当于res.on(data和res.on(end
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text'] //post上传的数据(postdata)可以接收很多格式
}))
app.use(json()) //post里面的数据的字符串格式转为json格式
    // --------------------------

app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// logger
app.use(async(ctx, next) => {
    const start = new Date()

    // next()也是一个函数
    await next() //await next()是await promise，吧异步变成同步(next()也是async函数的对象，返回promise)
    const ms = new Date() - start //服务请求耗时，这个是await next()的时间
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`) //会显示很多个：POST /api/user/login-0ms和POST /api/user/login-5ms等
})


// 安装了koa-morgan才写的这个代码：--------------------------
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
    //开发环境/测试环境
    app.use(morgan('dev'))
} else {
    //线上环境
    const logFileName = path.join(__dirname, 'logs', 'access.log')
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    })
    app.use(morgan('combined', {
        stream: writeStream
    }))
}


// session配置
app.keys = ['WJiol#23123_']
app.use(session({ //session()执行，(引用的session,require('session'))
    // 配置cookie
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    },
    // 配置redis
    store: redisStore({
        all: `${REDIS_CONF.host}:${REDIS_CONF.port}` //  all: '127.0.0.1:6379'
    })
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods()) // 注册,(需要注册和引用,引用：const blog = require('./routes/blog'))
app.use(user.routes(), user.allowedMethods())

// error-handling，错误处理
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app

// 中间件机制：
//有很多app.use
//代码中的next参数是什么

//app.use注册中间件，app.use后面都是async函数(异步函数),router.get('/list',async function(ctx,next){})这个也是async函数(异步函数)