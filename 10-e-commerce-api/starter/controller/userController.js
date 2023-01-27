const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils')

const getAllUsers = async (req, res) => {
  console.log(req.user)
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ users })
}
const getSingleUser = async (req, res) => {
  const {
    params: { id },
  } = req
  const user = await User.findById({ _id: id }).select('-password')
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${id}`)
  }
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user })
}
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

//update user with user.save()
const updateUser = async (req, res) => {
  const {
    body: { email, name },
  } = req
  if (!email || !name) {
    throw new CustomError.BadRequestError('please provide all values')
  }
  const user = await User.findOne({ _id: req.user.userId })
  user.name = name
  user.email = email
  await user.save()

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const updatePassword = async (req, res) => {
  const {
    body: { newPassword, oldPassword },
  } = req
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('please provide both values')
  }
  const user = await User.findOne({ _id: req.user.userId })
  let isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('invalid credentials')
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updatePassword,
}

//update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//   const {
//     body: { email, name },
//   } = req
//   if (!email || !name) {
//     throw new CustomError.BadRequestError('please provide all values')
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   )
//   const tokenUser = createTokenUser(user)
//   attachCookiesToResponse({ res, user: tokenUser })
//   res.status(StatusCodes.OK).json({ user: tokenUser })
// }
