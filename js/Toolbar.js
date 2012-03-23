(function($){

	function Toolbar(){};
  
	// --------- Component Interface Implementation ---------- //
	Toolbar.prototype.create = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-Toolbar").html())());
	}
		
	Toolbar.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
		$e.delegate(".item","click",function(){
			var $this = $(this);
			$this.closest(".toolbar").find(".item").removeClass("press");
			$this.toggleClass("press");
			app.drawMode = $this.attr("data-value");
			if($this.closest(".toolbar").find(".item.press").size()==0){
				app.drawMode = "";
			}
		});
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Private API --------- //	
	
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("Toolbar",{
        parent: ".mainScreen-top",
        emptyParent: true,
        loadTemplate:true
    },function(){
        return new Toolbar();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);