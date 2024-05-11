const exampleService = require('../services/example.js')

const query = async (req, res) => {
  try {
    const data = req.body
    const username = data.username

    const result = await exampleService.query(username, [])
    res.status(200).send(result)
  } catch (error) {
    const response = {
      success: false,
      error: `Query Failed: ${error}`,
    }
    res.status(401).send(response)
  }
}

const create = async (req, res) => {
  try {
    const data = req.body
    const username = data.username

    const args = [
      data.id,
      data.color,
      data.size,
      data.owner,
      data.appraisedValue,
    ]

    await exampleService.create(username, args)
    res.status(200).send('Create successful!')
  } catch (error) {
    const response = {
      success: false,
      error: `Create Failed: ${error}`,
    }
    res.status(401).send(response)
  }
}

module.exports = { query, create }
