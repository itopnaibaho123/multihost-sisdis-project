const buildSuccessResponse = (code, message, data, error = null) => {
  return {
    success: true,
    code: code,
    message: message,
    data: data,
    error: error,
  }
}

const buildErrorResponse = (code, message, error) => {
  return {
    success: false,
    code: code,
    message: message,
    data: null,
    error: error,
  }
}

const buildErrorResponseWithData = (code, message, data, error) => {
  return {
    success: false,
    code: code,
    message: message,
    data: data,
    error: error,
  }
}

module.exports = {
  buildSuccessResponse,
  buildErrorResponse,
  buildErrorResponseWithData,
}
