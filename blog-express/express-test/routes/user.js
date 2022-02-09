var express = require('express');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');
var router = express.Router(); //实例

router.post('/login', function(req, res, next) { //function(req, res, next) 这个函数是中间件
    const { username, password } = req.body //express框架可以直接使用req.query，省去了解析query(req.query=queryString.parse)
        // res.json({ //res.json相当于blog-1的app.js的设置返回格式：res.setHeader('Content-type', 'application/json') 加res.end(JSON.stringify(blogData))
        //     errno: 0,
        //     data: {
        //         username,
        //         password
        //     }
        // })


    const result = login(username, password)
    return result.then(data => {
        console.log(data, 'datadata')
        if (data.username) {
            // 设置session,这个会将session同步到redis中
            req.session.username = data.username
            req.session.realname = data.realname

            // 同步到redis，这个删除，express-session已将session同步到redis
            // set(req.sessionId, req.session)

            res.json(new SuccessModel()) // 从return new SuccessModel()的return改的
            return
        }
        res.json(new ErrorModel('登陆失败')) // 从return new ErrorModel(' 登录失败 ') 的return改的
    })

});


// router.get('/login-test', (req, res, next) => { //html-test输入http-server -p 8001(http-server启动)和nginx启动，express-test/bin/www的3000改为8000端口，npm run dev和浏览网址http://localhost:8000/api/blog/list,测试http://localhost:8082/api/user/login-test，再测试localhost:8082/login.html,再测试http://localhost:8082/api/user/login-test
//     if (req.session.username) {
//         res.json({
//             errno: 0,
//             msg: '已登录 '
//         })
//         return
//     }
//     res.json({
//         errno: -1,
//         msg: '未登录 '
//     })
// })



// postman的post请求，网址：localhost:3000/api/user/login，body输入：
// {
//     "username": "zhangsan",
//     "password": "123"
// }
// 或者选中x-www-form-ulencoded格式输入key为username和password,value为zhangsan和123也会显示一样的内容：
// {
//     "errno": 0,
//     "data": {
//         "username": "zhangsan",
//         "password": "123"
//     }
// }


// router.get('/session-test', (req, res, next) => {
//     const session = req.session
//     if (session.viewNum == null) {
//         session.viewNum = 0
//     }
//     session.viewNum++
//         res.json({
//             viewNum: session.viewNum //刷新3次显示viewNum:3，刷新几次显示几
//         })
// })


module.exports = router;