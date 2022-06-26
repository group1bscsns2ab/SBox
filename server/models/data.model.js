const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dataSchema = new Schema({
	username: {
		type: String,
		required: false,
		trim: true
	},
	password: {
		type: String,
		required: false,
		trim: true
	},
	devices: {
		type: [],
		required: false
	},
	apiKey: {
		type: String,
		required: false,
		trim: true
	},
	accessToken: {
		type: String,
		required: false,
		trim: true
	},
	appkey: {
		type: String,
		required: false,
		trim: true
	},
	appsecert: {
		type: String,
		required: false,
		trim: true
	},
	PC: {
		type: [],
		required: false
	}
}, {
	timestamps: true
});

const Data = mongoose.model('datas', dataSchema);

module.exports = Data;