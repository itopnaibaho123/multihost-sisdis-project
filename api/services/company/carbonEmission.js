'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')

const getList = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'cecontract',
    user
  )
  const result = await network.contract.submitTransaction('ReadAllCE')
  network.gateway.disconnect()
  return result
}
const getById = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'cecontract',
    user
  )
  const result = await network.contract.submitTransaction('GetCEById', args)
  network.gateway.disconnect()
  return result
}

const create = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'cecontract',
    user
  )
  const result = await network.contract.submitTransaction('CreateCE', ...args)
  network.gateway.disconnect()
  return result
}

const update = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'cecontract',
    user
  )
  const result = await network.contract.submitTransaction('UpdateCE', ...args)
  network.gateway.disconnect()
  return result
}

const remove = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'cecontract',
    user
  )
  const result = await network.contract.submitTransaction('DeleteCE', args)
  network.gateway.disconnect()
  return result
}

module.exports = { getList, getById, create, update, remove }
