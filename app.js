const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/MonitorRoutes');

app
.use(morgan('dev'))
.use(bodyParser.urlencoded({extended: true}))
.use(bodyParser.json())

.use('/api', userRoutes)
module.exports = app; 