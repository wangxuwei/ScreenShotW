$(function() {
	var imgs = JSON.parse(localStorage.getItem("imgs"));
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
	var $canvas = $("<canvas width=0 height=0></canvas>");
	$("#page").append($canvas);
	var gtx = brite.gtx($("#page").find("canvas"));
	gtx.fitParent();
	var height = 0;
	var y = 1 ;
	var init = true;
	serialResolve(imgs,function(imgObj,i){
		var dfd = $.Deferred();
		var image = new Image();
		image.src = imgObj.img;
		images.push[image];
		image.onload = function(){
			if(init){
				$canvas[0].height = imgs.length * image.height - imgs[imgs.length - 1].reduceHeight;
				init = false;
			}
			if(i != imgs.length - 1){
				gtx.drawImage(image,0,y);
			}else{
				var reduceHeight = imgs[imgs.length - 1].reduceHeight;
				gtx.drawImage(image, 0, reduceHeight, image.width, image.height - reduceHeight,0, y, image.width, image.height - reduceHeight);
			}
			y = y + image.height;
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