const { exec } = require('../db/mysql')
const xss = require('xss')

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 ` //最后有空格，没有空格会报错
    if (author) {
        // sql += `and author=${author} `
        sql += `and author='${author}' ` //最后有空格
    }
    if (keyword) {

        sql += `and title like '%${keyword}%' `
            // sql += `and title like '%${keyword}%' ` //最后有空格
    }
    sql += `order by createtime desc;`

    // 返回promise
    return exec(sql)
}

const getDetail = (id) => { //吧假数据删了再写真数据

    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {

    let title = xss(blogData.title) //xss攻击就是吧js代码块(<script></script>)转义,<script>alert(document.cookie)</script>
    console.log('let title', title)
    let content = xss(blogData.content)
    let author = blogData.author //用户输入的都需要xss预防,author是自己写的，不需要加xss
    let createTime = Date.now()

    //escape函数要在xss函数后面，escape函数需要删除单引号,xss需要加上单引号(const sql中)
    //cmd报错说mysql的错，是title的varchar(50)较小

    // mysql的id不用加上/'${createTime}'的引号可以省略
    const sql = `
insert into blogs(title,content,createtime,author)values('${title}','${content}','${createTime}','${author}');
`
    return exec(sql).then(insertData => {
        console.log(' insertData is ', insertData, insertData.insertId)
        return {
            id: insertData.insertId //这个id是src/router/blog.js的result [const result = newBlog(req.body)]
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    let title = blogData.title
    let content = blogData.content

    const sql = `update blogs set title='${title}',content='${content}' where id='${id}'`
    return exec(sql).then(updateData => {

        if (updateData.affectedRows > 0) { //大于0表示更新成功
            console.log('1updateData is', updateData)
            return true
        }
        return false
    })
}

const delBlog = (id, author) => { //id就是要删除博客的id

    const sql = `delete from blogs where id='${id}' and author='${author}'`
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}