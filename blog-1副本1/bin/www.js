const http = require('http')
const PORT = 8000
const serverHandle = require('../app')
const server = http.createServer(serverHandle)
server.listen(PORT) //开始用node bin/www.js 后面用npm run dev
console.log('ok')
    // npm init -y //www.js的scripts的dev开发 prd上线
    // npm i nodemon cross-env --save-dev //nodemon自动重启文件  cross-env兼容windows/mark/linux三个环境  NODE_ENV=DEV设置环境变量