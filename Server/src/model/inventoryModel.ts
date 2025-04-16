import mongoose, {model, Schema, Types} from 'mongoose';

interface Iinventory extends Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

const inventorySchema: Schema<Iinventory> = new Schema<Iinventory>({
name:{
    type:String,
     required:true,
     unique:true,
},
description:{
    type:String,
    required:true,
    unique:true,

},
quantity:{
    type:Number,
    required:true,
    min:1
},
price:{
    type:Number,
    required:true,
    min:0
}
},
{timestamps:true});

const Inventory = model<Iinventory>("inventory",inventorySchema)
export default Inventory;