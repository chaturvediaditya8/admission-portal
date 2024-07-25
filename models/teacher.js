const mongoose = require('mongoose')

const TeacherSchema = new mongoose.Schema({
    name:{
        type:String,
        Require:true
    },
    email:{
        type:String,
        Require:true
    },
    password:{
        type:String,
        Require:true
    },
    contact:{
        type:String,
        Require:true
    }

})

const TeacherModel = mongoose.model('teacher', TeacherSchema)
module.exports = TeacherModel