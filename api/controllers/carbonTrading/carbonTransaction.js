const iResp = require('../../utils/response.interface.js')

const carbonTransactionService = require('../../services/carbonTrading/carbonTransaction.js')
const { v4: uuidv4 } = require('uuid')
const getList = async (req, res) => {
  const result = await carbonTransactionService.getList(req.user, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const result = await carbonTransactionService.getById(
    req.user,
    req.params.carbonTransactionId
  )

  res.status(result.code).send(result)
}

const getCarbonTransactionByIdProposal = async (req, res) => {
  const data = req.params.idProposal
  const result =
    await carbonTransactionService.getCarbonTransactionByIdProposal(
      req.user,
      data
    )
  res.status(result.code).send(result)
}

const getCarbonTransactionByIdPerusahaan = async (req, res) => {
  const data = req.params.idPerusahaan
  const result =
    await carbonTransactionService.getCarbonTransactionByIdPerusahaan(
      req.user,
      data
    )
  res.status(result.code).send(result)
}

const verifikasiTransferKarbon = async (req, res) => {
  const data = req.body
  const result = await carbonTransactionService.verifikasiTransferKarbon(
    req.user,
    data
  )
  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const args = [
    uuidv4(),
    data.idPerusahaanPembeli,
    data.idProposalPenjual,
    data.kuota,
    data.status,
    data.urlBuktiTransaksi,
  ]
  const result = await carbonTransactionService.create(req.user, args)

  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const data = req.body
  const args = [
    req.params.carbonTransactionId,
    data.idPerusahaanPembeli,
    data.idPerusahaanPenjual,
    data.kuota,
    data.status,
    data.urlBuktiTransfer,
  ]
  const result = await carbonTransactionService.update(req.user, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const result = await carbonTransactionService.remove(
    req.user,
    req.params.carbonTransactionId
  )

  res.status(result.code).send(result)
}

module.exports = {
  getList,
  getById,
  create,
  update,
  remove,
  getCarbonTransactionByIdProposal,
  getCarbonTransactionByIdPerusahaan,
  verifikasiTransferKarbon,
}
