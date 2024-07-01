const JobModel = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

// For all controller funcs, req.user comes from our authentication middleware 

const getAllJobs = async (req,res) => {
    // Only get all jobs associated with the current logged in user
    const allJobs = await JobModel.find({createdBy:req.user.userID})
    res.status(StatusCodes.OK).json({Hits:allJobs.length,Jobs:allJobs})
}

const getJob = async (req,res) => {
    const jobID = req.params.id
    const userID = req.user.userID

    const job = await JobModel.findOne({
        _id:jobID,
        createdBy:userID
    })

    if (!job) {
        throw new NotFoundError(`No job found with id: ${jobID}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req,res) => {
    // add the id from req.user to req.body in order to create the Job document
    req.body.createdBy = req.user.userID
    const job = await JobModel.create(req.body)
    res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async (req,res) => {
    const jobID = req.params.id
    const userID = req.user.userID
    const {company, position} = req.body

    if (!company || !position) {
        throw new BadRequestError('Provide new company and position to patch')
    }

    const job = await JobModel.findOneAndUpdate(
        {_id:jobID,createdBy:userID},
        req.body,
        {new:true, runValidators:true}
    )

    if (!job) {
        throw new NotFoundError(`No job found with id: ${jobID}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req,res) => {
    const jobID = req.params.id
    const userID = req.user.userID

    const deleteJob = await JobModel.findOneAndDelete({
        _id:jobID,
        createdBy:userID
    })

    if (!deleteJob) {
        throw new NotFoundError(`No job found with id: ${jobID}`)
    }

    res.status(StatusCodes.OK).send('Successfully deleted')
}


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}