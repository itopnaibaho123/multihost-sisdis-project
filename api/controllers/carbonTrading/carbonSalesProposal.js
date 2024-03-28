const iResp = require('../../utils/response.interface.js')

const salesProposalService = require('../../services/carbonTrading/carbonSalesProposal.js')

const getList = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await salesProposalService.getList(username, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await salesProposalService.getById(
    username,
    req.params.salesProposalId
  )

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const username = data.username
  const args = [data.id, data.idPerusahaan, data.kuotaYangDijual, data.status]
  const result = await salesProposalService.create(username, args)

  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const data = req.body
  const username = data.username
  const args = [
    req.params.salesProposalId,
    data.idPerusahaan,
    data.kuotaYangDijual,
    data.status,
  ]
  const result = await salesProposalService.update(username, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await salesProposalService.remove(
    username,
    req.params.salesProposalId
  )

  res.status(result.code).send(result)
}

module.exports = { getList, getById, create, update, remove }
