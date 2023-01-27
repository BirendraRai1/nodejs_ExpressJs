const express = require('express')
const router = express.Router()
const {
  getAllTask,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require('../controller/tasks')

router.get('/', getAllTask)
router.post('/', createTask)
router.patch('/:id', updateTask)
router.get('/:id', getTask)
router.delete('/:id', deleteTask)

module.exports = router
