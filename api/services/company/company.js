'use strict'
const iResp = require('../../utils/response.interface.js')
const fabric = require('../../utils/fabric.js')

const FabricCAServices = require('fabric-ca-client')
const { sendEmail } = require('../../utils/mail.js')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const { bufferToJson } = require('../../utils/converter.js')

const getList = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'pecontract',
      user.username
    )
    const result = await network.contract.submitTransaction('ReadAllPerusahaan')
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      'Successfully get all company',
      bufferToJson(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const getById = async (user, id) => {
  try {
    const network = await fabric.connectToNetwork(
      user.organizationName,
      'pecontract',
      user.username
    )
    const result = await network.contract.submitTransaction(
      'GetPerusahaanById',
      id
    )
    network.gateway.disconnect()
    return iResp.buildSuccessResponse(
      200,
      `Successfully get company ${id}`,
      JSON.parse(result)
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const create = async (data) => {
  try {
    const idUser = uuidv4()
    const idPerusahaan = uuidv4()

    await createUser(data.username)

    const args = [
      idPerusahaan,
      data.nomorTelepon,
      data.email,
      data.namaPerusahaan,
      data.lokasi,
      data.deskripsi,
      data.urlSuratProposal,
      idUser,
      data.username,
    ]

    const peNetwork = await fabric.connectToNetwork(
      'supplychain',
      'pecontract',
      data.username
    )
    await peNetwork.contract.submitTransaction('CreatePerusahaan', ...args)
    peNetwork.gateway.disconnect()

    const userNetwork = await fabric.connectToNetwork(
      'supplychain',
      'usercontract',
      data.username
    )
    await userNetwork.contract.submitTransaction(
      'RegisterUser',
      ...[idUser, data.username, data.email, 'admin-perusahaan', idPerusahaan]
    )
    userNetwork.gateway.disconnect()

    return iResp.buildSuccessResponseWithoutData(
      201,
      'Successfully registered a new company'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const approve = async (user, id) => {
  try {
    const peNetwork = await fabric.connectToNetwork(
      'kementrian',
      'pecontract',
      user.username
    )
    await peNetwork.contract.submitTransaction('ApprovePerusahaan', id)
    let company = await peNetwork.contract.submitTransaction(
      'GetPerusahaanById',
      id
    )
    peNetwork.gateway.disconnect()
    company = JSON.parse(company)

    await sendEmail(
      company.email,
      `Berikut ini adalah akun untuk website Carbon Supply Chain\n 
      username: ${company.adminPerusahaan.username}\n 
      Password: ${company.adminPerusahaan.password}`
    )
    return iResp.buildSuccessResponse(
      200,
      'Successfully approve a company',
      company
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const reject = async (user, id) => {
  try {
    const peNetwork = await fabric.connectToNetwork(
      'kementrian',
      'pecontract',
      user.username
    )
    await peNetwork.contract.submitTransaction('RejectPerusahaan', id)
    let company = await peNetwork.contract.submitTransaction(
      'GetPerusahaanById',
      id
    )
    peNetwork.gateway.disconnect()
    company = JSON.parse(company)

    const ccp = await fabric.getCcp(organizationName)
    const wallet = await fabric.getWallet(organizationName)
    const caURL =
      ccp.certificateAuthorities[
        `ca.${organizationName.toLowerCase()}.example.com`
      ].url

    // Create a new CA client for interacting with the CA
    const ca = new FabricCAServices(caURL)

    // Check if the user exists in the wallet
    const identity = await wallet.get(username)
    if (!identity) {
      throw new Error(`User ${username} does not exist in the wallet`)
    }

    // Retrieve the admin identity from the wallet
    const adminIdentity = await wallet.get('admin')
    if (!adminIdentity) {
      throw new Error('Admin identity does not exist in the wallet')
    }

    // Build a user object for authenticating with the CA
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type)
    const adminUser = await provider.getUserContext(adminIdentity, 'admin')

    // Revoke user's identity from the CA
    await ca.revoke({ enrollmentID: username }, adminUser)

    // Remove the user's identity from the wallet
    await wallet.remove(username)

    const network = await fabric.connectToNetwork(
      'supplychain',
      'usercontract',
      data.username
    )
    await network.contract.submitTransaction(
      'DeleteUserByUsername',
      ...[username]
    )
    network.gateway.disconnect()

    await sendEmail(
      company.email,
      'Mohon maaf, perusahaan Anda tidak kami terima'
    )
    // Tembak smartcontract buat delete user

    return iResp.buildSuccessResponse(
      200,
      'Successfully approve a company',
      company
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

const update = async (user, args) => {
  try {
    const network = await fabric.connectToNetwork(
      'supplychain',
      'pecontract',
      user
    )
    await network.contract.submitTransaction('UpdatePerusahaan', ...args)
    network.gateway.disconnect()
    return iResp.buildSuccessResponseWithoutData(
      200,
      'Successfully update a company'
    )
  } catch (error) {
    return iResp.buildErrorResponse(500, 'Something wrong', error.message)
  }
}

module.exports = { getList, getById, create, update, approve, reject }

const createUser = async (username) => {
  const ccp = await fabric.getCcp('SupplyChain')

  // Create a new CA client for interacting with the CA.
  const caURL = ccp.certificateAuthorities[`ca.supplychain.example.com`].url
  const ca = new FabricCAServices(caURL)

  const walletSupplyChain = await fabric.getWallet('supplychain')
  const walletKementrian = await fabric.getWallet('kementrian')

  // Check to see if we've already enrolled the user.
  const checkWalletPerusahaan = await walletSupplyChain.get(username)
  if (checkWalletPerusahaan) {
    throw new Error(`An identity for the user ${username} already exists`)
  }

  const checkWalletKm = await walletKementrian.get(username)
  if (checkWalletKm) {
    throw new Error(`An identity for the user ${username} already exists`)
  }

  // Check to see if we've already enrolled the admin user.
  const adminIdentity = await walletSupplyChain.get('admin')
  if (!adminIdentity) {
    throw new Error('Admin network does not exist')
  }

  // build a user object for authenticating with the CA
  const provider = walletSupplyChain
    .getProviderRegistry()
    .getProvider(adminIdentity.type)
  const adminUser = await provider.getUserContext(adminIdentity, 'admin')

  // Create random password end encrypted
  const password = crypto.randomBytes(4).toString('hex')
  const encryptedPassword = await bcrypt.hash(password, 10)

  // Register the user, enroll the user, and import the new identity into the walletSupplyChain.
  const secret = await ca.register(
    {
      affiliation: `supplychain.department1`,
      enrollmentID: username,
      role: 'client',
      attrs: [
        { name: 'userType', value: 'admin-perusahaan', ecert: true },
        { name: 'password', value: encryptedPassword, ecert: true },
      ],
    },
    adminUser
  )

  const enrollment = await ca.enroll({
    enrollmentID: username,
    enrollmentSecret: secret,
    attr_reqs: [
      { name: 'userType', optional: false },
      { name: 'password', optional: false },
    ],
  })

  const x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: `SupplyChainMSP`,
    type: 'X.509',
  }
  await walletSupplyChain.put(username, x509Identity)

  fs.writeFile(
    path.join(process.cwd(), 'wallet', 'user.txt'),
    `${username}~admin-perusahaan~${password}\n`,
    { flag: 'a+' },
    (err) => {}
  )
  return password
}
