const logger = (req, res, next) => {
  const { url, method } = req
  const time = new Date().getFullYear()
  console.log(url)
  console.log(method)
  console.log(time)
  next()
}
module.exports = logger
