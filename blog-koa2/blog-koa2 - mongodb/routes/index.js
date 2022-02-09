const router = require('koa-router')() //koa-router和koa是分开的

router.get('/', async(ctx, next) => { //http://localhost:8000/或http://localhost:8000
        await ctx.render('index', { //render集成, index是view是index.pug， 集成index.pug
            title: 'Hello Koa 2!'
        })
    }) //ctx指的是req,res

router.get('/string', async(ctx, next) => { //http://localhost:8000/string
    ctx.body = 'koa2 string'
})

router.get('/json', async(ctx, next) => { //http://localhost:8000/json
    ctx.body = {
        title: 'koa2 json'
    }
})

module.exports = router