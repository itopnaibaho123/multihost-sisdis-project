const iResp = require('../../utils/response.interface.js')

const scStaffService = require('../../services/user/supplyChainStaff.js')

const getList = async (req, res) => {
  try {
    const result = await scStaffService.getList()

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
    console.log(req.params.scStaffId)
    const result = await scStaffService.getById(req.params.scStaffId)

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
    const result = await scStaffService.create(req.body)

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
    console.log(req.params.scStaffId, req.body)
    const result = await scStaffService.update(req.params.scStaffId, req.body)

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
    const result = await scStaffService.remove(req.params.scStaffId)
    console.log(req.params.scStaffId)

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
