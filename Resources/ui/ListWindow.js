/*
 * ListWindow.js controls both the todo list and the done list. _args.isDone flag is 
 * used to determine which list we are processing for.
 */
var platform = Ti.Platform.osname;
function ListWindow(_args) {
	var todo = require('todo');
	// Tableview will initially be blank until we have a logged in user.
	var self = Ti.UI.createWindow(_args),
		tblView = Ti.UI.createTableView({
			data:[]
		}),
		isDone = _args.isDone;
		
	// Listener for completing and deleting tasks
	tblView.addEventListener('click', function(e) {
		var btns, handler;
		if (isDone) {
			// If we're looking at the completed task list, we only want to be able to
			// delete any given task.
			btns = ['Delete', 'Cancel'];
			handler = function(evt) {
				if (evt.index === 0) {
					todo.remove(e.row.id);
					todo.fetch();
				}
			};
		} else {
			// If we are looking at the todo task list, we can mark it as done, or
			// delete the task all together.
			btns = ['Done', 'Delete', 'Cancel'];
			handler = function(evt) {
				if (evt.index === 0) {
					todo.done(e.row.id);
					todo.fetch();
				} else if (evt.index === 1) {
					todo.remove(e.row.id);
					todo.fetch();
				}
			};
		}
		
		// Build the confirm dialog for changing tasks.
		var confirm = Ti.UI.createAlertDialog({
			title:'Change Task Status',
			message:e.title,
			buttonNames:btns
		});
		confirm.addEventListener('click', handler);
		confirm.show();
	});
		
	self.add(tblView);
	
	// Here we are adding the 'add' button to iOS and mobile web
	// windows, but only on the task window. For Android, we added
	// a menu option to add new tasks.
	if (!isDone && platform !== 'android') {
		var addBtn = Ti.UI.createButton({
			title:'+'
		});
		addBtn.addEventListener('click', function() {
			// Show Add Window
			var AddWindow = require('ui/AddWindow'),
				addWin = new AddWindow();
				
			addWin.open();
		});
		self.rightNavButton = addBtn;
	}
	
	// If we are looking at the todo task list we listen for an app level
	// event to quickly add new tasks without making another ACS call.
	if (!isDone) {
		Ti.App.addEventListener('app:todo_added', function(_todo) {
			var row = Ti.UI.createTableViewRow({
				title:_todo.title,
				id:_todo.id
			});
			tblView.appendRow(row);
		});
	}
	
	// Here we are listening for an app level event that will update both task lists.
	// We fetch all tasks for a given user and then separate them based on their status.
	Ti.App.addEventListener('app:update_tables', function(_todos) {
		Ti.API.info("UPDATE: "+JSON.stringify(_todos));
		var dolist = [], donelist = [],
			i = 0, len = _todos.tasks.length,
			row, todo;
			
		for ( ; i < len; i++) {
			todo = _todos.tasks[i];
			row = Ti.UI.createTableViewRow({
				title:todo.title,
				id:todo.id
			});
			if (todo.done) {
				donelist.push(row);
			} else {
				dolist.push(row);
			}
		}
		
		if (isDone) {
			tblView.setData(donelist);
		} else {
			tblView.setData(dolist);
		}
	});
	
	return self;
}
module.exports = ListWindow;

