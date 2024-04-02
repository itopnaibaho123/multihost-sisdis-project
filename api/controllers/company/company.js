const companyService = require('../../services/company/company.js')

const getList = async (req, res) => {
  const result = await companyService.getList(req.user, [])
  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const result = await companyService.getById(req.user, req.params.companyId)

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const result = await companyService.create(data)

  res.status(result.code).send(result)
}

const approve = async (req, res) => {
  const id = req.params.companyId
  const result = await companyService.approve(req.user, id)

  res.status(result.code).send(result)
}

const reject = async (req, res) => {
  const id = req.params.companyId
  const result = await companyService.approve(req.user, id)

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

module.exports = { getList, getById, create, update, approve, reject }
