
var PreCalc = {
	calcstack: [0]
};

function PreCalc(val) {
	this.calcstack[0] = 0;
}

exports.reset = function() {
	PreCalc.calcstack = [0];
}

exports.calc = function(expression) {
	var jObj = JSON.parse(expression);
	
	if("number" in jObj) {
		
		if(jObj.op == "add") {
			console.log("its works");
			return PreCalc.calcstack[PreCalc.calcstack.length-1] + jObj.number;
		}	
		else if(jObj.op == "subtract") {
			return PreCalc.calcstack[PreCalc.calcstack.length-1] - jObj.number;
		}
		else if(jObj.op == "push") {
			//push
			PreCalc.calcstack.push(jObj.number);
			return PreCalc.calcstack[PreCalc.calcstack.length-1];
		}
		else if(jObj.op == "pop") {
			//pop
			if(PreCalc.calcstack.length == 0) {
				return 0;
			}
			
			PreCalc.calcstack.pop(jObj.number);
			var popped = PreCalc.calcstack[PreCalc.calcstack.length-1];
			return popped;
		}
		else {
			//print
			return print();
		}
	}
		
	if("expr" in jObj) {		
		jObj.number = calc2(jObj.expr);
	}
	
	if(jObj.op == "add") {
		return PreCalc.calcstack[PreCalc.calcstack.length-1] + jObj.number;
	}	
	else if(jObj.op == "subtract") {
		return PreCalc.calcstack[PreCalc.calcstack.length-1] - jObj.number;
	}
	else if(jObj.op == "push") {
		//push
		PreCalc.calcstack.push(jObj.number);
		return PreCalc.calcstack[PreCalc.calcstack.length-1];
	}
	else if(jObj.op == "pop") {
		//pop
		if(PreCalc.calcstack.length == 1) {
			return 0;
		}
		
		PreCalc.calcstack.pop(jObj.number);
		var popped = PreCalc.calcstack[PreCalc.calcstack.length-1];
		return popped;
	}
	else {
		//print
		return print();
	}	
}
													//my recursive function
function calc2(jObj) {
	
	if("expr" in jObj) {	
		jObj.number = calc2(jObj.expr);

	}
	
	if("number" in jObj) {
		if(jObj.op == "add") {
			return PreCalc.calcstack[PreCalc.calcstack.length-1] + jObj.number;
		}	
		else if(jObj.op == "subtract") {
			return PreCalc.calcstack[PreCalc.calcstack.length-1] - jObj.number;
		}
		else if(jObj.op == "push") {
			//push
			PreCalc.calcstack.push(jObj.number);
			return PreCalc.calcstack[PreCalc.calcstack.length-1];
		}
		else if(jObj.op == "pop") {
			//pop
			if(PreCalc.calcstack.length == 0) {
				return 0;
			}

			PreCalc.calcstack.pop(jObj.number);
			var popped = PreCalc.calcstack[PreCalc.calcstack.length-1];
			return popped;
		}
		else {
			//print
			return print();
		}
	}
	else {
		if(jObj.op == "pop") {
			//pop


			PreCalc.calcstack.pop(jObj.number);
			if(PreCalc.calcstack.length == 1) {
				return 0;
			}
			var popped = PreCalc.calcstack[PreCalc.calcstack.length-1];
			return popped;
		}
	}
}

										//slice function is used to not mutate the original array

function print() {
	var newStack = PreCalc.calcstack.slice();
	return newStack.reverse();
}

exports.print = function() { 
	var newStack = PreCalc.calcstack.slice;
	return PreCalc.calcstack;
}

