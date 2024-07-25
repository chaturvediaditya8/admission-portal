const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        Required:true
    },
    email:{
        type: String,
        Required:true
    },
    password:{
        type:String,
        Required:true
    },
    role:{
        type:String,
        default:'user'
    },
    image:{
        public_id:{
            type:String,
            Required:true
        },
        url:{
            type:String,
            Required:true
        }
    },
    token:{
        type:String
    },
    is_verified:{
        type:Number,
        default:0
    }
},{timestamps: true})//jb hum insert krege to 2 field dega 
const UserModel = mongoose.model('user', UserSchema)
module.exports = UserModel