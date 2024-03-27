const iResp = require('../../utils/response.interface.js')

const carbonTransactionService = require('../../services/carbonTrading/carbonTransaction.js')

const getList = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await carbonTransactionService.getList(username, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await carbonTransactionService.getById(
    username,
    req.params.carbonTransactionId
  )

  res.status(result.code).send(result)
}

const create = async (req, res) => {
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

  res.status(result.code).send(result)
}

const update = async (req, res) => {
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

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const data = req.body
  const username = data.username
  const args = data.companyId
  const result = await carbonTransactionService.remove(
    username,
    req.params.carbonTransactionId
  )

  res.status(result.code).send(result)
}

module.exports = { getList, getById, create, update, remove }
