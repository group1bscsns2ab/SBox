const router = require('express').Router();
const axios = require('axios');

let Data = require('./../models/data.model');

router.route('/update').get((req, res) => {
	const url = "https://api.sinric.pro/api/v1/credentials/appkeyandsecret";

	Data.findById(process.env.DOCID)
		.then(data => {
			axios.get(url, {
				headers: {
					authorization: `Bearer  ${data.accessToken}`,
					'Content-Type': 'application/x-www-form-urlencoded' 
				}
			})
			.then(response => {
				data.appkey = response.data.credentials[0].appkey;
				data.appsecert = response.data.credentials[0].appsecert;

				data.save()
					.then(() => {
						res.send({ success: true, 
						   message: "Credential update success." })
					})
				
			})
			.catch(error => {
				res.send({ success: false, message: error.message}); 
			})
		})
	
});

router.route('/get').get((req, res) => {
	Data.findById(process.env.DOCID)
		.then(data => {
			res.send({ success: true, 
					   appkey: data.appkey,
					   appsecert: data.appsecert,
					   message: "Credential get success."})
		})
		.catch(error => {
				res.send({ success: false, message: error.message}); 
			})
});

module.exports = router;