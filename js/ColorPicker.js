(function($){

	function ColorPicker(){};
  
	// --------- Component Interface Implementation ---------- //
	ColorPicker.prototype.create = function(data,config){
		var colors = ["#ffffff","#eeeeee","#ffff88","#ff7400","#cdeb8b","#6bba70","#006e2e","#c3d9ff","#4096ee","#356aa0","#ff0096","#b02b2c","#ff0000","#000000"];
		this.$screen = $("<div class='transparentScreen'></div>").appendTo($("body"));
		return $e = $(Handlebars.compile($("#tmpl-ColorPicker").html())({colors:colors}));
	}
	
	ColorPicker.prototype.init = function(data,config){
		var $e = this.$element;
		var $target = null;
		if(data && data.$target){
			$target = data.$target;
			var x = $target.offset().left + $target.width()/2 - $e.width() / 2;
			var y = $target.offset().top + $target.height() + 5;
			$e.css("left",x+"px");
			$e.css("top",y+"px");
		}
	}
		
	ColorPicker.prototype.postDisplay = function(data,config){
		var c = this;
		var $e = this.$element;
		
		this.$screen.bind("click",function(){
			c.close();
		});
		
		$e.delegate(".color","click",function(){
			var $this = $(this);
			var color = $this.css("background-color");
			if(c._changeCallback && $.isFunction(c._changeCallback)){
				c._changeCallback(color);
				c.close();
			}
		});
		
	}
	// --------- /Component Interface Implementation ---------- //
	
	// --------- Component Public API --------- //	
	ColorPicker.prototype.close = function(){
		var c = this;
		var $e = this.$element;
		$e.bRemove();
		c.$screen.remove();
	}
	
	ColorPicker.prototype.onChange = function(changeCallback){
		var c = this;
		c._changeCallback = changeCallback;
	}
	// --------- /Component Public API --------- //
	
	// --------- Component Private API --------- //	
	
	// --------- /Component Private API --------- //
	
	// --------- Component Registration --------- //
	brite.registerComponent("ColorPicker",{
        parent: "#page",
        loadTemplate:true
    },function(){
        return new ColorPicker();
    });
	// --------- /Component Registration --------- //
	
	
})(jQuery);