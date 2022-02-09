var express = require('express');
var router = express.Router(); //实例

/* GET users listing. */
router.get('/', function(req, res, next) { //router.get相当于blog-1的博客或登录路由文件的if(method==='GET')，router.post是post请求
    res.send('respond with a resource');
}); //router.get('/',如果改成router.get('/api',，需要访问localhost:3000/users/api

module.exports = router;