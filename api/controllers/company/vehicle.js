const iResp = require('../../utils/response.interface.js')

const vehicleService = require('../../services/company/vehicle.js')

const getList = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await vehicleService.getList(username, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await vehicleService.getById(username, req.params.vehicleId)

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const username = data.username
  const args = [
    data.id,
    data.idDivisi,
    data.carModel,
    data.fuelType,
    data.kmUsage,
  ]
  const result = await vehicleService.create(username, args)

  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const data = req.body
  const username = data.username
  const args = [
    req.params.vehicleId,
    data.carModel,
    data.fuelType,
    data.kmUsage,
  ]
  const result = await vehicleService.update(username, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await vehicleService.remove(username, req.params.vehicleId)

  res.status(result.code).send(result)
}

module.exports = { getList, getById, create, update, remove }
