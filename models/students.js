const mongoose=require('mongoose');
const { Schema } = mongoose;

const StudentSchema = new Schema({
    name: {
        type:String, 
        required:true,
    },
    enrollNo: {
        type:String, 
        required:true,
        unique:true
    },

    password: {
        type:String, 
        required:true,
    },
    date: { type: Date, default: Date.now },
});
Student=mongoose.model('student', StudentSchema);
// User.createIndexes();
module.exports = Student

