// 從 http 套件引用變數，取名為 http
// require 是 commonJS 語法
// const http = require('http')

// import 是 EMCAScript 語法
// 必須要 node.js > 13.0.0 且在 package.json 加入 "type": "module"
import http from 'http'

const server = http.createServer((req, res) => {
    // 回應狀態碼 200 成功
    res.writeHead(200)
    // 回應內容
    res.write('hello')
    // 回應結束
    res.end()
})

// 在 port 1323 啟動 : 啟動後在 console 顯示訊息
server.listen(1323, () => {
    console.log("網頁伺服器已啟動: http://localhost:1323");
})