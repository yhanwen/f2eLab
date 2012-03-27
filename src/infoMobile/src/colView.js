/**
 * չʾ�����е���Ƭ
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
		 * ʹ��swipeview��ʼ��
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
		 * ��masterPage���������item
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
		 * ��������item
		 */
		_buildItem:function(i,par){
			var el,page,
			self = this,
			slides = self.picData;
			//�����ǰindex������
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
		 * ��ʾ�������붯��
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
         * �����������붯��
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
		 * �л�����ͼ
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
			//Ϊ����ͼƬ���һ�����ֲ�����
			newWrap = document.createElement("div"),
			//���ֲ���������
			newWrapCls = "popBigPicWrap";
			if(document.querySelector("."+newWrapCls)){
				return;
			}
			newWrap.className = newWrapCls;
			if(!hasScroll){
				newWrap.style.top = docScroll+"px"
			}
			//���ø���ͼƬ�ĳ�ʼλ�ú���ʽ
			cloneItem.style.position = "absolute";
			
			//����border��Ӱ�죬���м����ص�ƫ�������Ҫ����
			cloneItem.style.top = itemPos["top"]+5-docScroll+"px";
			cloneItem.style.left = itemPos["left"]-5+"px";
			
			cloneItem.style.zIndex = "100";
			cloneItem.style.webkitTransition = "all 0.3s ease-in-out";
			
			//����ԭʼͼƬ
			item.style.opacity = 0;
			
			outerWrapper.appendChild(newWrap);
			newWrap.appendChild(cloneItem);
			
			//����ͼƬ������״̬��������transition���
			setTimeout(function(){
				//img.style.webkitTransform="translate3d(0,0,0)";
				
				cloneItem.style.top = (newWrap.clientHeight-340)/2+"px";
				cloneItem.style.left = itemPos["outerLeft"]+3+"px";
				cloneItem.style.width = "280px";
				cloneItem.style.height = "340px";
				//��תЧ��
				//cloneItem.style.webkitTransform = 'rotateY(180deg) scaleX('+(280/cloneItem.clientWidth)+') scaleY('+(360/cloneItem.clientHeight)+')';
				img.style.webkitTransformStyle = "preserve-3d"
				cloneItem.style.webkitTransformStyle = "preserve-3d";
				
				//�������е�һ��ʱ���¼����л�����ͼ
				var newImg = new Image();
				self.onSwitchBig({wrap:newWrap,img:newImg,url:data.url});
				setTimeout(function(){
					
					newImg.onload = function(){
						img.src = this.src;
					}
					newImg.src = img.src.replace(/_[^\.]*\.jpg$/,"_310x310.jpg");
					//��3d�任ʱ��ͼƬ��ת
					//img.style.webkitTransform = 'rotateY(180deg)';
					
					//��ȡ������
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
		 * ��ȡҪ�Ŵ��Ԫ�صĳ�ʼλ�ã���Թ���������
		 */
		_getStartPos:function(item){
			var self = this,
			
			//���û��ʹ��iscroll��ȡ���body��λ��
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
			//���ص�ǰԪ�ص�top,left,���ⲿ������left
			return {
				top:offsetTop,
				left:offsetLeft,
				outerLeft:wrap.offsetLeft
			};
		},
		/**
		 * ����ʵ��
		 */
		destroy:function(){
			var self = this;
			self.swipe.destroy();
		}
	}
	
})();
