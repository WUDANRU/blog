const router = require('koa-router')()

router.prefix('/users') // http: //localhost:8000/users

router.get('/', function(ctx, next) { // http: //localhost:8000/users/
    ctx.body = 'this is a users response!'
})

router.get('/bar', function(ctx, next) { // http: //localhost:8000/users/bar
    ctx.body = 'this is a users/bar response'
})

module.exports = router