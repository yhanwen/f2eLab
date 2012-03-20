/**
 * 展示文章中的照片
 */
(function(){
	galleryView = function(config){
		this.picData = config.data;
		this.wrap = config.wrap;
		this.swipe = null;
		this.relationList = config.relationList;
		this.isLastPage = config.isLastPage;
		this.relationItem;
		this._buildSwipe();
	}
	galleryView.prototype={
		constructor:galleryView,
		_buildSwipe:function(){
			var self = this,
			page, 
			slides = self.picData,
			endPosition,
			loadBlock;
			if (this.picData.length) {
				var gallery = self.swipe = new SwipeView(this.wrap, {
					numberOfPages: this.picData.length,
					loop:false
				});
				for (i=0; i<3; i++) {
					page = i==0 ? slides.length-1 : i-1;
					if(slides[page]){
        				el = self._buildItem(page);
        				gallery.masterPages[i].appendChild(el);
					}else if(self.isLastPage&&!document.querySelector(".relation-article")){
					    gallery.masterPages[i].innerHTML = self.relationList;
					    self._buildRelationIscroll();
					}
				}
				if(!self.loadBlock){
                    endPosition = (gallery.options.numberOfPages)*gallery.pageWidth;
                    self.loadBlock = loadBlock = document.createElement("div");
                    gallery.slider.appendChild(loadBlock);
                    loadBlock.style.cssText = "width:30px; height:100%; padding:0 0 0 20px; color:#fff; -webkit-transform:translate3d("+endPosition+"px,0,0)";
                    loadBlock.innerHTML = "继续拖动可以载入更多...";  
                }
				gallery.onFlip(function () {
					var el,
						upcoming,
						i;
				
					for (i=0; i<3; i++) {
						try{
							upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;
							if (upcoming != gallery.masterPages[i].dataset.pageIndex||!gallery.masterPages[i].querySelector('.swipeview-box')) {
							    if(slides[upcoming]&&upcoming!=0){
    								gallery.masterPages[i].innerHTML="";
    								el = self._buildItem(upcoming);
    								gallery.masterPages[i].appendChild(el);
								}else if(View.isLastPage&&!document.querySelector(".relation-article")){
								    self.updataDataLength(slides.length+1);
								    gallery.masterPages[i].innerHTML = self.relationList;
								    gallery.masterPages[i].style.visibility = "visible";
								    self._buildRelationIscroll();
								}
							}
						}catch(e){}
					}
					gallery.masterPages[gallery.currentMasterPage].style.visibility = "visible";
				});
				gallery.onMaxMove = function(x){
				    if(!View.isLastPage){
    				    if(x<-50){
    				        loadBlock.innerHTML = "";
    				        self._showLoading(loadBlock,true);
    				        setTimeout(function(){
    				        	self.loadMore(gallery);
    				        },1000);
    				        return -50;
    				    }
				    }
				}
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
		_buildRelationIscroll:function(){
		    var scroll = document.querySelector(".relation-article");
            scroll.addEventListener("touchmove",function(e){
                e.stopPropagation();
            });
            scroll.addEventListener("touchstart",function(e){
                e.stopPropagation();
            });
            new iScroll(scroll);
		},
		_buildItem:function(i){
			var el,page,
			self = this,
			slides = self.picData,
			loadHandler;
			
			var img = document.createElement("img"),
			realImg = new Image(),
			span = document.createElement("div");
			span.className = "swipeview-box";
			span.appendChild(img);
			span.appendChild(realImg);
			el = img;
			
			realImg.style.display="none";
			//el.style.webkitTransition = "all 0s";
			self._showLoading(span,true);
			el.src="";
			el.style.opacity = 0;
			realImg.style.opacity = 0;
			loadHandler = function (e) { 
				var that = e.currentTarget;
				//that.style.cssText = "-webkit-transform:translate3d("+((viewWidth-that.clientWidth)/2)+"px,"+((viewHeight-that.clientHeight)/2)+"px,0)";
				setTimeout(function(){
					
					
					that.style.cssText = "position:absolute;top:50%; left:50%; margin:-"+(that.clientHeight/2)+"px -"+(that.clientWidth/2)+"px auto;"
					that.style.opacity = 1;
					that.className = "xxx";
				},10);
					
			};
			el.onload = loadHandler;
			el.src = slides[i].img+"_60x60.jpg";
			realImg.onload = function(e){
			    var that = e.currentTarget;
			    self._hideLoading(span);
			    realImg.style.display="block";
			    span.removeChild(el);
			    setTimeout(function(){
        			    that.style.cssText = "position:absolute;top:50%; left:50%; margin:-"+(that.clientHeight/2)+"px -"+(that.clientWidth/2)+"px auto;"
                        that.style.opacity = 1;
                        that.className = "xxx";
                },10);
			}
			realImg.src = slides[i].img+"_670x670.jpg";
			return span;
		},
		_showLoading:function(obj,flag){
			var self = this;
			var tag = document.createElement("canvas"),
					ctx = tag.getContext("2d"),
					count = 0,
					edges = 10,
					i;
			obj.appendChild(tag);
			tag.width = 80;
			tag.height = 80;
			obj.style.position="relative";
			tag.style.cssText = "position:absolute; top:50%; left:50%; margin:-40px 0 0 -40px; -webkit-transform:scale3d(0.5,0.5,1); -webkit-transition:all 1s; background:rgba(0,0,0,0.5); -webkit-border-radius:5px;";
			function drawItem(){
				ctx.save();
				ctx.translate(tag.width/2,tag.height/2);
				ctx.rotate(Math.PI*count/(edges/2));
				count++;
				for(i=0; i<edges; i++){
					var color = (i)/edges;
					ctx.fillStyle = "rgba(255,255,255,"+color+")";
					ctx.rotate(Math.PI/(edges/2));
					ctx.fillRect(-2,-20,4,10);
				} 
				ctx.restore();
			}
			drawItem();
			if(flag){
			    clearInterval(self.canvasInterval);
				self.canvasInterval = setInterval(function(){
					tag.width = tag.width;
					drawItem();
				},120);
			}
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
		 * 更新数据长度
		 */
		updataDataLength:function(n){
		    this.swipe.updatePageCount(n);
		},
		/**
		 * 显示下一张
		 */
		goToMore:function(isLastPage){
		    var self = this,
		    endPosition,
		    gallery = self.swipe;
		    if(self.loadBlock&&!isLastPage){
		        endPosition = (gallery.options.numberOfPages)*gallery.pageWidth;
                self.loadBlock.style.cssText = "width:30px; height:100%; padding:0 0 0 20px; color:#fff; -webkit-transform:translate3d("+endPosition+"px,0,0)";
                self.loadBlock.innerHTML = "继续拖动可以载入更多..."; 
		    }
		    if(self.loadBlock&&isLastPage){
		        self.loadBlock.parentNode.removeChild(self.loadBlock);
		        self.loadBlock = null;
		    }
		    self.swipe.goToPage(self.swipe.page+1);
		},
		/**
		 * 拖动到最后的事件
		 */
		loadMore:function(fn){
		    var self = this;
		    
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
