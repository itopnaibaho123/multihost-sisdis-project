const divisionService = require('../../services/company/division.js')

const getList = async (req, res) => {
  const result = await divisionService.getList(req.user, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const result = await divisionService.getById(req.user, req.params.divisionId)

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const args = [data.id, data.idPerusahaan, data.lokasi, data.idManajer]
  const result = await divisionService.create(req.user, args)

  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const args = [req.params.divisionId, data.lokasi]
  const result = await divisionService.update(req.user, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const result = await divisionService.remove(req.user, req.params.divisionId)

  res.status(result.code).send(result)
}

module.exports = { getList, getById, create, update, remove }
