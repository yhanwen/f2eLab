/**
 * 展示文章中的照片
 */
(function(){
	colView = function(config){
		this.picData = config.data;
		this.wrapperEl = config.el;
		this.step = config.step||2;
		this.swipe = null;
		this._buildSwipe();
		this.scroll = config.scroll;
		
	}
	colView.prototype={
		constructor:colView,
		/**
		 * 使用swipeview初始化
		 */
		_buildSwipe:function(){
			var self = this,
			len = Math.ceil(this.picData.length/self.step),
			page, 
			slides = self.picData;
			if (this.picData.length) {
				var gallery = self.swipe = new SwipeView(this.wrapperEl, {
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
		/**
		 * 向masterPage中添加两个item
		 */
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
		/**
		 * 创建单个item
		 */
		_buildItem:function(i,par){
			var el,page,
			self = this,
			slides = self.picData;
			//如果当前index有数据
			if(slides[i]){
				var img = document.createElement("img"),
				span = document.createElement("div");
				span.className = "swipeview-box";
				span.appendChild(img),
				isShow = true;
				
				el = img;
				el.style.webkitTransform="translate3d(0,0,0)";
				self._showLoading(span);
				el.src="";
				el.onload = function () { 
					self._hideLoading(span);
		
				}
				el.onerror = function () { 
					self._hideLoading(span);
	
				}
				el.src = slides[i].pic+"_160x160.jpg";
				
				span.addEventListener("touchmove",function(e){
					isShow = false;
				},false);
				span.addEventListener("touchend",function(e){
					if(isShow){
						e.preventDefault();
						self.onSwitchBig({wrap:null,img:null,url:data.url});
						//self._switchBig(this,slides[i]);
					}else{
						isShow = true;
					}
				},false);
				span.addEventListener("click",function(e){
					if(isShow){
						e.preventDefault();
						self.onSwitchBig({wrap:null,img:null,url:slides[i].publishUrl});
						//self._switchBig(this,slides[i]);
					}else{
						isShow = true;
					}
				},false);
				return span;
			}else {
				return false;
			}
		},
		/**
		 * 显示正在载入动画
		 */
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
			tag.style.cssText = "position:absolute; top:50%; left:50%; margin:-15px 0 0 -15px; -webkit-transition:all 0.5s; background:rgba(0,0,0,0.7); -webkit-border-radius:5px;";
			function drawItem(){
				ctx.save();
				ctx.translate(tag.width/2,tag.height/2);
				ctx.rotate(Math.PI*count/(edges/2));
				count++;
				for(i=0; i<edges; i++){
					var color = (i)/edges;
					ctx.fillStyle = "rgba(255,255,255,"+color+")";
					ctx.rotate(Math.PI/(edges/2));
					ctx.fillRect(-1,-10,2,5);
				} 
				ctx.restore();
			}
			drawItem();
			
		},

        /**
         * 隐藏正在载入动画
         */
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
            
        },
        
        
		/**
		 * 切换到大图
		 */
		_switchBig:function(item,data){
			var self = this,
			
			
			item = item,
			cloneItem = item.cloneNode(true),
			img = cloneItem.querySelector("img"),
			
			hasScroll = !!self.scroll,
			docScroll = document.body.scrollTop,
			itemPos = self._getStartPos(item),
			
			
			//childs = item.parentNode.children,
			outerWrapper = self.scroll?self.scroll.wrapper:document.body,
			//为弹出图片添加一个遮罩层容器
			newWrap = document.createElement("div"),
			//遮罩层容器类名
			newWrapCls = "popBigPicWrap";
			if(document.querySelector("."+newWrapCls)){
				return;
			}
			newWrap.className = newWrapCls;
			if(!hasScroll){
				newWrap.style.top = docScroll+"px"
			}
			//设置浮出图片的初始位置和样式
			cloneItem.style.position = "absolute";
			
			//由于border等影响，会有几像素的偏差，后期需要调整
			cloneItem.style.top = itemPos["top"]+5-docScroll+"px";
			cloneItem.style.left = itemPos["left"]-5+"px";
			
			cloneItem.style.zIndex = "100";
			cloneItem.style.webkitTransition = "all 0.3s ease-in-out";
			
			//隐藏原始图片
			item.style.opacity = 0;
			
			outerWrapper.appendChild(newWrap);
			newWrap.appendChild(cloneItem);
			
			//设置图片的最终状态，动画由transition完成
			setTimeout(function(){
				//img.style.webkitTransform="translate3d(0,0,0)";
				
				cloneItem.style.top = (newWrap.clientHeight-340)/2+"px";
				cloneItem.style.left = itemPos["outerLeft"]+3+"px";
				cloneItem.style.width = "280px";
				cloneItem.style.height = "340px";
				//旋转效果
				//cloneItem.style.webkitTransform = 'rotateY(180deg) scaleX('+(280/cloneItem.clientWidth)+') scaleY('+(360/cloneItem.clientHeight)+')';
				img.style.webkitTransformStyle = "preserve-3d"
				cloneItem.style.webkitTransformStyle = "preserve-3d";
				
				//动画进行到一半时绑定事件并切换到大图
				var newImg = new Image();
				self.onSwitchBig({wrap:newWrap,img:newImg,url:data.url});
				setTimeout(function(){
					
					newImg.onload = function(){
						img.src = this.src;
					}
					newImg.src = img.src.replace(/_[^\.]*\.jpg$/,"_310x310.jpg");
					//做3d变换时将图片翻转
					//img.style.webkitTransform = 'rotateY(180deg)';
					
					//绑定取消动作
					newWrap.addEventListener("touchend",function(){
						this.parentNode.removeChild(this);
						item.style.opacity = 1;
					},false);
					
					newWrap.addEventListener("touchmove",function(e){
						e.preventDefault();
					},false);
					
				},300);
			},0);
			
			
		},
		onSwitchBig:function(){},
		/**
		 * 获取要放大的元素的初始位置（相对滚动容器）
		 */
		_getStartPos:function(item){
			var self = this,
			
			//如果没有使用iscroll则取相对body的位置
			scrollTop = self.scroll?self.scroll.y:document.documentElement.scrollTop,
			outerWrapper = self.scroll?self.scroll.wrapper:document.body,
			wrap = self.swipe.wrapper,
			offsetTop,offsetLeft;
			function getOffsetTop(obj,offset){
				var parNode = obj.offsetParent;
				offset = offset+obj.offsetTop;
				
				if(parNode!=outerWrapper){
					return getOffsetTop(parNode,offset);
				}else{
					return offset-Math.abs(scrollTop);
				}
			}
			function getOffsetLeft(obj,offset){
				var parNode = obj.offsetParent;
				offset = obj.offsetLeft;
				
				if(parNode!=wrap){
					return getOffsetLeft(parNode,offset);
				}else{
					return offset+wrap;
				}
			}
			offsetTop = getOffsetTop(wrap,0);
			offsetLeft = item.offsetLeft+wrap.offsetLeft;
			//返回当前元素的top,left,和外部容器的left
			return {
				top:offsetTop,
				left:offsetLeft,
				outerLeft:wrap.offsetLeft
			};
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
