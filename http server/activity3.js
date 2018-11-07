var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var parser = new DOMParser();

var data = fs.readFileSync('news.xml', 'utf-8'); 
var doc = parser.parseFromString(data, 'text/xml');

var http = require('http');
var url = require('url');
var querystring = require('querystring');
var module = require('./NewsService.js');
// read in the private key and certificate

var userObj;
var user, pass, role, a, b;
var previousPage;
// create the secure echo server
http.createServer(function(request, response) {

	var urlObj = url.parse(request.url, true, true);
	var qstr = urlObj.query;
	

    if (urlObj.path == '/') {	
		previousPage = 'root';
		response.writeHead(200);
		response.end(loginHtml());
    } else if(qstr.page == 'view_news' && previousPage == 'root'){
		//data from form
		previousPage = 'view_news';
        var reqContent = "";
		var queriedData;
        request.on('data', function (chunk) {
            reqContent += chunk;
			
			queriedData =(querystring.parse(reqContent));
			
			user = (queriedData.username);
			pass = (queriedData.password);
			role = (queriedData.role);
			
			userObj = {_username: user,
					   _password: pass,
					   _role: role
			};
			
			a = user.toString();
			b = pass.toString();
			
			if(a == b) {
				request.on('end', function (chunk) {
				response.writeHead(200);
				
				if(role == "guest") {
					response.end(html1(userObj));
				}
				else if(role == "subscriber") {
					response.end(html2(userObj));
				}
				else if(role == "author") {
					response.end(html3(userObj));
				}
			});	
			}
			else {
				request.on('end', function (chunk) {
				//reqContent += chunk;
				response.writeHead(200);
				response.end("<html><a href=\"http://localhost:3000/\" </a><body>Login error, redirect to Login page</body></html>");
				});
			}			
        });
    } 
	else if(qstr.page == 'view_news' && previousPage == 'new_story'){
		var reqContent = "";
		var queriedData;
		previousPage = 'view_news';
        request.on('data', function (chunk) {
            reqContent += chunk;
			
			queriedData =(querystring.parse(reqContent));
			
			
			
			if(queriedData.saveCancel == "save") {
				module.writeNew(queriedData.title, queriedData.author, queriedData.date, queriedData.access, queriedData.content);
			}
			data = fs.readFileSync('news.xml', 'utf-8'); 
			doc = parser.parseFromString(data, 'text/xml');
			
			if(role == "guest") {
				response.end(html1(userObj));
			}
			else if(role == "subscriber") {
				response.end(html2(userObj));
			}
			else if(role == "author") {
				response.end(html3(userObj));
			}
		});
	}
	else if(qstr.page == 'new_story') {
		previousPage = 'new_story';
		response.writeHead(200);
		response.end(newStoryHtml(userObj));
	}
	else if(qstr.page == 'edit_story' && previousPage == 'view_story'){
		previousPage = 'edit_story';
		var title = parseBack(qstr.title);
		response.writeHead(200);
		response.end(editStory(userObj, title));
	}
	else if(qstr.page == 'view_news' && previousPage == 'edit_story'){
		var reqContent = "";
		var queriedData;
		
		previousPage = 'view_news';
        request.on('data', function (chunk) {
            reqContent += chunk;
			
			queriedData =(querystring.parse(reqContent));
			
			var title = queriedData.oldTitle;
			
			
			if(queriedData.saveCancel == "save") {
				console.log("saved");
				module.updateHeadLine(title, queriedData.title);
				module.changeContent(queriedData.title, queriedData.content);
			}
			data = fs.readFileSync('news.xml', 'utf-8'); 
			doc = parser.parseFromString(data, 'text/xml');
			
			if(role == "guest") {
				response.end(html1(userObj));
			}
			else if(role == "subscriber") {
				response.end(html2(userObj));
			}
			else if(role == "author") {
				response.end(html3(userObj));
			}
		});
	}	
	else if(qstr.page == 'view_story' && previousPage == 'view_news') {
		previousPage = 'view_story';
		var title = parseBack(qstr.title);
		console.log(title);
		
		response.end(viewStoryHtml(userObj, title));
		
	}
	else if(qstr.page == 'view_news' && previousPage == 'view_story') {
		previousPage = 'view_news';

		
		 request.on('data', function (chunk) {
            reqContent += chunk;
			
			queriedData =(querystring.parse(reqContent));
			
			console.log(queriedData.title);
			if(queriedData.undefineddeleteS == "delete") {
				console.log("deleted");
				module.deleteStory(queriedData.title);
			}
			data = fs.readFileSync('news.xml', 'utf-8'); 
			doc = parser.parseFromString(data, 'text/xml');
			
			if(role == "guest") {
				response.end(html1(userObj));
			}
			else if(role == "subscriber") {
				response.end(html2(userObj));
			}
			else if(role == "author") {
				response.end(html3(userObj));
			}
		});
	}	
		else if(qstr.page == 'view_story') {
		previousPage = 'view_story';
		var title = parseBack(qstr.title);
		console.log(title);
		
		response.end(viewStoryHtml(userObj, title));
		
	}
	else {

		previousPage = 'view_news';
        request.on('data', function (chunk) {

			if(role == "guest") {
				response.end(html1(userObj));
			}
			else if(role == "subscriber") {
				response.end(html2(userObj));
			}
			else if(role == "author") {
				response.end(html3(userObj));
			}
		});
	}
}).listen(3000);


function loginHtml() {
	var htmlString =
			"<html>"+
				"<body>"+
					"<form action=\"http://localhost:3000/?page=view_news\" method=\"POST\">"+
						"username: <input type=\"text\" name=\"username\"><br>"+
						"password: <input type=\"password\" name=\"password\"><br>"+
						"<input type=\"radio\" name=\"role\" value=\"guest\" checked> guest<br>"+
						"<input type=\"radio\" name=\"role\" value=\"subscriber\"> subscriber<br>"+
						"<input type=\"radio\" name=\"role\" value=\"author\"> author<br>"+	
						"<input type=\"submit\" value=\"submit\">"+
					"</form>"+
				"</body>"+
			"</html>";
	return htmlString;
}
function newStoryHtml(user) {
	var htmlString ="<html><head>" + user._username + " " + user._role + 
					"<form action=\"http://localhost:3000/\" method=\"POST\">"+
					"<input type=\"submit\" value=\"logout\"></form><br>Create New Story<br></head><body>" +
					
					"<form action=\"http://localhost:3000/?page=view_news\" method=\"POST\">"+
					"Title: <input type=\text\" name=\"title\"><br>"+
					"Author: <input type=\text\" name=\"author\"><br>"+
					"Date: <input type=\"date\" name=\"date\"><br>" +
					"<input type=\"radio\" name=\"access\" value=\"T\" checked> Public" +
					"<input type=\"radio\" name=\"access\" value=\"F\" checked> Private<br>" +
					"Content: <input type=\text\" name=\"content\"><br>" + 
					"<input type=\"submit\" name=\"saveCancel\" value=\"save\">"+
					"<input type=\"submit\" name=\"saveCancel\" value=\"cancel\"></form></body></html>";
	
	return htmlString;
}

function editStory(user, title) {
	var htmlString ="<html><head>" + user._username + " " + user._role + 
					"<form action=\"http://localhost:3000/\" method=\"POST\">"+
					"<input type=\"submit\" value=\"logout\"></form><br>Edit Story<br></head><body>" + 
					"<form action=\"http://localhost:3000/?page=view_news\" method=\"POST\">"+
					"Change Title: <input type=\text\" name=\"title\"><br>"+ 
					"Change Content: <input type=\text\" name=\"content\"><br>" + 
					"<input type=\"submit\" name=\"saveCancel\" value=\"save\">"+
					"<input type=\"submit\" name=\"saveCancel\" value=\"cancel\">"+ 
					"<input type=\"hidden\" value=\"" + title + "\" name=\"oldTitle\" /></form></body></html>";

	return htmlString;
}

function viewStoryHtml (user, _title) {
	
	var x = doc.getElementsByTagName("TITLE");
	var title, author, date, content;
	
	var i;
	for(i = 0; i <x.length; i++) {
		
		if(_title == x[i].childNodes[0].nodeValue) {
			title = doc.getElementsByTagName("TITLE")[i].childNodes[0].textContent;
			author = doc.getElementsByTagName("AUTHOR")[i].childNodes[0].textContent;
			date = doc.getElementsByTagName("DATE")[i].childNodes[0].textContent;
			content = doc.getElementsByTagName("CONTENT")[i].childNodes[0].textContent;	
			
		}
	}
	
	var editable = "";
	
	if(user._role.toString() == "author") {
		editable = "<input type=\"button\" onclick=\"location.href='http://localhost:3000/?page=edit_story&title=" + parse(_title) + "\';\" value=\"edit\"/>"+
					"<form action=\"http://localhost:3000/?page=view_news\" method=\"POST\">"+
					"<input type=\"submit\" name=\"deleteS\" value=\"delete\"><input type=\"hidden\" value=\"" + _title + "\" name=\"title\" /></form>"
	}
	
	var htmlString ="<html><head>" + user._username + " " + user._role + 
					"<form action=\"http://localhost:3000/\" method=\"POST\">"+
					"<input type=\"submit\" value=\"logout\"></form><br>View Story<br></head><body>" + 
					title + "<br><br>" +
					author + "<br><br>" +
					date + "<br><br>" +
					content + "<br><br>" +
					editable +
					"</body></html>";	
					
	return htmlString;
}

function parse(string) {
	console.log(string);
	while(string.includes(" ")) {
		string = string.replace(" ", "`");
	}
	console.log(string);
	return string;	
}
function parseBack(string) {
	while(string.includes("`")) {
		string = string.replace("`", " ");
	}
	return string;	
}

//generate html for guest
function html1(user) {
	var x = doc.getElementsByTagName("TITLE");
	
	var title;
	var array = [];
	
	var htmlString1 ="<html><head>" + user._username + " " + user._role + 
					"<form action=\"http://localhost:3000/\" method=\"POST\">"+
					"<input type=\"submit\" value=\"logout\"></form><br>View News<br></head><body>"
	var htmlString2;

	
	var i;
	for(i = 0; i <x.length; i++) {
		title = doc.getElementsByTagName("TITLE")[i].childNodes[0].textContent;
		
		if(doc.getElementsByTagName("PUBLIC")[i].childNodes[0].textContent == 'T') {
			htmlString2 = "<br><a href=\"http://localhost:3000/?page=view_story&title=" + parse(title) + "\">" + title + "</a><br>";
		}
		else {
			htmlString2 = "<br>" + title + "<br>";
		}
		htmlString1 = htmlString1 + htmlString2;
	}

	
	htmlString2 ="</body></html>";
	htmlString1 = htmlString1 + htmlString2;
	

	
	return htmlString1;
}
//generate html for subscriber
function html2(user) {
	var x = doc.getElementsByTagName("TITLE");
	
	var title;
	var array = [];
	
	var htmlString1 ="<html><head>" + user._username + " " + user._role + 
					"<form action=\"http://localhost:3000/\" method=\"POST\">"+
					"<input type=\"submit\" value=\"logout\"></form><br>View News<br></head><body>"
	var htmlString2;

	
	var i;
	for(i = 0; i <x.length; i++) {
		title = doc.getElementsByTagName("TITLE")[i].childNodes[0].textContent;
		

		htmlString2 = "<br><a href=\"http://localhost:3000/?page=view_story&title=" + parse(title) + "\">" + title + "</a><br>";
		
		htmlString1 = htmlString1 + htmlString2;
	}

	
	htmlString2 ="</body></html>";
	htmlString1 = htmlString1 + htmlString2;
	

	
	return htmlString1;
}
//generate html for author
function html3(user) {
	var x = doc.getElementsByTagName("TITLE");
	
	var title;
	var array = [];
	
	var htmlString1 ="<html><head>" + user._username + " " + user._role + 
					"<form action=\"http://localhost:3000/\" method=\"POST\">"+
					"<input type=\"submit\" value=\"logout\"></form><br>View News<br>" +
					"<br><a href=\"http://localhost:3000/?page=new_story\">Create New Story</a><br></head><body>";
					
	var htmlString2;

	
	var i;
	for(i = 0; i <x.length; i++) {
		title = doc.getElementsByTagName("TITLE")[i].childNodes[0].textContent;
		
		if(doc.getElementsByTagName("PUBLIC")[i].childNodes[0].textContent == 'T' || doc.getElementsByTagName("AUTHOR")[i].childNodes[0].textContent == user._username) {
			htmlString2 = "<br><a href=\"http://localhost:3000/?page=view_story&title=" + parse(title) + "\">" + title + "</a><br>";
		}
		else {
			htmlString2 = "<br>" + title + "<br>";
		}
		htmlString1 = htmlString1 + htmlString2;
	}

	
	htmlString2 ="</body></html>";
	htmlString1 = htmlString1 + htmlString2;
	

	
	return htmlString1;
}






