const iResp = require('../../utils/response.interface.js')

const carbonTransactionService = require('../../services/carbonTrading/carbonTransaction.js')

const getList = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await carbonTransactionService.getList(username, [])

    res.status(200).send(result)
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
    const result = await carbonTransactionService.getById(
      username,
      req.params.carbonTransactionId
    )

    res.status(200).send(result)
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
      data.idPerusahaanPembeli,
      data.idPerusahaanPenjual,
      data.kuota,
      data.status,
      data.urlBuktiTransfer,
    ]
    const result = await carbonTransactionService.create(username, args)

    res.status(201).send(result)
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
      req.params.carbonTransactionId,
      data.idPerusahaanPembeli,
      data.idPerusahaanPenjual,
      data.kuota,
      data.status,
      data.urlBuktiTransfer,
    ]
    const result = await carbonTransactionService.update(username, args)

    res.status(200).send(result)
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
    const result = await carbonTransactionService.remove(
      username,
      req.params.carbonTransactionId
    )

    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

module.exports = { getList, getById, create, update, remove }
