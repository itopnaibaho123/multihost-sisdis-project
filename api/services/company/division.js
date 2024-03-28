'use strict'

const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')
const getList = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'divcontract',
      user
    )
    const result = await network.contract.submitTransaction('ReadAllDivisi')
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all division',
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const getById = async (user, id) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'divcontract',
      user
    )
    const result = await network.contract.submitTransaction('GetDivisiById', id)
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get division ${id}`,
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
      'divcontract',
      user
    )
    const result = await network.contract.submitTransaction(
      'CreateDivisi',
      ...args
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully registered a new division'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const update = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'divcontract',
      user
    )
    await network.contract.submitTransaction('UpdateDivisi', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a division'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const remove = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'divcontract',
      user
    )
    await network.contract.submitTransaction('DeleteDivisi', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully delete a division'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = { getList, getById, create, update, remove }
