const router = require('koa-router')()

const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

// router.get('/list', async function(ctx, next) {
//         //http://localhost:8000/api/blog/list和localhost:8000/api/blog/list?keyword=a&author=lisi

//         const query = ctx.query
//         ctx.body = {
//             errno: 0,
//             query, //返回{}和｛'keyword':'a','author':'lisi'｝
//             data: ['获取博客列表']
//         }

//     }) //async function,走这个中间件，这个是中间件


router.get('/list', async function(ctx, next) {
    let author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''

    if (ctx.query.isadmin) {
        console.log('is admin')
            // 管理员界面
        if (ctx.session.username == null) {
            console.error('is admin, but no login')
                // 未登录
            ctx.body = new ErrorModel('未登录')
            return
        }
        // 强制查询自己的博客
        author = ctx.session.username
    }

    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData)
})

router.get('/detail', async function(ctx, next) {
    const data = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function(ctx, next) {
    const body = ctx.request.body
    body.author = ctx.session.username
    const data = await newBlog(body)
    ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function(ctx, next) {
    const val = await updateBlog(ctx.query.id, ctx.request.body)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})

router.post('/del', loginCheck, async function(ctx, next) {
    const author = ctx.session.username
    const val = await delBlog(ctx.query.id, author)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('删除博客失败')
    }
})

module.exports = router