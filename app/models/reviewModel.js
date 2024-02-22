const mongoose=require('mongoose')

const { Schema, model } = mongoose

const reviewSchema =new Schema({
    customerId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // driverId:{
    //     type: Schema.Types.ObjectId,
    //     ref: "User"
    // },
    vehicleId:{
        type: Schema.Types.ObjectId,
        ref: "Vehcile"
    },
    feedback:String,
    rating : {
        driving: 'Number',
        vehicle: 'Number' 
    }
})
const Review=model("Review",reviewSchema)

module.exports = Review
