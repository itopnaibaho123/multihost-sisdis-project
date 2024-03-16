'use strict'
const iResp = require('../../utils/response.interface.js')

const getList = async () => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully get all shipment`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const getById = async (shipmentId) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${shipmentId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const create = async (body) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      201,
      'Successfully  create a shipment',
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const update = async (shipmentId, body) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      201,
      `Successfully update shipment ${shipmentId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const remove = async (shipmentId) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully delete shipment ${shipmentId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

module.exports = { getList, getById, create, update, remove }
