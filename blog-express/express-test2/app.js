 const express = require('express') //mkdir expresss-test2,cd express-test2,npm init -y,npm i express,package.json的入口文件main原来index.js改为app.js
     // node app.js
     //本次http请求的实例
 const app = express()

 // localhost:3000/api/get-cookie和postman的网址：localhost:3000/api/get-post-data执行下面的代码(从上到下的顺序执行)：
 app.use((req, res, next) => { //localhost:3000/api/get-cookie,api父路由( app.use((req, res, next) 和app.get符合这个网址会执行代码)
     console.log('请求开始...', req.method, req.url)
     next()
 })

 app.use((req, res, next) => {
     // 假设在处理cookie
     req.cookie = { //这个在console的xhr的preview能看到
         userId: 'abc123'
     }
     next()
 })

 app.use((req, res, next) => { //localhost:3000/api/get-cookie,这段代码控制台或者body是不会显示看见的
     // 假设处理post data,异步的(测试用setTimeout)
     setTimeout(() => {
         req.body = {
             a: 100,
             b: 200
         }
         next()
     })
 })

 app.use('/api', (req, res, next) => {
     console.log('处理/api路由')
     next()
 })

 app.get('/api', (req, res, next) => {
     console.log('get /api路由')
     next()
 })

 app.post('/api', (req, res, next) => { //localhost:3000/api/get-cookie，post请求不符合，不会执行这段代码
     console.log('post /api路由')
     next()
 })


 // 模拟登陆验证
 function loginCheck(req, res, next) { //这个函数是中间件
     setTimeout(() => { //从数据库拿数据是异步的，用setTimeout代表异步
         console.log('模拟登录失败')
         res.json({
             errno: -1,
             msg: '登陆失败'
         })
     })

     //或：
     //  setTimeout(() => {
     //      console.log('模拟登录成功')
     //      next() //模拟登录成功了，next()这个会使cmd打印下面的(get /api/get-cookie)，模拟登录失败就不会有这个打印出来
     //  })

 }
 app.get('/api/get-cookie', loginCheck, (req, res, next) => { //localhost:3000/api/get-cookie，没有next(),请求到这里就停止了
     console.log('get /api/get-cookie')
     res.json({
         errno: 0,
         data: req.cookie
     })
 })

 app.post('/api/get-post-data', (req, res, next) => {
     console.log('post /api/get-post-data')
     res.json({
         errno: 0,
         data: req.body
     })
 })

 app.use((req, res, next) => { //localhost:3000/api/aaabbb(get或post请求)显示404
     console.log('处理 404')
     res.json({
         errno: -1,
         msg: '404 not fount'
     })
 })


 // http://localhost:3000/api/get-cookie打印的：
 //  请求开始...GET / api / get - cookie
 //  处理 / api路由
 //  get / api / get - cookie

 //  postman的post请求的localhost:3000/api/get-post-data打印的：
 //  请求开始...POST / api / get - post - data
 //  处理 / api路由
 //  post / api / get - post - data

 app.listen(3000, () => {
     console.log('server isrunning on port 3000')
 })