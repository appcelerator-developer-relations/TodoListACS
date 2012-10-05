/*
 * AddWindow.js is the simple modal form for adding new tasks.
 */
function AddWindow() {
	var todo = require('todo');
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		layout:'vertical',
		modal:true,
		title:'Add Item'
	});
	
	// The title for the new task.
	var itemField = Ti.UI.createTextField({
		width:'90%',
		height:Ti.UI.SIZE,
		hintText:'What do you need to do?',
		top:20,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	// Listen for the 'return' event on the new task field.
	itemField.addEventListener('return', function() {
		if (itemField.value === '') {
			alert("Please enter an item.");
		} else {
			todo.add(itemField.value);
			self.close();
		}
	});
	self.add(itemField);
	
	// Add button
	var addBtn = Ti.UI.createButton({
		title:'Add Item',
		width:'50%',
		height:Ti.UI.SIZE,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top:20
	});
	// Click to add new task.
	addBtn.addEventListener('click', function() {
		if (itemField.value === '') {
			alert("Please enter an item.");
		} else {
			todo.add(itemField.value);
			self.close();
		}
	});
	self.add(addBtn);
	
	// Cancel the add task and close the window.
	var cancelBtn = Ti.UI.createButton({
		title:'Cancel',
		width:'50%',
		height:Ti.UI.SIZE,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top:10
	});
	cancelBtn.addEventListener('click', function() {
		self.close();
	});
	self.add(cancelBtn);
	
	return self;
}
module.exports = AddWindow;