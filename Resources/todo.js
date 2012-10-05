/*
 * todo.js replaces the db.js from the original todo sample with some additions. Here we'll be handling
 * all cloud interaction including User and Task handling.
 */
var Cloud = require('ti.cloud');

// Store the userid and username for quick access
exports.storeUser = function(_user) {
	Ti.App.Properties.setString('todo_uid', _user.id);
	Ti.App.Properties.setString('todo_username', _user.username);
};

// Register a new user with ACS.
exports.register = function(_args) {
	Cloud.Users.create(_args, function(e) {
		if (e.success) {
			alert("Registration Successful");
			exports.storeUser(e.users[0]);
			Ti.App.fireEvent('app:login_success');
		} else {
			alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
};

// Login an ACS user. If the user does not exist we automatically shoot the
// credentials off to register a new user. If a user is successfully logged in
// we immediately call the fetch() method to grab existing tasks.
exports.login = function(_args) {
	Cloud.Users.login(_args, function(e) {
		if (e.success) {
			alert("Login Successful!");
			exports.storeUser(e.users[0]);
			exports.fetch();
			Ti.App.fireEvent('app:login_success');
		} else {
			exports.register({
				username:_args.login,
				password:_args.password,
				password_confirmation:_args.password
			});
		}
	});
};

// Logout the current user.
exports.logout = function() {
	Cloud.Users.logout(function (e) {
    	if (e.success) {
    	    alert('Success: Logged out');
    	} else {
    	    alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
    	}
	});
};

// Creating a classname for custom objects based on the username
exports.getClass = function() {
	return Ti.App.Properties.getString('todo_username') + "_todo";
};

// Fetch all of the tasks for a given user. Once we retrieve those
// tasks fire an event to update the task lists.
exports.fetch = function() {
	var classname = exports.getClass();
	Cloud.Objects.query({
		classname:classname,
		limit:100
	}, function(e) {
		if (e.success) {
			Ti.API.info("SUCCESS:"+JSON.stringify(e));
			Ti.App.fireEvent('app:update_tables', {tasks:e[classname]});
		} else {
			alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

// Add a new task. Once a task is added, we fire an event to the task window
// that will add the new task to the task list without the need to make a
// new call to ACS.
exports.add = function(_title) {
	var classname = exports.getClass();
	Cloud.Objects.create({
		classname: classname,
		fields: {
			title:_title,
			done:false
		}
	}, function(e) {
		if (e.success) {
			alert("Task Added!");
			Ti.App.fireEvent('app:todo_added', e[classname][0]);
		} else {
			alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
};

// Remove a task from the users task list.
exports.remove = function(_id) {
	var classname = exports.getClass();
	Cloud.Objects.remove({
		classname: classname,
		id: _id
	}, function (e) {
		if (e.success) {
        	alert('Task Removed');
		} else {
			alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
};

// Mark a task as complete
exports.done = function(_id) {
	var classname = exports.getClass();
	Cloud.Objects.update({
		classname:classname,
		id:_id,
		fields:{
			done:true
		}
	}, function(e) {
		if (e.success) {
			alert('Task Complete');
		} else {
			alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
};
