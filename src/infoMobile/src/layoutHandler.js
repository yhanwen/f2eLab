/**
 * layoutHandler
 * 处理各种界面变化
 */
function layoutHandler(el){
	this.scroll;
	this.wrapper = typeof el == 'object' ? el : DOM.get(el);
	this.head = DOM.get("header");
	this.isAndroid = (/android/gi).test(navigator.appVersion);
	this.isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);
}
(function(){
	var doc = document,
	win = window;
	layoutHandler.prototype = {
		constructor:layoutHandler,
		_init:function(){
			var self = this;
			setTimeout(function(){
				self._hideHead();
				self._buildIScroll();
				self.__windowEventHandler = function(){
					self._resize();
				}
				window.addEventListener("scroll",self.__windowEventHandler,false);
				window.addEventListener("resize",self.__windowEventHandler,false);
			},0);
			
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
			if(self.isIDevice){
				self.scroll = new iScroll(self.wrapper, {
					onScrollEnd:function(){
			
					}
				});
			}
			self._resize();
		},
		_resize:function(){
			var self = this;
			if(self.scroll){
				var headerHeight = this.head.offsetHeight,
				contentHeight = this.wrapper.offsetHeight+headerHeight;
				//this.wrapper.style.height = DOM.getInnerHeight()-headerHeight+"px";
				self.scroll.refresh();
				if(document.body.scrollTop>0){
					win.scrollTo(0,0);
				}
			}else{
				this.wrapper.style.cssText = 'position:relative; height:auto;top:0;';
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
			}
			
		}
		
	}
})();

