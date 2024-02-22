
const _ = require('lodash')
const Trip = require('../models/tripModel');
const Vehicle = require('../models/vehicleModel')
const tripCltr = {}
const geolib = require('geolib');

// import { intervalToDuration } from 'date-fns';
const { intervalToDuration, differenceInHours, differenceInDays, parseISO } = require('date-fns')


async function distanceBtwThem(source, dest) {
  const distanceInMeters = geolib.getDistance((source), (dest));
  const distanceInKilometers = distanceInMeters / 1000; // Convert meters to kilometers
  return distanceInKilometers;
}

tripCltr.estimateAmount = async (req, res) => {
  console.log('api is working')
  const body = _.pick(req.body, [
    "vehicleId", "tripStartDate", "tripEndDate", "pickUplocation", "dropOfflocation"
  ])
  console.log(body, 'body')
  console.log(body.pickUplocation.latlon)
  const startDate = parseISO(body.tripStartDate);
  // console.log(startDate ,'208')
  const endDate = parseISO(body.tripEndDate);
  const hours = differenceInHours(endDate, startDate);
  console.log(hours, '211')
  const days = differenceInDays(endDate, startDate);
  console.log(days, '213')
  const totalDistanceToTravel = await distanceBtwThem(body.pickUplocation.latlon, body.dropOfflocation.latlon)
  // console.log(totalDistanceToTravel,'215')
  body.totalDistance = totalDistanceToTravel
  // console.log(body)
  // console.log(body,'217')
  const vehicle = await Vehicle.findById(body.vehicleId)
  body.pricePerKm = vehicle.pricePerKm
  body.driverId=vehicle.driverId
  console.log(vehicle, '216')
  if (days == 0 && hours < 8) {
    res.status(400).json({ errors: "Trips should br minimum 8 hours long" })
  } else if (days == 0 && hours > 8) {
    const driverAmount = vehicle.wages * 1
    body.totalwages = driverAmount
    const distanceAmount = totalDistanceToTravel * vehicle.pricePerKm
    const totalAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(distanceAmount + driverAmount)
    body.totalAmount = totalAmount
    body.totalHours = hours
    console.log(body)
    res.json(body)
  }
  else if (days > 0) {
    const driverAmount = vehicle.wages * days
    body.totalwages = driverAmount
    const distanceAmount = totalDistanceToTravel * vehicle.pricePerKm
    const totalAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(distanceAmount + driverAmount)
    body.totalAmount = totalAmount
    body.totalDays = days
    res.json(body)
    console.log(body)
  }

}

tripCltr.book = async (req, res) => {
  console.log()
  console.log('api is working')
  const body = _.pick(req.body, [
    "vehicleId","driverId", "tripStartDate", "tripEndDate", "pickUplocation", "dropOfflocation", "totalDistance", "totalAmount"
  ])
  body.customerId = req.user.id
  // console.log(req.user.id)
  // console.log(body)
  try {

    const trip = new Trip(body)
    const book = await trip.save()
    console.log(book._id)
    const book1 = await Trip.findById(book._id)
      .populate('customerId')
      .populate('driverId')
      .populate('vehicleId')

    console.log(book1)
    res.status(201).json(book1)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}



tripCltr.mytrip = async (req, res) => {
        console.log('api is working');
  const customerId = req.user.id; // Assuming req.user.id is the customerId
  try {
      const myTrips = await Trip.find({ customerId: customerId }).populate('customerId').populate('vehicleId').populate('driverId');
      res.json(myTrips); // Sending the trip data as response
  } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Internal server error" });
  }
};




module.exports = tripCltr




