const iResp = require('../../utils/response.interface.js')

const scProcessService = require('../../services/supplyChainProcess/supplyChain.js')

const getList = async (req, res) => {
  try {
    const result = await scProcessService.getList()

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
    console.log(req.params.scProcessId)
    const result = await scProcessService.getById(req.params.scProcessId)

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
    const result = await scProcessService.create(req.body)

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
    console.log(req.params.scProcessId, req.body)
    const result = await scProcessService.update(
      req.params.scProcessId,
      req.body
    )

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
    const result = await scProcessService.remove(req.params.scProcessId)
    console.log(req.params.scProcessId)

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
