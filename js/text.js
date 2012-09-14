var listing;				//the main sudoku game panel
var rowError = false;		//flag is true if there is a row conflict
var columnError = false;	//flag is true if there is a column conflict
var groupError = false;		//flag is true if there is a group conflict

/* Simply adds the small 1-9 number selectors to
* whatever parent is passed in.
*/
function populateSpace(parent) {
	for (var x = 1; x <= 9; x++) {
		var ins = document.createElement("div");
		ins.className = "inside";
		ins.id = parent.id + "-" + x;
		ins.innerHTML = x;
		ins.addEventListener("click", userSelection);
		ins.addEventListener("contextmenu", removeImpossible);
		ins.onmouseover = ( function(n, m, o){ return function(){paintConflicts(n, m, o);} } )( x, parent, on );
		ins.onmouseout = ( function(n, m, o){ return function(){paintConflicts(n, m, o);} } )( x, parent, off );
		parent.appendChild(ins);
	};
	return parent;	//so the element can be acted on in the calling function
}

/* This function is called when a user right-clicks on a space
* that contains a previously selected number. It removes the selected
* number and repopulates the space with the small number selectors
*/
function renewSpace(event) {
	//stop the context menu from appearing
	event.preventDefault();
	//erase the child element
	var parent = event.currentTarget.parentNode;
	parent.removeChild(parent.firstChild);
	//repopulate the space
	populateSpace(parent);
}

/* The left-click event for a choice in a space.
* If a choice does not conflict with that board,
* the space is filled with that choice.
*/
function userSelection(event) {
	var node = event.currentTarget;
	var parent = node.parentNode;
	var chosen = node.innerHTML;
	//if this choice doesn't create a conflict
	if (!validateNoStructs(chosen, parent)) {
		//delete all the small number selectors
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		};
		//add the number selection to the space
		var ins = document.createElement("div");
		ins.className = "fill";
		ins.innerHTML = chosen;
		ins.addEventListener("contextmenu", renewSpace);
		parent.appendChild(ins);
	}
}

/* When the solver decides on a number for a space, it updates the
* space to show only that number with this function.
*/
function selectSpace(element, number) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	};
	var ins = document.createElement("div");
	ins.className = "fill";
	ins.innerHTML = number;
	ins.addEventListener("contextmenu", renewSpace);
	element.appendChild(ins);
}

/* The right-click event for a choice in a space.
* Simply removes that choice from the space.
*/
function removeImpossible(event) {
	event.preventDefault();
	var node = event.currentTarget;
	var parent = node.parentNode;
	parent.removeChild(node);
}

/* When the DOM loads, the main game panel is then filled with the 81
* sudoku spaces that make up the game. Each space is also filled
* with 9 small number selectors by calling populateSpace()
*/
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

/* =========== PURE ALGORITHM VALIDATION =========================================================
* 
* The goal of this section is to validate and solve a game board against the rules of sudoku using nothing
* but the DOM and algorithmic checking. No advanced structures are allowed to ease the validation.
* There are a few ways to check if a choice exists in a row/column/group, but doing it with only
* algorithms limits our options slightly. The only 'structure' that I use in this section is the basic
* DOM elements and a useful labelling convention: each space has an id that contains its mathematical
* position on the board. This concession as a 'data structure' is given because it is a required part
* of the page anyway, so there is no reason to not take advantage of it. To not use it would require
* brute-force tactics which are of no interest to this project. Another decision is to record each of the
* three conflict errors in different flags so when a user removes a conflicting choice, only the section
* that was conflicting needs to be revalidated - not the row, column, and group that element was a part of.
*
* So, this section is an exercise in finding the most efficient algorithm to solve and validate a sudoku
* board without the aid of advanced structures including even arrays and lists.
*/

	/* Every time a user picks a number, this function is called which validates their pick
	* based on the current row/column/group that the number is in. If a conflict is found,
	* return true so the calling function knows a conflict was found.
	*/
	function validateNoStructs(number, space) {
		if( inRowNoStructs(number, space) ) {
			return true;
		};
		if( inColumnNoStructs(number, space) ) {
			return true;
		};
		if( inGroupNoStructs(number, space) ) {
			return true;
		};
		return false;
	}

	/* On every mouseover/out event, this function colours/clears
	* whatever section there is a conflict in.
	*/
	function paintConflicts(number, space, func) {
		if( inRowNoStructs(number, space) ) {
			drawRowNoStructs(space, func);
		};
		if( inColumnNoStructs(number, space) ) {
			drawColumnNoStructs(space, func);
		};
		if( inGroupNoStructs(number, space) ) {
			drawGroupNoStructs(space, func);
		};
	}

	/* There are a couple of ways to check whether a new choice is already chosen in the group:
	*
	*	1: iterate over all 81 spaces and check if each space is in the same group as the group
	*		the new choice belongs to. If a space is, then check that if it conflicts with the
	*		new choice of number. THIS IS TERRIBLY INEFFICIENT.
	*	2: mathematically find the top-left element of the group that your new choice belongs to.
	*		iterate over just these 9 elements in the group to check for a conflict with your new
	*		choice. This method is the best we can hope for without using data structures.
	*
	*	I use method 2 with the mathematical function
	*
	*			3 * (Math.ceil(x/3) - 1) + 1 (for the X axis, substitute y for the Y axis)
	*
	*	to find the top-left corner element of the current group.
	*/
	function inGroupNoStructs(number, space) {
		var x = parseInt(space.id[0]);	//the x coord of the selected space
		var y = parseInt(space.id[1]);	//the y coord of the selected space
		var cornerX = 3 * (Math.ceil(x/3) - 1) + 1;
		var cornerY = 3 * (Math.ceil(y/3) - 1) + 1;
		var tempElem;
		var testNum = 0;
		var tempId = 0;
		var tempX;
		var tempY;
		for (var ix = 0; ix < 3; ix++) {			//for each column in the group
			tempX = cornerX + ix;					//start from the leftmost space
			for (var iy = 0; iy < 3; iy++) {		//iterate vertically in the group
				tempY = cornerY + iy;				//from the top down
				//get the element at this coordinate
				tempElem = document.getElementById( tempX + "" + tempY );
				//if it doesn't contain a number selection, disregard it
				if (tempElem.firstChild.className !== "inside") {
					//get the number that is in the checked space
					testNum = tempElem.firstChild.innerHTML;
					//if it is the same as the new choice, there is a conflict
					if (testNum == number) {	//== because number is an int when passed by the mouseover function
						groupError = true;
						//record the element id that the new choice conflicts with
						tempId = tempElem.id;
					}
				}
			}
		}
		return tempId;
	}

	/* This function is given a space that is deemed to be in conflict.
	* All it does is add the error class to every element in the group that
	* space belongs to.
	*/
	function drawGroupNoStructs(space, func) {
		var x = parseInt(space.id[0]);	//the x coord of the selected space
		var y = parseInt(space.id[1]);	//the y coord of the selected space
		var cornerX = 3 * (Math.ceil(x/3) - 1) + 1;
		var cornerY = 3 * (Math.ceil(y/3) - 1) + 1;
		var tempX;
		var tempY;
		for (var ix = 0; ix < 3; ix++) {			//for each column in the group
			tempX = cornerX + ix;					//start from the leftmost space
			for (var iy = 0; iy < 3; iy++) {		//iterate vertically in the group
				tempY = cornerY + iy;				//from the top down
				func(tempX, tempY);
			}
		}
	}

	/* This function checks if there is a conflict in the same row as the given
	* space. To decide, it compares the given number with any previous number choices
	* in the row. Without data structures, the best algorithm we can hope for in this
	* case is one that iterates over the element ID to traverse only the current row.
	*/
	function inRowNoStructs(number, space) {
		var testNum = 0;
		var y = parseInt(space.id[1]);	//the row number to iterate over
		var tempElem;
		var tempId = 0;
		for (var i = 1; i <= 9; i++) {
			//get the element at this coordinate
			tempElem = document.getElementById("" + i + y);
			//if it doesn't contain a number selection, disregard it
			if (tempElem.firstChild.className !== "inside") {
				//get the number that is in the checked space
				testNum = tempElem.firstChild.innerHTML;
				//if it is the same as the new choice, there is a conflict
				if (testNum == number) {	//== because number is an int when passed by the mouseover function
					rowError = true;
					//record the element id that the new choice conflicts with
					tempId = tempElem.id;
				}
			}
		};
		return tempId;
	}

	/* This function is given a space that is deemed to be in conflict.
	* All it does is add the error class to every element in the row that
	* space belongs to.
	*/
	function drawRowNoStructs(space, func) {
		var y = parseInt(space.id[1]);	//the row number to iterate over
		for (var i = 1; i <= 9; i++) {
			func(i, y);
		};
	}

	/* This function checks if there is a conflict in the same column as the given
	* space. To decide, it compares the given number with any previous number choices
	* in the column. Without data structures, the best algorithm we can hope for in this
	* case is one that iterates over the element ID to traverse only the current column.
	*/
	function inColumnNoStructs(number, space) {
		var testNum = 0;
		var x = parseInt(space.id[0]);	//the column number to iterate over
		var tempElem;
		var tempId = 0;
		for (var i = 1; i <= 9; i++) {
			//get the element at this coordinate
			tempElem = document.getElementById("" + x + i);
			//if it doesn't contain a number selection, disregard it
			if (tempElem.firstChild.className !== "inside") {
				//get the number that is in the checked space
				testNum = tempElem.firstChild.innerHTML;
				//if it is the same as the new choice, there is a conflict
				if (testNum == number) {	//== because number is an int when passed by the mouseover function
					columnError = true;
					//record the element id that the new choice conflicts with
					tempId = tempElem.id;
				}
			}
		};
		return tempId;
	}

	/* This function is given a space that is deemed to be in conflict.
	* All it does is add the error class to every element in the column that
	* space belongs to.
	*/
	function drawColumnNoStructs(space, func) {
		var x = parseInt(space.id[0]);	//the column number to iterate over
		for (var i = 1; i <= 9; i++) {
			func(x, i);
		};
	}

	//adds the 'error' class to an element
	function on(x, y) {
		document.getElementById( x + "" + y ).className += " error";
	}

	//removes the 'error' class from an element
	function off(x, y) {
		document.getElementById( x + "" + y ).className = "text";
	}

	function solveNoStructs_Recursive() {

	}

	function solveNoStructs_Iterative() {

	}

/* =========== END OF PURE ALGORITHM VALIDATION ========================================================= */