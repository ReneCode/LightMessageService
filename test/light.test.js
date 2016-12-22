let assert = require('chai').assert
//let re = require('regex')
let superagent = require('superagent')
let server = require('../server')
let Light = require('../models/light')

let URL = 'http://localhost:3000/lights'


describe('REST interface light', function() {
	let api;

	before(function(done) {
		api = server.listen(3000, function() {
			done();
		});
	})

	after(function() {
		api.close();
	})

	beforeEach(function(done) {
		Light.remove({}, function(err) {
			done();
		})
	})

	function getTestData() {
		let l1 = {
			username:"11", 
			date:new Date(2010, 5, 2, 11, 44),
			size_x: 34,
			frames: [
				{ 	leds: [ 1,1,3,4 ]  },
				{ 	leds: [ 'red', 'green', 'blue' ]  }
			] 
		};
		let l2 = {
			username:"22", 
			date:new Date(2010, 5, 2, 11, 46),
			frames: [
				{ 	leds: [ 2,2,3,4 ]  },
				{ 	leds: [ 5,6,7,8 ]  }
			] 
		};
		let l3 = {
			username:"33", 
			date:new Date(2010, 5, 2, 11, 33),
			frames: [
				{ 	leds: [ 3,3,3,4 ]  }
			] 
		};

		return [ l1, l2, l3 ];
	}

	function createTestData(callback) {
		let data = getTestData();
		Light.create( data, (err, data) => {
			if (err) {
				callback(null)
			} else {
				callback(data);
			}
		})

	}

	// create Test data
	it ('should create TestData', function(done) {
		let data = getTestData();
		createTestData( (result) => {
			assert.equal(result.length, data.length)
			Light.findById(result[0]._id, (err, doc) => {
				// use sameDeepMembers when comparing mongoose arrays
				assert.sameDeepMembers(doc.frames, result[0].frames);
				assert.deepEqual(doc._id, result[0]._id)
				assert.equal(doc.size_x, result[0].size_x)
				done();
			})
		})
	})


	// GET
	it ('should provide GET', function(done) {
		superagent.get(URL, function(err, res) {
			assert.ifError(err)
			done();
		})
	})

	it ('should get data from GET', function(done) {
		let data = getTestData();
		createTestData( result => {
			superagent.get(URL, function(err, res) {
				assert.equal(res.body.length, data.length)
				assert.deepEqual(data[0].frames, res.body[0].frames)
				done();
			});
		})
	})

	it ('should get one latest data from GET', function(done) {
		let data = getTestData();
		// data[1] has the newest data
		createTestData( (result) => {
			let url = URL + '/latest'
			superagent.get(url, function(err, res) {
				assert.isNotNull(res.body)
				assert.equal(res.body.username, data[1].username)
				assert.deepEqual(res.body.frames, data[1].frames)
				done();
			})
		});
	})
	

	// POST
	it ('should provide POST', function(done) {
		superagent.post(URL, {}, function(err, res) {
			assert.ifError(err)		
			done();
		})
	})

	it ('should return status 201 from POST', function(done) {
		let data = getTestData()
		let currentDate = Date.now();
		superagent.post(URL)
		.set('Content-Type', 'application/json')
		.send(data[0])
		.end(function(err, res) {
			assert.equal(201, res.statusCode)	
			assert.include(res.text, '/lights/');
			assert.match(res.text, /\/lights\/[\w]+$/);

			// get created object
			Light.findOne({}, (err, doc) => {
				// date should be set
				assert.closeTo(doc.date.getTime(), currentDate, 1000)
				assert.sameDeepMembers(doc.frames, data[0].frames)
				done();

			})
		})
	})

	// PUT
	it ('should return 404 on bad id on PUT', function(done) {
		let url = URL + '/abc';
		superagent.put(url, {}, (err, res) => {
			assert.equal(res.statusCode, 404)		
			done();
		})
	})

	it ('should update light PUT', function(done) {
		createTestData( data => {
			let id = data[0]._id;
			let url = URL + '/' + id;
			let l2 = {
					username:"333", 
					frames: [
						{ 	leds: [ '34', 'abc', 'qqq' ]  },
						{ 	duration: 43, leds: [ 'abc' ]  }
					] 
			}

			let currentDate = Date.now();
			superagent.put(url)
			.send(l2)
			.end(function(err, res) {
				assert.equal(res.statusCode, 200)	
				Light.findById(id, (err, data) => {
					assert.deepEqual(data.username, l2.username)
					assert.sameDeepMembers(data.frames, l2.frames)
					assert.closeTo(data.date.getTime(), currentDate, 1000)
					done();
				})
			})

		});
	})
})


