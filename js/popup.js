$(document).ready(function(){
	$(".popup").find("a").bind("click",function() {
		var type = $(this).attr("data-type");
		if (type=='visible') {
			//FIXME
		}else if (type == 'entire') {
			chrome.extension.sendRequest({action:'cmdEntire'});
		}else if (type == 'selected') {
			//FIXME
		}
	});
	
});

