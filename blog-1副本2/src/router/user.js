// const { loginCheck } = require('../controller/user')
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 获取cookie的过期时间 //Application的cookie的expires如果是1960表示cookie永远不会过期，需要设置过期时间,expires过期时间是1天，从今天的时间算起
// let getCookieExpires = () => { //我的电脑Application的cookie的expires是session,教程是1960，可能因为这个导致显示d.toGMTStrng is not functiion
//     let d = new Date()
//     d.setTime(d.getTime() + (24 * 60 * 60 * 1000)) //设置时间，当前时间加上1天时间
//         // console.log('d.toGMTStrng() is', d.toGMTStrng()) //这个打印不出
//         // return d.toGMTStrng() //GMTStrng是cooie规定的一种格式
//     console.log(d) //这个能打印出
//     return d
// }

// 同域名cookie是可以共享的，跨域cookie是不能共享的
// js可以修改cookie,js修改完Request Headers的cookie显示的是追加
// Response Headers的set-Cookie是后端设置的
// 使用cookie实现登录验证，cookie会暴露username，如何解决:cookie中存储userid,serve端对应username，解决方案:session,即server端存储用户信息

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST
        // const url = req.url
        // const path = url.split('?')[0]

    //    登录
    // if (method === 'POST' && path === '/api/user/login') {
    //     if (method === 'POST' && req.path === '/api/user/login') {

    //         const { username, password } = req.body
    //         const result = loginCheck(username, password)

    //  // 2
    //         if (result) {
    //             return new SuccessModel()
    //         }
    //         return new ErrorModel('登录失败')

    // // 1
    //         // return {
    //         //     msg: '这是登录的接口'
    //         // }
    //     }

    // // 3  登录 
    // if (method === 'POST' && req.path === '/api/user/login') {
    //     const { username, password } = req.body
    //     const result = login(username, password)
    //     return result.then(data => {
    //         console.log('userData', data)
    //         if (data.username) {
    //             return new SuccessModel()
    //         }
    //         return new ErrorModel('登录失败')
    //     })
    // }

    // http: //localhost:8000/api/user/login
    // {
    // "username": "hei",
    //     "password": "789"
    // }


    // 4  登录  吧post改成get
    if (method === 'GET' && req.path === '/api/user/login') { //http://localhost:8000/api/user/login?username=lala&password=789
        // const { username, password } = req.body
        const { username, password } = req.query
        const result = login(username, password)
        console.log('resultresult', result)
        return result.then(data => {
                console.log('userDatauserData', data)
                if (data.username) { //expires=${getCookieExpires()}过期时间等于执行这个函数

                    // 操作cookie(后端设置cookie: ), cookie需要在后端设置不能在前端设置，console.log写document.cookie或document.cookie='name=hello'属于前端写cookie
                    // res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`) //1 写了这个Application会多一个cookie,Request Headers里没有cookie, （写了document.cookie='name=hello',Request Headers才有cookie）
                    //2 Response Headers有set-Cookie(set-Cookie后端传过来的)，console写document.cookie可以显示后端的cookie: "username=lala"
                    console.log(data.username, 'data.username1')
                        // 设置session
                    req.session.username = data.username
                    req.session.realname = data.realname

                    console.log('req.session is', req.session)
                    return new SuccessModel()

                }
                return new ErrorModel('登录失败')
            }) //写了session开始，吧操作cookie剪切到app.js里
    }

    // 后端代码写的lala,cookie可以伪造成zhangsan,console输入document.cookie="sername=zhangsan"(console的document.cookie和network的preview，cookie显示成zhangsan)，cookie显示成zhangsan，所以加了httpOnly
    // httpOnly做限制，让前端不能吧lala改为zhangsan,httpOnly只允许后端来改，不允许前端来改（httpOnly是可以看见Response Headers的set-Cookie和Request Headers的cookie）
    // console输入document.cookie='name=hello',加了httpOnly,console写document.cookie还是显示name=hello，看登录验证的测试的username: req.cookie.username是否正确(http://localhost:8000/api/user/login-test)


    //  cookie：  上面登录的代码res.setHeader('Set-Cookie'，然后浏览器输入的登录的http://，network的Response Headers会有set-Cookie 
    //  cookie：  登录验证的测试的代码，和浏览器输入的登录验证的测试的http://，network的Request Headers里有Cookie
    //  session： app.js的res.setHeader('Set-Cookie', `userid=${userId}; network的Response Headers没有set-Cookie 
    //  cookie的username  session的userid  1、登录名/用户名为了安全需要在后端设置，不能在前端设置， 2、cookie会暴露username用session，如何解决：cookie中存储userid,server端对应username(userid对应username) 解决方案：session，即server端存储用户信息  3、redis是为了上线适应多线程和session节省内存


    // 登录验证的测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) {
            // if (req.cookie.username) {
            // return Promise.resolve(new SuccessModel())
            console.log('req.session.username', req.session.username)
            return Promise.resolve(new SuccessModel({
                // username: req.cookie.username //Request Headers里有Cookie: username=lala   //返回username (httpOnly的作用是页面只有显示后端设置的username,前端设置的(document.cookie='username=hello')username会陆续添加在Request Headers里,不会显示在页面上)
                session: req.session //返回session
            }))
        }
        // return new ErrorModel('尚未登录')  //http://localhost:8000/api/user/login-test
        return Promise.resolve(new ErrorModel('尚未登录')) //每个路由返回promise，没有promise返回不出结果
    }

}
module.exports = handleUserRouter