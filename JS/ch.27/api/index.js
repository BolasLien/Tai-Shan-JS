// 網頁伺服器
import express from 'express'
// 讓 express 可以讀取 post 資料
import bodyParser from 'body-parser'
// 引用加密 md5
import md5 from 'md5'
// 連到自己的資料庫
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
    // 使用 id 找尋資料，只取 account 去掉 id
    const result = await db.user.findById(req.query.id, 'account -_id')
    res.status(200)
    res.send({ success: true, message: result, account: result.account })
  } catch (error) {
    // 找不到東西
    console.log(error.message)
    res.status(400)
    res.send({ success: false, message: '無此項目' })
  }
})

app.patch('/update/:type', async (req, res) => {
  // 拒絕不是json的資料格式
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.send({ success: false, message: '格式不符' })
    return
  }
  if (req.params.type !== 'account' &&
  req.params.type !== 'password' &&
  req.params.type !== 'name' &&
  req.params.type !== 'email'
  ) {
    res.status(400)
    res.send({ success: false, message: '更新欄位不符' })
    return
  }

  try {
    await db.user.findByIdAndUpdate(req.body.id, { [req.params.type]: req.body.data })
    res.status(200)
    res.send({ success: true, message: req.params.type + '資料更新成功' })
  } catch (error) {
    console.log(error)
    res.status(200)
    res.send({ success: false, message: '欄位不正確' })
  }
})

app.delete('/delete', async (req, res) => {
  // 拒絕不是json的資料格式
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.send({ success: false, message: '格式不符' })
  }

  try {
    const result = await db.user.findByIdAndDelete(req.body.id)
    if (result === null) {
      res.status(404)
      res.send({ success: false, message: '找不到資料' })
    } else {
      res.status(200)
      res.send({ success: true, message: '刪除成功' })
    }
  } catch (error) {
    res.status(500)
    res.send({ success: false, message: '發生錯誤' })
  }
})

app.listen(3000, () => {
  console.log('網頁伺服器已啟動')
  console.log('http://localhost:3000')
})
