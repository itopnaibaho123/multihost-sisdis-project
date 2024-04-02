'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')
const getList = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const result = await network.contract.submitTransaction('ReadAllCT')
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all carbon transaction',
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
      'ctcontract',
      user.username
    )
    const result = await network.contract.submitTransaction('GetCTById', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon transaction ${id}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getCarbonTransactionByIdPerusahaan = async (user, data) => {
  try {
    const idPerusahaan = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'getCTbyIdPerusahaan',
      idPerusahaan
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon transaction By Perusahaan ID: ${idPerusahaan}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getCarbonTransactionByIdProposal = async (user, data) => {
  try {
    const idProposal = data
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'getCTbyIdProposal',
      idProposal
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get carbon transaction ${idProposal}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

//
const verifikasiTransferKarbon = async (user, data) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const carbonTransaction = JSON.parse(
      await network.contract.submitTransaction('GetCTById', data.id)
    )
    if (data.status === 'reject') {
      carbonTransaction.status = 'reject'
      const updateArgs = [
        carbonTransaction.id,
        carbonTransaction.idPerusahaanPembeli,
        carbonTransaction.idProposalPenjual,
        carbonTransaction.kuota,
        carbonTransaction.status,
        carbonTransaction.urlBuktiTransaksi,
      ]
      await network.contract.submitTransaction('UpdateCT', updateArgs)
      network.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        `Successfully Update carbon transaction ${id}`,
        JSON.parse(result)
      )
    } else if (data.status === 'approve') {
      carbonTransaction.status = 'approve'
      const updateArgs = [
        carbonTransaction.id,
        carbonTransaction.idPerusahaanPembeli,
        carbonTransaction.idProposalPenjual,
        carbonTransaction.kuota,
        carbonTransaction.status,
        carbonTransaction.urlBuktiTransaksi,
      ]
      await network.contract.submitTransaction('UpdateCT', updateArgs)
      const network2 = await fabric.connectToNetwork(
        user.organizationName,
        'pecontract',
        user
      )
      const network3 = await fabric.connectToNetwork(
        user.organizationName,
        'cspcontract',
        user
      )

      const carbonSalesProposal = JSON.parse(
        await network3.contract.submitTransaction(
          'GetCSPById',
          carbonTransaction.idProposalPenjual
        )
      )
      carbonSalesProposal.kuotaYangDijual =
        carbonSalesProposal.kuotaYangDijual - carbonTransaction.kuota
      updateArgs = [
        carbonTransaction.idPerusahaanPembeli,
        carbonSalesProposal.idPerusahaan,
        carbonTransaction.kuota,
      ]
      await network2.contract.submitTransaction('UpdateSisaKuota', updateArgs)
      updateArgs = [
        carbonSalesProposal.id,
        carbonSalesProposal.idPerusahaan,
        carbonSalesProposal.kuotaYangDijual,
        carbonSalesProposal.status,
      ]
      if (carbonSalesProposal.kuotaYangDijual <= 0) {
        carbonSalesProposal.status = 'Sudah Habis'
      }
      await network3.contract.submitTransaction('UpdateCSP', updateArgs)
      network.gateway.disconnect()
      network2.gateway.disconnect()
      network3.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        `Successfully Update carbon transaction ${id}`,
        JSON.parse(result)
      )
    }
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const create = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    await network.contract.submitTransaction('CreateCT', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully registered a new carbon transaction'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const update = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    await network.contract.submitTransaction('UpdateCT', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a carbon transaction'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const remove = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    await network.contract.submitTransaction('DeleteCT', args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully delete a carbon transaction'
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
  getCarbonTransactionByIdPerusahaan,
  getCarbonTransactionByIdProposal,
  verifikasiTransferKarbon,
}
