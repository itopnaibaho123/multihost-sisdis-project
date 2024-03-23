const iResp = require('../../utils/response.interface.js')

const shipmentService = require('../../services/company/shipment.js')

const getList = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await shipmentService.getList(username, [])

    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const getById = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await shipmentService.getById(
      username,
      req.params.shipmentId
    )

    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const create = async (req, res) => {
  try {
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

    res.status(201).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const update = async (req, res) => {
  try {
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

    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const remove = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await shipmentService.remove(username, req.params.shipmentId)
    console.log(req.params.shipmentId)

    if (!result.success) {
      res.status(200).send(result)
    }

    res.status(result.code).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

module.exports = { getList, getById, create, update, remove }
