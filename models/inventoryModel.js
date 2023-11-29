 const mongoose = require('mongoose');

 const inventorySchema= new mongoose.Schema({
    inventoryType:{
        type:String,
        required:[true,'inventory type require'],
        enum:['In','Out'],
    },
    bloodGroup:{
        type:String,
        required:[true,'Blood Group require'],
        enum:['A+','A-','B+','B-','AB+','AB-','O+','O-'],
    },
    Quantity:{
        type:Number,
        required:[true,'Quantity require'],
    },
    email:{
        type:String,
        required:[true,"Donor Email is required"],

    },
    Organization:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user_infos',
        required:[true,'Organization is required']
    },
    hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user_infos',
        required: function(){
            return this.inventoryType === 'Out'
        }
    },
    donor:{
        type:mongoose.Schema.ObjectId,
        ref:'user_infos',
        required: function(){
            return this.inventoryType === 'In'
        }
    },
 },{timestamps:true})
 module.exports = mongoose.model('Inventory',inventorySchema)