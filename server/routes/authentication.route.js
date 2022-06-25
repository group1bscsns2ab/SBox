const router = require('express').Router();
const axios = require('axios');

let Data = require('./../models/data.model');

router.route('/update/login').post((req, res) => {
	Data.findById(process.env.DOCID)
		.then(data => {
			data.username = req.body.username;
			data.password = req.body.password;

			data.save()
				.then(() => res.send({ message: "[SUCCESS] Login details updated.",
									   success: true}))
				.catch(err => res.status(400).send({message: err, 
											    success: false}));
		})
		.catch(err => res.status(400).send({ message: err, 
											 success: false}));
});

router.route('/update/apiKey').post((req, res) => {
	Data.findById(process.env.DOCID)
		.then(data => {
			data.apiKey = req.body.apiKey;

			data.save()
				.then(() => res.send({ message: "[SUCCESS] API key updated.",
									   success: true}))
				.catch(err => res.status(400).send({message: err.mesage, 
											    success: false}));
		})
		.catch(err => res.status(400).send({ message: err.message, 
											 success: false}));
});

router.route('/update/appkey-appsecert').post((req, res) => {
	Data.findById(process.env.DOCID)
		.then(data => {
			data.appkey = req.body.appkey;
			data.appsecert = req.body.appsecert;

			data.save()
				.then(() => res.send({ message: "[SUCCESS] App Key and App Secret updated.",
									   success: true}))
				.catch(err => res.status(400).send({message: err.mesage, 
											    success: false}));
		})
		.catch(err => res.status(400).send({ message: err.message, 
											 success: false}));
});

router.route('/authenticate/:method').get((req, res) => {
	const url = "https://api.sinric.pro/api/v1/auth"
	const method = req.params.method

	Data.findById(process.env.DOCID)
		.then(data => {
			if (method === "api_key") {
				axios.post(url, { client_id: "iot-app"} , {
					headers: {
						'x-sinric-api-key' : data.apiKey,
	  					'Content-Type'  : 'application/x-www-form-urlencoded' 
					}
				})
				.then(response => {
					data.accessToken = response.data.accessToken;
					
					data.save()
					.then(() => res.send({ message: "[SUCCESS] Authenticated using API Key.",
										   success: true}))
					.catch(err => res.status(400).send({message: err, 
											    success: false}));
				})
			}
			else if (method === "login") {
				const auth = "Basic " + new Buffer.from(data.username + ":" + data.password).toString("base64");

				axios.post(url, { client_id: "iot-app"} ,{
					headers: {
						'Authorization' : auth,
      					'Content-Type'  : 'application/x-www-form-urlencoded' 
					}
				})
				.then(response => {
					data.accessToken = response.data.accessToken;

					data.save()
						.then(() => res.send({ message: "[SUCCESS] Authenticated using Login.",
											   success: true}))
						.catch(err => res.status(400).send({message: err, 
											    success: false}));
				})

			}
			else {
				res.send({ message: "API key nor credentials are set.",
									   success: false})
			}
		})
		.catch(err => res.status(400).send({ message: err, 
											 success: false}));


});



module.exports = router;