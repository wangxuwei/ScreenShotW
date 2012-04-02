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
		var $canvas = $e.find(".baseAreaCanvas");
		c.$canvas = $canvas;
		
//		var imageObj = JSON.parse(localStorage.getItem("image"));
		brite.dm.list("Images").done(function(imageObjs){
			var imageObj = imageObjs[imageObjs.length - 1];
//			brite.dm.remove("Images",imageObj.id);
			var canvasWidth = imageObj.width;
			var canvasHeight = imageObj.height;
			var initDfd = $.Deferred();
			$e.width(canvasWidth);
			$e.height(canvasHeight);
			
			var gtx = brite.gtx($canvas);
			gtx.fitParent();
			
			var image = new Image();
			image.src = imageObj.data;
			image.onload = function() {
				gtx.drawImage(image, 0, 0, canvasWidth, canvasHeight,0, 0, canvasWidth, canvasHeight);
				initDfd.resolve();
			}
			
			initDfd.done(function(){
				brite.display("EditArea");
			});
		});
	}
		
	BaseArea.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		var $canvas = c.$canvas;
		
		$e.bind("saveEditCanvasContent",function(e,extra){
			var graphics = extra.graphics;
			if(graphics.save){
				var _xmlString = "";
				_xmlString = "<"+graphics.drawMode+" from=\""+graphics.startX+";"+graphics.startY+"\" to=\""+graphics.endX+";"+graphics.endY+"\" />"
				_xmlAnnotation.push(_xmlString);
				app.draw($canvas,graphics,true);
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