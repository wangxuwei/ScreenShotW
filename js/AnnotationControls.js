(function($){

	function AnnotationControls(){};
  
	// --------- Component Interface Implementation ---------- //
	AnnotationControls.prototype.create = function(data,config){
		var color = app.drawColor;
		return $e = $(Handlebars.compile($("#tmpl-AnnotationControls").html())({color:color}));
	}
		
	AnnotationControls.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
		$e.delegate(".modeControl .annotationControl","click",function(){
			var $this = $(this);
			$this.closest(".modeControl").find(".annotationControl").removeClass("press");
			$this.toggleClass("press");
			app.drawMode = $this.attr("data-value");
			if($this.closest(".modeControl").find(".annotationControl.press").size()==0){
				app.drawMode = "";
			}
		});
		
		$e.delegate(".colorControl","click",function(){
			var $this = $(this);
			brite.display("ColorPicker",{$target:$this}).done(function(colorPicker){
				colorPicker.onChange(function(color){
					app.drawColor = color;
					$this.find(".colorItem").css("background-color",color);
				})
			});
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