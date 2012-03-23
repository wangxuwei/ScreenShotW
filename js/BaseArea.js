var app = app || {};
(function($){

	function BaseArea(){};
  
	// --------- Component Interface Implementation ---------- //
	BaseArea.prototype.create = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-BaseArea").html())());
	}
	
	BaseArea.prototype.init = function(data,config){
		var c = this;
		var $e = this.$element;
		var imgs = JSON.parse(localStorage.getItem("imgs"));
		var canvasWidth = JSON.parse(localStorage.getItem("width"));
		var canvasHeight = JSON.parse(localStorage.getItem("height"));
		//use <canvas> to load img
		$e.width(canvasWidth);
		$e.height(canvasHeight);
		var $canvas = $e.find(".baseAreaCanvas");
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
			brite.display("EditArea");
		});
	}
		
	BaseArea.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;

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