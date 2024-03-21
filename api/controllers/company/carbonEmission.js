const iResp = require('../../utils/response.interface.js')

const carbonEmissionService = require('../../services/company/carbonEmission.js')

const getList = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await carbonEmissionService.getList(username, [])

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
    const result = await carbonEmissionService.getById(
      username,
      req.params.carbonEmissionId
    )

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
    const args = [data.id, data.idPerusahaan, data.totalEmisi]
    const result = await carbonEmissionService.create(username, args)

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
    const args = [req.params.carbonEmissionId, data.totalEmisi]
    const result = await carbonEmissionService.update(username, args)

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
    const result = await carbonEmissionService.remove(
      username,
      req.params.carbonEmissionId
    )

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
