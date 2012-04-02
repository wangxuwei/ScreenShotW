var isContentScriptLoaded; 
if(typeof isContentScriptLoaded == "undefined") {
	console.log("go notloaded")
	chrome.extension.sendRequest({action:"notLoaded"});
} else {
	console.log("go loaded")
	chrome.extension.sendRequest({action:"loaded"});
}