'use strict'
const iResp = require('../../../utils/response.interface.js')
const { enrollAdmin } = require('../../../services/user.js')

const getList = async () => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully get all ministry admin`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const getById = async (ministryAdminId) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully get ministry admin ${ministryAdminId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const create = async (body) => {
  try {
    const username = body.username
    const password = body.password
    const orgName = body.organizationName

    let result = enrollAdmin(username, password, orgName)
    return iResp.buildSuccessResponse(
      201,
      'Successfully create a ministry admin',
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const update = async (ministryAdminId, body) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      201,
      `Successfully update ministry admin ${ministryAdminId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

const remove = async (ministryAdminId) => {
  try {
    let result = {}
    return iResp.buildSuccessResponse(
      200,
      `Successfully delete ministry admin ${ministryAdminId}`,
      result
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error)
  }
}

module.exports = { getList, getById, create, update, remove }
