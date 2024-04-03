'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric')
const { v4: uuidv4 } = require('uuid')
const { bufferToJson } = require('../../utils/converter.js')

const getList = async (user, idDivisi) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'vecontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetVehiclesByDivisi',
      idDivisi
    )
    console.log(result)
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all vehicle',
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getById = async (user, id) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'vecontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetVehicleById',
      id
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get vehicle ${id}`,
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
      user.idDivisi,
      data.carModel,
      data.fuelType,
      data.kmUsage,
    ]
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'vecontract',
      user.username
    )
    await network.contract.submitTransaction('CreateVehicle', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      201,
      'Successfully registered a new vehicle'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const update = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'vecontract',
      user.username
    )
    await network.contract.submitTransaction('UpdateVehicle', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      201,
      'Successfully update a vehicle'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const remove = async (user, id) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'vecontract',
      user.username
    )
    await network.contract.submitTransaction('DeleteVehicle', id)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully delete a vehicle'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = { getList, getById, create, update, remove }
