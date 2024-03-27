const iResp = require('../../utils/response.interface.js')

const { v4: uuidv4 } = require('uuid')
const companyService = require('../../services/company/company.js')

const getList = async (req, res) => {
  const result = await companyService.getList(req.user.username, [])
  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const result = await companyService.getById(
    req.user.username,
    req.params.companyId
  )

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const id = uuidv4()
  const args = [
    id,
    data.nomorTelepon,
    data.email,
    data.nama,
    data.lokasi,
    data.deskripsi,
    data.urlSuratProposal,
  ]
  const result = await companyService.create(req.user, args)

  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const data = req.body
  const id = uuidv4()
  const args = [
    id,
    data.nomorTelepon,
    data.email,
    data.nama,
    data.lokasi,
    data.deskripsi,
    data.urlSuratProposal,
    data.approvalStatus,
    data.participantStatus,
    data.kuota,
    data.sisaKuota,
  ]
  const result = await companyService.update(req.user.username, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const result = await companyService.remove(
    req.user.username,
    req.params.companyId
  )

  res.status(result.code).send(result)
}

module.exports = { getList, getById, create, update, remove }
