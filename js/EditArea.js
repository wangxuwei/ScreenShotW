(function($){

	function EditArea(){};
	var _prevGraphics = {};
	var _startX, _startY, endX, endY;
	var _locusPoints = [];
  
	// --------- Component Interface Implementation ---------- //
	EditArea.prototype.create = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-EditArea").html())());
	}
	
	EditArea.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		var $editArea = $e;
		var $editCanvas = $e.find("canvas");
		var thisOffset = $editArea.offset();
		var $baseArea = $e.bComponent("BaseArea").$element;
		
		$baseArea.bDrag({
			start:function(event,dragExtra){
				//save prev graphics
				$baseArea.trigger("saveEditCanvasContent",{
					graphics:_prevGraphics
				});
				//when draw a new graphic, init locusPoint
				_locusPoints = [];
				
				_startX = dragExtra.startPageX - thisOffset.left;
				_startY = dragExtra.startPageY - thisOffset.top;
				_locusPoints.push({x:_startX,y:_startY});
			},
			drag:function(event,dragExtra){
				_endX = dragExtra.pageX - thisOffset.left;
				_endY = dragExtra.pageY - thisOffset.top;
				_locusPoints.push({x:_endX,y:_endY});
				savePrevGraphics.call(c);
				app.draw($editCanvas,_prevGraphics);
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
		if(!app.drawMode || app.drawMode == ""){
			_prevGraphics.save = false;
		}else{
			_prevGraphics.save = true;
		}
		_prevGraphics.drawMode = app.drawMode;
		_prevGraphics.criticalPoints = {startX:_startX,startY:_startY,endX:_endX,endY:_endY};
		_prevGraphics.locusPoints = _locusPoints;
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