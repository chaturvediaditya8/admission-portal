const mongoose = require('mongoose');
const Local_URL ='mongodb://127.0.0.1:27017/admissionPortal'
const connectDB =()=>{
    return mongoose.connect(Local_URL)
    .then(()=>{
        console.log("connect successfully")
    }).catch((error)=>{
        console.log(error)
    })
}
module.exports = connectDB