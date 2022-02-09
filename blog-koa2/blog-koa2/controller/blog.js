const { exec, escape } = require('../db/mysql')
const xss = require('xss')

const getList = async(author, keyword) => {
    let sql = `select * from blogs where 1=1 ` //最后有空格，没有空格会报错
    if (author) {
        author = escape(author)
        sql += `and author=${author} `
            // sql += `and author='${author}' ` //最后有空格
    }
    if (keyword) {

        sql += `and title like '%${keyword}%' `
            // sql += `and title like '%${keyword}%' ` //最后有空格
    }
    sql += `order by createtime desc;`

    // 返回promise
    return await exec(sql) //await+promise
}


const getDetail = async(id) => { //吧假数据删了再写真数据

    id = escape(id)

    const sql = `select * from blogs where id=${id}`

    const rows = await exec(sql)
    return rows[0]

    // return await exec(sql).then(rows => {
    //     return rows[0]
    // })
}


const newBlog = async(blogData = {}) => {



    let title = xss(blogData.title) //xss攻击就是吧js代码块(<script></script>)转义,<script>alert(document.cookie)</script>
    console.log('let title', title)
    let content = xss(blogData.content)
    let author = blogData.author //用户输入的都需要xss预防,author是自己写的，不需要加xss
    let createTime = Date.now()


    title = escape(title) //escape函数要在xss函数后面，escape函数需要删除单引号,xss需要加上单引号(const sql中)
    content = escape(content)
    author = escape(author) //cmd报错说mysql的错，是title的varchar(50)较小

    // mysql的id不用加上/'${createTime}'的引号可以省略
    const sql = `
insert into blogs(title,content,createtime,author)values(${title},${content},${createTime},${author});
`
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }

    // return await exec(sql).then(insertData => {
    //     console.log(' insertData is ', insertData, insertData.insertId)
    //     return {
    //         id: insertData.insertId //这个id是src/router/blog.js的result [const result = newBlog(req.body)]
    //     }
    // })
}

const updateBlog = async(id, blogData = {}) => {
    let title = blogData.title
    let content = blogData.content

    title = escape(title)
    content = escape(content)
    id = escape(id)

    const sql = `update blogs set title=${title},content=${content} where id=${id}` //有escape，删除了3个单引号

    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
        // return exec(sql).then(updateData => {
        //     console.log('updateData is', updateData)
        //     if (updateData.affectedRows > 0) { //大于0表示更新成功
        //         return true
        //     }
        //     return false
        // })
}

const delBlog = async(id, author) => { //id就是要删除博客的id
    id = escape(id)
    author = escape(author)
    const sql = `delete from blogs where id=${id} and author=${author}`

    const delData = await exec(sql)

    if (delData.affectedRows > 0) {
        return true
    }
    return false

    // return exec(sql).then(delData => {
    //     if (delData.affectedRows > 0) {
    //         return true
    //     }
    //     return false
    // })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}