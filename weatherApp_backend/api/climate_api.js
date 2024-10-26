const express = require('express');
const router = express.Router();
const Climate = require('../schema/climate_schema');

router.post('/', async (req, res) => {
    try {
        const { location, date, timeSlot, temp } = req.body;

        console.log('Received data:', req.body);

        let climateRecord = await Climate.findOne({ 'places.placeName': location });

        if (!climateRecord) {
            climateRecord = new Climate({
                places: [
                    {
                        placeName: location,
                        dates: [
                            {
                                day: date,
                                timeData: [
                                    { slot: timeSlot, temp }
                                ],
                                avgTemp: temp,
                                maxTemp: temp,
                                minTemp: temp
                            }
                        ]
                    }
                ]
            });
        } else {
            const placeData = climateRecord.places.find(p => p.placeName === location);
            let dateData = placeData.dates.find(d => d.day.toISOString().split('T')[0] === date);

            if (!dateData) {
                dateData = {
                    day: date,
                    timeData: [
                        { slot: timeSlot, temp }
                    ],
                    avgTemp: temp,
                    maxTemp: temp,
                    minTemp: temp
                };
                placeData.dates.push(dateData);
            } else {
                dateData.timeData.push({ slot: timeSlot, temp });

                const totalTemp = dateData.timeData.reduce((sum, entry) => sum + entry.temp, 0);
                const count = dateData.timeData.length;
                dateData.avgTemp = totalTemp / count;

                dateData.maxTemp = Math.max(...dateData.timeData.map(entry => entry.temp));
                dateData.minTemp = Math.min(...dateData.timeData.map(entry => entry.temp));
            }
        }

        await climateRecord.save();
        res.status(201).json({
          message: 'Climate data saved successfully',
          avgTemp: climateRecord.places.find(p => p.placeName === location)
              .dates.find(d => d.day.toISOString().split('T')[0] === date)
              .avgTemp,
          minTemp: climateRecord.places.find(p => p.placeName === location)
              .dates.find(d => d.day.toISOString().split('T')[0] === date)
              .minTemp,
          maxTemp: climateRecord.places.find(p => p.placeName === location)
              .dates.find(d => d.day.toISOString().split('T')[0] === date)
              .maxTemp
      });
    } catch (error) {
        console.error('Error in POST /climate:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
});

module.exports = router;
