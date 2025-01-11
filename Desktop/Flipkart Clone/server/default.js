import { products } from "./data.js";
import Product from "./model/Productschema.js";

const Defaultdata = async() =>{
    try{
        await Product.insertMany(products);
        console.log('Data imported successfully');

    }catch(error){
        console.log('Error while inserting default data',error.message);
    }
}

export default Defaultdata;