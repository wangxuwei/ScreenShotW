var app = app || {};
(function($){

	function EditArea(){};
	
	var _prevGraphics = {};
	var _startX=0, _startY=0, _endX=0, _endY=0;
	var _locusPoints = [];
	var _text = "";
  
	// --------- Component Interface Implementation ---------- //
	EditArea.prototype.create = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-EditArea").html())());
	}
	
	EditArea.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		var $editArea = $e;
		var $editAreaContent = $e.find(".editAreaContent");
		var $editCanvas = $e.find("canvas");
		var thisOffset = $editArea.offset();
		var $baseArea = $e.bComponent("BaseArea").$element;
		
		$editArea.bDrag({
			start:function(event,dragExtra){
				if(app.drawMode != 'text'){
					//save prev graphics
					$baseArea.trigger("saveEditCanvasContent",{
						graphics:_prevGraphics
					});
					//when draw a new graphic, init locusPoint
					_locusPoints = [];
					
					_startX = dragExtra.startPageX - thisOffset.left;
					_startY = dragExtra.startPageY - thisOffset.top;
					_locusPoints.push({x:_startX,y:_startY});
				}
			},
			drag:function(event,dragExtra){
				if(app.drawMode != 'text'){
					_endX = dragExtra.pageX - thisOffset.left;
					_endY = dragExtra.pageY - thisOffset.top;
					_locusPoints.push({x:_endX,y:_endY});
					savePrevGraphics.call(c);
					app.draw($editCanvas,_prevGraphics);
				}
			},
			end:function(event,dragExtra){
				
			}
		});
		
		$editArea.click(function(e){
			if(app.drawMode == "text"){
				var $inputScreen = $("<div class='inputScreen'><div>").appendTo($editAreaContent);
				var $testText = $("<div class='testText'><div>").appendTo($editAreaContent);
				var $input = $("<input type='text' class='inputText' />").appendTo($editAreaContent);
				$input.focus();
				var left = e.pageX - thisOffset.left;
				var top = e.pageY - thisOffset.top;
				_startX = left;
				_startY = top;
				$input.css("left", left + "px");
				$input.css("top", top + "px");
				
				$input.bind("keyup keydown blur update",function(){
					$input.width($input.width()+30);
					checkInputWidth($input,$testText);
				});
				
				$inputScreen.click(function(se){
					_text = $input.val();
					savePrevGraphics.call(c);
					$baseArea.trigger("saveEditCanvasContent", {
						graphics : _prevGraphics
					});
					$input.remove();
					$testText.remove();
					$inputScreen.remove();
				});
			}
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Private API --------- //	
	savePrevGraphics = function(){
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
		_prevGraphics.text = _text;
	}
	
	function checkInputWidth($input,$testText){
		$testText.html($input.val());
		$input.width($testText.width() + 10);
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