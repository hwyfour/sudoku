var listing;
var error = false;

function populateSpace(elem) {
	for (var x = 1; x <= 9; x++) {
		var ins = document.createElement("div");
		ins.className = "inside";
		ins.id = elem.id + "-" + x;
		ins.innerHTML = x;
		ins.addEventListener("click", clearSpace);
		elem.appendChild(ins);
	};
	return elem;
}

function fillSpace(elem, parent) {
	var chosen = elem.innerHTML;
	var ins = document.createElement("div");
	ins.className = "fill";
	ins.innerHTML = chosen
	ins.addEventListener("contextmenu", renewSpace);
	parent.appendChild(ins);

	//the number for this space has been chosen
	//calculate if it is a valid selection
	calculate(chosen, parent);

	return ins;
}

function renewSpace(event) {
	event.preventDefault();
	var parent = event.currentTarget.parentNode;
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	};
	populateSpace(parent);
}

function clearSpace(event) {
	if (!error) {
		var node = event.currentTarget;
		var parent = node.parentNode;
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		};
		fillSpace(node, parent);
	}
}

/* Algorithm ONLY */

function calculate(number, space) {
	if( inRow(number, space) ) {
		drawRow(space);
		error = true;
	}
	if( inColumn(number, space) ) {
		drawColumn(space);
		error = true;
	}
}

function drawGroup(number, space) {
	for (var i = 0; i < 81; i++) {
		
	};
	return 0;
}

function inRow(number, space) {
	var testNum = 0;
	var y = parseInt(space.id[1]);
	var tempElem;
	var tempId = 0;
	for (var i = 1; i <= 9; i++) {
		tempElem = document.getElementById("" + i + y);
		if (tempElem.firstChild.className !== "inside") {
			if (tempElem.id !== space.id) {
				testNum = document.getElementById("" + i + y).firstChild.innerHTML;
				if (testNum === number) {
					tempId = tempElem.id;
				}
			}
		}
	};
	return tempId;
}

function drawRow(space) {
	var y = parseInt(space.id[1]);
	for (var i = 1; i <= 9; i++) {
		document.getElementById("" + i + y).className += " error";
	};
}

function inColumn(number, space) {
	var testNum = 0;
	var x = parseInt(space.id[0]);
	var tempElem;
	var tempId = 0;
	for (var i = 1; i <= 9; i++) {
		tempElem = document.getElementById("" + x + i);
		if (tempElem.firstChild.className !== "inside") {
			if (tempElem.id !== space.id) {
				testNum = document.getElementById("" + x + i).firstChild.innerHTML;
				if (testNum === number) {
					tempId = tempElem.id;
				}
			}
		}
	};
	return tempId;
}

function drawColumn(space) {
	var x = parseInt(space.id[0]);
	for (var i = 1; i <= 9; i++) {
		document.getElementById("" + x + i).className += " error";
	};
}

/* END of Algorithm ONLY */

window.onload = function() {
	listing = document.getElementById("store");
	for (var i = 0; i < 81; i++) {
		var pre = document.createElement("div");
		pre.className = "text";
		var id = "" + (i%9 + 1) + (Math.floor(i/9) + 1);
		pre.id = id;
		populateSpace(pre);
		listing.appendChild(pre);
	};
}