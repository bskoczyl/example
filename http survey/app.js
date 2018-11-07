let express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var module = require('./controller.js');

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');


var user = "";

var loggedIn = false;

app.use(session({
	secret: 'MAGICALEXPRESSKEY',
	resave: true,
	saveUninitialized: true,
}));


app.all('/', function(req, res) {
	res.set('Cache-Control', 'no-cache, no-store');
	console.log("start");
	res.render('index');
});

app.all('/survey', function(req, res) {
	res.set('Cache-Control', 'no-cache, no-store');
	if(req.body.action == "survey") {
		loggedIn = true;
		user = req.body.username;
		req.session.count = 0;
		req.session.time = Date.now() + 60000;
		req.session.pref = "horizontal";
	}
	if(req.body.action == "next") {
		if(req.session.time > Date.now()) {
			if(loggedIn) {
				module.add(req, user, module.question(req.session.count), req.session.count);
				req.session.count += 1;
			}
			else{res.render('loginErr');}		
		}
		else {
			req.session.destroy();
			res.redirect('/');
		}
	}
	if(req.body.action == "previous") {
		if(req.session.count > 0) {
			if(req.session.time > Date.now()) {
				if(loggedIn) {
					req.session.count -= 1;
					module.remove(req.session.count);
				}
				else{res.render('loginErr');}		
			}
			else {
				req.session.destroy();
				res.redirect('/');
			}	
		}		
	}
	if(req.body.action == "ok") {
		req.session.pref = req.body.pref;
		console.log(req.body.action);
	}
	
	if(loggedIn) {
		req.session.action = req.body.pref;
		if(req.session.count < module.length()) {
			if(req.session.pref == "horizontal") {
				res.render('questions', {	pageNum: req.session.count + 1,
											userName: user,
											question: module.question(req.session.count),
											answers: module.answers(req.session.count),
											prevAnswer: module.getAnswer(user, module.question(req.session.count)),
											popped: module.getPopped()});
			}
			else if(req.session.pref == "vertical") {
				res.render('questionsV', {		pageNum: req.session.count + 1,
												userName: user,
												question: module.question(req.session.count),
												answers: module.answers(req.session.count),
												prevAnswer: module.getAnswer(user, module.question(req.session.count)),
												popped: module.getPopped()});	
			}
		}
		else {
			res.render('complete');
			module.complete();
			req.session.destroy();
			loggedIn = false;
		}
	}
	else{res.render('loginErr');}
});

app.all('/match', function(req, res) {
	res.set('Cache-Control', 'no-cache, no-store');
	if(req.body.action == "match") {
		loggedIn = true;
		user = req.body.username;

		res.render('matches', {	userName: user,
								array: module.match(user)});
	}	
	else{res.render("405");}
});

app.all('/pref', function(req, res) {
	res.set('Cache-Control', 'no-cache, no-store');
	if(loggedIn) {
		res.render('pref');
	}
	else{res.render('loginErr');}
});

app.get('*', function(req, res){
	res.set('Cache-Control', 'no-cache, no-store');
	res.render('404');
});
app.listen(8088, () => console.log('listening on port 8088'));