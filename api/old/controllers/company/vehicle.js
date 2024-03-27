const iResp = require('../../utils/response.interface.js')

const vehicleService = require('../../../services/company/company/vehicle.js')

const getList = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await vehicleService.getList(username, [])
    if (!result.success) {
      res.status(200).send(result)
    }

    res.status(result.code).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const getById = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await vehicleService.getById(username, req.params.vehicleId)

    if (!result.success) {
      res.status(200).send(result)
    }

    res.status(result.code).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const create = async (req, res) => {
  try {
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

    if (!result.success) {
      res.status(200).send(result)
    }

    res.status(result.code).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const update = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const args = [
      req.params.vehicleId,
      data.carModel,
      data.fuelType,
      data.kmUsage,
    ]
    const result = await vehicleService.update(username, args)

    if (!result.success) {
      res.status(200).send(result)
    }

    res.status(result.code).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const remove = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await vehicleService.remove(username, req.params.vehicleId)

    if (!result.success) {
      res.status(200).send(result)
    }

    res.status(result.code).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

module.exports = { getList, getById, create, update, remove }
