// 網頁伺服器
import express from 'express'
// 讓 express 可以讀取 post 資料
import bodyParser from 'body-parser'
import validator from 'validator'
// import db from './db.js'

const app = express()

// 讓 express 使用 body-parser，並把收到的資料轉json
app.use(bodyParser.json())

app.post('/new', async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.sendStatus(400)
    return
  }
  console.log(req.body)
  res.send('ok')
})

app.listen(3000, () => {
  console.log('網頁伺服器已啟動')
  console.log('http://localhost:3000')
})
