const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')
const register = async (req, res) => {
  const {
    body: { email, name, password },
  } = req
  const emailAlreadyexists = await User.findOne({ email })
  if (emailAlreadyexists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  //first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'admin' : 'user'
  const user = await User.create({ name, email, password, role })
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.CREATED).json({ tokenUser })
}

const login = async (req, res) => {
  const {
    body: { email, password },
  } = req
  if (!email || !password) {
    throw new CustomError.BadRequestError(`Please provide email and password`)
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.UnauthenticatedError(`Please provide correct email`)
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(
      `Please provide correct password`
    )
  }
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  })
  res.status(StatusCodes.OK).json({ msg: `logged out` })
}

module.exports = {
  register,
  login,
  logout,
}
