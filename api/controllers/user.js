const userService = require('../services/user.js')

const enrollAdmin = async (req, res) => {
  const data = req.body
  const username = data.username
  const password = data.password
  const orgName = data.organizationName

  const result = await userService.enrollAdmin(username, password, orgName)

  res.status(result.code).send(result)
}

const registerAdminKementrian = async (req, res) => {
  const data = req.body
  const username = data.username
  const email = data.email

  const result = await userService.registerAdminKementrian(
    username,
    email,
    'Kementrian',
    'admin-kementerian'
  )
  res.status(result.code).send(result)
}

const registerUser = async (req, res) => {
  const data = req.body
  const result = await userService.registerUser(
    req.user,
    data.username,
    data.email,
    data.organizationName,
    data.role,
    data.idDivision
  )
  res.status(result.code).send(result)
}

const loginUser = async (req, res) => {
  const data = req.body
  const username = data.username
  const password = data.password

  const result = await userService.loginUser(username, password)
  res.status(result.code).send(result)
}

const editUser = async (req, res) => {
  const data = req.body
  const username = data.username
  const password = data.password
  const organizationName = data.organizationName
  const dataUser = data.dataUser
  const role = data.role

  const result = await userService.updateUser(
    organizationName,
    username,
    password,
    role,
    dataUser
  )

  res.status(result.code).send(result)
}

const editPassword = async (req, res) => {
  const result = await userService.editPassword(req.user, req.body)
  res.status(result.code).send(result)
}

const editEmail = async (req, res) => {
  const result = await userService.editEmail(req.user, req.body)
  res.status(result.code).send(result)
}

const getAllManagerByIdPerusahaan = async (req, res) => {
  const result = await userService.getAllManagerByIdPerusahaan(req.user)

  res.status(result.code).send(result)
}

const getAllStafKementerian = async (req, res) => {
  const result = await userService.getAllStafKementerian(req.user)

  res.status(result.code).send(result)
}

module.exports = {
  enrollAdmin,
  registerAdminKementrian,
  registerUser,
  loginUser,
  editPassword,
  editEmail,
  getAllManagerByIdPerusahaan,
  getAllStafKementerian,
}
