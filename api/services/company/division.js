'use strict'

const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')
const { v4: uuidv4 } = require('uuid')
const { bufferToJson } = require('../../utils/converter.js')

const getList = async (user, idPerusahaan) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'divcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'ReadAllDivisiByPerusahaan',
      idPerusahaan
    )
    network.gateway.disconnect()

    return iResp.buildSuccessResponse(
      200,
      'Successfully get all division',
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getListBySupplyChain = async (user, idSupplyChain) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'sccontract',
      user.username
    )
    const supplyChainResponse = await network.contract.submitTransaction(
      'GetSCById',
      idSupplyChain
    )
    network.gateway.disconnect()
    const divisiNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'divcontract',
      user.username
    )
    const divSupplyChain = []

    const supplyChain = JSON.parse(supplyChainResponse)
    for (var i = 0; i < supplyChain.listPerusahaan.length; i++) {
      const result = await divisiNetwork.contract.submitTransaction(
        'ReadAllDivisiByPerusahaan',
        supplyChain.listPerusahaan[i]
      )
      divSupplyChain.push(...bufferToJson(result))
    }
    divisiNetwork.gateway.disconnect()

    return iResp.buildSuccessResponse(
      200,
      'Successfully get all division',
      divSupplyChain
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const getById = async (user, id) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'divcontract',
      user.username
    )
    const result = await network.contract.submitTransaction('GetDivisiById', id)
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get division ${id}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const create = async (user, data) => {
  try {
    const idDivisi = uuidv4()
    const args = [
      idDivisi,
      data.name,
      user.idPerusahaan,
      data.lat,
      data.long,
      data.lokasi,
      data.idManajer,
    ]
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'divcontract',
      user.username
    )

    await network.contract.submitTransaction('CreateDivisi', ...args)
    network.gateway.disconnect()

    // update data manager
    const network2 = await fabric.connectToNetwork(
      user.organizationName,
      'usercontract',
      user.username
    )
    await network2.contract.submitTransaction(
      'UpdateManagerData',
      ...[data.idManajer, user.idPerusahaan, idDivisi, '']
    )
    network2.gateway.disconnect()

    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully registered a new division'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const update = async (user, id, data) => {
  try {
    const args = [id, data.name, data.lokasi, data.lat, data.long]
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'divcontract',
      user.username
    )
    await network.contract.submitTransaction('UpdateDivisi', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a division'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const remove = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'divcontract',
      user.username
    )
    await network.contract.submitTransaction('DeleteDivisi', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully delete a division'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = {
  getList,
  getById,
  create,
  update,
  remove,
  getListBySupplyChain,
}
