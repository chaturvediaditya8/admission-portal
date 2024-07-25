const mongoose = require('mongoose');
// const Local_URL ='mongodb://127.0.0.1:27017/admissionPortal'
const Live_URL = "mongodb+srv://chaturvediaditya8:Program1ngAP1@ap1express.1qq4hie.mongodb.net/admissionPortal?retryWrites=true&w=majority&appName=admissionPortal"

const connectDB =()=>{
    return mongoose.connect(Live_URL)
    .then(()=>{
        console.log("connect successfully")
    }).catch((error)=>{
        console.log(error)
    })
}
module.exports = connectDB