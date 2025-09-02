const mongoose=require('mongoose');
const todoData=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }
})
module.exports=mongoose.model('Todo',todoData);