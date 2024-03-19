const dataService = require('../services/data.js')

const getParser = async (result, query = [true, true]) => {
  if (query[0] && result.idSp) {
    const id = result.idSp
    const data = await dataService.getPTById('admin', id)
    result.sp = {
      id: id,
      nama: data.namaSp,
    }
    delete result.idSp
  }

  if (query[1] && result.idSms) {
    const id = result.idSms
    const data = await dataService.getProdiById('admin', id)
    result.sms = data
    delete result.idSms
  }
  return result
}

module.exports = { getParser }
