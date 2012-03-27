(function($){

	function Toolbar(){};
  
	// --------- Component Interface Implementation ---------- //
	Toolbar.prototype.create = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-Toolbar").html())());
	}
	
	Toolbar.prototype.init = function(data,config){
		brite.display("AnnotationControls");
	}
		
	Toolbar.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
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