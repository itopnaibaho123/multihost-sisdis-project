'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')
const { v4: uuidv4 } = require('uuid')

const getList = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'sccontract',
      user.username
    )
    const result = await network.contract.submitTransaction('ReadAllSC')
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all shipment',
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const getById = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'sccontract',
      user.username
    )
    const result = await network.contract.submitTransaction('GetSCById', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get shipment ${id}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const create = async (user, data) => {
  try {
    const args = {
      id: uuidv4(),
      listPerusahaan: data.listPerusahaan,
      status: 'pending',
      proposalSupplyChain: [],
    }
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'sccontract',
      user.username
    )
    await network.contract.submitTransaction(
      'CreateSupplyChainInitial',
      ...args
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully Proposed SupplyChain'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const ApproveKementerian = async (user, data) => {
  try {
    const proposalSupplyChain = []

    if (data.status === 'Menunggu Persetujuan Perusahaan') {
      data.listPerusahaan.forEach(function (item, index) {
        const tempData = {
          IdPerusahaan: item,
          status: 'pending',
        }
        proposalSupplyChain.push(tempData)
      })
    }

    const args = {
      id: data.id,
      listPerusahaan: data.listPerusahaan,
      status: data.status,
      proposalSupplyChain: proposalSupplyChain,
    }
    const network1 = await fabric.connectToNetwork(
      user.organizationName,
      'sccontract',
      user.username
    )
    await network1.contract.submitTransaction('UpdateSC', ...args)
    network1.gateway.disconnect()

    if (data.status === 'Menunggu Persetujuan Perusahaan') {
      const network2 = await fabric.connectToNetwork(
        user.organizationName,
        'pecontract',
        user.username
      )
      for (var i = 0; i < data.listPerusahaan.length; i++) {
        await network2.contract.submitTransaction('AddSupplyChaintoArray', [
          data.listPerusahaan[i],
          data.id,
        ])
      }
      network2.gateway.disconnect()

      return iResp.buildSuccessResponseWithoutData(
        200,
        'Successfully Approve The SupplyChain'
      )
    } else if (data.status === 'reject') {
      return iResp.buildSuccessResponseWithoutData(
        200,
        'Successfully Reject The SupplyChain'
      )
    }
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const ApprovePerusahaan = async (user, data) => {
  try {
    // idSupplyChain
    // idPerusahaan
    // Status
    const network1 = await fabric.connectToNetwork(
      user.organizationName,
      'sccontract',
      user.username
    )
    const supplyChain = JSON.parse(
      await network1.contract.submitTransaction(
        'getSCStateById',
        data.idSupplyChain
      )
    )
    let objProposal = supplyChain.proposalSupplyChain.findIndex(
      (obj) => obj.id == data.IdPerusahaan
    )
    supplyChain.proposalSupplyChain[objProposal].status = data.status

    if (data.status === 'reject') {
      supplyChain.status = 'reject'
      await network1.contract.submitTransaction('UpdateCSP', supplyChain)
      const network2 = await fabric.connectToNetwork(
        user.organizationName,
        'pecontract',
        user.username
      )
      for (var i = 0; i < supplyChain.proposalSupplyChain.length; i++) {
        await network2.contract.submitTransaction(
          'DeleteSupplyChainfromArray',
          [supplyChain.proposalSupplyChain[i].id, supplyChain.id]
        )
      }
      network1.gateway.disconnect()
      network2.gateway.disconnect()
      return iResp.buildSuccessResponseWithoutData(
        200,
        'Successfully Reject The SupplyChain'
      )
    } else if (data.status === 'approve') {
      const count = 0
      for (var i = 0; i > supplyChain.proposalSupplyChain.length; i++) {
        if (supplyChain.proposalSupplyChain[i].status === 'approve') {
          count++
        }
      }
      if (count === supplyChain.proposalSupplyChain.length) {
        supplyChain.status = 'approve'
      }
      await network1.contract.submitTransaction('UpdateSC', supplyChain)
      network1.gateway.disconnect()
      return iResp.buildSuccessResponseWithoutData(
        200,
        'Successfully Approve The SupplyChain'
      )
    }
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully Approve The SupplyChain'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}
const update = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'sccontract',
      user.username
    )
    await network.contract.submitTransaction('UpdateSC', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a shipment'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const remove = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'sccontract',
      user.username
    )
    await network.contract.submitTransaction('DeleteSC', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully delete a shipment'
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
  ApproveKementerian,
  ApprovePerusahaan,
}
