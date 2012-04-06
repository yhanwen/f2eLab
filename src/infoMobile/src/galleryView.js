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
				window.addEventListener("resize",function(){
				    if(gallery&&gallery.refreshSize){
				        setTimeout(function(){
                            for (i=0; i<3; i++) {
                                var img = gallery.masterPages[i].querySelector("img");
                                img.style.marginLeft = -img.clientWidth/2+"px";
                                img.style.marginTop = -img.clientHeight/2+"px";   

                            }
                        },30);
				        
				    }
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
				//预处理后面的图片，如果是小图，则删除该数据
                self._preLoadPics();
				if(!self.loadBlock){
                    endPosition = (gallery.options.numberOfPages)*gallery.pageWidth;
                    self.loadBlock = loadBlock = document.createElement("div");
                    gallery.slider.appendChild(loadBlock);
                    loadBlock.className = "will-loading-more";
                    loadBlock.style.cssText = "-webkit-transform:translate3d("+endPosition+"px,0,0)";
                    loadBlock.innerHTML = "";  
                }
				gallery.onFlip(function () {
					var el,
						upcoming,
						i;
				
					for (i=0; i<3; i++) {
						try{
							upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;
							if (upcoming != gallery.masterPages[i].dataset.pageIndex||!gallery.masterPages[i].querySelector('.swipeview-box')) {
							    if(slides[upcoming]&&!(!self.relationListShow&&upcoming==0)){
    								gallery.masterPages[i].innerHTML="";
    								el = self._buildItem(upcoming);
    								gallery.masterPages[i].appendChild(el);
								}else if(View.isLastPage&&!document.querySelector(".relation-article")){
								    self.relationListShow = true;
								    self.updataDataLength(slides.length+1);
								    gallery.masterPages[i].dataset.upcomingPageIndex = slides.length;
								    gallery.masterPages[i].innerHTML = self.relationList;
								    gallery.masterPages[i].style.visibility = "visible";
								    self._buildRelationIscroll();
								}
							}
						}catch(e){}
					}
					gallery.masterPages[gallery.currentMasterPage].style.visibility = "visible";
					//预处理后面的图片，如果是小图，则删除该数据
					self._preLoadPics();
					
				});
				gallery.onMaxMove = function(x){
				    if(!View.isLastPage){
    				    if(x<-50){
    				        loadBlock.className = "will-loading-more being-loading-more";
    				        //self._showLoading(loadBlock,true);
    				        setTimeout(function(){
    				        	self.loadMore(gallery);
    				        },1000);
    				        return -80;
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
		//预加载并删除小图
		_preLoadPics:function(){
		    var self = this,
		    data = self.picData,
		    gallery = self.swipe,
		    page = gallery.page+2,
		    img = new Image();
		    if(!data[page])return;
		    img.onload = function(){
		        if(img.height<180||img.width<180){
		            data.splice(page,1);
		        }
		        self.updataDataLength(data.length);
		    }
		    img.onerror = function(){
                data.splice(page,1);
                self.updataDataLength(data.length);
            }
            img.src = data[page].img+"_670x670.jpg";
		    
		    
		},
		_buildRelationIscroll:function(){
		    var self = this,
		    scroll = document.querySelector(".relation-article"),
		    btn = document.querySelector(".back-to-first");
		    btn.onclick = function(e){
		        e.preventDefault();
		        self.swipe.goToPage(0);
		    }
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
			el.style.opacity = 0;
			realImg.style.opacity = 0;
			function setImg() { 
				var that = el;
				//that.style.cssText = "-webkit-transform:translate3d("+((viewWidth-that.clientWidth)/2)+"px,"+((viewHeight-that.clientHeight)/2)+"px,0)";
				setTimeout(function(){
					that.style.cssText = "position:absolute;top:50%; left:50%; margin:-"+(that.clientHeight/2)+"px -"+(that.clientWidth/2)+"px auto;"
					that.style.opacity = 1;
					that.className = "xxx";
				},10);
					
			};
			el.onload = setImg;
			el.src = slides[i].img+"_60x60.jpg";
			if(el.width&&el.height){
			    setImg();
			}
			function setReal(){
			    var that = realImg;
                self._hideLoading(span);
                realImg.style.display="block";
                try{span.removeChild(el);}catch(e){}
                setTimeout(function(){
                        that.style.cssText = "position:absolute;top:50%; left:50%; margin:-"+(that.clientHeight/2)+"px -"+(that.clientWidth/2)+"px auto;"
                        that.style.opacity = 1;
                        that.className = "xxx";
                },10);
			}
			realImg.onload = setReal;
			realImg.src = slides[i].img+"_670x670.jpg";
			if(realImg.width&&realImg.height){
			    setReal();
			}
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
		    var gallery = this.swipe,
		    endPosition = n*gallery.pageWidth;
		    this.swipe.updatePageCount(n);
		    try{
		    if(this.loadBlock&&this.loadBlock.style)
		      this.loadBlock.style.cssText = "-webkit-transform:translate3d("+endPosition+"px,0,0)";
		     }catch(e){}
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
                self.loadBlock.className = "will-loading-more";
                self.loadBlock.style.cssText = "-webkit-transform:translate3d("+endPosition+"px,0,0)";
                self.loadBlock.innerHTML = ""; 
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
