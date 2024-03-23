'use strict'
const iResp = require('../../../utils/response.interface.js')
const fabric = require('../../../utils/fabric.js')
const getList = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'divcontract',
    user
  )
  const result = await network.contract.submitTransaction('ReadAllDivisi')
  network.gateway.disconnect()
  return result
}
const getById = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'divcontract',
    user
  )
  const result = await network.contract.submitTransaction('GetDivisiById', args)
  network.gateway.disconnect()
  return result
}

const create = async (user, args) => {
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
  return result
}

const update = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'divcontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'UpdateDivisi',
    ...args
  )
  network.gateway.disconnect()
  return result
}

const remove = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'divcontract',
    user
  )
  const result = await network.contract.submitTransaction('DeleteDivisi', args)
  network.gateway.disconnect()
  return result
}

module.exports = { getList, getById, create, update, remove }
