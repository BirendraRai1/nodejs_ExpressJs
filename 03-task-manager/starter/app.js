const express = require('express')
const app = express()
const tasks = require('./routes/tasks')
const connectDB = require('./db/connect')
require('dotenv').config()
const notFound = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/error-handler')
//middleware
app.use(express.static('./public'))
app.use(express.json())

//routes
app.get('/hello', (req, res) => {
  res.send('Welcome Task Manager')
})

app.use('/api/v1/tasks', tasks)

app.use(notFound)
app.use(errorHandlerMiddleware)
//app.get('/api/v1/tasks)  -get all the tasks
//app.post('/api/v1/task') -create a new task
//app.patch('/api/v1/task/:id') - update task
//app.get('/api/v1/task/:id') -get a single task
//app.delete('/api/v1/task/:id') -delete task
const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server listening on port ${port}`))
  } catch (e) {
    throw new Error(e)
  }
}

start()
