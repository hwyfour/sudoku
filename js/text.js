var listing;

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

function fillSpace(elem) {
	var ins = document.createElement("div");
	ins.className = "fill error";
	ins.innerHTML = elem.innerHTML;
	ins.addEventListener("contextmenu", renewSpace);

	//the number for this space has been chosen
	//calculate if it is a valid selection


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
	var node = event.currentTarget;
	var parent = node.parentNode;
	console.log(parseInt(parent.innerHTML));
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	};
	parent.appendChild(fillSpace(node));
}

window.onload = function() {
	listing = document.getElementById("store");
	for (var i = 0; i < 81; i++) {
		var pre = document.createElement("div");
		pre.className = "text";
		var id = "" + (Math.floor(i/9) + 1) + (i%9 + 1);
		pre.id = id;
		populateSpace(pre);
		listing.appendChild(pre);
	};
}