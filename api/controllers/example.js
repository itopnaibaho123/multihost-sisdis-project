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

module.exports = { query }
