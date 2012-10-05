/*
 * LoginWindow.js is the simple login form for the app. If a user and pass does not exist in
 * ACS, then a new account is automatically created using those credentials.
 */
function LoginWindow() {
	var todo = require('todo');
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		layout:'vertical',
		title:'Todo Login'
	});
	
	var lbl = Ti.UI.createLabel({
		text:'Login / Signup',
		font:{
			fontWeight:'bold',
			fontSize:16
		},
		top:20
	});
	self.add(lbl);
	
	// Username field
	var userField = Ti.UI.createTextField({
		width:'90%',
		height:Ti.UI.SIZE,
		hintText:'Username',
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top:10
	});
	self.add(userField);
	
	// Password field
	var passField = Ti.UI.createTextField({
		width:'90%',
		height:Ti.UI.SIZE,
		hintText:'Password',
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		passwordMask:true,
		top:10
	})
	// Adding a 'return' listener so that the form is submitted
	// whens the Return key is pressed.
	passField.addEventListener('return', function() {
		todo.login({
			login:userField.value,
			password:passField.value
		});
	});
	self.add(passField);
	
	// login button
	var loginBtn = Ti.UI.createButton({
		title:'Login',
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		top:20
	});
	// submit the form when login button is clicked
	loginBtn.addEventListener('click', function(){
		todo.login({
			login:userField.value,
			password:passField.value
		});
	});
	self.add(loginBtn);
	
	// On a successful login, close this modal window
	Ti.App.addEventListener('app:login_success', function() {
		self.close();
	});
	
	return self;
}
module.exports = LoginWindow;