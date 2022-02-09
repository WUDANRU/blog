var express = require('express');
var router = express.Router(); //实例

const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog') //npm i mysql xss --save
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

// 统一的登录验证函数(新建/更新/删除博客需要登录验证)
// const loginCheck = (req) => { //有登录什么都不用返回(返回undefined),这段代码主要拦截没有登录的用户
//         if (!req.session.username) {
//             return Promise.resolve(new ErrorModel('尚未登录'))
//         }
//     } //npm run dev显示500是因为没有这个代码

/* GET home page. */
router.get('/list', (req, res, next) => { //(req, res, next)这个函数是中间件

    // 测试用的：
    // res.json({ //http://localhost:3000/api/blog/list
    //     errno: 0,
    //     data: [1, 2, 3]
    // })


    // http: //localhost:8082/admin.html
    let author = req.query.author || '' //http://localhost:3000/api/blog/list网址的页面会显示数据
    const keyword = req.query.keyword || '' //express框架可以直接使用req.query，省去了解析query(req.query=queryString.parse)
    console.log('req.query2', req.query) //{ isadmin: '1' }
        // nginx增加的代码:
    if (req.query.isadmin) {
        // express-test和blog-1的redis拿到key和value一样，如下：
        //a,localhost:8082/index.html会走这个/api/blog/list路由，见html-test/index.html的url = '/api/blog/list?isadmin=1'
        // b,redis需要删除全部key,flushall（127.0.0.1:6379> flushall和127.0.0.1:6379>keys *和127.0.0.1:6379>get sess:XqUoczjZJ_2YiwSft）,才能拿到东西，才不会拿到空对象，前提是需要登录成功(localhost:8082/login.html)
        // c,console的XHR就是经过的路径(localhost:8082/index.html经过/api/blog/list?isadmin=1)
        // d,localhost:8082/index.html没有登录成功，页面不会显示内容的，XHR的list?isadmin=1还会显示pending

        console.log('is admin', req.query.isadmin) //访问http://localhost:8082/admin.html，cmd显示is admin和开发环境的日志输出的GET /api/blog/list?isadmin=1 200 62.890 ms - 182(network最后一个是list?isadmin=1)
            //     // 管理员界面
            // const loginCheckResult = loginCheck(req)
            // if (loginCheckResult) {
            //     // 未登录
            //     return loginCheckResult
            // }

        // 管理员界面
        if (req.session.username == null) {
            console.error('is admin, but no login')
                // 未登录
            res.json(
                new ErrorModel('未登录')
            )
            return
        }

        // 强制查询自己的博客
        author = req.session.username
        console.log('author', req.session)
    }


    // 现在的：(这个跟blog-koa2的比较一下)
    const result = getList(author, keyword)
    return result.then(listData => {
        res.json(new SuccessModel(listData)) //return new SuccessModel(listData)
    })

})



router.get('/detail', (req, res, next) => {
    const result = getDetail(req.query.id)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
});

router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
})

router.post('/update', loginCheck, (req, res, next) => {
    const result = updateBlog(req.query.id, req.body)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        } else {
            res.json(
                new ErrorModel('更新博客失败')
            )
        }
    })
})

router.post('/del', loginCheck, (req, res, next) => {
    const author = req.session.username
    const result = delBlog(req.query.id, author)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        } else {
            res.json(
                new ErrorModel('删除博客失败')
            )
        }
    })


});

module.exports = router;