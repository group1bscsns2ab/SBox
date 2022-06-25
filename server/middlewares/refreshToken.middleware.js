// const axios = require('axios');

// let Data = require('./../models/data.model');

// // Check if token is expired
// const refreshToken = (req, res, next) => {
// 	Data.findById("62b15b2048f88bdb9be19814")
// 		.then(data => {
// 			if(data.tokenExpiration < new Date()/1000) {
// 				const url = "https://api.sinric.pro/api/v1/auth/refresh_token";

// 				axios.get(url, {
// 					refreshToken: data.refreshToken,
// 					accountId: data.acccountId
// 				},{
// 					headers: {
// 						'Content-Type': 'application/x-www-form-urlencoded' 
// 					}
// 				})
// 				.then((response) => {
// 					data.accessToken = response.accessToken;
// 					data.refreshToken = response.refreshToken;
// 				})
// 			}
// 		})
// }

// module.exports = refreshToken;