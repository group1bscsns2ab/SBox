const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const apiKey = require('./middlewares/apiKey.middleware');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// MIDDLESWARES
app.use(express.json(),
		cors(),
		bodyParser.urlencoded({extended: true}),
		bodyParser.json(),
		apiKey);

// MONGODB CONNECTION
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, () => {
	useNewUrlParser: true;
	useCreateIndex: true;
	useUnifiedTopology: true;
});

const connection = mongoose.connection;

connection.once('open', () => {
	console.log('MongoDB database connection is established.');
});

// ROUTES
const AuthenticationRouter = require('./routes/authentication.route');
const CredentialRouter = require('./routes/credential.route');
const DeviceRouter = require('./routes/device.route');

app.use('/authentication', AuthenticationRouter);
app.use('/credential', CredentialRouter);
app.use('/device', DeviceRouter);

app.listen(port,() => {
	console.log(`\nServer is running in port: \x1b[32m${port}\x1b[0m\n`);
})

// Shows server is reachable
app.get("/", (req, res) => {
	res.send("<html><head><title>API</title></head><body>200 OK</body></html>");
})

exports.app = app;