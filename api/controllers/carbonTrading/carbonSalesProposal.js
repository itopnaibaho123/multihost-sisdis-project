const iResp = require('../../utils/response.interface.js')
const { v4: uuidv4 } = require('uuid')
const salesProposalService = require('../../services/carbonTrading/carbonSalesProposal.js')

const getList = async (req, res) => {
  const data = req.body
  const result = await salesProposalService.getList(req.user, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const data = req.body
  const result = await salesProposalService.getById(
    req.user,
    req.params.salesProposalId
  )

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const result = await salesProposalService.create(req.user, data)

  res.status(result.code).send(result)
}
const getAllCspPerusahaan = async (req, res) => {
  const data = req.params.idPerusahaan
  const result = await salesProposalService.getAllCspPerusahaan(req.user, data)
  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const data = req.body

  const result = await salesProposalService.update(req.user, data)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const result = await salesProposalService.remove(
    req.user,
    req.params.salesProposalId
  )

  res.status(result.code).send(result)
}

module.exports = {
  getList,
  getById,
  create,
  update,
  remove,
  getAllCspPerusahaan,
}
