/**
 * 展示文章中的照片
 */
(function(){
	colView = function(config){
		this.picData = config.data;
		this.wrapperId = config.id;
		this.step = config.step||2;
		this.swipe = null;
		this._buildSwipe();
	}
	colView.prototype={
		constructor:colView,
		_buildSwipe:function(){
			var self = this,
			len = Math.ceil(this.picData.length/self.step),
			page, 
			slides = self.picData;
			if (this.picData.length) {
				var gallery = self.swipe = new SwipeView(this.wrapperId, {
					numberOfPages: len,
					loop:false
				});
				for (i=0; i<3; i++) {
					
					page = i==0 ? len-1 : i-1;
					el = self._buildCol(page);
					gallery.masterPages[i].appendChild(el);
				}
				gallery.onFlip(function () {
					var el,
						upcoming,
						i;
				
					for (i=0; i<3; i++) {
						upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;
						if (upcoming != gallery.masterPages[i].dataset.pageIndex) {
							el = gallery.masterPages[i].querySelector('.col');
							gallery.masterPages[i].removeChild(el);
							gallery.masterPages[i].appendChild(self._buildCol(upcoming));
						}
					}
				});
				
				gallery.onMoveOut(function () {
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
		_buildCol:function(i){
			var self = this, 
			el = document.createElement("div"),
			item;
			el.className = "col"
			for(var k = 0; k<self.step; k++){
				item = self._buildItem(i*self.step+k,el);
				if(item)el.appendChild(item);
			}
			return el;
		},
		_buildItem:function(i,par){
			var el,page,
			self = this,
			slides = self.picData;
			if(slides[i]){
				var img = document.createElement("img"),
				span = document.createElement("div");
				span.className = "swipeview-box";
				span.appendChild(img);
				
				el = img;
				el.style.webkitTransform="translate3d(0,0,0)";
				self._showLoading(par);
				
				el.onload = function () { 
					that = this;
	
					self._hideLoading(par);
					var viewWidth = span.clientWidth,viewHeight = span.clientHeight;
					that.style.cssText = "-webkit-transform:translate3d("+((viewWidth-that.clientWidth)/2)+"px,"+((viewHeight-that.clientHeight)/2)+"px,0)";
	
				}
				el.src = slides[i].img;
				return span;
			}else {
				return false;
			}
		},
		_showLoading:function(obj){
			var self = this;
			if(obj.getElementsByTagName("canvas").length!=0){
				return;
			}
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
			if(obj.getElementsByTagName("canvas").length==0){
				return;
			}
			var self = this,
			canvas = obj.getElementsByTagName("canvas")[0];
			canvas.style.opacity=0;
			setTimeout(function(){
				clearInterval(self.canvasInterval);
				try{obj.removeChild(canvas);}catch(e){}
			},1000)
			
		}
	}
	
})();
