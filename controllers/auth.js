const {StatusCodes} = require('http-status-codes')
const UserModel = require('../models/User')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const register = async (req, res) => {
    // createdUser is an instance of UserModel class - Can access instance methods
    // in reality, mongoose models arent technically js classes, but can be interfaced as such anyway
    
    // We rely on the mongoose schema to validate our req.body
    // If something goes wrong, our error-handler will output a nicely formatted, user-friendly msg
    const createdUser = await UserModel.create(req.body)

    // Get JWT using instance method
    const token = createdUser.createJWT() 
    // this JWT allows user to access protected routes right after registering. No need to login

    res.status(StatusCodes.CREATED).json({user:{name:createdUser.name},token})
}

// A Note on Validation:
/**
 * Mongoose validation applies to operations that involve creating or updating documents, 
 * such as .create(), .save(), or .update(). These operations trigger Mongoose schema validations, 
 * ensuring that the data being saved or updated adheres to the schema's rules. 
 * 
 * On the other hand, query operations like .findOne() do not trigger Mongoose schema validations 
 * because they are simply retrieving data from the database.
 * 
 * Hence why we need to do manual validation in login function, but can rely on the error-handler 
 * to catch/kick in for the register function, since they will be caught by mongoose's schema
 */


const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        throw new BadRequestError('Provide Email and Password')
    }

    const user = await UserModel.findOne({email:email}) 
    // Find the acc with the email, since we made it so each email must be unique

    if (!user) {
        throw new UnauthenticatedError('No account with that email')
    }

    // Compare password - do this in the User Model since it has access to the hashed password
    const isPasswordCorrect = await user.comparePasswords(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Password')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {
    register,
    login
}