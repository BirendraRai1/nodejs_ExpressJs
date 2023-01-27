const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({})
    .sort('-name -price')
    .select('company price')
    .limit(10)
    .skip(5)
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  const {
    query: {
      featured = '',
      company = '',
      name = '',
      sort = '',
      fields = '',
      numericFilters,
    },
  } = req
  const queryObject = {}
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }
    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    )
    console.log(`filters inside the ${filters}`)
    const options = ['price', 'rating']
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }

  let result = Product.find(queryObject)
  console.log(`result after queryObject ${result}`)
  if (sort) {
    const sortList = sort.split(',').join(' ')
    console.log(`sortList ${sortList}`)
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }
  if (fields) {
    const fieldList = fields.split(',').join(' ')
    result = result.select(fieldList)
  }
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  result = result.skip(skip).limit(limit)
  const products = await result
  console.log(queryObject)
  res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
  getAllProducts,
  getAllProductsStatic,
}
