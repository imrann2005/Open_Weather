const mongoose = require('mongoose')

const TimeSlotSchema = new mongoose.Schema({
	slot: { type: Date, required: true },
	temp: { type: Number, required: true },
})

const DateWeatherSchema = new mongoose.Schema({
	day: { type: Date, required: true },
	timeRecords: [TimeSlotSchema],
	avgTemp: { type: Number },
	maxTemp: { type: Number },
	minTemp: { type: Number },
})

const LocationWeatherSchema = new mongoose.Schema({
	placeName: { type: String, required: true },
	dates: [DateWeatherSchema],
})

const ClimateSchema = new mongoose.Schema({
	places: [LocationWeatherSchema],
})

module.exports = mongoose.model('Climate', ClimateSchema)
