'use strict'
const iResp = require('../../utils/response.interface.js')

const getList = async () => {
  try {
    let result = {}
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
    let result = {}
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
    let result = {}
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
    let result = {}
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
    let result = {}
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
