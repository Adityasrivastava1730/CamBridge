const mongoose = require("mongoose");


const cameraSchema = new mongoose.Schema({


    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    cameraName:{
        type:String,
        required:true
    },


    status:{
        type:String,
        enum:["online", "offline"],
        default:"offline"
    },


    streamUrl:{
        type:String
    },


    // Unique code for phone pairing
    pairCode:{
        type:String,
        unique:true,
        sparse:true
    },


    // Phone currently connected or not
    isConnected:{
        type:Boolean,
        default:false
    },

    connectedDeviceId:{
        type:String,
        default:null
    }


},{
    timestamps:true
});



module.exports = mongoose.model(
    "Camera",
    cameraSchema
);