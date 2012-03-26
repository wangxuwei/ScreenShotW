var isContentScriptLoaded = true;
var overflowStyle = "";

//accept the request from the background.js
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var data = request.data || {};
    if (request.action == "scroll"){
    	//first hide scroll bar
    	if(data.xfirst && data.yfirst){
    		overflowStyle = document.body.style.overflow;
    		document.body.style.overflow = "hidden";
    	}
    	var complete = scrollNext(data.xfirst,data.yfirst,data.xMove,data.yMove);
    	if(complete.xComplete && complete.yComplete){
    		document.body.style.overflow = overflowStyle;
    	}
    	
    	var height = getHeight();
    	var width = getWidth();
    	var vWidth = getVisibleWidth();
    	var vHeight = getVisibleHeight();
    	
    	var reduceHeight = 0;
    	var reduceWidth = 0;
    	var x = document.body.scrollLeft;
    	var y = document.body.scrollTop;
    	var remainWidth = vWidth;
    	var remainHeight = vHeight;
    	if(complete.xComplete){
    		remainWidth = width % vWidth;
    		if(remainWidth == 0){
    			remainWidth = vWidth;
    		}
    		reduceWidth = vWidth - remainWidth;
    		x = document.body.scrollLeft + reduceWidth;
    	}
    	if(complete.yComplete){
    		remainHeight = height % vHeight;
    		if(remainHeight == 0){
    			remainHeight = vHeight;
    		}
    		reduceHeight = vHeight - remainHeight;
    		y = document.body.scrollTop + reduceHeight;
    	}
    	setTimeout(function(){
    		sendResponse({complete:{x:complete.xComplete,y:complete.yComplete},coop:{x:x,y:y},remainArea:{remainWidth:remainWidth,remainHeight:remainHeight},width:width,height:height});
    	}, 300);
    	
    }else{
    	sendResponse({});
    }
});

//do scrolling
function scrollNext(xfirst,yfirst,xMove,yMove){
	var prevScrollTop = document.body.scrollTop;
	var prevScrollLeft = document.body.scrollLeft;
	var height = getHeight();
	var width = getWidth();
	var vWidth = getVisibleWidth();
	var vHeight = getVisibleHeight();
	if(xMove){
		if(xfirst){
			document.body.scrollLeft = 0;
			prevScrollLeft = document.body.scrollLeft;
		}else{
			prevScrollLeft = document.body.scrollLeft;
			document.body.scrollLeft = prevScrollLeft + vWidth;
			prevScrollLeft = document.body.scrollLeft;
		}
	}
	if(yMove){
		if(yfirst){
			document.body.scrollTop = 0;
			prevScrollTop = document.body.scrollTop;
		}else{
			prevScrollTop = document.body.scrollTop;
			document.body.scrollTop = prevScrollTop + vHeight;
			prevScrollTop = document.body.scrollTop;
		}
	}
	
	var xComplete = false;
	var yComplete = false;
	if(prevScrollLeft + vWidth >= width){
		xComplete = true;
	}
	
	if(prevScrollTop + vHeight >= height){
		yComplete = true;
	}
	var ret = {xComplete:xComplete,yComplete:yComplete};
	return ret;
}


function getWidth(){
	if(document.documentElement.scrollWidth < document.documentElement.clientWidth){
		return document.documentElement.clientWidth;
	}
	return document.documentElement.scrollWidth;
}

function getHeight(){
	if(document.documentElement.scrollHeight < document.documentElement.clientHeight){
		return document.documentElement.clientHeight;
	}
	return document.documentElement.scrollHeight;
}

function getVisibleWidth(){
	return document.documentElement.clientWidth;
}

function getVisibleHeight(){
	return document.documentElement.clientHeight;
}

