'use strict'
const iResp = require('../../../utils/response.interface.js')
const fabric = require('../../../utils/fabric.js')

const getList = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'shcontract',
    user
  )
  const result = await network.contract.submitTransaction('ReadAllShipment')
  network.gateway.disconnect()
  return result
}
const getById = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'shcontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'GetShipmentById',
    args
  )
  network.gateway.disconnect()
  return result
}

const create = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'shcontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'CreateShipment',
    ...args
  )
  network.gateway.disconnect()
  return result
}

const update = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'shcontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'UpdateShipment',
    ...args
  )
  network.gateway.disconnect()
  return result
}

const remove = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'shcontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'DeleteShipment',
    args
  )
  network.gateway.disconnect()
  return result
}

module.exports = { getList, getById, create, update, remove }
