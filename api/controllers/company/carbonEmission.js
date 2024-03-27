const carbonEmissionService = require('../../services/company/carbonEmission.js')

const getList = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await carbonEmissionService.getList(username, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await carbonEmissionService.getById(
    username,
    req.params.carbonEmissionId
  )

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const username = data.username
  const args = [data.id, data.idPerusahaan, data.totalEmisi]
  const result = await carbonEmissionService.create(username, args)

  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const data = req.body
  const username = data.username
  const args = [req.params.carbonEmissionId, data.totalEmisi]
  const result = await carbonEmissionService.update(username, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await carbonEmissionService.remove(
    username,
    req.params.carbonEmissionId
  )

  res.status(result.code).send(result)
}

module.exports = { getList, getById, create, update, remove }
