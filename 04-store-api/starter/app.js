require('dotenv').config()
//async errors
require('express-async-errors')
const express = require('express')
const app = express()
const connectDB = require('./db/connect')

const productRoutes = require('./routes/products')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')

//middleware
app.use(express.json())

//routes
app.get('/', (req, res) =>
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
)
app.use('/api/v1/products', productRoutes)

//products route

app.use(errorHandlerMiddleware)
app.use(notFound)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    //connect DB
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`server listening on port ${port}....`))
  } catch (err) {
    console.log(err)
  }
}

start()
