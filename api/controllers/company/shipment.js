const shipmentService = require('../../services/company/shipment.js')

const getList = async (req, res) => {
  const user = req.user
  const idPerusahaan = !user.idPerusahaan
    ? req.params.companyId
    : user.idPerusahaan
  const result = await shipmentService.getList(user, idPerusahaan)

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const result = await shipmentService.getById(req.user, req.params.shipmentId)
  res.status(result.code).send(result)
}

const getAllSHByDivisiPengirim = async (req, res) => {
  const result = await shipmentService.getAllSHByDivisiPengirim(
    req.user,
    req.params.idDivisi
  )
  console.log(req.params)
  res.status(result.code).send(result)
}

const getAllSHByDivisiPenerima = async (req, res) => {
  const result = await shipmentService.getAllSHByDivisiPenerima(
    req.user,
    req.params.idDivisi
  )
  res.status(result.code).send(result)
}

const getAllSHByVehicle = async (req, res) => {
  const result = await shipmentService.getAllSHByVehicle(
    req.user,
    req.params.idVehicle
  )
  res.status(result.code).send(result)
}

const getAllSHByCompany = async (req, res) => {
  const result = await shipmentService.GetAllSHByCompany(
    req.user,
    req.params.idPerusahaan
  )
  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const result = await shipmentService.create(req.user, req.body)

  res.status(result.code).send(result)
}

const updateStatus = async (req, res) => {
  const result = await shipmentService.updateStatus(req.user, req.body)

  res.status(result.code).send(result)
}

const complete = async (req, res) => {
  const result = await shipmentService.complete(req.user, req.body)

  res.status(result.code).send(result)
}
const generateIdentifier = async (req, res) => {
  const data = req.params.idShipment
  const result = await shipmentService.generateIdentifier(req.user, data)
  res.status(result.code).send(result)
}

const verify = async (req, res) => {
  const data = req.body

  const identifier = data.identifier

  const result = await shipmentService.verify(req.user, identifier)
  res.status(result.code).send(result)
}

module.exports = {
  getList,
  getById,
  create,
  updateStatus,
  complete,
  getAllSHByDivisiPengirim,
  getAllSHByDivisiPenerima,
  getAllSHByVehicle,
  getAllSHByCompany,
  generateIdentifier,
  verify,
}
