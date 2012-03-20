var _SQLiteDb;
(function($) {
		var databaseOptions = {
			fileName : "screenshotW",
			version : "1.0",
			displayName : "SQLite ScreenShot",
			maxSize : 1024
		};

		_SQLiteDb = openDatabase(databaseOptions.fileName, databaseOptions.version, databaseOptions.displayName, databaseOptions.maxSize);
		brite.registerDao("Images", new brite.dao.SQLiteDao("Images", "id", [ {
			column : 'data',
			dtype : 'TEXT'
		}, {
			column : 'url',
			dtype : 'TEXT'
		}, {
			column : 'nid',
			dtype : 'TEXT'
		} ]));
		
})(jQuery);
