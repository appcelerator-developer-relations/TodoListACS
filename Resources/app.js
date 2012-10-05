// app.js doing only what it needs to do ... bootstrap
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
} else {
	(function() {	
		var ApplicationTabGroup = require('ui/ApplicationTabGroup');
		new ApplicationTabGroup().open();
	})();
}