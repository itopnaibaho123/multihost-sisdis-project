'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')
const { bufferToJson } = require('../../utils/converter.js')
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
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const generateIdentifier = async (user, idTransaction) => {
  var network = await fabric.connectToNetwork('SupplyChain', 'ctcontract', user)
  const carbonTransaction = JSON.parse(
    await network.contract.evaluateTransaction('GetCTById', idTransaction)
  )

  if (carbonTransaction.status === 'approve') {
    const identifier = {}

    network = await fabric.connectToNetwork('Kementrian', 'qscc', 'admin')
    const blockCarbonTransaction = await network.contract.evaluateTransaction(
      'GetBlockByTxID',
      'carbonchannel',
      carbonTransaction.approvalTxId[carbonTransaction.historyTxId.length - 1]
    )

    identifier.carbonTransaction = fabric.calculateBlockHash(
      BlockDecoder.decode(blockCarbonTransaction).header
    )

    network.gateway.disconnect()
    return identifier
  } else {
    throw 'Carbon Transaction Belum di Approve'
  }
}

const verify = async (user, identifier) => {
  try {
    // find block that block hash == identifier
    console.log(identifier)
    const network = await fabric.connectToNetwork('Kementrian', 'qscc', 'admin')
    const blockCarbonTransaction = await network.contract.evaluateTransaction(
      'GetBlockByHash',
      'carbonchannel',
      Buffer.from(identifier.carbonTransaction, 'hex')
    )

    // Get data from block
    const argsCt = BlockDecoder.decode(blockCarbonTransaction).data.data[0]
      .payload.data.actions[0].payload.chaincode_proposal_payload.input
      .chaincode_spec.input.args
    const idCt = Buffer.from(argsCt[1]).toString()

    console.log('ID Carbon Transaction: ', idCt)
    //query data ijazah, transkrip, nilai
    network.gateway.disconnect()

    const ctNetwork = await fabric.connectToNetwork(
      user.organizationName,
      'ctcontract',
      user.username
    )
    const ct = await ctNetwork.contract.evaluateTransaction('GetCTById', idCt)
    ctNetwork.gateway.disconnect()
    const parseData = JSON.parse(ct)
    parseData.signatures = await fabric.getAllSignature(parseData.historyTxId)

    const data = {
      carbonTransaction: parseData,
    }

    const result = {
      success: true,
      message: 'Carbon Transaction asli',
      data: data,
    }
    return result
  } catch (error) {
    console.log('ERROR', error)
    const result = {
      success: true,
      message: 'Carbon Transaction palsu',
    }
    return result
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
      'GetCTbyIdPerusahaan',
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
      'GetCTbyIdProposal',
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
const verifikasiTransferKarbonKementrian = async (user, data) => {
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
      const result = await network.contract.submitTransaction(
        'UpdateCT',
        JSON.stringify(carbonTransaction)
      )

      network.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        `Successfully Update carbon transaction ${carbonTransaction.id}`
      )
    } else if (data.status === 'approve') {
      carbonTransaction.status = 'approve'
      carbonTransaction.approvers.push(data.idApproval)
      await network.contract.submitTransaction(
        'UpdateCT',
        JSON.stringify(carbonTransaction)
      )
      network.gateway.disconnect()

      const network3 = await fabric.connectToNetwork(
        user.organizationName,
        'cspcontract',
        user.username
      )

      const carbonSalesProposal = JSON.parse(
        await network3.contract.submitTransaction(
          'GetCSPById',
          carbonTransaction.proposalPenjual.id
        )
      )
      network3.gateway.disconnect()

      const network2 = await fabric.connectToNetwork(
        user.organizationName,
        'pecontract',
        user.username
      )

      carbonSalesProposal.kuotaYangDijual =
        carbonSalesProposal.kuotaYangDijual - carbonTransaction.kuota

      const perusahaanPembeli = bufferToJson(
        await network2.contract.submitTransaction(
          'GetPerusahaanById',
          carbonTransaction.perusahaanPembeli.id
        )
      )
      const perusahaanPenjual = bufferToJson(
        await network2.contract.submitTransaction(
          'GetPerusahaanById',
          carbonSalesProposal.idPerusahaan
        )
      )

      let updateArgsPembeli = {
        perusahaan: perusahaanPembeli.id,
        kuota: (perusahaanPembeli.sisaKuota += carbonTransaction.kuota),
      }

      let updateArgsPenjual = {
        perusahaan: perusahaanPenjual.id,
        kuota: (perusahaanPenjual.sisaKuota -= carbonTransaction.kuota),
      }
      console.log(updateArgsPembeli)
      console.log(updateArgsPenjual)
      await network2.contract.submitTransaction(
        'UpdateSisaKuota',
        JSON.stringify(updateArgsPembeli)
      )
      await network2.contract.submitTransaction(
        'UpdateSisaKuota',
        JSON.stringify(updateArgsPenjual)
      )

      network2.gateway.disconnect()
      if (carbonSalesProposal.kuotaYangDijual <= 0) {
        carbonSalesProposal.status = 'Sudah Habis'
      }
      const network4 = await fabric.connectToNetwork(
        user.organizationName,
        'cspcontract',
        user.username
      )
      await network4.contract.submitTransaction(
        'UpdateCSP',
        JSON.stringify(carbonSalesProposal)
      )
      console.log('UpdateCSP')
      network4.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        `Successfully Update carbon transaction ${carbonTransaction.id}`
      )
    }
  } catch (error) {
    console.log(error)
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
      const result = await network.contract.submitTransaction(
        'UpdateCT',
        JSON.stringify(carbonTransaction)
      )

      network.gateway.disconnect()
      return iResp.buildSuccessResponse(
        200,
        `Successfully Update carbon transaction ${carbonTransaction.id}`
      )
    } else if (data.status === 'approve') {
      carbonTransaction.status = 'approve penjual'
      carbonTransaction.approvers.push(data.idApproval)
      await network.contract.submitTransaction(
        'UpdateCT',
        JSON.stringify(carbonTransaction)
      )
      network.gateway.disconnect()

      return iResp.buildSuccessResponse(
        200,
        `Successfully Update carbon transaction ${carbonTransaction.id}`
      )
    }
  } catch (error) {
    console.log(error)
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
    await network.contract.submitTransaction('CreateCT', JSON.stringify(args))
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
  verifikasiTransferKarbonKementrian,
  verifikasiTransferKarbon,
  generateIdentifier,
  verify,
}
