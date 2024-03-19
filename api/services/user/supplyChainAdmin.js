'use strict'
const iResp = require('../../utils/response.interface.js')

const getList = async () => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully get all supply chain admin`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const getById = async (scAdminId) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully get supply chain admin ${scAdminId}`,
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
      'Successfully  create a supply chain admin',
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const update = async (scAdminId, body) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      201,
      `Successfully update supply chain admin ${scAdminId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const remove = async (scAdminId) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully delete supply chain admin ${scAdminId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

module.exports = { getList, getById, create, update, remove }
