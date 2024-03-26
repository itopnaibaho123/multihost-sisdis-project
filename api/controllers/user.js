const iResp = require('../utils/response.interface.js')

const userService = require('../services/user.js')

const enrollAdmin = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const password = data.password
    const orgName = data.organizationName

    const result = await userService.enrollAdmin(username, password, orgName)
    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const registerAdminKementrian = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const email = data.email
    const orgName = data.organizationName
    const role = data.role

    const result = await userService.registerAdminKementrian(
      username,
      email,
      orgName,
      role
    )
    res.status(result.code).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const registerUser = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const email = data.email
    const orgName = data.organizationName
    const role = data.role

    const result = await userService.registerUser(
      req.user,
      username,
      email,
      orgName,
      role
    )
    res.status(result.code).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const loginUser = async (req, res) => {
  // try {
  const data = req.body
  const username = data.username
  const password = data.password

  const result = await userService.loginUser(username, password)
  res.status(result.code).send(result)
  // } catch (error) {
  //   res
  //     .status(500)
  //     .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  // }
}

const updateUser = async (req, res) => {
  try {
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
    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

module.exports = {
  enrollAdmin,
  registerAdminKementrian,
  registerUser,
  loginUser,
  updateUser,
}
