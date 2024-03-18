'use strict'

const fabric = require('../utils/fabric.js')

const query = async (user, args) => {
  const network = await fabric.connectToNetwork('Kementrian', 'basic', user)
  const result = await network.contract.submitTransaction(
    'GetAllAssets',
    ...args
  )
  network.gateway.disconnect()
  return result
}

module.exports = { query }
