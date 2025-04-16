import  mongoose , {Document,model,Schema} from "mongoose";

export interface ICustomer extends Document {
    name:string,
    address:string,
    mobile:number,
}

 const CustomerSchema = new Schema<ICustomer>({
    name:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true,

    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    }
},{timestamps:true});

  const customer = model<ICustomer>("customer",CustomerSchema);
  export default customer;