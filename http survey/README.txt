run with >node app.js

dependencies:
	express
	body-parser
	express-session
modules:
	controller.js

let express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var module = require('./controller.js');

Design*************************************

view engine: ejs

routes:
	+survey
		-pref
	+match

survey checks form actions like "next", "previous", and the actions from the preferences page

pref just renders the preferences page

match requests user, which was set at index, and renders matched users