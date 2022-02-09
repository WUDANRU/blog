// const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const User = require('../db/models/User')

const login = async(username, password) => {


    // 生成加密密码
    // password = genPassword(password)

    // username = escape(username)
    // password = escape(password)
    // let sql = `select username,realname from users where username=${username} and password=${password}`
    // console.log('sql is', sql)

    // const rows = await exec(sql)
    // return rows[0] || {}


    password = genPassword(password)

    const userList = await User.find({ //返回空数组或者叫做列表
        username,
        password
    })

    console.log(userList)

    // if (userList == null) return {} //不能写null
    // return userList

    if (userList.length === 0) return {} //如果是空数组，返回空对象
    return userList[0]

}

module.exports = {
    login
}