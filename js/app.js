var app = app || {};
(function($){
	app.serialResolve = function(items,itemResolver){
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
	
	app.draw = function($canvas,dtX,dtY){
		if(app.mode){
			if(app.mode == "arrow"){
				drawArrow($canvas,dtX,dtY);
			}
		}
	}
	
	function drawArrow($canvas,dtX,dtY){
		var gtx = brite.gtx($canvas);
		gtx.fitParent();
		var width = $canvas.width();
		var height = $canvas.height();
		var D = Math.sqrt(width * width + height * height);
		var x0 = 0;
		var y0 = 0;
		var x1 = width;
		var y1 = height;
		if(!dtX){
			x0 = width;
			x1 = 0;
		}
		if(!dtY){
			y0 = height;
			y1 = 0;
		}
		
		gtx.strokeStyle("#ff0000");
		gtx.lineWidth(3);
		gtx.moveTo(x0,y0);
		gtx.lineTo(x1,y1);
		gtx.stroke();
		
		var arrowLenth = 8;
		var xa = x1 + arrowLenth * ((x0 - x1) + (y0 - y1) / 2) / D;
		var ya = y1 + arrowLenth * ((y0 - y1) - (x0 - x1) / 2) / D;
		var xb = x1 + arrowLenth * ((x0 - x1) - (y0 - y1) / 2) / D;
		var yb = y1 + arrowLenth * ((y0 - y1) + (x0 - x1) / 2) / D;
		
		gtx.moveTo(x1, y1);
		gtx.lineTo(xa, ya);
		gtx.moveTo(x1, y1);
		gtx.lineTo(xb, yb);
		gtx.stroke();
	}
})(jQuery);

