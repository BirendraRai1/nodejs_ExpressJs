const express = require('express')
const router = express.Router()
const {
  getPeople,
  updatePeople,
  deletePeople,
} = require('../controllers/people')

router.get('/', getPeople)

router.put('/:id', updatePeople)

router.delete('/:id', deletePeople)

module.exports = router
