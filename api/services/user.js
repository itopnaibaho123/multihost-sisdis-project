'use strict'

const FabricCAServices = require('fabric-ca-client')
const fabric = require('../utils/fabric.js')
const { sendEmail } = require('../utils/mail.js')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')

const registerUser = async (
  userId,
  organizationName,
  userType,
  dataUser = {}
) => {
  const ccp = await fabric.getCcp(organizationName)

  // Create a new CA client for interacting with the CA.
  const caURL =
    ccp.certificateAuthorities[
      `ca.${organizationName.toLowerCase()}.example.com`
    ].url
  const ca = new FabricCAServices(caURL)

  const wallet = await fabric.getWallet(organizationName)

  // Check to see if we've already enrolled the user.
  const userIdentity = await wallet.get(userId)
  if (userIdentity) {
    throw new Error(
      `An identity for the user ${userId} already exists in the wallet`
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
      enrollmentID: userId,
      role: 'client',
      attrs: [
        { name: 'userType', value: userType, ecert: true },
        { name: 'password', value: encryptedPassword, ecert: true },
        { name: 'dataUser', value: JSON.stringify(dataUser), ecert: true },
      ],
    },
    adminUser
  )

  const enrollment = await ca.enroll({
    enrollmentID: userId,
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
  await wallet.put(userId, x509Identity)

  console.log(password)

  fs.writeFile(
    path.join(process.cwd(), 'wallet', 'user.txt'),
    `${userId}~${userType}~${password}\n`,
    { flag: 'a+' },
    (err) => {}
  )
  await sendEmail(userId, password)

  const response = {
    success: true,
    password: password,
    message: 'Successfully registered user and imported it into the wallet',
  }
  return response
}

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

const loginUser = async (username, password) => {
  const response = {}
  // Check to see if we've already registered and enrolled the user in wallet Kementrian or SupplyChain
  const walletKementrian = await fabric.getWallet('kementrian')
  const walletSupplyChain = await fabric.getWallet('supplychain')

  const user1 = await walletKementrian.get(username)
  const user2 = await walletSupplyChain.get(username)
  let organizationName = ''
  if (user1) {
    organizationName = 'kementrian'
  } else if (user2) {
    organizationName = 'supplychain'
  } else {
    throw new Error(`User ${username} is not registered yet`)
  }

  // Get user attr
  const userAttrs = await fabric.getUserAttrs(username, organizationName)
  const userPassword = userAttrs.find((e) => e.name == 'password').value
  const userType = userAttrs.find((e) => e.name == 'userType').value
  const dataUser = userAttrs.find((e) => e.name == 'dataUser').value

  // Compare input password with password in CA
  if (await bcrypt.compare(password, userPassword)) {
    const payload = {
      username: username,
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

module.exports = { enrollAdmin, registerUser, loginUser, updateUser }
