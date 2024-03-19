const iResp = require('../../utils/response.interface.js')

const salesProposalService = require('../../services/carbonTrading/carbonSalesProposal.js')

const getList = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await salesProposalService.getList(username, [])

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
    const data = req.body
    const username = data.username
    const cspId = data.companyId
    const result = await salesProposalService.getById(username, cspId)

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
    const data = req.body
    const username = data.username
    const args = [data.id, data.idPerusahaan, data.kuotaYangDijual, data.status]
    const result = await salesProposalService.create(username)

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
    const data = req.body
    const username = data.username
    const args = [data.id, data.idPerusahaan, data.kuotaYangDijual, data.status]
    const result = await salesProposalService.update(username, args)

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
    const data = req.body
    const username = data.username
    const args = data.companyId
    const result = await salesProposalService.remove(username, args)

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
