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
			$this.addClass("press");
			if($this.attr("data-value") == "arrow"){
				app.mode = "arrow";
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