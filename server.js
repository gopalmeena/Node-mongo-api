var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;

var port = process.env.PORT||3000;
var hostname = '127.0.0.1';

var app = express()

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Connect to the db

MongoClient.connect("mongodb://localhost:27017/local", function(err, db) {
	if(!err){
		var router = express.Router();

		router.use(function(req,res,next){
			console.log("Request type is "+req.method);
			next();
		});


		router.route('/student')
		.get(function(req,res){
			db.collection('student').find().toArray(function(err,result){
				res.json({Status:"OKAY",data:result});
				console.log(result);
			})
		})
		.post(function(req,res){
			var collection = db.collection('student');
			console.log(collection);
			var user = {name:req.body.name, age:req.body.age, address:req.body.address};
			console.log(user);
			collection.insert(user,function(err,result){
				if(err){
					console.log("Mongo insertion error "+err);
				}
			})
			res.json({status:201,message:"Successfully Created"});
		});
		
		app.use('/api',router);
	}
	else{
		throw new Error(err);
		console.log("Mongo connection error"+err);
	}
});
app.listen(port,hostname,function(){
	console.log(`Server listening at http://${hostname}:${port}`);
});
