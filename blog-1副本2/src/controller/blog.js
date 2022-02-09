const { exec } = require('../db/mysql')

// const getList = (author, keyword) => {
//     // 先返回假数据（格式是正确的）
//     return [{
//             id: 1,
//             title: '标题A',
//             content: '内容A',
//             createTime: 1601988853404, //Date.now()
//             author: 'zhangsan'
//         },
//         {
//             id: 2,
//             title: '标题B',
//             content: '内容B',
//             createTime: 1601988971747,
//             author: 'list'
//         },
//     ]
// }

// const getDetail = (id) => {
//     // 先返回假数据
//     return {
//         id: 2,
//         title: '标题B',
//         content: '内容B',
//         createTime: 1601988971747,
//         author: 'list'
//     }
// }

// const newBlog = (blogData = {}) => {
//     // blogData是一个博客对象，包含 title content属性
//     console.log('newBlog blogData...', blogData)
//     return {
//         id: 3 //表示新建博客，插入到数据表里面的id
//     }
// }

// const updateBlog = (id, blogData = {}) => {
//     // id就是要更新博客的 id
//     // blogData 是一个博客对象，包含title content属性
//     console.log('update blog', id, blogData)
//     return true //假数据，返回true表示成功，返回false或者没有这句代码表示失败
// }

// const delBlog = (id) => {
//     // id就是要删除博客的id
//     return true //return false
// }


const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 ` //最后有空格，没有空格会报错
    if (author) {
        sql += `and author='${author}' ` //最后有空格
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' ` //最后有空格
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

//getList也是返回数组，返回多个
//getDetal返回数组，这个getDetail只能返回1个，rows是数组，rows[0]是对象

const newBlog = (blogData = {}) => {
    console.log('BLOGDATA', blogData)
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createTime = Date.now()

    // mysql的id不用加上/'${createTime}'的引号可以省略
    const sql = `
insert into blogs(title,content,createtime,author)values('${title}','${content}',${createTime},'${author}');
`
    return exec(sql).then(insertData => {
        console.log('insertData is ', insertData, insertData.insertId)
        return {
            id: insertData.insertId //这个id是src/router/blog.js的result [const result = newBlog(req.body)]
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    const title = blogData.title
    const content = blogData.content
    const sql = `update blogs set title='${title}',content='${content}' where id='${id}'`
    return exec(sql).then(updateData => {
        console.log('updateData is', updateData)
        if (updateData.affectedRows > 0) { //大于0表示更新成功
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