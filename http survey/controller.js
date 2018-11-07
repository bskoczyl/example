var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
var userObj = JSON.parse(fs.readFileSync('userAnswers.json', 'utf8'));

var popped = null;

exports.add = function(req, user, question, num) {						//change answer of user
	var contains = false;
	for(var i = 0; i < userObj.data.length; i++) {
		if(userObj.data[i].user == user && userObj.data[i].question == question) {
			userObj.data[i].answer = req.body.answer;
			contains = true;
		}
	}
	if(contains == false) {																									//create new user
		userObj.data.push({"user": user, "question": question, "answer": req.body.answer, "number": num});
	}
}
exports.remove = function(num) {
	popped = userObj.data.pop();
	popped = popped.answer;
}
exports.complete = function() {													//write json to file once survey complete
	fs.writeFileSync('userAnswers.json', JSON.stringify(userObj, null, 4));
	popped = null;
}
exports.question = function(num) {										//return question at index num
	var q = obj.questions[num].question;
	return q;
}

exports.answers = function(num) {
	var a = obj.questions[num].answers;
	return a;
}

exports.length = function() {
	return Object.keys(obj.questions).length;
}

exports.getPopped = function() {				//for saving answer when user hits previous
	return popped;
}
exports.getAnswer = function(user, question) {													//return answer for populating returning users' answers
	for(var i = 0; i < userObj.data.length; i++) {
		if(userObj.data[i].user == user && userObj.data[i].question == question) {
			return userObj.data[i].answer;
		}	
	}
}

exports.match = function(user) {
	//var match = {user:"", matchingAnswers:0}; format
	var userAnswers = [];
	var matchedAnswers = [];
	var matchedUsers = [];
	var finalArray = [];
	for(var i = 0; i < userObj.data.length; i++) {			//reduce to answers by this user
		if(userObj.data[i].user == user) {
			userAnswers.push(userObj.data[i]);
		}
	}	
	for(var i = 0; i < userAnswers.length; i++) {			//reduce to answers by this user for this question
		for(var k = 0; k < userObj.data.length; k++) {
			if(userAnswers[i].question == userObj.data[k].question && userAnswers[i].answer == userObj.data[k].answer) {
				matchedAnswers.push(userObj.data[k]);
			}
		}
	}
	for(var i = 0; i < matchedAnswers.length; i++) {		//push users with matched answer
		matchedUsers.push(matchedAnswers[i].user);
	}
	for(var i = 0; i < matchedUsers.length; i++) {
		
		if(myIncludes(matchedUsers[i], finalArray)) {						//increment num of matches if user is already present
			for(var k = 0; k < finalArray.length; k++) {
				if(finalArray[k].user == matchedUsers[i]) {
					finalArray[k].matchedAnswers++;
				}
			}
		}			
		else {
			finalArray.push({"user": matchedUsers[i], "matchedAnswers":1});				//create match
		}
	}
	finalArray.splice(myIndexOf(user, finalArray), 1);									//remove this user from list of matched answers
	
	//straight from w3schools
	finalArray.sort(function(a,b) {return b.matchedAnswers - a.matchedAnswers;});		//sort number of matched answers

	console.log(finalArray);
	return finalArray;
}

function myIncludes(user, array) {							//find if array includes by var inside object
	var includes = false;
	for(var i = 0; i < array.length; i++) {
		if (array[i].user == user) {
			includes = true;
			break;
		}
	}
	return includes;
}
function myIndexOf(user, array) {							//find index of user inside object
	var index = 0;
	for(var i = 0; i < array.length; i++) {
		if (array[i].user == user) {
			index = i;
			break;
		}
	}
	return index;
}