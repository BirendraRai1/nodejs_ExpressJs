const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')
const getAllTask = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({})
  return res.status(200).json({ tasks })
})

const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body)
  res.status(201).json({ task })
})

const getTask = asyncWrapper(async (req, res, next) => {
  const { params: { id: taskId } = {} } = req
  const task = await Task.findOne({ _id: taskId })
  if (!task) {
    next(createCustomError(`No task found with id ${taskId}`, 400))
  }
  res.status(200).json({ task })
})

const updateTask = asyncWrapper(async (req, res) => {
  const { params: { id: taskId } = {} } = req
  const { body } = req
  const task = await Task.findOneAndUpdate({ _id: taskId }, body, {
    new: true,
    runValidators: true,
  })
  if (!task) {
    next(createCustomError(`no match found with id ${id}`, 404))
  }
  res.status(200).json(task)
})

const deleteTask = asyncWrapper(async (req, res) => {
  const { params: { id: taskId } = {} } = req
  const task = await Task.findOneAndDelete({ _id: taskId })
  if (!task) {
    next(createCustomError(`No task found with id ${taskId}`, 404))
  }
  res.status(200).json({ task })
})

module.exports = {
  getAllTask,
  createTask,
  getTask,
  updateTask,
  deleteTask,
}
