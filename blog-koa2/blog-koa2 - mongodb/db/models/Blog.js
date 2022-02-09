// 对应 blog 集合

const mongoose = require('../db')

const BlogSchema = mongoose.Schema({ //mongodb不直接用，用mongoose，因为比较底层，而mongoose比较丰富/多
        title: {
            type: String,
            required: true // 必需
        },
        content: String,
        author: {
            type: String,
            required: true
        }
    }, { timestamps: true }) //timestamps: true这个需要编辑或者新建博客才能看到compass(客户端的mongodb)添加了createdAt，updatedAt

const Blog = mongoose.model('blog', BlogSchema)

module.exports = Blog