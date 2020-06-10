// 網頁伺服器
import express from 'express'
// 讓 express 可以讀取 post 資料
import bodyParser from 'body-parser'
// 引用加密 md5
import md5 from 'md5'

import db from './db.js'

const app = express()

// 讓 express 使用 body-parser，並把收到的資料轉json
app.use(bodyParser.json())

app.post('/new', async (req, res) => {
  console.log(req.body)
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.send({ success: false, message: '格式不符' })
    return
  }

  // 檢查資料內容
  if (req.body.name === undefined || req.body.account === undefined || req.body.password === undefined || req.body.email === undefined) {
    res.status(400)
    res.send({ success: false, message: '欄位不正確' })
    return
  }

  // 新增資料
  try {
    const result = await db.user.create({
      name: req.body.name,
      account: req.body.account,
      password: md5(req.body.password),
      email: req.body.email
    })

    res.status(200)
    res.send({ success: true, message: '', id: result._id })
  } catch (error) {
    const key = Object.keys(error.errors)[0]
    const message = error.errors[key].message
    res.status(400)
    res.send({ success: false, message: message })
  }

  res.send('ok')
})

app.get('/find', async (req, res) => {
  if (req.query.id === undefined) {
    res.status(400)
    res.send({ success: false, message: '欄位不正確' })
  }

  try {
    const result = await db.user.findById(req.query.id)
    console.log(result)
    res.status(200)
    res.send({ success: true, message: result })
  } catch (error) {
    // 找不到東西
    console.log(error.message)
    res.status(400)
    res.send({ success: false, message: '無此項目' })
  }
})

app.listen(3000, () => {
  console.log('網頁伺服器已啟動')
  console.log('http://localhost:3000')
})
