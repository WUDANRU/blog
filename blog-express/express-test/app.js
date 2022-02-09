var createError = require('http-errors');
var express = require('express');
var path = require('path'); //用于日志
var fs = require('fs') //用于日志
var cookieParser = require('cookie-parser'); //cookie(在routes中使用req.cookie)
var logger = require('morgan'); //相当于blog-1的app.js的日志acess()
const session = require('express-session') //npm i express-session --save
const RedisStore = require('connect-redis')(session) // npm i redis connect-redis --save

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express(); //实例

// view engine setup(视图引擎设置， views文件夹和里面的文件， 前端用的)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// app.use(logger('combined', { //combined,组合格式，线上用这种格式(有dev/combined/short等格式)
//     stream: process.stdout //标准输出，默认配置，可以省略，开发环境打印输出就可以，线上环境将日志写入文件

// })); //从这到后的8行都是中间件(app.use后有函数就是中间件，有这个(req,res,next)函数的也是中间件)


// 日志增加了path,fs,package.json/scripts/prd (//https:github.com/expressjs/morgan)
const ENV = process.env.Node_ENV
if (ENV !== 'production') {
    // 开发环境/测试环境  //npm run dev
    app.use(logger('dev'))
} else {
    // 线上环境  //npm run prd
    const logFileName = path.join(__dirname, 'logs', 'access.log')
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    })
    app.use(logger('combined', {
        stream: writeStream
    }))
}


app.use(express.json()); //getPostData
app.use(express.urlencoded({ extended: false })); //getPostData的application/json等兼容格式
app.use(cookieParser()); //app.use()注册
app.use(express.static(path.join(__dirname, 'public'))); //public是静态文件夹

// 写了session，然后http: //localhost:8082/login.html，然后再redis
const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
    client: redisClient
})

app.use(session({ //app.use执行函数，返回中间件
        // resave: false, //添加 resave 选项
        // saveUninitialized: true, //添加 saveUninitialized 选项
        // secret: 'aF,.j)wBhq+E9n#aHHZ91Ba!VaoMfC', // 建议使用 128 个字符的随机字符串
        secret: 'WJiol#23123_', //session处理放在路由处理前面
        cookie: { //session是服务端的，cookie是客户端的
            // path: '/', //默认配置，可以注释掉   (根目录/，代表前端每个路由都能访问)
            // httpOnly: true, //默认配置 //true:前端js没办法操作
            maxAge: 24 * 60 * 60 * 1000 //cookie的过期时间
        },
        store: sessionStore //session会存在redis中去
    })) //控制台application原来是空的，安装了express-session,application的name就显示connect.sid等(http://localhost:8000/api/blog/list)

// 路由处理
app.use('/', indexRouter); //localhost:3000/
app.use('/users', usersRouter); //localhost:3000/users可以显示routes/users.js里的内容
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler (路由有问题会显示not found)
app.use(function(req, res, next) {
    next(createError(404)); //这里输入localhost:3000/api等不存在的路由会显示not found

});

// error handler
app.use(function(err, req, res, next) { //程序语法有问题: 状态码500和显示报错信息，dev是开发环境
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'dev' ? err : {}; //development改为dev,package.json的NODE_ENV=dev的dev

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;