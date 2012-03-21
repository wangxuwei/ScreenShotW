var isContentScriptLoaded = true;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var data = request.data || {};
    if (request.action == "scroll"){
    	var complete = scrollNext(data.first);
    	var reduceHeight = 0;
    	if(complete){
    		reduceHeight = document.documentElement.clientHeight - (document.documentElement.offsetHeight % document.documentElement.clientHeight);
    	}
    	setTimeout(function(){
    		sendResponse({complete:complete,reduceHeight:reduceHeight});
    	}, 300);
    	
    }else{
    	sendResponse({});
    }
});

function scrollNext(first){
	var prevScrollTop;
	if(first){
		document.body.scrollTop = 0;
		prevScrollTop = document.body.scrollTop;
	}else{
		prevScrollTop = document.body.scrollTop;
		document.body.scrollTop = prevScrollTop + document.documentElement.clientHeight;
		prevScrollTop = document.body.scrollTop;
	}
	if(prevScrollTop + document.documentElement.clientHeight >= document.documentElement.offsetHeight){
		return true;
	}
	return false;
}