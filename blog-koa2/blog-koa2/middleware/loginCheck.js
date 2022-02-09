const { ErrorModel } = require('../model/resModel')

module.exports = async(ctx, next) => {
    if (ctx.session.username) {
        await next()
        return //估计是return await next()
    }
    ctx.body = new ErrorModel('未登录')
}