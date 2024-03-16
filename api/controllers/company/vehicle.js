const iResp = require('../../utils/response.interface.js')

const vehicleService = require('../../services/company/vehicle.js')

const getList = async (req, res) => {
  try {
    const result = await vehicleService.getList()

    if (!result.success) {
      res.status(result.code).send(result)
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
    console.log(req.params.vehicleId)
    const result = await vehicleService.getById(req.params.vehicleId)

    if (!result.success) {
      res.status(result.code).send(result)
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
    console.log(req.body)
    const result = await vehicleService.create(req.body)

    if (!result.success) {
      res.status(result.code).send(result)
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
    console.log(req.params.vehicleId, req.body)
    const result = await vehicleService.update(req.params.vehicleId, req.body)

    if (!result.success) {
      res.status(result.code).send(result)
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
    const result = await vehicleService.remove(req.params.vehicleId)
    console.log(req.params.vehicleId)

    if (!result.success) {
      res.status(result.code).send(result)
    }

    res.status(result.code).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

module.exports = { getList, getById, create, update, remove }
