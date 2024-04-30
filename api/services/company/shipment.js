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
const getById = async (user, shipmentId) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetShipmentById',
      shipmentId
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${shipmentId}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getAllSHByDivisiPengirim = async (user, data) => {
  try {
    const idDivisi = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetAllSHByDivisiPengirim',
      idDivisi
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${idDivisi}`,
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const getAllSHByDivisiPenerima = async (user, data) => {
  try {
    const idDivisi = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetAllSHByDivisiPenerima',
      idDivisi
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${idDivisi}`,
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getAllSHByVehicle = async (user, data) => {
  try {
    const idVehicle = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetAllSHByVehicle',
      idVehicle
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${idVehicle}`,
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const GetAllSHByCompany = async (user, data) => {
  try {
    const idPerusahaan = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetAllSHByCompany',
      idPerusahaan
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${idPerusahaan}`,
      bufferToJson(result)
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

const updateStatus = async (user, data) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const args = [data.id, data.status]
    await network.contract.submitTransaction('UpdateStatusShipment', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a shipment'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const complete = async (user, data) => {
  try {
    // Get the Car
    const veNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'vecontract',
      user.username
    )
    const vehicle = await veNetwork.contract.evaluateTransaction(
      'GetVehicleById',
      data.idVehicle
    )
    veNetwork.gateway.disconnect()

    // Calculate the carbon emission
    const distance = data.distance // km
    const fuelType = vehicle.fuelType // petrol | diesel

    let fuelEfficiency = 0 // liter / km
    let emissionFactor = 0 // kgCO2e/liter
    if (fuelType == 'petrol') {
      fuelEfficiency = 20
      emissionFactor = 3.1455
    } else {
      fuelEfficiency = 34
      emissionFactor = 3.5117
    }

    const carbon = (fuelEfficiency / 100) * distance * emissionFactor

    // Complete the shipment
    const shNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const shArgs = [data.id, carbon]
    await shNetwork.contract.submitTransaction('CompleteShipment', ...shArgs)
    shNetwork.gateway.disconnect()

    // Create the carbon emission object
    const ceNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'cecontract',
      user.username
    )
    const ceArgs = [uuidv4(), user.idPerusahaan, carbon, data.id]
    await shNetwork.contract.submitTransaction('CreateCE', ...ceArgs)

    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully complete a shipment'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
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
  GetAllSHByCompany,
}
