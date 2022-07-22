require('express-async-errors')
require('dotenv/config')
const sqliteConnection = require("./database/sqlite")
const AppError = require('./utils/AppError')
const express = require('express')
const uploadConfig = require('./configs/upload')
const routes = require('./routes')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes)

sqliteConnection()

app.use((error, req, res, next) => {
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})




const PORT = process.env.PORT || 3333
app.listen(PORT, ()=> console.log(`Running on ${PORT}`))