'use strict'
const iResp = require('../../../utils/response.interface.js')
const fabric = require('../../../utils/fabric.js')
const getList = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'vecontract',
    user
  )
  const result = await network.contract.submitTransaction('ReadAllVehicle')
  network.gateway.disconnect()
  return result
}
const getById = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'vecontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'GetVehicleById',
    args
  )
  network.gateway.disconnect()
  return result
}

const create = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'vecontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'CreateVehicle',
    ...args
  )
  network.gateway.disconnect()
  return result
}

const update = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'vecontract',
    user
  )
  const result = await network.contract.submitTransaction(
    'UpdateVehicle',
    ...args
  )
  network.gateway.disconnect()
  return result
}

const remove = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'supplychain',
    'vecontract',
    user
  )
  const result = await network.contract.submitTransaction('DeleteVehicle', args)
  network.gateway.disconnect()
  return result
}

module.exports = { getList, getById, create, update, remove }
