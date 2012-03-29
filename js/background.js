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
		takeScreenshot("selected");
	}else if(request.action == "cmdEntire"){
		takeScreenshot("entire");
	}else if(request.action == "captureSelectedArea"){
		takeScreenshot("selectedArea", request.centerW , request.centerH);
	}
});

// the screenshot control method, which can do screenshot by type
function takeScreenshot(type, w, h) {
	chrome.tabs.getSelected(null, function(tab) {
		console.log(tab);
		sendRequest('tab', tab.id, {action:'destroy_selected'});
		
		var loadDfd = $.Deferred();
		// test if loaded;
		chrome.tabs.executeScript(tab.id, {file: 'js/content-isLoad.js'}, function(){
			if (!isLoaded) {
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
			}else if(type == "selected"){
				capDfd = captureSelected();
			}else if(type == "entire"){
				capDfd = captureEntire();
			}else if(type == "selectedArea"){
				capDfd = captureSelectedArea(w, h);
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

// do screenshot with entire full page
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

//do screenshot with visible part
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

// do screenshot with selected area
function captureSelected() {
	var dfd = $.Deferred();
	chrome.tabs.getSelected(null, function(tab) {
		  chrome.tabs.sendRequest(tab.id, {
			    action : 'mask',
			    data : {}
		    }, function(response) {
			    dfd.resolve();
		    });
	  });
	return dfd.promise();
}

function captureSelectedArea(w,h){
	var dfd = $.Deferred();
	chrome.tabs.captureVisibleTab(null, function(img) {
		var t = new Image();
		t.src = img;
		t.onload = function() {
			  console.log(t);
			  localStorage.setItem("type", JSON.stringify("selected"));
			  localStorage.setItem("imgs", img);
			  if (w) {
			  	localStorage.setItem("width", w);
			  	localStorage.setItem("height", h);
			  }
			  dfd.resolve(img);
		  }
	});
	return dfd.promise();
}

// capture api
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