const iResp = require('../utils/response.interface.js')
const fabric = require('../utils/fabric.js')
const { bufferToJson } = require('../utils/converter.js')

const getNotification = async (user) => {
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

      // Company ApprovalStatus => 0
      const Company = await fabric.connectToNetwork(
        user.organizationName,
        'pecontract',
        user.username
      )
      const companyList = await Company.contract.submitTransaction(
        'ReadAllPendingPerusahaan'
      )
      Company.gateway.disconnect()

      const result = {
        supplyChain: supplyChainList,
        carbonSalesProposal: cspList,
        company: companyList,
      }
      return iResp.buildSuccessResponse(
        200,
        'Successfully get all Notification',
        JSON.parse(result)
      )
    } else if (user.userType === 'admin-perusahaan') {
      const idPerusahaan = user.idPerusahaan
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
          return item.status == 'pending'
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
    } else {
      const network = await fabric.connectToNetwork(
        user.organizationName,
        'shcontract',
        user.username
      )
      const shipment = await network.contract.submitTransaction(
        'GetShipmentsNeedApprovalByDivisiPenerima',
        user.idDivisi
      )
      network.gateway.disconnect()
      console.log(shipment)
      const result = {
        shipment: bufferToJson(shipment),
      }
      return iResp.buildSuccessResponse(
        200,
        'Successfully get all Notification',
        result
      )
    }
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = { getNotification }
