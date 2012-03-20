$(function() {
	  brite.dm.list("Images", {}).done(function(images) {

		    var img = new Image();
		    img.onload = function() {
			    var w = img.width;
			    var h = img.height;
//			    $("#show-canvas").width(w);
//			    $("#show-canvas").height(h);
//			    var ctx = document.getElementById("show-canvas").getContext("2d");
//			    ctx.clearRect(0, 0, w, h);
//			    ctx.drawImage(img, 0, 0, w, h);
		    }
		    img.onerror = function() {
		    }
		    img.src = images[0].data;
		    $("#preview").attr("src", images[0].data)
	    });
  })