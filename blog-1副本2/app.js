const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')

// 获取cookie的过期时间 
let getCookieExpires = () => {
    let d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d
}

// session数据 
const SESSION_DATA = {} //重启的时候因为这句代码为空对象，session丢失,要用到redis

//  用于处理post data  （针对post请求）
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') { //如果不是post请求是get请求返回空，get请求没有postData
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
    return promise
}

const serverHandle = (req, res) => { //这个选中的函数是所有http请求都会经过的，所有入口都会经过这个函数的

    // 设置返回格式
    res.setHeader('Content-type', 'application/json')

    // 获取path blog和user文件的获取path一样，吧它们删除，写在了app.js文件里，blog和user可以用const path，app不能用const path，用req.path(挂在req上，因为getPostData(req)的req
    const url = req.url
    req.path = url.split('?')[0] //const path=url.split('?')[0] 
        // 解析query
    req.query = querystring.parse(url.split('?')[1]) // 这个是给getPostData(req)和const getPostData = (req)用的  没有给src/router的blog和user用

    // 1、session:  解析cookie(aa)和req.session = SESSION_DATA[userId]这一段代码   session: req.session(bb)    req.session.username = data.username(cc)   (dd)userResult.then(userData => { if (needSetCookie) { 
    // 解析cookie(aa)  cookie: router/user.js的res.setHeader('Set-Cookie',(bb)   username: req.cookie.username(cc)   (dd)userResult.then(userData => { if (needSetCookie) {
    req.cookie = {} //req.headers.cookie不是res...是因为server/后端可以修改cookie并返回给浏览器
    const cookieStr = req.headers.cookie || '' // cookie是这样的字符串：k1=v1;k2=v2;k3=v3，吧cookie字符串转为对象
    cookieStr.split(';').forEach(item => {

        if (!item) {
            return
        }

        // 通过=号拆分，k1是第一个值，v1是第二个值
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        console.log('a', key, val) //打印显示多了空格，加了httpOnly还需要加trim(),console输入document.cookie='name=hello',加了httpOnly,console写document.cookie还是显示name=hello,看登录验证的测试的username: req.cookie.username是否正确
        req.cookie[key] = val // req.cookie = {}

    })
    console.log('req.cookie is', req.cookie) // http://localhost:8000/api/blog/list 这个是在真实数据和promise下运行的，显示{}
        // 在console手动添加document.cookie='name=hello'并且刷新，cmd显示req.cookie is { name: 'hello' } Headers也会显示Cookie: name=hello,在Application里删除这个cookie


    // 解析session （从cookie中获取userId，并且对应到session上）
    // const userId = req.cookie.userId
    // if (userId) {
    //     if (SESSION_DATA[userId]) {
    //         req.session = SESSION_DATA[userId]
    //     } else {
    //         SESSION_DATA[userId] = {}
    //         req.session = SESSION_DATA[userId]
    //     }
    // }

    let needSetCookie = false //不用const
    let userId = req.cookie.userid //刚刚写成了req.cookie.userId，login-test测试文件显示尚未登录，一开
        // 然后http://localhost:8000/api/user/login?username=lala&password=789显示{errno:0},然后再login-test显示成功{errno:0}和username,realname
        // 最后一步测试结果对或者不对，cookie都有useid,最后一步login-test测试结果不对是因为 if (req.session.username)没有执行到 
        // 问题是进入api/user/login?username=lala&password=789，再login-test，login-test里都没有查看到lala(req.session.usernam:lala)，只有cookie里的useid，login-test的代码为什么写if (req.session.username)
        // 不是拿到req.cookie.userid就能登录，而是拿到username用户名(req.session.username/data.username)就能登录

    console.log('req.cookie', req.cookie.userid)
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true //没有userId需要设置cookie
        userId = `${Date.now()}_${Math.random()}` //Date.now()可能会重复，加了Math.random()就不会
        SESSION_DATA[userId] = {}
        console.log('id',
                SESSION_DATA[userId], userId) //id {} 1604413942378_0.2924371053581971
    }

    req.session = SESSION_DATA[userId]
    console.log('req.sessionreq.sessionreq.session', req.session)


    // 处理post data
    console.log('getPostData', getPostData)
        // get请求会走这里/异步，是因为用了sql真数据
        // get请求的假数据不会走这里，因为是异步(promise)   get请求的真数据(sql)不会走这里，因为是异步(sql是异步)和上面已经返回空对象(上面的代码：const getPostData = (req) => {})，只有post请求走这里
    getPostData(req).then(postData => { // 处理post data再处理下面两个路由   这句前面加不加return都可以
        // req.body = postData

        console.log('123postData', postData) //值blogData和值postData没关系
            // console.log('123req.body', req.body)

        // 处理blog路由
        // const blogData = handleBlogRouter(req, res)
        const blogResult = handleBlogRouter(req, res)

        // console.log('reqreqreq47', req)
        if (blogResult) {
            console.log('blogResult', blogResult) // 老师这个显示Promise { <pending> }，但是cmd能显示出｛id:28｝,postman显示的是｛｝
                // 执行假数据
                // res.end(JSON.stringify(blogData))
                // return

            // 执行真数据
            blogResult.then(blogData => { // res.end需要写在.then里
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                } //吧username改为userid,data.username改为userId

                res.end(
                    JSON.stringify(blogData) //postman的send后的body显示错的{}，因为blogData不对
                )
                console.log('123blogData', blogData)
            })

            return //没有return会显示404 not found,这里写return或者return blogData.then(blog => {
        }

        // 处理user路由
        // const userData = handleUserRouter(req, res)
        // if (userData) {
        //     res.end(
        //         JSON.stringify(userData)
        //     )
        //     return
        // }

        // 处理user路由  controller和router的user.js两个都是promise,这里路由也要改成promise
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            console.log('userResult', userResult)
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )

            })
            return //如果有值就return掉，不要再继续了
        }



        // 未命中路由，返回404
        res.writeHead(404, { "Content-type": "text/plain" })
        res.write('404 Not Found\n')
        res.end()
    })

    // 删除的
    // const resData = {
    //     name: '冬如',
    //     site: 'imooc',
    //     env: process.env.NODE_ENV //需要用到npm run dev才会显示出来
    // }
    // res.end(JSON.stringify(resData))



}

module.exports = serverHandle

// get:
// http://localhost:8000/  404 Not Found
// http://localhost:8000/api/blog/list?keyword=标题
// http://localhost:8000/api/blog/detail?id=1


// post:
// http://localhost:8000/api/blog/update?id=1
// {
//     "title":"博客标题A",
//     "content":"博客内容A"
// }


// http://localhost:8000/api/user/login
// {
//     "username":"zhangsan",
//     "password":"123"
// }