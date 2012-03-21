var id = 100;

var isLoaded = false;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request.action == "notLoaded"){
		isLoaded = false;
	}else if(request.action == "loaded"){
		isLoaded = true;
	}
});

function takeScreenshot(tab) {
	// test if loaded;
	chrome.tabs.executeScript(tab.id, {file: 'js/content-isLoad.js'}, function(){
		console.log(isLoaded);
		if(!isLoaded){
			chrome.tabs.executeScript(tab.id, {file: 'js/content-main.js'}, function() {
				captureEntire();
			});
		}else{
			captureEntire();
		}
	});
}

function captureEntire(){
	var dfd = $.Deferred();
	sendScrollRequest().done(function(imgs) {
		var viewTabUrl = [chrome.extension.getURL('screenshot.html'),
	                      '?id=', id++].join('');
		localStorage.setItem("imgs",JSON.stringify(imgs));
		chrome.tabs.create({url: viewTabUrl});
	});
	return dfd.promise();
}


function captureVisible(){
	  var dfd = $.Deferred();
	  chrome.tabs.captureVisibleTab(null, function(img) {
		  dfd.resolve(img);
	  });
	  return dfd.promise();
}

function sendScrollRequest(){
	var imgs = [];
	var dfd = $.Deferred();
	nextRequest(true);
	
	function nextRequest(first){
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {action:'scroll',data:{first:first}}, function(response) {
				captureVisible().done(function(img){
					imgs.push({img:img,reduceHeight:response.reduceHeight});
					if(!response.complete){
						nextRequest(false);
					}else{
						dfd.resolve(imgs);
					}
				});
			});
		});
	}
	return dfd.promise();
}

// Listen for a click on the camera icon.  On that click, take a screenshot.
chrome.browserAction.onClicked.addListener(function(tab) {
    takeScreenshot(tab);
});
