var app = app || {};
(function($){
	
	//default gtx style
	app.drawMode = "";
	app.drawColor = "#FF0000";
	
	app.draw = function($canvas,graphics,notClear){
		var drawMode = graphics.drawMode;
		if(!drawMode){
			drawMode = app.drawMode;
		}
		if(drawMode){
			if(drawMode == "arrow"){
				drawArrow($canvas,graphics,notClear);
			}else if(drawMode == "rect"){
				drawRect($canvas,graphics,notClear);
			}else if(drawMode == "line"){
				drawLine($canvas,graphics,notClear);
			}else if(drawMode == "ellipse"){
				drawEllipse($canvas,graphics,notClear);
			}else if(drawMode == "curve"){
				drawCurve($canvas,graphics,notClear);
			}else if(drawMode == "text"){
				drawText($canvas,graphics,notClear);
			}else if(drawMode == "eraser"){
				drawEraser($canvas,graphics,notClear);
			}
		}
	}
	
	function drawArrow($canvas,graphics,notClear){
		var gtx = brite.gtx($canvas);
		if(!notClear){
			gtx.fitParent();
		}
		var points = graphics.criticalPoints;
		var x0 = points.startX;
		var y0 = points.startY;
		var x1 = points.endX;
		var y1 = points.endY;
		var D = Math.sqrt((x0-x1) * (x0-x1) + (y0-y1) * (y0-y1));
		
		gtx.strokeStyle(graphics.drawColor);
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
	
	function drawRect($canvas,graphics,notClear){
		var gtx = brite.gtx($canvas);
		if(!notClear){
			gtx.fitParent();
		}
		var width = $canvas.width();
		var height = $canvas.height();
		var points = graphics.criticalPoints;
		var x0 = points.startX;
		var y0 = points.startY;
		var x1 = points.endX;
		var y1 = points.endY;
		var cx = (x0 - x1) < 0 ? 2 : -2;
		var cy = (y0 - y1) < 0 ? 2 : -2;
		
		gtx.beginPath();
		gtx.strokeStyle(graphics.drawColor);
		gtx.lineWidth(3);
		gtx.moveTo(x0+cx,y0+cy);
		gtx.lineTo(x1-cx,y0+cy);
		gtx.lineTo(x1-cx,y1-cy);
		gtx.lineTo(x0+cx,y1-cy);
		gtx.closePath();
		gtx.stroke();
		
	}
	
	function drawLine($canvas,graphics,notClear){
		var gtx = brite.gtx($canvas);
		if(!notClear){
			gtx.fitParent();
		}
		var width = $canvas.width();
		var height = $canvas.height();
		var points = graphics.criticalPoints;
		var x0 = points.startX;
		var y0 = points.startY;
		var x1 = points.endX;
		var y1 = points.endY;
		
		gtx.strokeStyle(graphics.drawColor);
		gtx.lineWidth(3);
		gtx.moveTo(x0,y0);
		gtx.lineTo(x1,y1);
		gtx.stroke();
		
	}
	
	function drawEllipse($canvas,graphics,notClear){
		var gtx = brite.gtx($canvas);
		if(!notClear){
			gtx.fitParent();
		}
		var points = graphics.criticalPoints;
		var x0 = points.startX;
		var y0 = points.startY;
		var x1 = points.endX;
		var y1 = points.endY;
		var centerX = (x0 + x1 ) / 2;
		var centerY = (y0 + y1 ) / 2;
		var rWidth = Math.abs(x0 - x1);
		var rHeight = Math.abs(y0 - y1);

		gtx.strokeStyle(graphics.drawColor);
		gtx.lineWidth(3);
		var x = x0 > x1 ? x1 : x0;
		var y = y0 > y1 ? y1 : y0;
		var k = .5522848;
		ox = (rWidth / 2) * k, // control point offset horizontal
		oy = (rHeight  / 2) * k, // control point offset vertical
		xe = x + rWidth, // x-end
		ye = y + rHeight, // y-end
		xm = x + rWidth / 2, // x-middle
		ym = y + rHeight / 2; // y-middle
		var b = 2;
		x = x + b;
		y = y + b;
		xe = xe - b;
		ye = ye - b;

		gtx.beginPath();
		gtx.moveTo(x, ym);
		gtx.bezierCurveTo(x , ym - oy, xm - ox, y, xm, y);
		gtx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		gtx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		gtx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		gtx.closePath();
		gtx.stroke();
		
	}
	
	function drawCurve($canvas,graphics,notClear){
		var gtx = brite.gtx($canvas);
		if(!notClear){
			gtx.fitParent();
		}
		var points = graphics.criticalPoints;
		var x0 = points.startX;
		var y0 = points.startY;
		var x1 = points.endX;
		var y1 = points.endY;
		var locusPoints = graphics.locusPoints;
		
		if(locusPoints && locusPoints.length > 0){
			gtx.strokeStyle(graphics.drawColor);
			gtx.lineWidth(3);
			gtx.beginPath();
			gtx.moveTo(locusPoints[0].x,locusPoints[0].y);
			for(var i=0; i < locusPoints.length; i++){
				gtx.lineTo(locusPoints[i].x,locusPoints[i].y);
			}
			gtx.stroke();
		}
	}
	
	function drawText($canvas,graphics,notClear){
		var gtx = brite.gtx($canvas);
		if(!notClear){
			gtx.fitParent();
		}
		var points = graphics.criticalPoints;
		var x0 = points.startX;
		var y0 = points.startY;
		
		gtx.fillStyle(graphics.drawColor);
		gtx.font("bold 14px Arial");
		gtx.fillText(graphics.text,x0 + 1,y0 + 13);
	}
	
	function drawEraser($canvas,graphics,notClear){
		var gtx = brite.gtx($canvas);
		if(!notClear){
			gtx.fitParent();
		}
		var points = graphics.criticalPoints;
		var x0 = points.startX;
		var y0 = points.startY;
		var x1 = points.endX;
		var y1 = points.endY;
		var locusPoints = graphics.locusPoints;
		var d = 6;
		
		if(locusPoints && locusPoints.length > 0){
			gtx.strokeStyle("#ffffff");
			gtx.lineWidth(10);
			gtx.beginPath();
			gtx.moveTo(locusPoints[0].x,locusPoints[0].y);
			for(var i=0; i < locusPoints.length; i++){
				gtx.lineTo(locusPoints[i].x,locusPoints[i].y);
			}
			gtx.stroke();
		}
	}
	
	
})(jQuery);

