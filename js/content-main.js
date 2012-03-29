if(typeof addEvent!='function'){var addEvent=function(o,t,f,l){var d='addEventListener',n='on'+t,rO=o,rT=t,rF=f,rL=l;if(o[d]&&!l)return o[d](t,f,false);if(!o._evts)o._evts={};if(!o._evts[t]){o._evts[t]=o[n]?{b:o[n]}:{};o[n]=new Function('e','var r=true,o=this,a=o._evts["'+t+'"],i;for(i in a){o._f=a[i];r=o._f(e||window.event)!=false&&r;o._f=null}return r');if(t!='unload')addEvent(window,'unload',function(){removeEvent(rO,rT,rF,rL)})}if(!f._i)f._i=addEvent._i++;o._evts[t][f._i]=f};addEvent._i=1;var removeEvent=function(o,t,f,l){var d='removeEventListener';if(o[d]&&!l)return o[d](t,f,false);if(o._evts&&o._evts[t]&&f._i)delete o._evts[t][f._i]}}function cancelEvent(e,c){e.returnValue=false;if(e.preventDefault)e.preventDefault();if(c){e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation()}};function DragResize(myName,config){var props={myName:myName,enabled:true,handles:['tl','tm','tr','ml','mr','bl','bm','br'],isElement:null,isHandle:null,element:null,handle:null,minWidth:10,minHeight:10,minLeft:0,maxLeft:9999,minTop:0,maxTop:9999,zIndex:1,mouseX:0,mouseY:0,lastMouseX:0,lastMouseY:0,mOffX:0,mOffY:0,elmX:0,elmY:0,elmW:0,elmH:0,allowBlur:true,ondragfocus:null,ondragstart:null,ondragmove:null,ondragend:null,ondragblur:null};for(var p in props)this[p]=(typeof config[p]=='undefined')?props[p]:config[p]};DragResize.prototype.apply=function(node){var obj=this;addEvent(node,'mousedown',function(e){obj.mouseDown(e)});addEvent(node,'mousemove',function(e){obj.mouseMove(e)});addEvent(node,'mouseup',function(e){obj.mouseUp(e)})};DragResize.prototype.select=function(newElement){with(this){if(!document.getElementById||!enabled)return;if(newElement&&(newElement!=element)&&enabled){element=newElement;element.style.zIndex=++zIndex;if(this.resizeHandleSet)this.resizeHandleSet(element,true);elmX=parseInt(element.style.left);elmY=parseInt(element.style.top);elmW=element.offsetWidth;elmH=element.offsetHeight;if(ondragfocus)this.ondragfocus()}}};DragResize.prototype.deselect=function(delHandles){with(this){if(!document.getElementById||!enabled)return;if(delHandles){if(ondragblur)this.ondragblur();if(this.resizeHandleSet)this.resizeHandleSet(element,false);element=null}handle=null;mOffX=0;mOffY=0}};DragResize.prototype.mouseDown=function(e){with(this){if(!document.getElementById||!enabled)return true;var elm=e.target||e.srcElement,newElement=null,newHandle=null,hRE=new RegExp(myName+'-([trmbl]{2})','');while(elm){if(elm.className){if(!newHandle&&(hRE.test(elm.className)||isHandle(elm)))newHandle=elm;if(isElement(elm)){newElement=elm;break}}elm=elm.parentNode}if(element&&(element!=newElement)&&allowBlur)deselect(true);if(newElement&&(!element||(newElement==element))){if(newHandle)cancelEvent(e);select(newElement,newHandle);handle=newHandle;if(handle&&ondragstart)this.ondragstart(hRE.test(handle.className))}}};DragResize.prototype.mouseMove=function(e){with(this){if(!document.getElementById||!enabled)return true;mouseX=e.pageX||e.clientX+document.documentElement.scrollLeft;mouseY=e.pageY||e.clientY+document.documentElement.scrollTop;var diffX=mouseX-lastMouseX+mOffX;var diffY=mouseY-lastMouseY+mOffY;mOffX=mOffY=0;lastMouseX=mouseX;lastMouseY=mouseY;if(!handle)return true;var isResize=false;if(this.resizeHandleDrag&&this.resizeHandleDrag(diffX,diffY)){isResize=true}else{var dX=diffX,dY=diffY;if(elmX+dX<minLeft)mOffX=(dX-(diffX=minLeft-elmX));else if(elmX+elmW+dX>maxLeft)mOffX=(dX-(diffX=maxLeft-elmX-elmW));if(elmY+dY<minTop)mOffY=(dY-(diffY=minTop-elmY));else if(elmY+elmH+dY>maxTop)mOffY=(dY-(diffY=maxTop-elmY-elmH));elmX+=diffX;elmY+=diffY}with(element.style){left=elmX+'px';width=elmW+'px';top=elmY+'px';height=elmH+'px'}if(window.opera&&document.documentElement){var oDF=document.getElementById('op-drag-fix');if(!oDF){var oDF=document.createElement('input');oDF.id='op-drag-fix';oDF.style.display='none';document.body.appendChild(oDF)}oDF.focus()}if(ondragmove)this.ondragmove(isResize, e)/* modified by imiaou: add args 'e' */;cancelEvent(e)}};DragResize.prototype.mouseUp=function(e){with(this){if(!document.getElementById||!enabled)return;var hRE=new RegExp(myName+'-([trmbl]{2})','');if(handle&&ondragend)this.ondragend(hRE.test(handle.className));deselect(false)}};DragResize.prototype.resizeHandleSet=function(elm,show){with(this){if(!elm._handle_tr){for(var h=0;h<handles.length;h++){var hDiv=document.createElement('div');hDiv.className=myName+' '+myName+'-'+handles[h];elm['_handle_'+handles[h]]=elm.appendChild(hDiv)}}for(var h=0;h<handles.length;h++){elm['_handle_'+handles[h]].style.visibility=show?'inherit':'hidden'}}};DragResize.prototype.resizeHandleDrag=function(diffX,diffY){with(this){var hClass=handle&&handle.className&&handle.className.match(new RegExp(myName+'-([tmblr]{2})'))?RegExp.$1:'';var dY=diffY,dX=diffX,processed=false;if(hClass.indexOf('t')>=0){rs=1;if(elmH-dY<minHeight)mOffY=(dY-(diffY=elmH-minHeight));else if(elmY+dY<minTop)mOffY=(dY-(diffY=minTop-elmY));elmY+=diffY;elmH-=diffY;processed=true}if(hClass.indexOf('b')>=0){rs=1;if(elmH+dY<minHeight)mOffY=(dY-(diffY=minHeight-elmH));else if(elmY+elmH+dY>maxTop)mOffY=(dY-(diffY=maxTop-elmY-elmH));elmH+=diffY;processed=true}if(hClass.indexOf('l')>=0){rs=1;if(elmW-dX<minWidth)mOffX=(dX-(diffX=elmW-minWidth));else if(elmX+dX<minLeft)mOffX=(dX-(diffX=minLeft-elmX));elmX+=diffX;elmW-=diffX;processed=true}if(hClass.indexOf('r')>=0){rs=1;if(elmW+dX<minWidth)mOffX=(dX-(diffX=minWidth-elmW));else if(elmX+elmW+dX>maxLeft)mOffX=(dX-(diffX=maxLeft-elmX-elmW));elmW+=diffX;processed=true}return processed}};

var isContentScriptLoaded = true;
var overflowStyle = "";


var doc, html, docW, docH, initScrollTop, initScrollLeft, clientH, clientW;
var fixedElements = [];
var wrapperHTML = '<div id="screenshotapp_screenshot_wrapper"><div id="screenshotapp_screenshot_top"></div><div id="screenshotapp_screenshot_right"></div><div id="screenshotapp_screenshot_bottom"></div><div id="screenshotapp_screenshot_left"></div><div id="screenshotapp_screenshot_center" class="drsElement drsMoveHandle"><div id="screenshotapp_screenshot_size"><span>0 X 0</span></div><div id="screenshotapp_screenshot_action"><a href="javascript:void(0)" id="screenshotapp_screenshot_capture"><span></span>Capture</a><a href="javascript:void(0)" id="screenshotapp_screenshot_cancel"><span></span>Cancel</a></div></div></div>';
var wrapper, dragresize; // dragresize object
var isSelected = false;



//accept the request from the background.js
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var data = request.data || {};
    if (request.action == "scroll"){
    	//first hide scroll bar
    	if(data.xfirst && data.yfirst){
    		overflowStyle = document.body.style.overflow;
    		document.body.style.overflow = "hidden";
    	}
    	var complete = scrollNext(data.xfirst,data.yfirst,data.xMove,data.yMove);
    	if(complete.xComplete && complete.yComplete){
    		document.body.style.overflow = overflowStyle;
    	}
    	
    	var height = getHeight();
    	var width = getWidth();
    	var vWidth = getVisibleWidth();
    	var vHeight = getVisibleHeight();
    	
    	var reduceHeight = 0;
    	var reduceWidth = 0;
    	var x = document.body.scrollLeft;
    	var y = document.body.scrollTop;
    	var remainWidth = vWidth;
    	var remainHeight = vHeight;
    	if(complete.xComplete){
    		remainWidth = width % vWidth;
    		if(remainWidth == 0){
    			remainWidth = vWidth;
    		}
    		reduceWidth = vWidth - remainWidth;
    		x = document.body.scrollLeft + reduceWidth;
    	}
    	if(complete.yComplete){
    		remainHeight = height % vHeight;
    		if(remainHeight == 0){
    			remainHeight = vHeight;
    		}
    		reduceHeight = vHeight - remainHeight;
    		y = document.body.scrollTop + reduceHeight;
    	}
    	setTimeout(function(){
    		sendResponse({complete:{x:complete.xComplete,y:complete.yComplete},coop:{x:x,y:y},remainArea:{remainWidth:remainWidth,remainHeight:remainHeight},width:width,height:height});
    	}, 300);
    	
    } else if (request.action == "mask") {
		  initSelectedCapture();
	  } else if (request.action == "ummask") {
		  var mask = document.getElementById("screenshotapp_screenshot_wrapper");
		  mask.parentNode.removeChild(mask);
		  sendResponse({});
	  } else if (request.action == "destroy_selected") {
		  removeSelected();
	  } else {
		  sendResponse({});
	  }
});

//do scrolling
function scrollNext(xfirst,yfirst,xMove,yMove){
	var prevScrollTop = document.body.scrollTop;
	var prevScrollLeft = document.body.scrollLeft;
	var height = getHeight();
	var width = getWidth();
	var vWidth = getVisibleWidth();
	var vHeight = getVisibleHeight();
	if(xMove){
		if(xfirst){
			document.body.scrollLeft = 0;
			prevScrollLeft = document.body.scrollLeft;
		}else{
			prevScrollLeft = document.body.scrollLeft;
			document.body.scrollLeft = prevScrollLeft + vWidth;
			prevScrollLeft = document.body.scrollLeft;
		}
	}
	if(yMove){
		if(yfirst){
			document.body.scrollTop = 0;
			prevScrollTop = document.body.scrollTop;
		}else{
			prevScrollTop = document.body.scrollTop;
			document.body.scrollTop = prevScrollTop + vHeight;
			prevScrollTop = document.body.scrollTop;
		}
	}
	
	var xComplete = false;
	var yComplete = false;
	if(prevScrollLeft + vWidth >= width){
		xComplete = true;
	}
	
	if(prevScrollTop + vHeight >= height){
		yComplete = true;
	}
	var ret = {xComplete:xComplete,yComplete:yComplete};
	return ret;
}


function getWidth(){
	if(document.documentElement.scrollWidth < document.documentElement.clientWidth){
		return document.documentElement.clientWidth;
	}
	return document.documentElement.scrollWidth;
}

function getHeight(){
	if(document.documentElement.scrollHeight < document.documentElement.clientHeight){
		return document.documentElement.clientHeight;
	}
	return document.documentElement.scrollHeight;
}

function getVisibleWidth(){
	return document.documentElement.clientWidth;
}

function getVisibleHeight(){
	return document.documentElement.clientHeight;
}



/** ************ selected capture start ************* */
function initSelectedCapture() {
	getDocumentNode();
	getDocumentDimension();
	if (!doc.getElementById('screenshotapp_screenshot_wrapper')) {
		doc.body.innerHTML += wrapperHTML;
	}
	wrapper = doc.getElementById('screenshotapp_screenshot_wrapper');
	updateWrapper();
	window.addEventListener('resize', windowResize, false);
	doc.body.addEventListener('keydown', selectedKeyDown, false);

	wrapper.addEventListener('mousedown', wrapperMouseDown, false);
}

function wrapperMouseDown(e) {
	if (e.button == 0) {
		var initX = e.pageX, initY = e.pageY;
		var asSize = doc.getElementById('screenshotapp_screenshot_size');

		wrapper.addEventListener('mousemove', wrapperMouseMove, false);
		wrapper.addEventListener('mouseup', wrapperMouseUp, false);

		function wrapperMouseMove(e) {
			setStyle(wrapper, 'background-color', 'rgba(0,0,0,0)');
			var centerW = e.pageX - initX, centerH = e.pageY - initY;
			asSize.children[0].innerHTML = Math.abs(centerW) + ' X ' + Math.abs(centerH);

			updateCorners(initX, initY, centerW, centerH);
			updateCenter(initX, initY, centerW, centerH);
			autoScroll(e);
		}

		function wrapperMouseUp(e) {
			wrapper.removeEventListener('mousedown', wrapperMouseDown, false);
			wrapper.removeEventListener('mousemove', wrapperMouseMove, false);
			wrapper.removeEventListener('mouseup', wrapperMouseUp, false);
			setStyle(doc.getElementById('screenshotapp_screenshot_action'), 'display', 'block');
			setStyle(asSize, 'display', 'block');
			bindCenter();
		}
	}
}
function selectedKeyDown(e) {
	if (e.keyCode == 27)
		removeSelected();
}
function windowResize(e) {
	updateWrapper();
	getDocumentDimension();

	var center = doc.getElementById('screenshotapp_screenshot_center');
	var centerW = getStyle(center, 'width'), centerH = getStyle(center, 'height');

	if (centerW * centerH) {
		var initX = getStyle(center, 'left'), initY = getStyle(center, 'top');
		updateCorners(initX, initY, centerW, centerH);
	}
	dragresize.maxLeft = docW;
	dragresize.maxTop = docH;
}

function bindCenter() {
	var initX, initY, centerW, centerH;
	var center = doc.getElementById('screenshotapp_screenshot_center');
	dragresize = new DragResize('dragresize', {
		  maxLeft : docW,
		  maxTop : docH
	  }); // { minWidth: 50, minHeight: 50, minLeft: 20, minTop: 20, maxLeft: 600,
							// maxTop: 600 });
	var asSize = doc.getElementById('screenshotapp_screenshot_size');

	dragresize.isElement = function(elm) {
		if (elm.className && elm.className.indexOf('drsElement') > -1)
			return true;
	};
	dragresize.isHandle = function(elm) {
		if (elm.className && elm.className.indexOf('drsMoveHandle') > -1)
			return true;
	};

	dragresize.ondragmove = function(isResize, ev) {
		var x = dragresize.elmX, y = dragresize.elmY, w = dragresize.elmW, h = dragresize.elmH;
		asSize.children[0].innerHTML = Math.abs(w) + ' X ' + Math.abs(h);
		updateCorners(x, y, w, h);
		updateCenter(x, y, w, h);
		autoScroll(ev);
	};

	dragresize.apply(wrapper);
	dragresize.select(center); // show resize handle

	// bind action button
	doc.getElementById('screenshotapp_screenshot_action').addEventListener('click', actionHandler, false);
	function actionHandler(e) {
		switch (e.target.id) {
			case 'screenshotapp_screenshot_capture' :
				captureSelected();
				break;
			case 'screenshotapp_screenshot_cancel' :
				removeSelected();
				break;
		}
	}

	function captureSelected() {
		dragresize.deselect(center);
		setStyle(center, 'outline', 'none');
		enableFixedPosition(false);
		counter = 1;
		html = doc.documentElement;
		initScrollTop = doc.body.scrollTop;
		initScrollLeft = doc.body.scrollLeft;
		clientH = html.clientHeight;
		clientW = html.clientWidth;
		isSelected = true;
		var x = dragresize.elmX, y = dragresize.elmY, w = dragresize.elmW, h = dragresize.elmH;
		var offX = x - doc.body.scrollLeft, offY = y - doc.body.scrollTop;

		if (offX <= 0)
			doc.body.scrollLeft = x;
		else {
			wrapper.style.paddingRight = offX + 'px';
			doc.body.scrollLeft += offX;
		}
		if (offY <= 0)
			doc.body.scrollTop = y;
		else {
			wrapper.style.paddingTop = offY + 'px';
			doc.body.scrollTop += offY;
		}

		getDocumentDimension();
		updateCorners(x, y, w, h);

		if (w <= clientW && h <= clientH) {
			setTimeout(sendRequest, 500, {
				  action : 'captureSelectedArea',
				  ratio : (h % clientH) / clientH,
				  centerW : w,
				  centerH : h
			  });
			return;
		}
	}
}

function removeSelected() {
	window.removeEventListener('resize', windowResize);
	doc.body.removeEventListener('keydown', selectedKeyDown, false);
	wrapper.parentNode.removeChild(wrapper);
	isSelected = false;
	doc.body.scrollTop = initScrollTop;
	doc.body.scrollLeft = initScrollLeft;
}
function autoScroll(e) {
	var clientY = e.clientY, clientX = e.clientX, restY = window.innerHeight - clientY, restX = window.innerWidth
	  - clientX;
	if (clientY < 20)
		doc.body.scrollTop -= 25;
	if (clientX < 40)
		doc.body.scrollLeft -= 25;
	if (restY < 40)
		doc.body.scrollTop += 60 - restY;
	if (restX < 40)
		doc.body.scrollLeft += 60 - restX;
}

function updateCorners(x, y, w, h) { // x:initX, w:centerW
	var topW = (w >= 0) ? (x + w) : x;
	var topH = (h >= 0) ? y : (y + h);
	var rightW = (w >= 0) ? (docW - x - w) : (docW - x);
	var rightH = (h >= 0) ? (y + h) : y;
	var bottomW = (w >= 0) ? (docW - x) : (docW - x - w);
	var bottomH = (h >= 0) ? (docH - y - h) : (docH - y);
	var leftW = (w >= 0) ? x : (x + w);
	var leftH = (h >= 0) ? (docH - y) : (docH - y - h);

	var top = doc.getElementById('screenshotapp_screenshot_top');
	var right = doc.getElementById('screenshotapp_screenshot_right');
	var bottom = doc.getElementById('screenshotapp_screenshot_bottom');
	var left = doc.getElementById('screenshotapp_screenshot_left');
	setStyle(top, 'width', topW + 'px');
	setStyle(top, 'height', topH + 'px');
	setStyle(right, 'width', rightW + 'px');
	setStyle(right, 'height', rightH + 'px');
	setStyle(bottom, 'width', bottomW + 'px');
	setStyle(bottom, 'height', bottomH + 'px');
	setStyle(left, 'width', leftW + 'px');
	setStyle(left, 'height', leftH + 'px');
}
function updateCenter(x, y, w, h) {
	var l = (w >= 0) ? x : (x + w);
	var t = (h >= 0) ? y : (y + h);

	var center = doc.getElementById('screenshotapp_screenshot_center');
	setStyle(center, 'width', Math.abs(w) + 'px');
	setStyle(center, 'height', Math.abs(h) + 'px');
	setStyle(center, 'top', t + 'px');
	setStyle(center, 'left', l + 'px');
}
function updateWrapper() {
	setStyle(wrapper, 'display', 'none');
	setStyle(wrapper, 'width', doc.body.scrollWidth + 'px');
	setStyle(wrapper, 'height', document.body.scrollHeight + 'px');//todo
	setStyle(wrapper, 'display', 'block');
}

function setStyle(ele, style, value) {
	ele.style.setProperty(style, value/* , 'important' */);
}
function getStyle(ele, style) {
	return parseInt(ele.style.getPropertyValue(style));
}
/** ************ selected capture end ************* */

function enableFixedPosition(enableFlag) {
	if (enableFlag) {
		for (var i = 0, l = fixedElements.length; i < l; ++i) {
			fixedElements[i].style.position = "fixed";
		}
	} else {
		var nodeIterator = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null, false);
		var currentNode;
		while (currentNode = nodeIterator.nextNode()) {
			var nodeComputedStyle = document.defaultView.getComputedStyle(currentNode, "");
			if (!nodeComputedStyle)
				return;
			var nodePosition = nodeComputedStyle.getPropertyValue("position");
			if (nodePosition == "fixed") {
				fixedElements.push(currentNode);
				currentNode.style.position = "absolute";
			}
		}
	}
}


function checkScrollBar() {
	scrollBar.x = window.innerHeight > getClientH() ? true : false;
	scrollBar.y = document.body.scrollHeight > window.innerHeight ? true : false;
}
function sendRequest(r) {
	chrome.extension.sendRequest(r);
}
function getDocumentNode() {
	doc = window.document;
	if (window.location.href.match(/https?:\/\/mail.google.com/i)) {
		doc = doc.getElementById('canvas_frame').contentDocument;
	}
}
function getDocumentDimension() {
	docH = doc.body.scrollHeight;
	docW = doc.body.scrollWidth;
}
function getClientH() {
	return doc.compatMode === "CSS1Compat" ? html.clientHeight : doc.body.clientHeight;
}