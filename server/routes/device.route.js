const router = require('express').Router();
const axios = require('axios');

let Data = require('./../models/data.model');

router.route('/update').get((req, res) => {
	const url = "https://api.sinric.pro/api/v1/devices/";

	Data.findById("62b17fae197f8dce3cfd7915")
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

					response.data.devices.map((device) => 	{
						devices.push(device.id);
					})

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

	Data.findById("62b17fae197f8dce3cfd7915")
		.then(data => {
			res.send({ success: true, devices: data.devices })
		})	
});

router.route('/wol/toggle').get((req, res) => {
	Data.findById("62b17fae197f8dce3cfd7915")
		.then(data => {
			data.wol = !data.wol;

			data.save()
				.then(() => {
					res.send({ success: true, value: data.wol, message: `[SUCCESS] value is ${data.wol}`});
				})
				.catch((err) => {
					res.send({ success: false, message: err.message});
				})
		})	
});

router.route('/wol/get').get((req, res) => {
	Data.findById("62b17fae197f8dce3cfd7915")
		.then(data => {
			res.send({ success: true, value: data.wol, message: `[SUCCESS] value is ${data.wol}`});
		})
		.catch((err) => {
				res.send({ success: false, message: err.message});
		})	
});

router.route('/pc_state/update/:value').get((req, res) => {
	const value = req.params.value;

	Data.findById("62b17fae197f8dce3cfd7915")
		.then(data => {
			data.pc_state = value;

			data.save()
				.then(() => {
					res.send({ success: true, value: data.pc_state, message: `[SUCCESS] value is ${data.pc_state}`});
				})
				.catch((err) => {
					res.send({ success: false, message: err.message});
				})
		})	
});

router.route('/pc_state/get').get((req, res) => {
	Data.findById("62b17fae197f8dce3cfd7915")
		.then(data => {
			res.send({ success: true, value: data.pc_state, message: `[SUCCESS] value is ${data.pc_state}`});
		})
		.catch((err) => {
				res.send({ success: false, message: err.message});
		})	
});

router.route('/reset').get((req, res) => {
	Data.findById("62b17fae197f8dce3cfd7915")
		.then(data => {
			data.username = "";
			data.password = "";
			data.devices = [];
			data.accessToken = "";
			data.apiKey = "";
			data.wol = false;

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