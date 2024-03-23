'use strict'
const iResp = require('../../../utils/response.interface.js')
const fabric = require('../../../utils/fabric.js')

const getList = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'pecontract',
    user
  )
  const result = await network.contract.submitTransaction('ReadAllPerusahaan')
  network.gateway.disconnect()
  return result
}
const getById = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'pecontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'GetPerusahaanById',
    args
  )
  network.gateway.disconnect()
  return result
}

const create = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'pecontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'CreatePerusahaan',
    ...args
  )
  network.gateway.disconnect()
  return result
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
  return result
}

const remove = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'pecontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'DeletePerusahaan',
    args
  )
  network.gateway.disconnect()
  return result
}

module.exports = { getList, getById, create, update, remove }
