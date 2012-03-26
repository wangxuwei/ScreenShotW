var id = 100;

var isLoaded = false;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request.action == "notLoaded"){
		isLoaded = false;
	}else if(request.action == "loaded"){
		isLoaded = true;
	}else if(request.action == "cmdVisible"){
		takeScreenshot("visible");
	}else if(request.action == "cmdSelected"){
		takeScreenshot("selected");
	}else if(request.action == "cmdEntire"){
		takeScreenshot("entire");
	}
});

function takeScreenshot(type) {
	chrome.tabs.getSelected(null, function(tab) {
		console.log(tab);
		var loadDfd = $.Deferred();
		// test if loaded;
		chrome.tabs.executeScript(tab.id, {file: 'js/content-isLoad.js'}, function(){
			if(!isLoaded){
				chrome.tabs.executeScript(tab.id, {file: 'js/content-main.js'}, function() {
					loadDfd.resolve();
				});
			}else{
				loadDfd.resolve();
			}
		});
		
		loadDfd.done(function(){
			var capDfd = $.Deferred();
			if(type == "visible"){
				capDfd = captureVisible();
			}else if(type == "selected"){
				capDfd = captureSelected();
			}else if(type == "entire"){
				capDfd = captureEntire();
			}
			
			if(capDfd.promise){
				capDfd.done(function(data){
					var viewTabUrl = [chrome.extension.getURL('screenshot.html'),'?id=', id++].join('');
					chrome.tabs.create({url: viewTabUrl});
				})
			}
			
		});
	});
}

function captureEntire(){
	var dfd = $.Deferred();
	sendScrollRequest().done(function(data) {
		localStorage.setItem("type",JSON.stringify("entire"));
		localStorage.setItem("imgs",JSON.stringify(data.imgs));
		localStorage.setItem("width",JSON.stringify(data.width));
		localStorage.setItem("height",JSON.stringify(data.height));
		dfd.resolve(data);
	});
	return dfd.promise();
}


function captureVisible(){
	var dfd = $.Deferred();
	chrome.tabs.captureVisibleTab(null, function(img) {
		var t = new Image();
		t.src = img;
		t.onload = function() {
			  console.log(t);
			  localStorage.setItem("type", JSON.stringify("visible"));
			  localStorage.setItem("imgs", img);
			  localStorage.setItem("width", t.width);
			  localStorage.setItem("height", t.height);
			  dfd.resolve(img);
		  }
	});
	return dfd.promise();
}

function captureSelected(){
	  //do something here....
}

function capture(){
	var dfd = $.Deferred();
	
	chrome.tabs.captureVisibleTab(null, function(img) {
		var t = new Image();
		t.src = img;
		t.onload = function(){
			console.log(t);
		}
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
				capture().done(function(img){
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

