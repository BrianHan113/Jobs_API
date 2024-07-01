const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  // If error not explicelty passed in via a 'throw', generic 500 error
  let customError = {
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Generic error msg - Something went wrong'
  }

  // More user friendly err message for invalid req.body in register function
  if (err.name === 'ValidationError') {
    // Get the .message of everything inside err.errors, and join the messages together
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(', ')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // Trying to register new user with same email - user friendly custom error
  if (err.code && err.code === 11000) { 
    customError.msg = `Duplicate value entered for the ${Object.keys(err.keyValue)} field`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // Error for when :id param in url is too long/too short - Cast error
  if (err.name === 'CastError') {
    customError.msg = `${err.value} is not a Valid ID`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err }) // For seeing entire err object
  return res.status(customError.statusCode).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware
