'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')
const { v4: uuidv4 } = require('uuid')
const { bufferToJson } = require('../../utils/converter.js')

const getList = async (user) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'cspcontract',
      user.username
    )
    const result = await network.contract.submitTransaction('ReadAllCSP')
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all carbon sales proposal',
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
      'cspcontract',
      user.username
    )
    const result = await network.contract.submitTransaction('GetCSPById', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon sales proposal ${id}`,
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
      'cspcontract',
      user.username
    )

    args.id = uuidv4()
    args.idPerusahaan = user.idPerusahaan
    await network.contract.submitTransaction(
      'CreateProposal',
      JSON.stringify(args)
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully registered a new carbon sales proposal'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const getAllCspPerusahaan = async (user, args) => {
  try {
    const idPerusahaan = args
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'cspcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetAllCSPByIdPerusahaan',
      idPerusahaan
    )

    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon Sales Proposal With Company Id: ${idPerusahaan}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const getAllCspByStatus = async (user, args) => {
  try {
    const status = args
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'cspcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetAllCSPByStatus',
      status
    )

    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon Sales Proposal With Status: ${status}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const update = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'cspcontract',
      user.username
    )
    args.idPerusahaan = user.idPerusahaan
    await network.contract.submitTransaction('UpdateCSP', JSON.stringify(args))
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a carbon sales proposal'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const remove = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'cspcontract',
      user.username
    )
    await network.contract.submitTransaction('DeleteCSP', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully delete a carbon sales proposal'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = {
  getList,
  getById,
  create,
  update,
  remove,
  getAllCspPerusahaan,
  getAllCspByStatus,
}
