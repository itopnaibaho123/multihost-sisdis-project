'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')

const getList = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'cspcontract',
    user
  )
  const result = await network.contract.submitTransaction('ReadAllCSP')
  network.gateway.disconnect()
  return result
}
const getById = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'cspcontract',
    user
  )
  const result = await network.contract.submitTransaction('GetCSPById', args)
  network.gateway.disconnect()
  return result
}

const create = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'cspcontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'CreateProposal',
    ...args
  )
  network.gateway.disconnect()
  return result
}

const update = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'cspcontract',
    user
  )
  const result = await network.contract.submitTransaction('UpdateCSP', ...args)
  network.gateway.disconnect()
  return result
}

const remove = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'cspcontract',
    user
  )
  const result = await network.contract.submitTransaction('DeleteCSP', args)
  network.gateway.disconnect()
  return result
}

module.exports = { getList, getById, create, update, remove }
