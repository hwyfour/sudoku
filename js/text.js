var box;

window.onload = function() {
	// window.addEventListener("keydown", motion, false);
	box = document.getElementById("store");
	for (var i = 0; i < 81; i++) {
		var pre = document.createElement("div");
		pre.className = "text";
		// pre.maxLength = 1;
		pre.id = i;
		for (var x = 0; x < 9; x++) {
			var ins = document.createElement("div");
			ins.className = "inside";
			ins.id = i + "" + x;
			ins.innerHTML = x + 1;
			pre.appendChild(ins);
		};
		box.appendChild(pre);
	};
}