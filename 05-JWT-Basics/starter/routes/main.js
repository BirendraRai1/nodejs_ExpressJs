const express = require('express')
const router = express.Router()

const { login, dashboard } = require('../controllers/main')
const authMiddleWare = require('../middleware/auth')

router.get('/dashboard', authMiddleWare, dashboard)
router.post('/login', login)

module.exports = router
