const mongoose=require('mongoose');
const { Schema } = mongoose;

// const DateSchema = new Schema({absent:{type:Date}});

const FacultySchema = new Schema({
    name: {
        type:String, 
        required:true,
    },
    facultyID: {
        type:String, 
        required:true,
        unique:true
    },
    
    password: {
        type:String, 
        required:true,
    },
    absent: {
        type:[String],
        default:[],
    },
});
Faculty=mongoose.model('faculty', FacultySchema);
// User.createIndexes();
module.exports = Faculty

