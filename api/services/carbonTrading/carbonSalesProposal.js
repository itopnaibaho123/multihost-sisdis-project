'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')

const getList = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'cspcontract',
      user
    )
    const result = await network.contract.submitTransaction('ReadAllCSP')
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all carbon sales proposal',
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const getById = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'cspcontract',
      user
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
      'supplychain',
      'cspcontract',
      user
    )
    await network.contract.submitTransaction('CreateProposal', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully registered a new carbon sales proposal'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const update = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'cspcontract',
      user
    )
    await network.contract.submitTransaction('UpdateCSP', ...args)
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
      'supplychain',
      'cspcontract',
      user
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

module.exports = { getList, getById, create, update, remove }
