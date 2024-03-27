const iResp = require('../../utils/response.interface.js')

const shipmentService = require('../../services/company/shipment.js')

const getList = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await shipmentService.getList(username, [])

  res.status(result.code).send(result)
}

const getById = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await shipmentService.getById(username, req.params.shipmentId)

  res.status(result.code).send(result)
}

const create = async (req, res) => {
  const data = req.body
  const username = data.username
  const args = [
    data.id,
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
  const result = await shipmentService.create(username, args)

  res.status(result.code).send(result)
}

const update = async (req, res) => {
  const data = req.body
  const username = data.username
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
  const result = await shipmentService.update(username, args)

  res.status(result.code).send(result)
}

const remove = async (req, res) => {
  const data = req.body
  const username = data.username
  const result = await shipmentService.remove(username, req.params.shipmentId)
  console.log(req.params.shipmentId)

  if (!result.success) {
    res.status(200).send(result)
  }

  res.status(result.code).send(result)
}

module.exports = { getList, getById, create, update, remove }
