

let mongoose = require('mongoose')
let Schema = mongoose.Schema


var LightSchema = new Schema( {
	username: String,
	name: String,
	date: { type: Date, default: Date.now },
	size_x: Number,
	size_y: Number,
	frames: [ {} ]
	// frames: { type: Array, default: [] }
})

let Light = mongoose.model('Light', LightSchema)
module.exports = Light;

