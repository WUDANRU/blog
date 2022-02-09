// blog写5个接口，这个文件会被app.js调用，所以有req,res函数
// user写1个接口

const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog') //假数据
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {

    const method = req.method //GET POST
        // const url = req.url
        // const path = url.split('?')[0]
    const id = req.query.id //剪切过来的id,可以通用的id


    // 获取博客列表
    // if (method === 'GET' && path == '/api/blog/list') {
    if (method === 'GET' && req.path === '/api/blog/list') { //用的是app.js的req.path
        const author = req.query.author || '' //app.js有req.query,所以这里不用引用queryString,直接用req.query
        const keyword = req.query.keyword || ''


        //   之前的；
        // const listData = getList(author, keyword)
        // console.log(author, 'aaaaaa') //cmd显示zhangsan  
        // console.log(keyword, 'bbbbbb') //cmd显示标题
        // console.log(listData, 'cccccc') //标题A和标题B的数组  //http://localhost:8000/api/blog/list?keyword=标题  链接的keyword或author跟getList的return的keyword或author不是同一个
        // return new SuccessModel(listData) //传入data没有传入message //localhost:8000/api/blog/list?keyword=A&author=zhangsan


        // 现在的：
        const result = getList(author, keyword)
        return result.then(listData => {
            console.log(listData, 'listData')
            return new SuccessModel(listData)
        })


        // return {
        //     msg: '这是获取博客列表的接口'
        // }
    }

    // 获取博客详情
    // if (method === 'GET' && path == '/api/blog/detail') {
    if (method === 'GET' && req.path == '/api/blog/detail') {
        // const id = req.query.id  吧这里的id剪切在上面 这里的id是空的，上面的id是undefined,两个都一样的指的不是controller里的getDetail的return里的id
        // http://localhost:8000/api/blog/detail/4 显示404 NOT FOUNT   上面的改成req.path =='/api/blog/detail/id'也不对
        // http://localhost:8000/api/blog/detail?id=7 这个能显示数据,这个链接的id7和controller里的getDetail的return里的id2不是同一个
        // console.log(id, 'hhhhhhhhhhhhhhh') //http://localhost:8000/api/blog/detail这个能显示数据

        //   之前的；
        // const data = getDetail(id)
        // return new SuccessModel(data)

        // 现在的：
        const result = getDetail(id) //http://localhost:8000/api/blog/detail?id=2
        return result.then(data => {
            console.log('detailData', data)
            return new SuccessModel(data)
        })

        // return {
        //     msg: '这是获取博客详情的接口'
        // }
    }

    // 新建一篇博客
    // if (method === 'POST' && path == '/api/blog/new') {  //
    if (method === 'POST' && req.path == '/api/blog/new') {

        //   之前的；
        // const data = newBlog(req.body) //controller的blog.js(blogData = {}等于req.body
        // return new SuccessModel(data)

        // 现在的：
        req.body.author = 'zhangsan' //新建博客没有author，写一个author的假数据 (假数据，待开发登录时再改成真实数据)
        const result = newBlog(req.body) //result是controller/blog.js的id(id: insertData.insertId)
        return result.then(data => { //postman显示404 not found，所以需要return promise（虽然没有return但是数据的值(conroller/blog.js)是有插入,可以在mysql测试有没有插入：select * from blogs;）
            console.log('datadata', data) //{ id: 17 }
            return new SuccessModel(data)
        })




    }

    // 更新一篇博客
    // if (method === 'POST' && path == '/api/blog/update') {
    if (method === 'POST' && req.path == '/api/blog/update') {
        const result = updateBlog(id, req.body) //result返回的是true  //controller的(blogData = {}等于req.body

        //   之前的；
        // if (result) {
        //     return new SuccessModel() //或者 return new SuccessModel('更新博客成功')
        // } else {
        //     return new ErrorModel('更新博客失败')
        // }

        // 现在的：
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('更新博客失败')
            }
        })

    }

    // 删除一篇博客
    // if (method === 'POST' && path == '/api/blog/del') {
    if (method === 'POST' && req.path == '/api/blog/del') {

        //   之前的；
        // const result = delBlog(id)
        // if (result) {
        //     return new SuccessModel()
        // } else {
        //     return new ErrorModel('删除博客失败')
        // }

        // 现在的：
        const author = 'zhangsan' //假数据，待开发登录时再改成真实数据
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('删除博客失败')
            }
        })

    }

}

module.exports = handleBlogRouter