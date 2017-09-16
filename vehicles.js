var db = require('./mongodb');
var VehiclesList = db.MyModel;


exports.findAll = function (req, res, next) {
	VehiclesList.find({}).lean().exec(
		function (err, vehicles) {
			res.send(vehicles);
		}
	)
	.catch(next);
};

exports.findById = function (req, res, next) {
	var id = req.params.id;
	VehiclesList.findOne({vid: id}).lean().exec(
		function (err, vehicle) {
			if (err || vehicle == null) {
				res.send({msg: "failed"});
			} else {
				res.send(vehicle);
			}
		}
	)
	.catch(next);
};

exports.findByTerms = function (req, res, next) {
	var queryField = req.query.q;

	VehiclesList.find({ $or:
		[
			{veiculo: new RegExp('.*' + queryField + '.*', "i")},
			{descricao: new RegExp('.*' + queryField + '.*', "i")}
		]
	}).lean().exec(
		function (err, vehicles) {
			if (err || vehicles == null || vehicles.length == 0) {
				res.send({msg: "failed"});
			} else {
				res.send(vehicles);
			}
		}
	)
	.catch(next);
};


exports.insert = function (req, res, next) {
	var veiculo = req.body.veiculo;
	var marca = req.body.marca;
	var descricao = req.body.descricao;
	var vendido = req.body.vendido;

	var cursor = VehiclesList.find( {}, { vid: 1 } ).sort( { vid: -1 } ).limit(1).lean().exec(
		function (err, position) {
			var seq = position[0] != null ? position[0].vid + 1 : 1;

			var Vehicle = db.MyModel;
			var vehicle = new Vehicle(
				{
					vid: seq,
					veiculo: veiculo,
					marca: marca,
					descricao: descricao,
					vendido: vendido
				}
			);

			vehicle.save(function () {
				res.send(vehicle);
			});
		}
	)
	.catch(next);
};

exports.updateById = function (req, res, next) {
	var id = req.params.id;

	var veiculo = req.body.veiculo;
	var marca = req.body.marca;
	var descricao = req.body.descricao;
	var vendido = req.body.vendido;

	var set = {
		veiculo : veiculo,
		marca : marca,
		descricao : descricao,
		vendido : vendido
	};

	VehiclesList.update({vid: id}, set,
		function (err, vehicles) {
			if (err || vehicles.n == 0) {
				res.send({msg: "failed"});
			} else {
				res.send({msg: "ok"});
			}
		}
	);
};

exports.cleanUpdateById = function (req, res, next) {
	var id = req.params.id;
	console.log(id);
	console.log(req.body);

	VehiclesList.update({vid: id}, { $set: req.body },
		function (err, vehicles) {
			console.log(vehicles);
			if (err || vehicles.n == 0) {
				res.send({msg: "failed"});
			} else {
				res.send({msg: "ok"});
			}
		}
	);
};

exports.delete = function (req, res, next) {
	var id = req.params.id;
	VehiclesList.find({vid: id}).remove().lean().exec(
		function (err, vehicles) {
			if (err || vehicles.result.n == 0) {
				res.send({msg: "failed"});
			} else {
				res.send({msg: "ok"});
			}
		}
	)
	.catch(next);
};

exports.clear = function (req, res, next) {
	VehiclesList.find({}).remove().lean().exec(
		function (err, vehicles) {
			res.send({msg: "ok"});
		}
	)
	.catch(next);
};

