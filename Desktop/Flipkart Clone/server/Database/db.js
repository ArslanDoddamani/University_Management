import mongoose from 'mongoose' ;

export const Connection = async() => {
const URL =`mongodb+srv://sanyam:sanyam%407820@cluster0.qj4kf7i.mongodb.net/?retryWrites=true&w=majority` ;
try{
await mongoose.connect(URL,{useUnifiedTopology:true,useNewUrlParser:true});
console.log('Database connected successfully');
}catch(error){
    console.log('Error while connecting database',error.message);
}
}

export default Connection;