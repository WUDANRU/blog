// 对应 user 集合

const mongoose = require('../db')

// 用 Schema 定义数据规范
const UserSchema = mongoose.Schema({ //Schema这个是函数
        username: {
            type: String,
            required: true, // 必需
            unique: true // 唯一，不能重复
        },
        password: String,
        realname: String
    }, { timestamps: true }) // timestamps时间戳

// Model 对应 collection
const User = mongoose.model('user', UserSchema) // 'user'，这个是users集合，这个'user'会变成复数，如果没有写'users',mongose会帮你创建复数的users的collection

module.exports = User