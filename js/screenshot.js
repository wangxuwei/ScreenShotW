var app = app || {};
$(function() {
	var imgs = JSON.parse(localStorage.getItem("imgs"));
	var canvasWidth = JSON.parse(localStorage.getItem("width"));
	var canvasHeight = JSON.parse(localStorage.getItem("height"));
	//use <canvas> to load img
	var $canvas = $("<canvas class='fixCanvas' width="+canvasWidth+" height="+canvasHeight+"></canvas>");
	var $editCanvas = $("<canvas class='editCanvas' width="+0+" height="+0+"></canvas>");
	var $page = $("#page");
	$page.append($canvas);
	$page.append($editCanvas);
	var gtx = brite.gtx($("#page").find("canvas"));
	serialResolve(imgs,function(imgObj,i){
		var dfd = $.Deferred();
		var image = new Image();
		image.src = imgObj.img;
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
			gtx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight,destX,destY, destWidth, destHeight);
			dfd.resolve();
		}
		return dfd.promise();
	}).done(function(){
		var $toolbar = $("#toolbar");
		$toolbar.delegate(".item","click",function(){
			var $this = $(this);
			if($this.attr("data-value") == "arrow"){
				app.mode = "arrow";
			}
		});
		
		$page.bDrag({
			start:function(event,dragExtra){
				$editCanvas.attr("width",0);
				$editCanvas.attr("height",0);
				var left = dragExtra.startPageX - $canvas.offset().left;
				var top = dragExtra.startPageY - $canvas.offset().top;
				$editCanvas.css("left",left+"px");
				$editCanvas.css("top",top+"px");
			},
			drag:function(event,dragExtra){
				var dtX = true;
				var dtY = true;
				$editCanvas.attr("width",Math.abs(dragExtra.startPageX - dragExtra.pageX));
				$editCanvas.attr("height",Math.abs(dragExtra.startPageY - dragExtra.pageY));
				if(dragExtra.pageX < dragExtra.startPageX){
					var left = dragExtra.pageX - $canvas.offset().left;
					$editCanvas.css("left",left+"px");
					dtX = false;
				}
				if(dragExtra.pageY < dragExtra.startPageY){
					var top = dragExtra.pageY - $canvas.offset().top;
					$editCanvas.css("top",top+"px");
					dtY = false;
				}
				draw($editCanvas,dtX,dtY);
			},
			end:function(event,dragExtra){
				
			}
		});
	});
});

function draw($canvas,dtX,dtY){
	var gtx = brite.gtx($canvas);
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