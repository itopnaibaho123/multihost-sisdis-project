const iResp = require('../../utils/response.interface.js')

const divisionService = require('../../services/company/division.js')
const { param } = require('../../routes/user.js')

const getList = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await divisionService.getList(username, [])

    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const getById = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await divisionService.getById(
      username,
      req.params.divisionId
    )

    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const create = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const args = [data.id, data.idPerusahaan, data.lokasi, data.idManajer]
    const result = await divisionService.create(username, args)

    res.status(201).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const update = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const args = [req.params.divisionId, data.lokasi]
    const result = await divisionService.update(username, args)

    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

const remove = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await divisionService.remove(username, req.params.divisionId)

    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

module.exports = { getList, getById, create, update, remove }
