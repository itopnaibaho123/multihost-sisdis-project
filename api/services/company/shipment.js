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
    const shArgs = [data.id, carbon, data.idApprover]
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
const generateIdentifier = async (user, idShipment) => {
  try {
    var network = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const shipment = JSON.parse(
      await network.contract.evaluateTransaction('GetShipmentById', idShipment)
    )

    network.gateway.disconnect()
    if (shipment.status === 'Completed') {
      const identifier = {}
      network = await fabric.connectToNetwork('Kementrian', 'qscc', 'admin')

      const blockShipment = await network.contract.evaluateTransaction(
        'GetBlockByTxID',
        'carbonchannel',
        shipment.TxId
      )

      identifier.shipment = fabric.calculateBlockHash(
        BlockDecoder.decode(blockShipment).header
      )
      network.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        'Successfully get Shipment',
        identifier
      )
    } else {
      throw 'Shipment Not Completed'
    }
  } catch (error) {
    return iResp.buildErrorResponse(500, 'something wrong', error.message)
  }
}

const verify = async (user, identifier) => {
  try {
    // find block that block hash == identifier
    const network = await fabric.connectToNetwork('Kementrian', 'qscc', 'admin')
    const blockCarbonTransaction = await network.contract.evaluateTransaction(
      'GetBlockByHash',
      'carbonchannel',
      Buffer.from(identifier.shipment, 'hex')
    )

    // Get data from block
    const argsSh = BlockDecoder.decode(blockCarbonTransaction).data.data[0]
      .payload.data.actions[0].payload.chaincode_proposal_payload.input
      .chaincode_spec.input.args
    const idSh = Buffer.from(argsSh[1]).toString()

    console.log('ID Shipment: ', idSh)
    //query data ijazah, transkrip, nilai
    network.gateway.disconnect()

    const shNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'shcontract',
      user.username
    )
    const sh = await shNetwork.contract.evaluateTransaction(
      'GetShipmentById',
      idSh
    )
    shNetwork.gateway.disconnect()
    const parseData = JSON.parse(sh)

    parseData.signature = await fabric.getSignature(parseData.TxId)
    console.log(parseData)
    const data = {
      shipment: parseData,
    }

    const result = {
      success: true,
      message: 'Shipment Trusted',
      data: data,
    }
    return iResp.buildSuccessResponse(200, 'Successfully get Shipment', result)
  } catch (error) {
    console.log('ERROR', error)
    const result = {
      success: true,
      message: 'Shipment Fake',
    }
    return iResp.buildErrorResponse(500, 'Something wrong', result)
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
  generateIdentifier,
  verify,
}
