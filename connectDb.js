const mongoose = require('mongoose')

const mongooseURI=`mongodb+srv://tanishq:tanishq@cluster0.gipz0.mongodb.net/LeaveTracker?retryWrites=true&w=majority`

const connectToMongoose =()=>{
    mongoose.connect(mongooseURI,{keepAlive:true},()=>console.log('Connected to mongoDB succesfully'));
}

module.exports =connectToMongoose;