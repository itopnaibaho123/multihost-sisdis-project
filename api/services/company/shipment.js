'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')

const { v4: uuidv4 } = require('uuid')
const { bufferToJson } = require('../../utils/converter.js')

const getList = async (user, idPerusahaan) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetShipmentsByPerusahaan',
      idPerusahaan
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all shipment',
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const getById = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetShipmentById',
      args
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${id}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const create = async (user, data) => {
  try {
    const args = [
      uuidv4(),
      user.idPerusahaan,
      data.idSupplyChain,
      user.idDivisi,
      data.idDivisiPenerima,
      data.waktuBerangkat,
      data.idTransportasi,
      data.beratMuatan,
    ]
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    await network.contract.submitTransaction('CreateShipment', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully registered a new shipment'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const update = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    await network.contract.submitTransaction('UpdateShipment', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a shipment'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const remove = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    await network.contract.submitTransaction('DeleteShipment', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully delete a shipment'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = { getList, getById, create, update, remove }
