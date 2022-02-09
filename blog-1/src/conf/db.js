let MYSQL_CONF //process是node.js进程的一些信息，db.js文件是配置,db这个文件夹是跟数据有关的文件
const env = process.env.NODE_ENV // 环境参数

if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'myblog'
    }
}

  // "dev": "cross-env NODE_ENV=dev nodemon ./bin/www.js",
  //   "prd": "cross-env NODE_ENV=production pm2 ./bin/www.js",

if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'myblog'
    }
}

module.exports = {
    MYSQL_CONF
}