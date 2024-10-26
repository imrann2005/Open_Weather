const express = require('express');
const server = express();
const ClimateData = require('./api/climate_api'); // Uncomment this line

const allowCrossOrigin = require('cors');
server.use(allowCrossOrigin());
server.use(express.json());

const dbConnector = require('mongoose');
dbConnector.connect('mongodb://127.0.0.1:27017/Open_weather', {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Recommended for new applications
});

const connection = dbConnector.connection;
connection.on('error', (err) => console.log(err));
connection.on('open', () => console.log('Database Connected...'));

server.use('/climate', ClimateData); // Register the ClimateData router

server.listen(5557, () => console.log('The server is live now....'));
