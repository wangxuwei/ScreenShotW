var _SQLiteDb;
(function($) {
		var databaseOptions = {
			fileName : "ScreenshotW",
			version : "1.0",
			displayName : "ScreenShotW",
			maxSize : 5120
		};

		_SQLiteDb = openDatabase(databaseOptions.fileName, databaseOptions.version, databaseOptions.displayName, databaseOptions.maxSize);
		
		brite.registerDao("Images", new brite.dao.SQLiteDao("Images", "id", [ {
			column : 'data',
			dtype : 'TEXT'
		}, {
			column : 'width',
			dtype : 'Integer'
		}, {
			column : 'height',
			dtype : 'Integer'
		} ]));
		
})(jQuery);
