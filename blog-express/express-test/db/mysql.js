const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始链接
con.connect()

// 统一执行sql的函数
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => { //MySQL语句的查询 (con.query查询)
            if (err) {
                reject(err)
                return
            }
            resolve(result) //这一句就是postData
        })
    })
    return promise
}

// con.end() 这个文件不能写关闭连接，到这里关闭了MySQL就不能执行多次promise

module.exports = {
    exec,
    escape: mysql.escape //mysql自带的函数，sql(sql语句)攻击用的
}