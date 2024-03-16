'use strict'
const iResp = require('../../utils/response.interface.js')

const getList = async () => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully get all carbonEmission`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const getById = async (carbonEmissionId) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbonEmission ${carbonEmissionId}`,
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
      'Successfully  create a carbonEmission',
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const update = async (carbonEmissionId, body) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      201,
      `Successfully update carbonEmission ${carbonEmissionId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const remove = async (carbonEmissionId) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully delete carbonEmission ${carbonEmissionId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

module.exports = { getList, getById, create, update, remove }
