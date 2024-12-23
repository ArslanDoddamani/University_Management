import mongoose from 'mongoose';

const AdminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
  role: {
    type: String,
    enum: ['student', 'admin', 'faculty'],
    default: 'admin'
  },
})

export default mongoose.model('Admin',AdminSchema);
