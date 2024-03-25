'use strict'
const iResp = require('../utils/response.interface.js')

const FabricCAServices = require('fabric-ca-client')
const fabric = require('../utils/fabric.js')
const { sendEmail } = require('../utils/mail.js')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const enrollAdmin = async (adminId, adminSecret, organizationName) => {
  const ccp = await fabric.getCcp(organizationName)

  // Create a new CA client for interacting with the CA.
  const caInfo =
    ccp.certificateAuthorities[
      `ca.${organizationName.toLowerCase()}.example.com`
    ]
  const caTLSCACerts = caInfo.tlsCACerts.pem

  const ca = new FabricCAServices(
    caInfo.url,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName
  )

  const wallet = await fabric.getWallet(organizationName)

  // Check to see if we've already enrolled the admin user.
  const identity = await wallet.get(adminId)
  if (identity) {
    throw new Error(
      'An identity for the admin user "admin" already exists in the wallet'
    )
  }

  // Enroll the admin user, and import the new identity into the wallet.
  const enrollment = await ca.enroll({
    enrollmentID: adminId,
    enrollmentSecret: adminSecret,
  })

  const x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: `${organizationName}MSP`,
    type: 'X.509',
  }
  await wallet.put(adminId, x509Identity)

  const response = {
    success: true,
    message: 'Successfully registered admin and imported it into the wallet',
  }
  return response
}

const registerAdminKementrian = async (
  name,
  email,
  organizationName,
  userType
) => {
  if (organizationName.toLowerCase() !== 'kementrian') {
    return iResp.buildErrorResponse(400, 'Invalid organization', null)
  }

  if (userType.toLowerCase() !== 'admin-kementerian') {
    return iResp.buildErrorResponse(400, 'Invalid user type')
  }

  await createUser(name, email, organizationName, userType)

  const userId = uuidv4()
  invokeRegisterUserCc(userId, name, organizationName, email)

  const payload = {
    id: userId,
    name: name,
    email: email,
    userType: userType,
  }
  const token = jwt.sign(payload, 'secret_key', { expiresIn: '2h' })
  payload.token = token

  return iResp.buildSuccessResponse(
    200,
    'Successfully registered admin kementerian and imported it into the wallet',
    payload
  )
}

const registerUser = async (
  permitUser,
  name,
  email,
  organizationName,
  userType
) => {
  if (
    permitUser.userType === 'admin-kementerian' &&
    userType !== 'staf-kementerian'
  ) {
    return iResp.buildErrorResponse(
      400,
      'Admin kementerian only be able to register staf kementerian'
    )
  }

  if (permitUser.userType === 'staf-kementerian' && userType !== 'admin-sc') {
    return iResp.buildErrorResponse(
      400,
      'Staf kementerian only be able to register admin supply chain'
    )
  }

  if (permitUser.userType === 'admin-sc' && userType !== 'manager-sc') {
    return iResp.buildErrorResponse(
      400,
      'Admin supply chain only be able to register manager supply chain'
    )
  }

  if (
    organizationName.toLowerCase() === 'supplychain' &&
    userType.toLowerCase() === 'staf-kementerian'
  ) {
    return iResp.buildErrorResponse(400, 'Invalid user type')
  }

  if (
    organizationName.toLowerCase() === 'kementerian' &&
    userType.toLowerCase() !== 'staf-kementerian'
  ) {
    return iResp.buildErrorResponse(400, 'Invalid user type')
  }

  await createUser(name, email, organizationName, userType)

  const userId = uuidv4()
  invokeRegisterUserCc(userId, name, organizationName, email)

  const payload = {
    id: userId,
    name: name,
    email: email,
    userType: userType,
  }
  const token = jwt.sign(payload, 'secret_key', { expiresIn: '2h' })
  payload.token = token

  return iResp.buildSuccessResponse(
    200,
    `Successfully registered ${userType} and imported it into the wallet`,
    payload
  )
}

const loginUser = async (email, password) => {
  // tembak ke chaincode login

  // dapetin usernamenya dari chaincode

  const response = {}
  // Check to see if we've already registered and enrolled the user in wallet Kementrian or SupplyChain
  const walletKementrian = await fabric.getWallet('kementrian')
  const walletSupplyChain = await fabric.getWallet('supplychain')

  const user1 = await walletKementrian.get(name)
  const user2 = await walletSupplyChain.get(name)
  let organizationName = ''
  if (user1) {
    organizationName = 'kementrian'
  } else if (user2) {
    organizationName = 'supplychain'
  } else {
    throw new Error(`User ${name} is not registered yet`)
  }

  // Get user attr
  const userAttrs = await fabric.getUserAttrs(name, organizationName)
  const userPassword = userAttrs.find((e) => e.name == 'password').value
  const userType = userAttrs.find((e) => e.name == 'userType').value

  // Compare input password with password in CA
  if (await bcrypt.compare(password, userPassword)) {
    const payload = {
      name: name,
      userType: userType,
      dataUser: dataUser,
    }
    const token = jwt.sign(payload, 'secret_key', { expiresIn: '2h' })

    response.success = true
    response.message = 'Successfully Login'
    response.user = payload
    response.token = token
  } else {
    throw new Error('Password Not Correct')
  }
  return response
}

const updateUser = async (
  organizationName,
  username,
  password,
  role,
  dataUser
) => {
  const ccp = await fabric.getCcp(organizationName)
  const wallet = await fabric.getWallet(organizationName)

  // Create a new CA client for interacting with the CA.
  const caURL =
    ccp.certificateAuthorities[
      `ca.${organizationName.toLowerCase()}.example.com`
    ].url
  const ca = new FabricCAServices(
    caURL,
    undefined,
    `ca.${organizationName.toLowerCase()}.example.com`
  )

  // Check to see if we've already enrolled the admin user.
  const adminIdentity = await wallet.get('admin')
  if (!adminIdentity) {
    throw new Error('Admin network does not exist')
  }

  // build a user object for authenticating with the CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)
  const adminUser = await provider.getUserContext(adminIdentity, 'admin')

  // retrieve the registered identity
  const identityService = ca.newIdentityService()
  const encryptedPassword = await bcrypt.hash(password, 10)
  const updateObj = {
    affiliation: `${organizationName.toLowerCase()}.department1`,
    role: 'client',
    attrs: [
      { name: 'userType', value: role, ecert: true },
      { name: 'password', value: encryptedPassword, ecert: true },
      { name: 'dataUser', value: JSON.stringify(dataUser), ecert: true },
    ],
  }
  identityService.update(username, updateObj, adminUser)

  const userIdentity = await identityService.getOne(username, adminUser)

  // Get user attr
  const userAttrs = userIdentity.result.attrs
  return userAttrs
}

module.exports = {
  enrollAdmin,
  registerUser,
  registerAdminKementrian,
  loginUser,
  updateUser,
}

const createUser = async (name, email, organizationName, userType) => {
  const ccp = await fabric.getCcp(organizationName)

  // Create a new CA client for interacting with the CA.
  const caURL =
    ccp.certificateAuthorities[
      `ca.${organizationName.toLowerCase()}.example.com`
    ].url
  const ca = new FabricCAServices(caURL)

  const wallet = await fabric.getWallet(organizationName)

  // Check to see if we've already enrolled the user.
  const userIdentity = await wallet.get(name)
  if (userIdentity) {
    throw new Error(
      `An identity for the user ${name} already exists in the wallet`
    )
  }

  // Check to see if we've already enrolled the admin user.
  const adminIdentity = await wallet.get('admin')
  if (!adminIdentity) {
    throw new Error('Admin network does not exist')
  }

  // build a user object for authenticating with the CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)
  const adminUser = await provider.getUserContext(adminIdentity, 'admin')

  // Create random password end encrypted
  const password = crypto.randomBytes(4).toString('hex')
  const encryptedPassword = await bcrypt.hash(password, 10)

  // Register the user, enroll the user, and import the new identity into the wallet.
  const secret = await ca.register(
    {
      affiliation: `${organizationName.toLowerCase()}.department1`,
      enrollmentID: name,
      role: 'client',
      attrs: [
        { name: 'userType', value: userType, ecert: true },
        { name: 'password', value: encryptedPassword, ecert: true },
      ],
    },
    adminUser
  )

  const enrollment = await ca.enroll({
    enrollmentID: name,
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
    mspId: `${organizationName}MSP`,
    type: 'X.509',
  }
  await wallet.put(name, x509Identity)

  fs.writeFile(
    path.join(process.cwd(), 'wallet', 'user.txt'),
    `${name}~${userType}~${password}\n`,
    { flag: 'a+' },
    (err) => {}
  )

  await sendEmail(email, password)
}

const invokeRegisterUserCc = async (userId, name, organizationName, email) => {
  const network = await fabric.connectToNetwork(
    organizationName,
    'usercontract',
    name
  )

  await network.contract.submitTransaction(
    'RegisterUser',
    ...[userId, name, email]
  )
  network.gateway.disconnect()

  return userId
}
