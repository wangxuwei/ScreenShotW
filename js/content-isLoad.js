var isContentScriptLoaded; 
if(typeof isContentScriptLoaded == "undefined") {
	chrome.extension.sendRequest({action:"notLoaded"});
} else {
	chrome.extension.sendRequest({action:"loaded"});
}