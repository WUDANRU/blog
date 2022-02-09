const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')

const serverHandle = (req, res) => {

    // 设置返回格式
    res.setHeader('Content-type', 'application/json')

    // 获取path blog和user文件的获取path一样，吧它们删除，写在了app.js文件里，blog和user可以用const path，app不能用const path，用req.path
    const url = req.url
    req.path = url.split('?')[0] //const path=url.split('?')[0] 


    // 解析query
    req.query = querystring.parse(url.split('?')[1])


    // 删除的
    // const resData = {
    //     name: '冬如',
    //     site: 'imooc',
    //     env: process.env.NODE_ENV //需要用到npm run dev才会显示出来
    // }
    // res.end(JSON.stringify(resData))

    // 处理blog路由
    const blogData = handleBlogRouter(req, res)
    if (blogData) {
        res.end(
            JSON.stringify(blogData)
        )
        return
    }

    // 处理user路由
    const userData = handleUserRouter(req, res)
    if (userData) {
        res.end(
            JSON.stringify(userData)
        )
        return
    }

    // 未命中路由，返回404
    res.writeHead(404, { "Content-type": "text/plain" })
    res.write('404 Not Found\n')
    res.end()

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