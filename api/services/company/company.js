'use strict'
const iResp = require('../../utils/response.interface.js')

const getList = async () => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'pecontract',
      body.user.username
    )
    const result = await network.contract.submitTransaction('ReadAllPerusahaan')
    network.gateway.disconnect()

    return iResp.buildSuccessResponse(
      200,
      `Successfully get all company`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const getById = async (companyId) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'pecontract',
      body.user.username
    )
    const result = await network.contract.submitTransaction(
      'GetPerusahaanById',
      companyId
    )
    network.gateway.disconnect()

    return iResp.buildSuccessResponse(
      200,
      `Successfully get company ${companyId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const create = async (body) => {
  try {
    args = [body.data]
    const network = await fabric.connectToNetwork(
      'supplychain',
      'pecontract',
      body.user.username
    )
    const result = await network.contract.submitTransaction(
      'CreatePerusahaan',
      args
    )
    network.gateway.disconnect()

    return iResp.buildSuccessResponse(
      201,
      'Successfully  create a company',
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const update = async (companyId, body) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'pecontract',
      body.user.username
    )
    const result = await network.contract.submitTransaction(
      'UpdatePerusahaan',
      companyId,
      [body.data]
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      201,
      `Successfully update company ${companyId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const remove = async (companyId) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'pecontract',
      body.user.username
    )
    const result = await network.contract.submitTransaction(
      'DeletePerusahaan',
      companyId,
      [body.data]
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully delete company ${companyId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

module.exports = { getList, getById, create, update, remove }
