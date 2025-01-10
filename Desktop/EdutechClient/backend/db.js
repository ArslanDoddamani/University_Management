const mongoose=require('mongoose');
require('dotenv').config();
const URL=process.env.DATABASE_URL;
try{
    mongoose.connect(URL);
    console.log('database connected successfully');
}
catch(error){
    console.log('Error while connecting database',error);
}

const courseSchema=mongoose.Schema({
    Image:String,
    price:Number,
    title:String,
    description:String
})

const Course=mongoose.model('Course',courseSchema);

const userSchema=mongoose.Schema({ 
    email:String,
    contact:String,
    password:String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
})

const user=mongoose.model('user',userSchema);

module.exports={
    user,Course
}