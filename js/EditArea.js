(function($){

	function EditArea(){};
	var _prevGraphics = {};
  
	// --------- Component Interface Implementation ---------- //
	EditArea.prototype.create = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-EditArea").html())());
	}
		
	EditArea.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		var $editArea = $e;
		var $editCanvas = $e.find("canvas");
		var $baseArea = $e.bComponent("BaseArea").$element;
		
		$baseArea.bDrag({
			start:function(event,dragExtra){
				//save prev graphics
				$baseArea.trigger("saveEditCanvasContent",{
					save:_prevGraphics.save,
					startX:_prevGraphics.startX,
					startY:_prevGraphics.startY,
					endX:_prevGraphics.endX,
					endY:_prevGraphics.endY,
					dtX:_prevGraphics.dtX,
					dtY:_prevGraphics.dtY,
				});
				
				$editArea.width(0);
				$editArea.height(0);
				var left = dragExtra.startPageX - $baseArea.offset().left;
				var top = dragExtra.startPageY - $baseArea.offset().top;
				$editArea.css("left",left+"px");
				$editArea.css("top",top+"px");
			},
			drag:function(event,dragExtra){
				var dtX = true;
				var dtY = true;
				$editArea.width(Math.abs(dragExtra.startPageX - dragExtra.pageX));
				$editArea.height(Math.abs(dragExtra.startPageY - dragExtra.pageY));
				if(dragExtra.pageX < dragExtra.startPageX){
					var left = dragExtra.pageX - $baseArea.offset().left;
					$editArea.css("left",left+"px");
					dtX = false;
				}
				if(dragExtra.pageY < dragExtra.startPageY){
					var top = dragExtra.pageY - $baseArea.offset().top;
					$editArea.css("top",top+"px");
					dtY = false;
				}
				app.draw($editCanvas,dtX,dtY);
				
				savePrevGraphics.call(c,dtX,dtY);
			},
			end:function(event,dragExtra){
				
			}
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Private API --------- //	
	savePrevGraphics = function(dtX,dtY){
		var c = this;
		var $e = c.$element;
		var $editArea = $e;
		var pos = $editArea.position();
		if(!app.drawMode || app.drawMode == ""){
			_prevGraphics.save = false;
		}else{
			_prevGraphics.save = true;
		}
		_prevGraphics.dtX = dtX;
		_prevGraphics.dtY = dtY;
		_prevGraphics.startX = pos.left;
		_prevGraphics.startY = pos.top;
		_prevGraphics.endX = pos.left + $editArea.width();
		_prevGraphics.endY = pos.top + $editArea.height();
	}
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("EditArea",{
        parent: ".baseArea",
        loadTemplate:true
    },function(){
        return new EditArea();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);