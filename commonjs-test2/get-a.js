const http = require('http')
const queryString = require('querystring')
const server = http.createServer((req, res) => { //http://localhost:8000/  //http://localhost:8000/api/blog/list  //http://localhost:8000/api/blog/list?keyword=A&author=zhangsan
    console.log(req.method)
    const url = req.url
    req.query = queryString.parse(url.split('?')[1])
    req.path = url.split('?')[0]
        // const query = queryString.parse(url.split('?')[1])
        // const path = url.split('?')[0]
        // console.log(JSON.stringify(query),path)
    console.log(JSON.stringify(req.query), req.path) //{"keyword":"A","author":"zhangsan"} /api/blog/list
    res.end('hello world')
})
server.listen(8000)
console.log('ok')