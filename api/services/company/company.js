'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')

const getList = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'pecontract',
    user
  )
  const result = await network.contract.submitTransaction('ReadAllPerusahaan')
  network.gateway.disconnect()
  return iResp.buildSuccessResponse(
    200,
    'Successfully get all company',
    JSON.parse(result)
  )
}
const getById = async (user, id) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'pecontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'GetPerusahaanById',
    id
  )
  network.gateway.disconnect()
  return iResp.buildSuccessResponse(
    200,
    `Successfully get company ${id}`,
    JSON.parse(result)
  )
}

const create = async (user, args) => {
  try {
    if (user.idPerusahaan === '') {
      const penetwork = await fabric.connectToNetwork(
        'supplychain',
        'pecontract',
        user.username
      )
      await penetwork.contract.submitTransaction('CreatePerusahaan', ...args)
      penetwork.gateway.disconnect()
      const usernetwork = await fabric.connectToNetwork(
        'supplychain',
        'usercontract',
        user.username
      )

      await usernetwork.contract.submitTransaction(
        'UpdateAdminData',
        ...[user.id, args[0]]
      )
      usernetwork.gateway.disconnect()
      return iResp.buildSuccessResponseWithoutData(
        200,
        'Successfully registered a new company'
      )
    } else {
      return iResp.buildErrorResponse(
        400,
        'This user already has a company',
        null
      )
    }
  } catch (err) {
    return iResp.buildErrorResponse(400, 'Something wrong', err.message)
  }
}

const update = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'pecontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'UpdatePerusahaan',
    ...args
  )
  network.gateway.disconnect()
  return iResp.buildSuccessResponseWithoutData(
    200,
    'Successfully update a company'
  )
}

const remove = async (user, id) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'pecontract',
    user
  )
  await network.contract.submitTransaction('DeletePerusahaan', id)
  network.gateway.disconnect()
  return iResp.buildSuccessResponseWithoutData(
    200,
    'Successfully delete a company'
  )
}

module.exports = { getList, getById, create, update, remove }
