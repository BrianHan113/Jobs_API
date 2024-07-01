const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const authMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization 

    // Check for "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('No valid JWT Provided')
    }
    
    // Split to isolate token
    const token = authHeader.split(' ')[1]

    try {
        // Get back the payload using token and JWT_SECRET
        const payload = jwt.verify(token, process.env.JWT_SECRET)
    
        // Send payload back as req.user so the controller has access to the info
        req.user = {
            userID: payload.userID,
            name: payload.name
        }
        next() // Go to controller
    } catch (error) { // Catch errors, throw UnauthorizedError
        throw new UnauthenticatedError('Not Authorized to access route')
    }
}

module.exports = authMiddleware