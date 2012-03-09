/**
 * 展示文章中的照片
 */
(function(){
	galleryView = function(config){
		this.picData = config.data;
		this.wrapperId = config.id;
		this.swipe = null;
		this._buildSwipe();
	}
	galleryView.prototype={
		constructor:galleryView,
		_buildSwipe:function(){
			var self = this,
			page, 
			slides = self.picData;
			if (this.picData.length) {
				var gallery = self.swipe = new SwipeView(this.wrapperId, {
					numberOfPages: this.picData.length
				});
				for (i=0; i<3; i++) {
					page = i==0 ? slides.length-1 : i-1;
					el = self._buildItem(page);
					gallery.masterPages[i].appendChild(el);
				}
				gallery.onFlip(function () {
					var el,
						upcoming,
						i;
				
					for (i=0; i<3; i++) {
						upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;
						if (upcoming != gallery.masterPages[i].dataset.pageIndex) {
							el = gallery.masterPages[i].querySelector('img');
							
							self._buildItem(upcoming,el);
						}
					}
				});
				
				gallery.onMoveOut(function () {
					gallery.
					gallery.masterPages[gallery.currentMasterPage].className = 
					gallery.masterPages[gallery.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
				});
				
				gallery.onMoveIn(function () {
					var className = gallery.masterPages[gallery.currentMasterPage].className;
					/(^|\s)swipeview-active(\s|$)/.test(className) || 
					(gallery.masterPages[gallery.currentMasterPage].className = 
						!className ? 'swipeview-active' : className + ' swipeview-active');
				});
			}
		},
		_buildItem:function(i,img){
			var el,page,
			self = this,
			slides = self.picData;
			if(!img){
				var img = document.createElement("img"),
				span = document.createElement("div");
				span.className = "swipeview-box";
				span.appendChild(img);
			}else{
				var span = img.parentNode;
			}
			el = img;
			el.style.webkitTransform="translate3d(0,0,0)";
			//el.style.webkitTransition = "all 0s";
			self._showLoading(span);
			
			el.onload = function () { 
				that = this;
				//el.style.webkitTransition = "all 1s";
				setTimeout(function(){
					self._hideLoading(span);
					var viewWidth = span.clientWidth,viewHeight = span.clientHeight;
					that.style.cssText = "-webkit-transform:translate3d("+((viewWidth-that.clientWidth)/2)+"px,"+((viewHeight-that.clientHeight)/2)+"px,0)";
				},0);
			}
			el.src = slides[i].img;
			return span;
		},
		_showLoading:function(obj){
			var self = this;
			var tag = document.createElement("canvas"),
					ctx = tag.getContext("2d"),
					count = 0,
					edges = 10,
					i;
			obj.appendChild(tag);
			tag.width = 30;
			tag.height = 30;
			obj.style.position="relative";
			tag.style.cssText = "position:absolute; top:50%; left:50%; margin:-15px 0 0 -15px; -webkit-transition:all 1s";
			function drawItem(){
				ctx.save();
				ctx.translate(tag.width/2,tag.height/2);
				ctx.rotate(Math.PI*count/(edges/2));
				count++;
				for(i=0; i<edges; i++){
					var color = (i)/edges;
					ctx.fillStyle = "rgba(0,0,0,"+color+")";
					ctx.rotate(Math.PI/(edges/2));
					ctx.fillRect(-1,-10,2,5);
				} 
				ctx.restore();
			}
			drawItem();
			self.canvasInterval = setInterval(function(){
				tag.width = tag.width;
				drawItem();
			},60);
		},
		_hideLoading:function(obj){
			var self = this,
			canvas = obj.getElementsByTagName("canvas")[0];
			canvas.style.opacity=0;
			setTimeout(function(){
				try{
					clearInterval(self.canvasInterval);
					obj.removeChild(canvas);
				}
				catch(e){
					
				}
				
			},1000)
			
		},
		/**
		 * 销毁实例
		 */
		destroy:function(){
			var self = this;
			self.swipe.destroy();
		}
	}
	
})();
