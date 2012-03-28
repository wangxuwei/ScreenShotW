(function($){

	function MainScreen(){};
	var _drawModeChangeListener = [];
  
	// --------- Component Interface Implementation ---------- //
	MainScreen.prototype.create = function(data,config){
		return $e = $(Handlebars.compile($("#tmpl-MainScreen").html())());
	}
		
	MainScreen.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
		brite.display('Toolbar');
		brite.display('BaseArea');
		
		$e.bind("drawModeChange",function(){
			if(_drawModeChangeListener && $.isFunction(_drawModeChangeListener)){
				_drawModeChangeListener.call(c);
			}
		});
		
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //	
	MainScreen.prototype.onDrawModeChange = function(drawModeChangeListener){
		_drawModeChangeListener = drawModeChangeListener;
	}
	
	// --------- /Component Public API --------- //
	
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