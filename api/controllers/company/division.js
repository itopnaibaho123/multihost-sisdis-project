const divisionService = require('../../services/company/division.js')

const getList = async (req, res) => {
  const user = req.user
  const idPerusahaan = !user.idPerusahaan
    ? req.params.idPerusahaan
    : user.idPerusahaan
  const result = await divisionService.getList(user, idPerusahaan)

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const result = await divisionService.getById(req.user, req.params.divisionId)

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  data = req.body
  const result = await divisionService.create(req.user, data)

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
