const vehicleService = require('../../services/company/vehicle.js')

const getList = async (req, res) => {
  const user = req.user
  const idDivisi = user.idDivisi == '' ? req.params.divisionId : user.idDivisi
  const result = await vehicleService.getList(user, idDivisi)

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const result = await vehicleService.getById(req.user, req.params.vehicleId)

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const result = await vehicleService.create(req.user, data)

  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const args = [
    req.params.vehicleId,
    data.carModel,
    data.fuelType,
    data.kmUsage,
  ]
  const result = await vehicleService.update(req.user, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const result = await vehicleService.remove(req.user, req.params.vehicleId)

  res.status(result.code).send(result)
}

module.exports = { getList, getById, create, update, remove }
