const express = require('express');
const server = express();

const allowCrossOrigin = require('cors');
server.use(allowCrossOrigin());
server.use(express.json());

const dbConnector = require('mongoose');
dbConnector.connect('mongodb://127.0.0.1:27017/Open_weather', {
  useNewUrlParser: true,
});

const connection = dbConnector.connection;
connection.on('error', (err) => console.log(err));
connection.on('open', () => console.log('Database Connected...'));

const ClimateData = require('./api/climate_api');
server.use('/climate', ClimateData);

server.listen(5557, () => console.log('The server is live now....'));
