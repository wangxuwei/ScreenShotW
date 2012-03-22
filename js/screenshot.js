$(function() {
	var imgs = JSON.parse(localStorage.getItem("imgs"));
	var canvasWidth = JSON.parse(localStorage.getItem("width"));
	var canvasHeight = JSON.parse(localStorage.getItem("height"));
	console.log(canvasWidth);
	//use <img> to load img
//	for(var i = 0; i < imgs.length; i++){
//		var $img = $("<img></img>")
//		$("body").append($img);
//		$img.attr("src",imgs[i].img);
//		var reduceHeight = imgs[i].reduceHeight;
//		if(reduceHeight > 0){
//			$img.attr("height",reduceHeight);
//		}
//	}
	//use <canvas> to load img
	var images = [];
	var $canvas = $("<canvas width="+canvasWidth+" height="+canvasHeight+"></canvas>");
	$("#page").append($canvas);
	var gtx = brite.gtx($("#page").find("canvas"));
	serialResolve(imgs,function(imgObj,i){
		var dfd = $.Deferred();
		var image = new Image();
		image.src = imgObj.img;
		images.push[image];
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
			console.log("--------");
			console.log(imgObj.remainArea);
			console.log("destX:"+destX);
			console.log("destY:"+destY);
			console.log("destWidth:"+destWidth);
			console.log("destHeight:"+destHeight);
			gtx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight,destX,destY, destWidth, destHeight);
			
			dfd.resolve();
		}
		return dfd.promise();
	});
});

function serialResolve(items,itemResolver){
    	var dfd = $.Deferred();
    	var results = [];
    	var i = 0;
    	
    	resolveAndNext();
    	function resolveAndNext(){
    		if (i < items.length){
    			var item = items[i];
    			var itemResolverResult = itemResolver(item,i);

    			// if it is a promise (but not a jquery object, which is also a promise), then, pipe it
    			if (typeof itemResolverResult !== "undefined" && itemResolverResult !== null && $.isFunction(itemResolverResult.promise) && !itemResolverResult.jquery){
    				itemResolverResult.done(function(result){
    					results.push(result);
	    				i += 1;
	    				resolveAndNext();
    				});		
    			}
    			// if it is a normal object or a jqueryObject, then, just push the value and move to the next
    			else{
    				results.push(itemResolverResult);
    				i += 1;
    				resolveAndNext();
    			}
    		}
    		// once we run out
    		else{
    			dfd.resolve(results);
    		}
    	} 
    	
    	return dfd.promise();    		
}