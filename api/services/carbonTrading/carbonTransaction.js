'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')
const getList = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'ctcontract',
    user
  )
  const result = await network.contract.submitTransaction('ReadAllCT')
  network.gateway.disconnect()
  return result
}
const getById = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'ctcontract',
    user
  )
  const result = await network.contract.submitTransaction('GetCTById', args)
  network.gateway.disconnect()
  return result
}

const create = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'ctcontract',
    user
  )
  const result = await network.contract.submitTransaction('CreateCT', ...args)
  network.gateway.disconnect()
  return result
}

const update = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'ctcontract',
    user
  )
  const result = await network.contract.submitTransaction('UpdateCT', ...args)
  network.gateway.disconnect()
  return result
}

const remove = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'ctcontract',
    user
  )
  const result = await network.contract.submitTransaction('DeleteCT', args)
  network.gateway.disconnect()
  return result
}

module.exports = { getList, getById, create, update, remove }
