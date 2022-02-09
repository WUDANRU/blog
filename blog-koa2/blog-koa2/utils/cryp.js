const crypto = require('crypto') //node.js提供的加密的库，因为前端虽然document.cookie拿不到userid,但是还不够安全，需要密码加密


// 密钥
const SECRET_KEY = 'wjioL_8776#'


//md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex') //digest('hex')吧输出变成16进制
}


//加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}


//const result = genPassword('789') //node src/utils/cryp.js
//console.log(result) //6f126c9e05428f184a74944a73c567b5
// MySQL Workbench的代码:update users set password='6f126c9e05428f184a74944a73c567b5' where username='hei';和SET SQL_SAFE_UPDATES=0;


module.exports = {
    genPassword
}