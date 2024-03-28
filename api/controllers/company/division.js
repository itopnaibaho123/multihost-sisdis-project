const divisionService = require('../../services/company/division.js')

const getList = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await divisionService.getList(username, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await divisionService.getById(username, req.params.divisionId)

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const username = data.username
  const args = [data.id, data.idPerusahaan, data.lokasi, data.idManajer]
  const result = await divisionService.create(username, args)

  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const data = req.body
  const username = data.username
  const args = [req.params.divisionId, data.lokasi]
  const result = await divisionService.update(username, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await divisionService.remove(username, req.params.divisionId)

  res.status(result.code).send(result)
}

module.exports = { getList, getById, create, update, remove }
