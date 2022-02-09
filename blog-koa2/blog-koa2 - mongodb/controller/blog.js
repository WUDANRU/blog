// const { exec, escape } = require('../db/mysql')
const xss = require('xss')

const Blog = require('../db/models/Blog')

const getList = async(author, keyword) => {
    // let sql = `select * from blogs where 1=1 `
    // if (author) {
    //     sql += `and author='${author}' `
    // }
    // if (keyword) {
    //     sql += `and title like '%${keyword}%' `
    // }
    // sql += `order by createtime desc;`

    // return await exec(sql)

    // 动态拼接查询条件
    const whereOpt = {}
    if (author) whereOpt.author = author
    if (keyword) whereOpt.keyword = new RegExp(keyword) //keyword是模糊查询，用正则表达式，正则表达式可以模糊查询

    const list = await Blog.find(whereOpt).sort({ _id: -1 })
    return list
}

const getDetail = async(id) => {
    // const sql = `select * from blogs where id='${id}'`
    // const rows = await exec(sql)
    // return rows[0]

    const blog = await Blog.findById(id)
    return blog
}

const newBlog = async(blogData = {}) => {
    // // blogData 是一个博客对象，包含 title content author 属性
    // const title = xss(blogData.title)
    // // console.log('title is', title)
    // const content = xss(blogData.content)
    // const author = blogData.author
    // const createTime = Date.now()

    // const sql = `
    //     insert into blogs (title, content, createtime, author)
    //     values ('${title}', '${content}', ${createTime}, '${author}');
    // `

    // const insertData = await exec(sql)
    // return {
    //     id: insertData.insertId
    // }

    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const author = blogData.author

    const blog = await Blog.create({ //创建博客
        title,
        content,
        author
    })

    return {
        id: blog._id
    }
}

const updateBlog = async(id, blogData = {}) => {
    // // id 就是要更新博客的 id
    // // blogData 是一个博客对象，包含 title content 属性

    // const title = xss(blogData.title)
    // const content = xss(blogData.content)

    // const sql = `
    //     update blogs set title='${title}', content='${content}' where id=${id}
    // `

    // const updateData = await exec(sql)
    // if (updateData.affectedRows > 0) {
    //     return true
    // }
    // return false

    const title = xss(blogData.title)
    const content = xss(blogData.content)

    const blog = await Blog.findOneAndUpdate({ _id: id }, { title, content }, { new: true }) //更新条件{ _id: id }，更新内容{ title, content }

    if (blog == null) return false //更新失败
    return true //更新成功
}

const delBlog = async(id, author) => {
    // // id 就是要删除博客的 id
    // const sql = `delete from blogs where id='${id}' and author='${author}';`
    // const delData = await exec(sql)
    // if (delData.affectedRows > 0) {
    //     return true
    // }
    // return false

    const blog = await Blog.findOneAndDelete({
        _id: id,
        author
    })
    if (blog == null) return false //删除失败
    return true //删除成功
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}