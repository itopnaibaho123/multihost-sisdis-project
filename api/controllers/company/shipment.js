const shipmentService = require('../../services/company/shipment.js')

const getList = async (req, res) => {
  const user = req.user
  const idPerusahaan = !user.idPerusahaan
    ? req.params.idPerusahaan
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

const update = async (req, res) => {
  const args = [
    req.params.shipmentId,
    data.idSupplyChain,
    data.idDivisiPengirim,
    data.idDivisiPenerima,
    data.status,
    data.waktuBerangkat,
    data.waktuSampai,
    data.idTransportasi,
    data.beratMuatan,
    data.emisiKarbonstr,
  ]
  const result = await shipmentService.update(req.user, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const result = await shipmentService.remove(req.user, req.params.shipmentId)

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
  getAllSHByDivisiPengirim,
  getAllSHByVehicle,
  getAllSHByCompany,
}
