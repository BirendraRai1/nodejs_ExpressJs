const authorize = (req, res, next) => {
  const { query: { user } = {} } = req
  if (user) {
    req.user = { user }
    next()
  } else {
    res.status(401).send('UnAuthorized')
  }
}

module.exports = authorize
