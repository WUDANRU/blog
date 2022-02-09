const router = require('koa-router')()

const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user') // http: //localhost:8000'/api/user

// router.post('/login', async function(ctx, next) {
//     const { username, password } = ctx.request.body //ctx.body已经被占用了，用ctx.request.body

//     //http协议：req,res是属于http协议的
//     ctx.body = {
//         errno: 0,
//         username,
//         password
//     }
// })

// router.get('/session-test', async function(ctx, next) {
//     if (ctx.session.viewCount == null) {
//         ctx.session.viewCount = 0 //初始化
//     }
//     ctx.session.viewCount++ //访问的次数
//         ctx.body = {
//             errno: 0,
//             viewCount: ctx.session.viewCount
//         }
// })


router.post('/login', async function(ctx, next) {
    const { username, password } = ctx.request.body
    const data = await login(username, password) //引用的ogin是返回promise,所以前面要加await
    if (data.username) {
        // 设置 session
        ctx.session.username = data.username
        ctx.session.realname = data.realname

        ctx.body = new SuccessModel()
        return
    }
    ctx.body = new ErrorModel('登录失败')
})

//cmd输出npm run dev，浏览器输入localhost:8082只显示博客首页是因为没有登录(localhost:8082/login.html,hei/lala,789)，登录了就能显示一些列表

module.exports = router