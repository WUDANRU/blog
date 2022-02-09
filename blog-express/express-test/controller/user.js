// const loginCheck = (username, password) => {

const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')


let login = (username, password) => {
    // 先使用假数据
    // if (username === 'zhangsan' && password === '123') {
    //     return true
    // }
    // return false

    // 生成加密密码
    password = genPassword(password) //密码没有单引号，sql语法会报错，escape函数需要写在gen函数后，（用了escape,password不需要单引号）


    // sql攻击增加的代码，用了escape，用户名lala' -- 密码自定义，登录会显示失败,controller的blog.js和user.js都需要加escape
    username = escape(username)
    password = escape(password)


    // 使用真数据
    // let sql = `select username,realname from users where username='${username}' and password='${password}'`
    let sql = `select username,realname from users where username=${username} and password=${password}` //吧单引号删除了
    console.log('sql is', sql) //escape起的作用('lala\')：sql is select username,realname from users where username='lala\' -- ' and password='d'
    return exec(sql).then(rows => {
        console.log(rows, 'rows')
        return rows[0] || {}
    })
}
module.exports = {
    login
}