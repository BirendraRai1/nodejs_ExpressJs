const { people } = require('../data')

const getPeople = (req, res) => {
  res.status(200).send({ success: true, data: people })
}

const updatePeople = (req, res) => {
  const {
    params: { id },
    body: { name },
  } = req
  console.log(id, name)
  const person = people.find((person) => person.id === Number(id))
  if (!person) {
    return res
      .status(404)
      .json({ success: false, message: `there is no person with id ${id}` })
  }
  const newPerson = people.map((person) => {
    if (person.id === Number(id)) {
      person.name = name
    }
    return person
  })
  res.status(200).json({ success: true, data: newPerson })
}

const deletePeople = (req, res) => {
  const {
    params: { id },
  } = req
  const person = people.find((person) => person.id === Number(id))
  if (!person) {
    res.status(200).json({ success: false, message: `no person with id ${id}` })
  }
  const newPeople = people.filter((person) => person.id !== Number(id))
  res.status(200).json({ success: true, newPeople })
}

module.exports = { getPeople, updatePeople, deletePeople }
