const carbonEmissionService = require('../../services/company/carbonEmission.js')

const getList = async (req, res) => {
  const result = await carbonEmissionService.getList(req.user, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const result = await carbonEmissionService.getById(
    req.user,
    req.params.carbonEmissionId
  )

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const args = [data.id, data.idPerusahaan, data.totalEmisi]
  const result = await carbonEmissionService.create(req.user, args)

  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const args = [req.params.carbonEmissionId, data.totalEmisi]
  const result = await carbonEmissionService.update(req.user, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const result = await carbonEmissionService.remove(
    req.user,
    req.params.carbonEmissionId
  )

  res.status(result.code).send(result)
}

module.exports = { getList, getById, create, update, remove }
