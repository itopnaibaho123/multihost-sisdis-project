'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')
const { bufferToJson } = require('../../utils/converter.js')

const getList = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'cecontract',
      user.username
    )
    const result = await network.contract.submitTransaction('ReadAllCE')
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all carbon emissions',
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const GetCEByCompany = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'cecontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetCEByPerusahaan',
      args
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all carbon emissions',
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
      'cecontract',
      user.username
    )
    const result = await network.contract.submitTransaction('GetCEById', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon emission ${id}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const create = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'cecontract',
      user.username
    )
    await network.contract.submitTransaction('CreateCE', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully registered a new carbon emission'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const update = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'cecontract',
      user.username
    )
    await network.contract.submitTransaction('UpdateCE', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a carbon emission'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const remove = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'cecontract',
      user.username
    )
    await network.contract.submitTransaction('DeleteCE', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully delete a carbon emission'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = { getList, getById, create, update, remove, GetCEByCompany }
