// Check if api key is correct
const apiKey = (req, res, next) => {
	if (req.headers['x-api-key'] === process.env.API_KEY) {
		next();
	}
	else {
		res.send({ message: 'Access Denied.'})
	}
}

module.exports = apiKey;