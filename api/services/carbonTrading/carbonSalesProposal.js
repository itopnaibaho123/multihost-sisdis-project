'use strict'
const iResp = require('../../utils/response.interface.js')

const getList = async () => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully get all carbon sales proposal`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const getById = async (salesProposalId) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon sales proposal ${salesProposalId}`,
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
      'Successfully  create a carbon sales proposal',
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const update = async (salesProposalId, body) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      201,
      `Successfully update carbon sales proposal ${salesProposalId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const remove = async (salesProposalId) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully delete carbon sales proposal ${salesProposalId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

module.exports = { getList, getById, create, update, remove }
