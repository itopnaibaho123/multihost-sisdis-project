const iResp = require('../utils/response.interface.js')
const fabric = require('../utils/fabric.js')

const getNotification = async (user, data) => {
  try {
    if (
      user.userType === 'admin-kementerian' ||
      user.userType === 'staf-kementerian'
    ) {
      // Status Pending =>  SupplyChain
      const supplyChain = await fabric.connectToNetwork(
        user.organizationName,
        'sccontract',
        user.username
      )
      const supplyChainList = await supplyChain.contract.submitTransaction(
        'GetAllSCByStatus',
        'pending'
      )
      supplyChain.gateway.disconnect()

      // Status Pending => CSP
      const CarbonSalesProposal = await fabric.connectToNetwork(
        user.organizationName,
        'cspontract',
        user.username
      )
      const cspList = await CarbonSalesProposal.contract.submitTransaction(
        'GetAllCSPByStatus',
        'pending'
      )
      supplyChain.gateway.disconnect()

      const result = {
        supplyChain: supplyChainList,
        carbonSalesProposal: cspList,
      }
      return iResp.buildSuccessResponse(
        200,
        'Successfully get all Notification',
        JSON.parse(result)
      )
    } else if (user.userType === 'admin-perusahaan') {
      const idPerusahaan = data.idPerusahaan
      const network = await fabric.connectToNetwork(
        user.organizationName,
        'ctcontract',
        user.username
      )
      const carbonTransactionPerusahaan =
        await network.contract.submitTransaction(
          'GetCTbyIdPerusahaan',
          idPerusahaan
        )
      network.gateway.disconnect()

      const carbonTransactionQuery = carbonTransactionPerusahaan.filter(
        function (item) {
          return (item.status = 'pending')
        }
      )
      const result = {
        carbonTransaction: carbonTransactionQuery,
        supplyChain: [],
      }
      return iResp.buildSuccessResponse(
        200,
        'Successfully get all Notification',
        JSON.parse(result)
      )
      // Status Menunggu Persetujuan Perusahaan => supply Chain
      // Status Pending => Carbon Transaction
    }
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = { getNotification }
