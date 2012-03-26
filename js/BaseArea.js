var app = app || {};
(function($){

	function BaseArea(){};
	var _xmlAnnotation = [];
	
  
	// --------- Component Interface Implementation ---------- //
	BaseArea.prototype.create = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-BaseArea").html())());
	}
	
	BaseArea.prototype.init = function(data,config){
		var c = this;
		var $e = this.$element;
		var type = JSON.parse(localStorage.getItem("type"));
		var initDfd = $.Deferred();
		if(type == "visible"){
			var imgs = localStorage.getItem("imgs");
			var canvasWidth = JSON.parse(localStorage.getItem("width"));
			var canvasHeight = JSON.parse(localStorage.getItem("height"));
			$e.width(canvasWidth);
			$e.height(canvasHeight);
			
			var $canvas = $e.find(".baseAreaCanvas");
			c.$canvas = $canvas;
			var gtx = brite.gtx($canvas);
			gtx.fitParent();
			
			var image = new Image();
			image.src = imgs;
			image.onload = function() {
				gtx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
				initDfd.resolve();
			}
		}else if(type == "entire"){
			var imgs = JSON.parse(localStorage.getItem("imgs"));
			var canvasWidth = JSON.parse(localStorage.getItem("width"));
			var canvasHeight = JSON.parse(localStorage.getItem("height"));
			//use <canvas> to load img
			$e.width(canvasWidth);
			$e.height(canvasHeight);
			
			var $canvas = $e.find(".baseAreaCanvas");
			c.$canvas = $canvas;
			var gtx = brite.gtx($canvas);
			gtx.fitParent();
			
			app.serialResolve(imgs,function(imgObj,i){
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
				initDfd.resolve();
			});
		}
		
		initDfd.done(function(){
			brite.display("EditArea");
		});
	}
		
	BaseArea.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		var $canvas = c.$canvas;
		
		$e.bind("saveEditCanvasContent",function(e,extra){
			if(extra.save){
				var _xmlString = "";
				_xmlString = "<"+app.drawMode+" from=\""+extra.startX+";"+extra.startY+"\" to=\""+extra.endX+";"+extra.endY+"\" />"
				_xmlAnnotation.push(_xmlString);
				console.log(_xmlAnnotation);
				app.draw($canvas,extra.dtX,extra.dtY,{startX:extra.startX,startY:extra.startY,endX:extra.endX,endY:extra.endY},true);
			}
		});

	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Private API --------- //	
	
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("BaseArea",{
        parent: ".mainScreen-main",
        emptyParent: true,
        loadTemplate:true
    },function(){
        return new BaseArea();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);