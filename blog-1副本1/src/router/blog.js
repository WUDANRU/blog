// blog写5个接口，这个文件会被app.js调用，所以有req,res函数
// user写1个接口

const { getList } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {

    const method = req.method //GET POST
        // const url = req.url
        // const path = url.split('?')[0]

    // 获取博客列表
    // if (method === 'GET' && path == '/api/blog/list') {
    if (method === 'GET' && req.path === '/api/blog/list') { //用的是app.js的req.path
        const author = req.query.author || '' //app.js有req.query,所以这里不用引用queryString,直接用req.query
        const keyword = req.query.keyword || ''
        const listData = getList(author, keyword)
        console.log(author, 'aaaaaa') //cmd显示zhangsan
        console.log(keyword, 'bbbbbb') //A
        console.log(listData, 'cccccc') //标题A和标题B的数组
        return new SuccessModel(listData) //传入data没有传入message //localhost:8000/api/blog/list?keyword=A&author=zhangsan

        // return {
        //     msg: '这是获取博客列表的接口'
        // }
    }

    // 获取博客详情
    // if (method === 'GET' && path == '/api/blog/detail') {
    if (method === 'GET' && req.path == '/api/blog/detail') {
        return {
            msg: '这是获取博客详情的接口'
        }
    }

    // 新建一篇博客
    // if (method === 'POST' && path == '/api/blog/new') {
    if (method === 'POST' && req.path == '/api/blog/new') {
        return {
            msg: '这是新建博客的接口'
        }
    }

    // 更新一篇博客
    // if (method === 'POST' && path == '/api/blog/update') {
    if (method === 'POST' && req.path == '/api/blog/update') {
        return {
            msg: '这是更新博客的接口'
        }
    }

    // 删除一篇博客
    // if (method === 'POST' && path == '/api/blog/del') {
    if (method === 'POST' && req.path == '/api/blog/del') {
        return {
            msg: '这是删除博客的接口'
        }
    }

}

module.exports = handleBlogRouter