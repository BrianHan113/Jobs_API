const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true, 'Provide company name'],
        maxLength:50
    },
    position:{
        type:String,
        required:[true, 'Provide position'],
        maxLength:100
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId, // Link the job document to a user in the DB
        ref:'UserModel', 
        required:[true, 'Provide the User for the Job']
    },
},
{   // More options
    timestamps:true // Automatically adds createdAt and updatedAt properties to the document in DB
})

module.exports = mongoose.model('JobModel', JobSchema)