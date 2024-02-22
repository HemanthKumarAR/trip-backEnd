const mongoose= require('mongoose')
// const mongoose = require('mongoose')

const { Schema, model } = mongoose
  

const tripSchema=new Schema({
    customerId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    driverId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    vehicleId:{
        type: Schema.Types.ObjectId,
        ref: "Vehicle"
    },
    
    tripStartDate: Date,

    tripEndDate: Date,
    
    pickUplocation:{
        address:String, //address 
        pickCoordinate:[]
         
    },
    dropOfflocation:{
        address:String,
        dropCoordinate:[String]
    },
    // coordinates: {
    //     type: { pickUpcoordinate: [], dropCoordinate: [] },
    //   },
      
    totalDistance:Number,

    totalAmount:String,

    paymentStatus: {
        type:Boolean,
        default:false
    }

    
}, { timestamps: true })

const Trip = model("Trip", tripSchema)
module.exports = Trip

