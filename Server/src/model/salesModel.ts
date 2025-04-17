import {Document,model,Schema} from "mongoose";

export interface ISales extends Document{
product:string,
price:number;
quantity:number;
total:number;
customer:string;
}
const salesSchema =  new Schema<ISales>({
  customer:{
    type:String,
    required:true,

  },
      product:{
        type:String,
        required:true
      },

      price:{
        type:Number,
        required:true,
        min:0

      },
      quantity:{
        type:Number,
        required:true,
        min:1
      },
      total:{
        type:Number,
        required:true,
        min:1
      }
},{timestamps:true});

const Sales = model<ISales>("sales",salesSchema);
export default Sales;