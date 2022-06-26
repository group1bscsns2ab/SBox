const router = require('express').Router();
const axios = require('axios');

let Data = require('./../models/data.model');

router.route('/update').get((req, res) => {
	const url = "https://api.sinric.pro/api/v1/devices/";

	Data.findById(process.env.DOCID)
		.then(data => {
			if(data.accessToken) {
				axios.get(url, {
					headers: {
						authorization: "BEARER " + data.accessToken,
						'Content-Type': 'application/x-www-form-urlencoded' 
					}
				})
				.then(response => {
					let devices = [];

					response.data.devices.map((device, index) => {
						if(index === 6) continue;
						else devices.push([device.id, device.name]);
						
					})

					console.log(devices);

					data.devices = devices;

					data.save()
						.then(() => {
							res.send({ devices: devices, success: true});
						})
				})
			}
			else {
				res.send({ success: false, message: "API Key or Login Credentials are required to access devices."});
			}
			
		})	
});

router.route('/get').get((req, res) => {
	const url = "https://api.sinric.pro/api/v1/devices/";

	Data.findById(process.env.DOCID)
		.then(data => {
			res.send({ success: true, devices: data.devices })
		})	
});


router.route('/PC/ipaddress/:ipaddress/:macaddress').get((req, res) => {
	const ipaddress = req.params.ipaddress;
	const macaddress = req.params.macaddress;

	Data.findById(process.env.DOCID)
		.then(data => {
			data.PC[0] = ipaddress;
			data.PC[1] = macaddress;

			data.save()
				.then(() => {
					res.send({ message: "Success.", success: true});
				})
		})	
});


router.route('/reset').get((req, res) => {
	Data.findById(process.env.DOCID)
		.then(data => {
			data.username = "";
			data.password = "";
			data.devices = [];
			data.accessToken = "";
			data.apiKey = "";
			data.PC = [];
			data.appkey = "";
			data.appsecert = "";

			data.save()
				.then(() => {
					res.send({ success: true, message: '[SUCCESS]'});
				})
				.catch((err) => {
					res.send({ success: false, message: err.message});
				})
		})	
})

module.exports = router;