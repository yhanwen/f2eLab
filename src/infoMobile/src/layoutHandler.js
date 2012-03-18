/**
 * layoutHandler
 * 处理各种界面变化
 */
function layoutHandler(el,config){
	this.scroll;
	this.wrapper = typeof el == 'object' ? el : DOM.get(el);
	this.head = DOM.get("header");
	this.isAndroid = (/android/gi).test(navigator.appVersion);
	this.isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);
	this.config = config;
}
(function(){
	var doc = document,
	win = window;
	layoutHandler.prototype = {
		constructor:layoutHandler,
		init:function(){
			var self = this;
			self._hideHead();
			self._buildIScroll();
			self.__windowEventHandler = function(){
				self._resize();
			}
			window.addEventListener("scroll",self.__windowEventHandler,false);
			window.addEventListener("resize",self.__windowEventHandler,false);
			self.isDestroyed = false;
		},
		_hideHead:function(){
			var self = this;
			var headerHeight = this.head.offsetHeight;
			if(self.isIDevice){
    			
    			
    			setTimeout(function(){
    			    self.wrapper.style.height = "1000px";
    			    win.scrollTo(0,0);
    			    self.wrapper.style.height = DOM.getInnerHeight()-headerHeight+"px";
                    if(self.scroll){
                        self._resize();
                    }
    			},0);
    			
			}
			
		},
		_buildIScroll:function(){
			var self = this;
			if(self.isIDevice){
			    self.wrapper.style.cssText = 'position:absolute; height:1000px';
                self.wrapper.children[0].style.cssText = "position:absolute;";
                DOM.get("html").style.overflow = "hidden";
				self.scroll = new iScroll(self.wrapper, self.config);
			}
			self._resize();
		},
		_resize:function(){
			var self = this;
			if(self.scroll){
				var headerHeight = this.head.offsetHeight,
				contentHeight = this.wrapper.offsetHeight+headerHeight;
				self.wrapper.style.height = DOM.getInnerHeight()-headerHeight+"px";
				self.scroll.refresh();
				if(document.body.scrollTop>0){
					win.scrollTo(0,0);
				}
			}else{
				this.wrapper.style.cssText = 'position:relative; height:auto; min-height:'+(document.body.clientHeight-48)+'px; top:0;';
				this.wrapper.children[0].style.cssText = "position:relative;";
				DOM.get("html").style.overflow = "auto";
			}
		},
		/**
		 * 销毁实例
		 */
		destroy:function(){
			var self = this;
			//移除窗口绑定的事件
			if(self.__windowEventHandler){
				window.removeEventListener("scroll",self.__windowEventHandler);
				window.removeEventListener("resize",self.__windowEventHandler);
			}
			//移除iScroll组件
			if(self.scroll){
				self.scroll.destroy();
				self.scroll = null;
			}
			self.wrapper.style.cssText = 'position:relative; height:auto; min-height:'+(document.body.clientHeight-48)+'px; top:0;';
            self.wrapper.children[0].style.cssText = "position:relative;";
            DOM.get("html").style.overflow = "auto";
			self.isDestroyed = true;
		}
		
	}
})();

