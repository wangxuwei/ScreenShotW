(function($){

	function EditArea(){};
  
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
			},
			end:function(event,dragExtra){
				
			}
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Private API --------- //	
	
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