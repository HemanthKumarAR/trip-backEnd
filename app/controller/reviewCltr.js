const Review=require('../models/reviewModel')
const Vehcile=require('../models/vehicleModel')
const _=require('lodash')

const reviewCltr={}

reviewCltr.add=async(req,res)=>{
    const body = _.pick(req.body, ["vehicleId", "rating", "feedback"])
    const customerId = req.user.id

    const reviewFound = await Review.findOne({ customerId: customerId, vehicleId: body.vehicleId })
    try{
        if (!reviewFound) {
            const review = new Review(body)
            review.customerId = customerId
            await review.save()
      
            //update rating in vehicle
            console.log(review)
            await Vehcile.findOneAndUpdate({ _id: body.vehicleId }, { $push: { ratings: review } },{ new: true })
            console.log('hemanth')
            res.json(review)
          }
    }catch (e) {
        res.status(400).json(e)
      }
}


module.exports = reviewCltr