(function($){

	function AnnotationControls(){};
  
	// --------- Component Interface Implementation ---------- //
	AnnotationControls.prototype.create = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-AnnotationControls").html())());
	}
		
	AnnotationControls.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
		$e.delegate(".annotationControl","click",function(){
			var $this = $(this);
			$this.closest(".annotationControls").find(".annotationControl").removeClass("press");
			$this.toggleClass("press");
			app.drawMode = $this.attr("data-value");
			if($this.closest(".annotationControls").find(".annotationControl.press").size()==0){
				app.drawMode = "";
			}
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Private API --------- //	
	
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("AnnotationControls",{
        parent: ".toolbar .annotationControlArea",
        emptyParent: true,
        loadTemplate:true
    },function(){
        return new AnnotationControls();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);