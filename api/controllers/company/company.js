const iResp = require('../../utils/response.interface.js')

const companyService = require('../../services/company/company.js')

const getList = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    const result = await companyService.getList(username, [])

    if (!result.success) {
      res.status(200).send(result)
    }
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
    const companyId = data.companyId
    const result = await companyService.getById(username, req.params.companyId)
    res.status(200).send(result)
    if (!result.success) {
      res.status(200).send(result)
    }

    res.status(result.code).send(result)
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
    const args = [
      data.id,
      data.nomorTelepon,
      data.email,
      data.nama,
      data.lokasi,
      data.deskripsi,
      data.urlSuratProposal,
    ]
    const result = await companyService.create(username, args)

    if (!result.success) {
      res.status(200).send(result)
    }

    res.status(result.code).send(result)
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
    const args = [
      data.id,
      data.nomorTelepon,
      data.email,
      data.nama,
      data.lokasi,
      data.deskripsi,
      data.urlSuratProposal,
      data.approvalStatus,
      data.participantStatus,
      data.kuota,
      data.sisaKuota,
    ]
    const result = await companyService.update(username, args)
    if (!result.success) {
      res.status(200).send(result)
    }

    res.status(result.code).send(result)
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
    const result = await companyService.remove(username, req.params.companyId)
    if (!result.success) {
      res.status(200).send(result)
    }

    // res.status(result.code).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

module.exports = { getList, getById, create, update, remove }
