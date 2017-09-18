var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testbruno');


var vehiclesSchema = new mongoose.Schema(
	{
		vid:       Number,
		veiculo:   String,
		marca:     String,
		descricao: String,
		vendido:   Boolean,
		created: {type: Date, default: Date.now()},
		updated: {type: Date, default: Date.now()}
	},
	{ collection: 'vehiclescollection' }
);

module.exports = { Mongo: mongoose, VehiclesSchema: vehiclesSchema }
module.exports = { MyModel: mongoose.model('vehiclescollection', vehiclesSchema, 'vehiclescollection') };