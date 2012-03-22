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
	sendScrollRequest().done(function(data) {
		var viewTabUrl = [chrome.extension.getURL('screenshot.html'),
	                      '?id=', id++].join('');
		localStorage.setItem("imgs",JSON.stringify(data.imgs));
		localStorage.setItem("width",JSON.stringify(data.width));
		localStorage.setItem("height",JSON.stringify(data.height));
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
	var yfirstFlag = true;
	nextRequest(true,true,true,true);
	
	function nextRequest(xfirst,yfirst,xMove,yMove){
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {action:'scroll',data:{xfirst:xfirst,yfirst:yfirst,xMove:xMove,yMove:yMove}}, function(response) {
				var complete = response.complete;
				var remainArea = response.remainArea;
				captureVisible().done(function(img){
					imgs.push({img:img,coop:response.coop,complete:complete,remainArea:remainArea});
					if(!complete.x || !complete.y){
						if(complete.x){
							yfirstFlag = false;
							nextRequest(true,yfirstFlag,true,true);
						}else{
							nextRequest(false,yfirstFlag,true,false);
						}
					}else{
						dfd.resolve({imgs:imgs,width:response.width,height:response.height});
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
