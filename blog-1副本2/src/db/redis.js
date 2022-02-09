const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
constredisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error(err)
})

function set(key, val) {
    if (typeofval === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key) { //get函数是异步
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val == null) {
                resolve(null)
                return
            }
            try {
                resolve(JSON.parse(val)) //上面代码写了转为字符串，这里要反推转为对象，如果不是json格式可能转不成功
            } catch (ex) { //如果不是json格式就转不成功，就返回原来的val
                resolve(val)
            }
            // resolve(val)
            // 退出
            // redisClient.quit()
        })
    })
    return promise
}
module.exports = {
    set,
    get
}