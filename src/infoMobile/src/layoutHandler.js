/**
 * layoutHandler
 * 处理各种界面变化
 */
function layoutHandler(){
	this.scroll;
	this.wrapper = DOM.get("#wrapper");
	this.head = DOM.get("header");
}
(function(){
	var doc = document,
	win = window;
	layoutHandler.prototype = {
		constructor:layoutHandler,
		_init:function(){
			var self = this;
			self._hideHead();
			self._buildIScroll();
			window.addEventListener("scroll",function(){
				self._resize();
			},false);
			window.addEventListener("resize",function(){
				self._resize();
			},false);
		},
		_hideHead:function(){
			var self = this;
			var headerHeight = this.head.offsetHeight,
			contentHeight = this.wrapper.offsetHeight+headerHeight;
			this.wrapper.style.height = "1000px";
			win.scrollTo(0,0);
			this.wrapper.style.height = DOM.getInnerHeight()-headerHeight+"px";
		},
		_buildIScroll:function(){
			var self = this;
			self.scroll = new iScroll('wrapper', {
				onScrollEnd:function(){
			
				}
			});
			self._resize();
		},
		_resize:function(){
			var self = this;
			var headerHeight = this.head.offsetHeight,
			contentHeight = this.wrapper.offsetHeight+headerHeight;
			//this.wrapper.style.height = DOM.getInnerHeight()-headerHeight+"px";
			self.scroll.refresh();
			if(document.body.scrollTop>0){
				win.scrollTo(0,0);
			}
		},
		switchPage:function(fromEl,toEl){
			var self = this,
			wrapper = DOM.get("div",self.scroll.wrapper);
			wrapper.appendChild(toEl);
			toEl.style.height = self.scroll.wrapper.offsetHeight+"px";
			fromEl.style.height = self.scroll.wrapper.offsetHeight+"px";
			DOM.addClass(toEl,"onSwitch");
			DOM.addClass(toEl,"beforeShow");
			DOM.addClass(fromEl,"onSwitch");
			DOM.addClass(fromEl,"beforeHide");
			
			setTimeout(function(){
				DOM.addClass(toEl,"afterShow");
				DOM.addClass(fromEl,"afterHide");
			},10);
			setTimeout(function(){
				toEl.style.WebkitTransitionDuration = 0;
				//DOM.removeClass(toEl,["onSwitch","beforeShow","afterShow"]);
				wrapper.removeChild(fromEl);
				//toEl.style.height="auto";
				//toEl.setAttribute("style","");
				setTimeout(function(){
					var newEl = toEl.cloneNode(true);
					DOM.removeClass(newEl,["onSwitch","beforeShow","afterShow"]);
					newEl.setAttribute("style","");
					wrapper.appendChild(newEl);
					setTimeout(function(){
						wrapper.removeChild(toEl);
						self.scroll.refresh();
					},100);
					
					
				},10);
				
			},610);
		}
		
	}
})();

