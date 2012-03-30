var id = 100;

var isLoaded = false;

//accept the request from popup.html, content script
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(request.action == "notLoaded"){
		isLoaded = false;
	}else if(request.action == "loaded"){
		isLoaded = true;
	}else if(request.action == "cmdVisible"){
		takeScreenshot("visible");
	}else if(request.action == "cmdSelected"){
		takeScreenshot("selectedRequest");
	}else if(request.action == "cmdEntire"){
		takeScreenshot("entire");
	}else if(request.action == "captureSelectedArea"){
		takeScreenshot("selected", request.centerW , request.centerH);
	}
});

// the screenshot control method, which can do screenshot by type
function takeScreenshot(type, w, h) {
	chrome.tabs.getSelected(null, function(tab) {
		console.log(tab);
//		sendRequest('tab', tab.id, {action:'destroy_selected'});
		
		var loadDfd = $.Deferred();
		// test if loaded;
		chrome.tabs.executeScript(tab.id, {file: 'js/content-isLoad.js'}, function(){
			if (!isLoaded) {
				console.log("insert")
				    chrome.tabs.insertCSS(tab.id, {
					      file : 'css/selected.css'
				      }, function() {
					      chrome.tabs.executeScript(tab.id, {
						        file : 'js/content-main.js'
					        }, function() {
						        loadDfd.resolve();
					        });
				      });
			    } else {
				    loadDfd.resolve();
			    }
		});
		
		loadDfd.done(function(){
			var capDfd = $.Deferred();
			if(type == "visible"){
				capDfd = captureVisible();	
			}else if(type == "selectedRequest"){
				capDfd = null;
				captureSelectedRequest();
			}else if(type == "entire"){
				capDfd = captureEntire();
			}else if(type == "selected"){
				capDfd = captureSelected(w, h);
			}
			
			if(capDfd && capDfd.promise){
				capDfd.done(function(data){
						// then show the screen
						sendRequest('tab', tab.id, {action:'destroy_selected'});
						var viewTabUrl = [chrome.extension.getURL('screenshot.html'),'?id=', id++].join('');
						chrome.tabs.create({url: viewTabUrl});
				})
			}
			
		});
	});
}

// do screenshot with entire full page
function captureEntire(){
	var captureDfd = $.Deferred();
	sendScrollRequest().done(function(data) {
		// save to localStorage
		var imgs = data.imgs
		var canvasWidth = data.width;
		var canvasHeight = data.height;
		
		var $cacheArea = $(".cacheArea");
		$cacheArea.width(canvasWidth);
		$cacheArea.height(canvasHeight);
		
		var $canvas = $cacheArea.find(".cacheCanvas");
		var gtx = brite.gtx($canvas);
		gtx.fitParent();
		
		app.util.serialResolve(imgs,function(imgObj,i){
			var dfd = $.Deferred();
			var image = new Image();
			image.src = imgObj.img;
			image.onload = function(){
				var sourceX = 0;
				var sourceY = 0;
				var sourceWidth = imgObj.remainArea.remainWidth;
				var sourceHeight = imgObj.remainArea.remainHeight;
				var destX = imgObj.coop.x;
				var destY = imgObj.coop.y;
				var destWidth = imgObj.remainArea.remainWidth;
				var destHeight = imgObj.remainArea.remainHeight;
				if(imgObj.complete.x){
					sourceX = image.width - sourceWidth;
				}
				if(imgObj.complete.y){
					sourceY = image.height - sourceHeight;
				}
				gtx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight,destX,destY, destWidth, destHeight);
				dfd.resolve();
			}
			return dfd.promise();
		}).done(function(){
			var finishImage = {};
			finishImage.data = $canvas[0].toDataURL("image/png");
			finishImage.width = canvasWidth;
			finishImage.height = canvasHeight;
			saveImage(finishImage);
			captureDfd.resolve(finishImage);
		});
	});
	return captureDfd.promise();
}

//do screenshot with visible part
function captureVisible(){
	var dfd = $.Deferred();
	chrome.tabs.captureVisibleTab(null, function(img) {
		var t = new Image();
		t.src = img;
		t.onload = function() {
			// save to localStorage
			var canvasWidth = t.width;
			var canvasHeight = t.height;
			
			var $cacheArea = $(".cacheArea");
			$cacheArea.width(canvasWidth);
			$cacheArea.height(canvasHeight);
			
			var $canvas = $cacheArea.find(".cacheCanvas");
			var gtx = brite.gtx($canvas);
			gtx.fitParent();
			gtx.drawImage(t, 0, 0, canvasWidth, canvasHeight,0, 0, canvasWidth, canvasHeight);
			
			var finishImage = {};
			finishImage.data = $canvas[0].toDataURL("image/png");
			finishImage.width = canvasWidth;
			finishImage.height = canvasHeight;
			saveImage(finishImage);
			dfd.resolve(finishImage);
		  }
	});
	return dfd.promise();
}

// do screenshot with selected area
function captureSelected(w,h){
	var dfd = $.Deferred();
	chrome.tabs.captureVisibleTab(null, function(img) {
		var t = new Image();
		t.src = img;
		t.onload = function() {
			var width = t.width;
			var height = t.height;
			if (w) {
				width = w;
				height = h;
			}
			// save to localStorage
			var canvasWidth = width;
			var canvasHeight = height;
			
			var $cacheArea = $(".cacheArea");
			$cacheArea.width(canvasWidth);
			$cacheArea.height(canvasHeight);
			
			var $canvas = $cacheArea.find(".cacheCanvas");
			var gtx = brite.gtx($canvas);
			gtx.fitParent();
			gtx.drawImage(t, 0, 0, canvasWidth, canvasHeight,0, 0, canvasWidth, canvasHeight);
			
			var finishImage = {};
			finishImage.data = $canvas[0].toDataURL("image/png");
			finishImage.width = canvasWidth;
			finishImage.height = canvasHeight;
			saveImage(finishImage);
			dfd.resolve(finishImage);
		  }
	});
	return dfd.promise();
}

// capture api
function capture(){
	var dfd = $.Deferred();
	chrome.tabs.captureVisibleTab(null, function(img) {
		dfd.resolve(img);
	});
	
	return dfd.promise();
}

function saveImage(finishImage){
	localStorage.setItem("image", JSON.stringify(finishImage));
}

function captureSelectedRequest() {
	chrome.tabs.getSelected(null, function(tab) {
		  chrome.tabs.sendRequest(tab.id, {
			    action : 'mask',
			    data : {}
		    });
	  });
}

// scrolling the page when doing entire full page screenshot
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

function sendRequest(where, to, req) { //to is a int (id)
	switch(where) {
		case 'tab':
			chrome.tabs.sendRequest(to, req);
			break;
		case 'popup':
			chrome.extension.sendRequest(req);
			break;
	}
}