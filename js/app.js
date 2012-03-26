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
	
	app.draw = function($canvas,dtX,dtY,coop,notClear,drawMode){
		if(!drawMode){
			drawMode = app.drawMode;
		}
		if(drawMode){
			if(drawMode == "arrow"){
				drawArrow($canvas,dtX,dtY,coop,notClear);
			}else if(drawMode == "rect"){
				drawRect($canvas,dtX,dtY,coop,notClear);
			}else if(drawMode == "line"){
				drawLine($canvas,dtX,dtY,coop,notClear);
			}else if(drawMode == "eclipse"){
//				drawEclipse($canvas,dtX,dtY,coop,notClear);
			}
		}
	}
	
	function getPoints(width,height,dtX,dtY,coop){
		var x0 = 0;
		var y0 = 0;
		var x1 = width;
		var y1 = height;
		if(coop){
			x0 = coop.startX;
			y0 = coop.startY;
			x1 = coop.endX;
			y1 = coop.endY;
		}
		if(!dtX){
			x0 = width;
			x1 = 0;
			if(coop){
				x0 = coop.endX;
				x1 = coop.startX;
			}
		}
		if(!dtY){
			y0 = height;
			y1 = 0;
			if(coop){
				y0 = coop.endY;
				y1 = coop.startY;
			}
		}
		return {x0:x0,y0:y0,x1:x1,y1:y1};
	}
	
	function drawArrow($canvas,dtX,dtY,coop,notClear){
		var gtx = brite.gtx($canvas);
		if(!notClear){
			gtx.fitParent();
		}
		var width = $canvas.width();
		var height = $canvas.height();
		var points = getPoints(width,height,dtX,dtY,coop);
		var x0 = points.x0;
		var y0 = points.y0;
		var x1 = points.x1;
		var y1 = points.y1;
		var D = Math.sqrt((x0-x1) * (x0-x1) + (y0-y1) * (y0-y1));
		
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
	
	function drawRect($canvas,dtX,dtY,coop,notClear){
		var gtx = brite.gtx($canvas);
		if(!notClear){
			gtx.fitParent();
		}
		var width = $canvas.width();
		var height = $canvas.height();
		var points = getPoints(width,height,dtX,dtY,coop);
		var x0 = points.x0;
		var y0 = points.y0;
		var x1 = points.x1;
		var y1 = points.y1;
		var cx = (x0 - x1) < 0 ? 2 : -2;
		var cy = (y0 - y1) < 0 ? 2 : -2;
		
		gtx.beginPath();
		gtx.strokeStyle("#ff0000");
		gtx.lineWidth(3);
		gtx.moveTo(x0+cx,y0+cy);
		gtx.lineTo(x1-cx,y0+cy);
		gtx.lineTo(x1-cx,y1-cy);
		gtx.lineTo(x0+cx,y1-cy);
		gtx.closePath();
		gtx.stroke();
		
	}
	
	function drawLine($canvas,dtX,dtY,coop,notClear){
		var gtx = brite.gtx($canvas);
		if(!notClear){
			gtx.fitParent();
		}
		var width = $canvas.width();
		var height = $canvas.height();
		var points = getPoints(width,height,dtX,dtY,coop);
		var x0 = points.x0;
		var y0 = points.y0;
		var x1 = points.x1;
		var y1 = points.y1;
		
		gtx.strokeStyle("#ff0000");
		gtx.lineWidth(3);
		gtx.moveTo(x0,y0);
		gtx.lineTo(x1,y1);
		gtx.stroke();
		
	}
	
//	function drawEclipse($canvas,dtX,dtY,coop,notClear){
//		var gtx = brite.gtx($canvas);
//		if(!notClear){
//			gtx.fitParent();
//		}
//		var width = $canvas.width();
//		var height = $canvas.height();
//		var points = getPoints(width,height,dtX,dtY,coop);
//		var x0 = points.x0;
//		var y0 = points.y0;
//		var x1 = points.x1;
//		var y1 = points.y1;
//		
//		var k = 0.5522848;
//        var xo = ((x1-x0) / 2) * k;
//        var yo = ((y1-y0) / 2) * k;
//        var xm = x1 / 2;
//        var ym = y1 / 2;
//        
//        gtx.strokeStyle("#ff0000");
//		gtx.lineWidth(3);
//		gtx.beginPath();
//		gtx.moveTo(x0, ym);
//		gtx.bezierCurveTo(x0, ym - yo, xm - xo, y0, xm, y0);
//		gtx.bezierCurveTo(xm + xo, y0, x1, ym - yo, x1, ym);
//		gtx.bezierCurveTo(x1, ym + yo, xm + xo, y1, xm, y1);
//		gtx.bezierCurveTo(xm - xo, y1, x0, ym + yo, x0, ym);
//		gtx.stroke();
//		
//	}
})(jQuery);

