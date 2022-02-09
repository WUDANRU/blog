const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')

//  用于处理post data （处理post请求）
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

const serverHandle = (req, res) => {

    // 设置返回格式
    res.setHeader('Content-type', 'application/json')

    // 获取path blog和user文件的获取path一样，吧它们删除，写在了app.js文件里，blog和user可以用const path，app不能用const path，用req.path(挂在req上，因为getPostData(req)的req)
    const url = req.url
    req.path = url.split('?')[0] //const path=url.split('?')[0] 
        // 解析query
    req.query = querystring.parse(url.split('?')[1]) //这个是给getPostData(req)和const getPostData = (req)用的  没有给src/router的blog和user用

    // 处理post data （处理post请求）
    console.log('getPostData', getPostData)
    return getPostData(req).then(postData => { // 处理post data再处理下面两个路由
        req.body = postData
            // console.log(postData, req.body) //{}，{} postman显示的{}就是这里的postData，req.body
            // postman工具显示的{}是因为拿到的是mysql真数据，假数据就不会显示{}

        // 处理blog路由
        const blogData = handleBlogRouter(req, res)

        // detail路由的cmd显示Promise { <pending> }和postman显示的是｛｝原因？

        if (blogData) { //b. 下面的user路由只有promise比blog路由少一层，不需要加.then
            blogData.then(blogData => { //a. 关于上面的原因在这Promise { <pending> }是要在加.then,数据才能在postman的send后的body显示出来
                console.log('blogblog', blogData) //cmd显示Promise { <pending> }，后面还能显示出id=28的detail路由(链接)的数据,postman之send后显示的是｛｝
                res.end(
                    JSON.stringify(blogData)
                )
            })

            return
        }

        // 处理user路由
        const userData = handleUserRouter(req, res)
        if (userData) {
            console.log('//////////////', userData)
            res.end(
                JSON.stringify(userData)
            )
            return
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

// 需要发送参数（比如id或者{"title":"heiha", "content":"heiha"}等）就用post请求，不发送参数就用get请求
// controller写的函数有的用到了mysql查询，有的用了假数据

// get:
// http://localhost:8000/  404 Not Found
// http://localhost:8000/api/blog/list?keyword=标题
// http://localhost:8000/api/blog/detail?id=1


// post:
// http://localhost:8000/api/blog/new
// {
//     "title":"heiha",
//     "content":"heiha"
// }

// http://localhost:8000/api/blog/update?id=1
// {
//     "title":"博客标题A",
//     "content":"博客内容A"
// }

// http://localhost:8000/api/blog/del?id=2

// http://localhost:8000/api/user/login
// {
//     "username":"zhangsan",
//     "password":"123"
// }