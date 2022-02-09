const http = require('http') //中间件原理-代码实现
const slice = Array.prototype.slice

class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routes = {
            all: [], // app.use(...)
            get: [], // app.get(...)
            post: [], // app.post(...)
            // put: [],
            // patch: [],
            // delete: []
        }
    }

    register(path) {
        const info = {} // use / get / post三个函数通用的当前注册信息
        if (typeof path === 'string') {
            info.path = path
                // 从第二个参数开始，转换为数组，存入 stack
            info.stack = slice.call(arguments, 1) //info.stack即当前注册信息中间件的信息
        } else {
            info.path = '/'
                // 从第一个参数开始，转换为数组，存入 stack
            info.stack = slice.call(arguments, 0)
        }
        return info
    }

    // app.use('/',(req, res, next)=>{...})根路由/代表所有路由都会命中，这个根路由有或者省略都是执行一样的效果
    // --------------------------------------------------------------
    // 如果访问的是get请求的/api/get-cookie/的网址这个post的/api就不用访问，比如下面的例子：
    // app.get('/api', (req, res, next) => {
    //     console.log('get /api路由')
    //     next()
    // })

    // app.post('/api', (req, res, next) => {
    //     console.log('post /api路由')
    //     next()
    // })
    // --------------------------------------------------------------

    use() {
        const info = this.register.apply(this, arguments) //arguments所有参数
        this.routes.all.push(info)
    }

    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }

    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }

    match(method, url) {
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }

        // 获取 routes
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])

        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) { //表示有
                // url === '/api/get-cookie' 且 routeInfo.path === '/'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api/get-cookie'
                stack = stack.concat(routeInfo.stack) //routeInfo.stack是info.stack是中间件数组
            }
        })
        return stack
    }

    // 核心的 next 机制
    handle(req, res, stack) {
        const next = () => {
            // 拿到第一个匹配的中间件
            const middleware = stack.shift()
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next) //middleware(req, res, next)的next表示const next=()=>{}这个函数
            }
            //如果中间件有3个，判断拿到第一个执行next(),剩下后两个，如果两个的第一个有执行next()即最后一个
        }
        next() //表示执行const next=()=>{}
    }

    // res.json({  //{}json格式
    //     errno: 0,
    //    msg:'404 not fount
    // })

    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json') //返回json格式，data是字符串
                res.end(
                    JSON.stringify(data) //data是字符串
                )
            }
            const url = req.url //url为/api不需要访问，url为/api/login-test需要访问
            const method = req.method.toLowerCase() //转为小写

            const resultList = this.match(method, url)
            this.handle(req, res, resultList) //resultList是stack
        }
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

// 工厂函数  课：js设计模式的讲解与应用
module.exports = () => {
    return new LikeExpress()
}


// app.listen(3000, () => {
//         console.log('erver is running on port 3000')
//     }) //3000 后的() => {
//console.log('server is running on port 3000')}) 是callback回调


// 如果是字符串就是路由，就需要吧第二个参数取出来，如果传入两个中间件的话需要吧第三个参数取出来
//  app.use((req, res, next) => {
// app.get('/api', (req, res, next) => { //中间件是第二个参数
//  app.get('/api/get-cookie', loginCheck, (req, res, next) => { //中间件是第二个参数和第三个参数