const iResp = require('../../utils/response.interface.js')

const supplyChainService = require('../../services/company/supplyChain.js')

const getList = async (req, res) => {
  const result = await supplyChainService.getList(req.user, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const result = await supplyChainService.getById(req.user, req.params.supplyId)

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const result = await supplyChainService.create(req.user, data)

  res.status(result.code).send(result)
}

const ApproveKementerian = async (req, res) => {
  const data = req.body
  const result = await supplyChainService.ApproveKementerian(req.user, data)
  res.status(result.code).send(result)
}

const ApprovePerusahaan = async (req, res) => {
  const data = req.body
  const result = await supplyChainService.ApprovePerusahaan(req.user, data)
  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const data = req.body
  const args = {
    id: data.id,
    listPerusahaan: data.listPerusahaan,
    status: data.status,
    proposalSupplyChain: data.proposalSupplyChain,
  }
  const result = await supplyChainService.update(req.user, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const result = await supplyChainService.remove(
    req.user,
    req.params.shipmentId
  )

  if (!result.success) {
    res.status(200).send(result)
  }

  res.status(result.code).send(result)
}

module.exports = {
  getList,
  getById,
  create,
  update,
  remove,
  ApproveKementerian,
  ApprovePerusahaan,
}
