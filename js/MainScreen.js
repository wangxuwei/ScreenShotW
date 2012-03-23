(function($){

	function MainScreen(){};
  
	// --------- Component Interface Implementation ---------- //
	MainScreen.prototype.create = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-MainScreen").html())());
	}
		
	MainScreen.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
		brite.display('Toolbar');
		brite.display('BaseArea');
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Private API --------- //	
	
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("MainScreen",{
        parent: "#page",
        emptyParent: true,
        loadTemplate:true
    },function(){
        return new MainScreen();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);