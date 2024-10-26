const express = require('express');
const router = express.Router();
const Climate = require('../schema/climate_schema');

router.post('/', async (req, res) => {
    try {
        const { city, day, hourlyTime, temperature } = req.body;

        console.log('Received data:', req.body); // Log the received data

        // Validate incoming data
        if (!city || !day || !hourlyTime || temperature === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let climateRecord = await Climate.findOne({ 'places.placeName': city });

        if (!climateRecord) {
            climateRecord = new Climate({
                places: [
                    {
                        placeName: city,
                        dates: [
                            {
                                day: new Date(day), // Ensure this is a valid Date object
                                timeRecords: [
                                    { slot: new Date(hourlyTime), temp: temperature } // Ensure this is a valid Date object
                                ],
                                avgTemp: temperature,
                                maxTemp: temperature,
                                minTemp: temperature
                            }
                        ]
                    }
                ]
            });
        } else {
            const placeData = climateRecord.places.find(p => p.placeName === city);
            let dateData = placeData.dates.find(d => d.day.toISOString().split('T')[0] === day);

            if (!dateData) {
                dateData = {
                    day: new Date(day), // Ensure this is a valid Date object
                    timeRecords: [
                        { slot: new Date(hourlyTime), temp: temperature } // Ensure this is a valid Date object
                    ],
                    avgTemp: temperature,
                    maxTemp: temperature,
                    minTemp: temperature
                };
                placeData.dates.push(dateData);
            } else {
                dateData.timeRecords.push({ slot: new Date(hourlyTime), temp: temperature });

                const totalTemp = dateData.timeRecords.reduce((sum, entry) => sum + entry.temp, 0);
                const count = dateData.timeRecords.length;
                dateData.avgTemp = totalTemp / count;

                dateData.maxTemp = Math.max(...dateData.timeRecords.map(entry => entry.temp));
                dateData.minTemp = Math.min(...dateData.timeRecords.map(entry => entry.temp));
            }
        }

        await climateRecord.save();
        res.status(201).json({
            message: 'Climate data saved successfully',
            avgTemp: climateRecord.places.find(p => p.placeName === city)
                .dates.find(d => d.day.toISOString().split('T')[0] === day)
                .avgTemp,
            minTemp: climateRecord.places.find(p => p.placeName === city)
                .dates.find(d => d.day.toISOString().split('T')[0] === day)
                .minTemp,
            maxTemp: climateRecord.places.find(p => p.placeName === city)
                .dates.find(d => d.day.toISOString().split('T')[0] === day)
                .maxTemp
        });
    } catch (error) {
        console.error('Error in POST /climate:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
});

module.exports = router;
