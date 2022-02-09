const { loginCheck } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST
        // const url = req.url
        // const path = url.split('?')[0]
        //    登录
        // if (method === 'POST' && path === '/api/user/login') {
    if (method === 'POST' && req.path === '/api/user/login') {

        const { username, password } = req.body
        console.log(username, password, 'console.log(result)')
        const result = loginCheck(username, password)

        if (result) {
            return new SuccessModel()
        }
        return new ErrorModel('登录失败')


        // return {
        //     msg: '这是登录的接口'
        // }
    }
}
module.exports = handleUserRouter