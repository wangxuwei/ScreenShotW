$(document).ready(function(){
	
	//send request where backround.js can accept the request
	$(".popup").find("a").bind("click",function() {
		var type = $(this).attr("data-type");
		if (type=='visible') {
			chrome.extension.sendRequest({action:'cmdVisible'});
		}else if (type == 'entire') {
			chrome.extension.sendRequest({action:'cmdEntire'});
		}else if (type == 'selected') {
			chrome.extension.sendRequest({action:'cmdSelected'});
		}
	});
	
});

