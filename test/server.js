var chai = require("chai");
var expect = chai.expect;

var httpMocks = require('node-mocks-http');
var request = require('supertest');

var api = require("../server.js");
var vehicles = require('../vehicles.js');

var clearList = function(done) {
	request(api)
		.delete('/veiculos/limpar')
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("ok");
			done();
		});
}

var listShouldBeEmpty = function(done) {
	request(api)
		.get('/veiculos')
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.length).to.equal(0);
			done();
		});
}

var listShouldHave = function(n, done) {
	request(api)
		.get('/veiculos')
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.length).to.equal(n);
			done();
		});
}

var listShouldHaveOne = function(done) {
	listShouldHave(1, done);
}


var findByIndexShouldBeEmpty = function(index, done) {
	request(api)
		.get('/veiculos/'+index)
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("failed");
			done();
		});
}

var findByIndexShouldBe = function(index, carName, done) {
	request(api)
		.get('/veiculos/'+index)
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.veiculo).to.equal(carName);
			done();
		});
}

var findByIndexShouldBeSold = function(index, sold, done) {
	request(api)
		.get('/veiculos/'+index)
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.vendido).to.equal(sold);
			done();
		});
}

var findByQueryShouldBeEmpty = function(carName, done) {
	request(api)
		.get('/veiculos/find?q='+carName)
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("failed");
			done();
		});
}


var findByQueryShouldNotBeEmptyButDontHaveIt = function(carName, done) {
	request(api)
		.get('/veiculos/find?q='+carName)
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("failed");
			done();
		});
}

var findOneByQuery = function(carName, done) {
	request(api)
		.get('/veiculos/find?q='+carName)
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.length).to.equal(1);
			done();
		});
}


var insertIntoIndexAsync = function(carName, index) {
	request(api)
		.post('/veiculos')
		.send({
			"veiculo": carName,
			"marca": "Ford",
			"descricao": "Carro Normal",
			"vendido": false
		})
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.veiculo).to.equal(carName);
		});
}

var insertIntoIndex = function(index, carName, done) {
	request(api)
		.post('/veiculos')
		.send({
			"veiculo": carName,
			"marca": "Ford",
			"descricao": "Carro Normal",
			"vendido": true
		})
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.vid).to.equal(index);
			expect(res.body.veiculo).to.equal(carName);
			done();
		});
}


var insertTheOne = function(carName, done) {
	insertIntoIndex(1, carName, done);
}

var insertTheOneNTimes = function(carName, n, done) {
	var doneCounter = 0;

    for(var i = 0; i < n; i++) {
    	request(api)
		.post('/veiculos')
		.send({
			"veiculo": carName,
			"marca": "Ford",
			"descricao": "Carro Normal",
			"vendido": false
		})
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.veiculo).to.equal(carName);

			++doneCounter;
            if (doneCounter === n) {
                done();
            }
		});
    }
}

var updateByIndex = function(index, carNamePart, done) {
	request(api)
		.put('/veiculos/' + index)
		.send({
			"veiculo": carNamePart,
			"marca": "Ford",
			"descricao": "Carro modelo " + carNamePart + " Normal",
			"vendido": true
		})
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("ok");
			done();
		});
}

var updateByIndexTryPartial = function(index, carNamePart, done) {
	request(api)
		.put('/veiculos/' + index)
		.send({
			"veiculo": carNamePart,
			"marca": "Ford"
		})
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("ok");
			done();
		});
}

var updateByInvalidIndex = function(index, carNamePart, done) {
	request(api)
		.put('/veiculos/' + index)
		.send({
			"veiculo": carNamePart,
			"marca": "Ford",
			"descricao": "Carro modelo " + carNamePart + " Normal",
			"vendido": true
		})
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("failed");
			done();
		});
}

var partialUpdateNameByIndex = function(index, fieldValue, done) {
	request(api)
		.patch('/veiculos/' + index)
		.send({
			"veiculo": fieldValue
		})
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("ok");
			done();
		});
}

var partialUpdateDescriptionByIndex = function(index, fieldValue, done) {
	request(api)
		.patch('/veiculos/' + index)
		.send({
			"descricao": fieldValue
		})
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("ok");
			done();
		});
}

var partialUpdateByInvalidIndex = function(index, fieldValue, done) {
	request(api)
		.patch('/veiculos/' + index)
		.send({
			"veiculo": fieldValue
		})
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("failed");
			done();
		});
}


var deleteByIndex = function(index, done) {
	request(api)
		.delete('/veiculos/'+index)
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("ok");
			done();
		});
}

var deleteTheOne = function(done) {
	deleteByIndex(1, done);
}


var deleteTheOneWhenNone = function(done) {
	request(api)
		.delete('/veiculos/1')
		.end(function(err, res) {
			expect(res.statusCode).to.equal(200);
			expect(res.body.msg).to.equal("failed");
			done();
		});
}





describe("Test Vehicles class", function() {
	it("Should empty the mongo collection", function() {
		var req  = httpMocks.createRequest();
		var res = httpMocks.createResponse();
		vehicles.clear(req, res);


		describe("Vehicles List", function() {
			it("Should start empty", function(done) {
				listShouldBeEmpty(done);
			});

			it("Should follow inserts and deletes", function() {

				describe("The insert of a vehicle", function() {
					it("Should insert a new vehicle", function(done) {
						insertTheOne("Ford Fusion", done);
					});
				});


				describe("The list of vehicles", function() {
					it("Should not be empty", function(done) {
						listShouldHaveOne(done);
					});
				});

			});


			it("Should be empty after a delete", function() {

				describe("The delete of the vehicle", function() {
					it("Should delete the new vehicle", function(done) {
						deleteTheOne(done);
					});
				});

				describe("The list of vehicles", function() {
					it("Should  be empty", function(done) {
						listShouldBeEmpty(done);
					});
				});

			});

			it("Should not change after a delete against a null set", function() {

				describe("The delete of the vehicle", function() {
					it("Should fail when nothing to delete", function(done) {
						deleteTheOneWhenNone(done);
					});
				});

				describe("The list of vehicles", function() {
					it("Should be empty", function(done) {
						listShouldBeEmpty(done);
					});
				});

			});
		}); // LIST ALL


		describe("Indexed search", function() {
			it("Should start empty", function(done) {
				findByIndexShouldBeEmpty(1, done);
			});

			it("Should follow inserts and deletes", function() {

				describe("The insert of a vehicle", function() {
					it("Should insert a new vehicle", function(done) {
						insertTheOne("Ford Fusion", done);
					});
				});


				describe("The indexed search of vehicles", function() {
					it("Should not be empty for the new indexed one", function(done) {
						findByIndexShouldBe(1, "Ford Fusion", done);
					});

					it("Should be empty for a non indexed one", function(done) {
						findByIndexShouldBeEmpty(2, done);
					});
				});

				describe("The delete of the vehicle", function() {
					it("Should delete the new vehicle", function(done) {
						deleteTheOne(done);
					});
				});

				describe("The indexed search of vehicles", function() {
					it("Should be empty", function(done) {
						findByIndexShouldBeEmpty(1, done);
					});
				});

			});
		}); // FIND BY INDEX

		describe("Queried search", function() {
			it("Should start empty", function(done) {
				findByQueryShouldBeEmpty("Ford Focus", done);
			});

			it("Should follow inserts and deletes", function() {

				describe("The insert of a vehicle", function() {
					it("Should insert a new vehicle", function(done) {
						insertTheOne("Ford Focus", done);
					});

					it("Should insert another new vehicle", function(done) {
						insertIntoIndex(2, "Ford T", done);
					});
				});

				describe("The queried search of vehicles", function() {
					it("Should not be empty for the new queried one", function(done) {
						findOneByQuery("Ford Focus", done);
					});

					it("Should be empty for a non queried one", function(done) {
						findByQueryShouldBeEmpty("Ford Fusion", done);
					});
				});

				describe("The delete of the vehicle", function() {
					it("Should delete a new vehicle", function(done) {
						deleteTheOne(done);
					});

					it("Should delete the another vehicle", function(done) {
						deleteByIndex(2, done);
					});
				});

				describe("The queried search of vehicles", function() {
					it("Should be empty", function(done) {
						findByIndexShouldBeEmpty(1, done);
					});
				});

			});
		}); // LIST BY QUERY

		describe("Insertions", function() {
			it("Should start empty", function(done) {
				listShouldBeEmpty(done);
			});

			it("Should follow inserts and deletes", function() {

				describe("The insert of a vehicle", function() {
					it("Should insert a new vehicle", function(done) {
						insertTheOne("Ford Fusion", done);
					});
				});


				describe("The list of vehicles", function() {
					it("Should not be empty", function(done) {
						listShouldHaveOne(done);
					});
				});

				describe("The delete of the vehicle", function() {
					it("Should delete the new vehicle", function(done) {
						deleteTheOne(done);
					});
				});

				describe("The list of vehicles", function() {
					it("Should  be empty", function(done) {
						listShouldBeEmpty(done);
					});
				});

			});

			it("Should support a multiple set of insert", function() {
				describe("The insert of a vehicle with ids", function() {
					it("Should work N times", function(done) {
						insertTheOneNTimes("Ford T", 100, done);
					});

					it("Should have a list of N elements", function(done) {
						listShouldHave(100, done);
					});
				});
			});

			it("Should clean everything", function() {
				describe("Before leave", function() {
					it("clean anything", function(done) {
						clearList(done);
					});
				});
			});
		}); // INSERTS


		describe("Full Updates", function() {
			it("Should start empty", function(done) {
				listShouldBeEmpty(done);
			});

			it("Should follow inserts", function() {

				describe("The update of a vehicle", function() {
					it("Should insert a new vehicle", function(done) {
						insertTheOne("Ford Focus", done);
					});

					it("Should insert another new vehicle", function(done) {
						insertIntoIndex(2, "Ford T", done);
					});

					it("Should insert and another new vehicle", function(done) {
						insertIntoIndex(3, "Ford K", done);
					});
				});


				describe("The list of vehicles", function() {
					it("Should not be empty", function(done) {
						listShouldHave(3, done);
					});
				});
			});

			it("Should test updates", function() {
				describe("The list of vehicles", function() {
					it("Should update index 3", function(done) {
						updateByIndex(3, "Ford Fusion", done);
					});

					it("Should update index 2", function(done) {
						updateByIndex(2, "Ford Eletron", done);
					});
				});

				describe("The vehicles list should be", function() {
					it("Should return without change", function(done) {
						findByIndexShouldBe(1, "Ford Focus", done);
					});

					it("Should return with change", function(done) {
						findByIndexShouldBe(2, "Ford Eletron", done);
					});
					
					it("Should return with change too", function(done) {
						findByIndexShouldBe(3, "Ford Fusion", done);
					});
				});

				describe("The tentative of update without passing all fields", function() {
					it("Should return failure", function(done) {
						updateByInvalidIndex(4, "Ford Power", done);
					});
				});

				describe("The tentative of update without passing all fields", function() {
					it("Should return ok", function(done) {
						updateByIndexTryPartial(2, "Ford Power", done);
					});

					it("Should not keep sold status", function(done) {
						findByIndexShouldBeSold(2, false, done);
					});
				});
			});

			it("Should clean everything", function() {
				describe("Before leave", function() {
					it("clean anything", function(done) {
						clearList(done);
					});
				});
			});
		}); // UPDATES


		describe("Partial Updates", function() {
			it("Should start empty", function(done) {
				listShouldBeEmpty(done);
			});

			it("Should follow inserts", function() {

				describe("The update of a vehicle", function() {
					it("Should insert a new vehicle", function(done) {
						insertTheOne("Ford Focus", done);
					});

					it("Should insert another new vehicle", function(done) {
						insertIntoIndex(2, "Ford T", done);
					});

					it("Should insert and another new vehicle", function(done) {
						insertIntoIndex(3, "Ford K", done);
					});
				});


				describe("The list of vehicles", function() {
					it("Should not be empty", function(done) {
						listShouldHave(3, done);
					});
				});
			});

			it("Should test updates", function() {
				describe("The list of vehicles", function() {
					it("Should update index 3", function(done) {
						partialUpdateNameByIndex(3, "Ford Fusion", done);
					});

					it("Should update index 2", function(done) {
						partialUpdateDescriptionByIndex(2, "Bom Carro", done);
					});
				});

				describe("The vehicles list should be", function() {
					it("Should return without change", function(done) {
						findByIndexShouldBe(1, "Ford Focus", done);
					});

					it("Should return without change in name too", function(done) {
						findByIndexShouldBe(2, "Ford T", done);
					});
					
					it("Should return with change", function(done) {
						findByIndexShouldBe(3, "Ford Fusion", done);
					});
				});

				describe("The tentative of update without passing all fields", function() {
					it("Should return failure", function(done) {
						partialUpdateByInvalidIndex(4, "Ford Power", done);
					});
				});

				describe("The tentative of update without passing all fields", function() {
					it("Should return ok", function(done) {
						updateByIndexTryPartial(2, "Ford Power", done);
					});

					it("Should not keep sold status", function(done) {
						findByIndexShouldBeSold(2, false, done);
					});
				});
			});

			it("Should clean everything", function() {
				describe("Before leave", function() {
					it("clean anything", function(done) {
						clearList(done);
					});
				});
			});
		}); // PARTIAL UPDATES


	});
});