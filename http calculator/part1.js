let express = require('express');
var bodyParser = require('body-parser');
var module = require('./lab1act2partC.js');

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');


var outputHis = []; 
var outputStr;
var value = 0;



app.get('/', function(req, res) {
	res.set('Cache-Control', 'no-cache, no-store');
	outputStr = outputHis.join("");
	res.render('index', {	output: outputStr,
							value: value});
});
app.get('/reset', function(req, res) {
	res.set('Cache-Control', 'no-cache, no-store');
	outputStr = "";
	outputHis = [];
	value = 0;
	module.reset();
	res.render('success');
	//res.redirect('/');
});

app.post('/add',function(req, res){
	res.set('Cache-Control', 'no-cache, no-store');
	if(req.body.action == "add") {
		var action = req.body.action;
		var number = req.body.number;

		value = module.calc(`{"op":"push", "expr": {"op":"${action}", "number":  ${number}}}`);
	}
	outputHis.push(action + " " + number + " " + req.ip + "\n" + req.headers['user-agent'] + "\n");
	res.render('success');
	//res.redirect('/');
});
app.post('/subtract',function(req, res){
	res.set('Cache-Control', 'no-cache, no-store');
	if(req.body.action == "subtract") {
		var action = req.body.action;
		var number = req.body.number;
		
		value = module.calc(`{"op":"push", "expr": {"op":"${action}", "number":  ${number}}}`);
	}
	outputHis.push(action + " " + number + " " + req.ip + "\n" + req.headers['user-agent'] + "\n");
	res.render('success');
	//res.redirect('/');
});
app.post('/pop',function(req, res){
	res.set('Cache-Control', 'no-cache, no-store');
	if(req.body.action == "pop") {
		value = module.calc('{"op":"pop"}');
	}
	outputHis.pop();
	res.render('success');
	//res.redirect('/');
});
app.get('*', function(req, res){
	res.set('Cache-Control', 'no-cache, no-store');
	res.render('404');
});

app.listen(8088, () => console.log('listening on port 8088'));