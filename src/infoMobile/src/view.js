View = (function(){
	var doc = document,
	DA = dataAccess,
	Log = console.log,
	//loading动画用的全局变量
	loadingCanvas,
	canvasInterval,
	popBigPicWrap,
	listObjArr=[],
	curTagname,
	_wrapper = doc.getElementById("iScrollArea"),
	_fixTitleWrapper = doc.createElement("div");
	
	var layout = new layoutHandler("#wrapper",{
		onScrollMove:function(){
			location.href.indexOf("index")>0&&View.fixListTitle();
		}
	});
	layout._init();
	doc.querySelector("#wrapper").insertBefore(_fixTitleWrapper);
	_fixTitleWrapper.style="position:absolute; top:48px; left:0;width:100%; z-index:1000";
	return {
		/**
		 * 修改头部的标签状态
		 */
		setHeadStatus:function(n,fn){
			var headTabs = doc.querySelectorAll("#headNav a"),
			curTab = doc.querySelector("#headNav .cur");
			//切换标签状态
			if(headTabs[n-1]){
				curTab.setAttribute("class","");
				headTabs[n-1].className = "cur";
			}
			fn&&fn();
		},
		/**
		 * 渲染数据模版
		 */
		renderHTML:function(template,data){
			for(k in data){
				template = template.replace(new RegExp("{{"+k+"}}","g"));
			}
			return template;
		},
		/**
		 * 创建页面框架
		 */
		buildNewPage:function(fn){
			var page = doc.createElement("div"),
            oldPage = _wrapper.querySelector(".switch-block");
            layout._hideHead();
			page.className = "switch-block";
            page.style.cssText = "top:0; left:0; width:100%; position:absolute";
            page.style.zIndex=-1;
            page.style.opacity = 0;
            page.style.webkitTransform = "scale3d(1.2,1.2,1)";
            //清空固定标题位置相关的变量和容器
            listObjArr = [];
            _fixTitleWrapper.innerHTML = "";
            !loadingCanvas&&this.showLoading();
            
			return page;
		},
		/**
		 * 显示新页面
		 */
		showNewPage:function(page){
		    var self = this,
		    oldPage;
		    page.addEventListener("webkitTransitionEnd",function(){
            },false);
            
            self._scrollToTop(page);
		    setTimeout(function(){
		    	oldPage = _wrapper.querySelectorAll(".switch-block");
                if(oldPage[1])oldPage[0].style.zIndex="-1";
                page.style.zIndex=1000;
                if(popBigPicWrap){
                	_wrapper.style.zIndex=100000;
                	if(oldPage[1])_wrapper.removeChild(oldPage[0]);
                }
		    	page.style.webkitTransition = "all 0.4s";
		    	setTimeout(function(){
		    		
		    		page.style.webkitTransform = "scale3d(1,1,1)";
		    		page.style.opacity = 1;
		    		
		    		setTimeout(function(){
		    			page.style.webkitTransition = "all 0s";
		    			if(oldPage[1])!popBigPicWrap&&_wrapper.removeChild(oldPage[0]);
		    			page.style.position = "relative";
		    			self._scrollToTop(page);
		    			//清除弹出大图
		    			if(popBigPicWrap){
			    			popBigPicWrap.parentNode.removeChild(popBigPicWrap);
							popBigPicWrap = null;
						}
						page.style.zIndex=0;
						_wrapper.style.zIndex=0;
						self.hideLoading();
		    		},600);
		    	},40);
		        
		    },1000)
		    
		    
		    
		},
		/**
		 * 把页面滚动到头部
		 */
		_scrollToTop:function(page){
			if(layout.scroll){
				layout.scroll.refresh();
				layout.scroll.scrollToElement(page,5);
			}else{
				window.scrollTo(0,0);
			}
		},
		/*******************************************************************
		 * 渲染标签列表页(首页)
		 */
		renderTagList:function(data,fn){
			var self = this,
			page = self.buildNewPage();
			if(!data.list.length)return;
			
			_wrapper.appendChild(page);
			setTimeout(function(){
				for(i in data.list){
					self._renderScrollList(data.list[i],page);
				}
				self.showNewPage(page);
			},0);
			
			
		},
		/**
		 * 渲染水平列表块
		 */
		_renderScrollList:function(data,page,fn){
			var self = this,
			listWrap = doc.createElement("div"),
			scroll,
			colViewItem,
			title;
			
			
			listWrap.className = "scroll-list";
			listWrap.innerHTML = '<div class="scroll-title"><h3>'+data.tagName+'</h3><a data-tag="" href="#list/'+data.tagId+'/1.php_'+encodeURIComponent(data.tagName)+'" class="more"></a></div>\
			<div class="list-view"><div class="carousel-block"></div></div>';
			title = listWrap.querySelector(".scroll-title");
			scroll = listWrap.querySelector(".carousel-block");
			scroll.listData = data.items;
			page.appendChild(listWrap);
			//初始化colview组件
			colViewItem = new colView({
				el:scroll,
				scroll:layout.scroll,
				data:data.items,
				equalHeight:true
			});
			//展开打图时显示detail页
			colViewItem.onSwitchBig = function(obj){
				var url = obj.url;
				//处理url地址
				url = url.replace(/http:\/\/[^\/]+\//i,"");
				popBigPicWrap = obj.wrap;
				Router.setHash(url);
			};
			self.setListTitle(listWrap);
			return listWrap;
			
		},
		/************************************************
		 * 展开列表页面
		 */
		renderListPage:function(data){
			var self = this,
			page = self.buildNewPage(),
			listWrap = doc.createElement("ul"),
			title;
			listWrap.className = "normal-list";
            
			page.innerHTML = '<div class="scroll-title"><h3>'+decodeURIComponent(data.tagName)+'</h3></div>';
			
			title = page.querySelector(".scroll-title");
			_fixTitleWrapper.appendChild(title.cloneNode(true));
			if(!data.items.length)return;
			_wrapper.appendChild(page);
			page.appendChild(listWrap);
			setTimeout(function(){
				for(i in data.items){
					self._renderListItem(data.items[i],listWrap);
				}
				self.showNewPage(page);
			},0);
		},
		_renderListItem:function(data,wrap){
			var self = this,
			item = doc.createElement("li"),
			template = '<a href="#'+data["publishUrl"].substr(1)+'"><img src="'+data["pic"]+"_160x160.jpg"+'"/></a>';
			item.innerHTML = template;
			wrap.appendChild(item);
		},
		/**
		 * 上下滚动时将标题固定在顶部
		 */
		setListTitle:function(el){
			if(!layout.scroll)return;
			var self = this,
			scroll = layout.scroll,
			scrollTop,
			title = el.querySelector(".scroll-title"),
			pos = scroll._offset(el),
			elWidth = el.clientWidth,
			elHeight = el.clientHeight,
			elTop,
			cloneTitle = title.cloneNode(true);
			pos.left += scroll.wrapperOffsetLeft;
			pos.top += scroll.wrapperOffsetTop;
			elTop = Math.abs(pos.top);
			
			listObjArr.push({
				pos:elTop,
				obj:cloneTitle
			});
		},
		fixListTitle:function(){
			if(!layout.scroll)return;
			var self = this,
			scroll = layout.scroll,
			scrollTop,
			elTop,
			cloneTitle,
			nextElTop;
			
			scrollTop = Math.abs(scroll.y);
			
			for(var k=0; k<listObjArr.length; k++){
				elTop = listObjArr[k].pos;
				cloneTitle = listObjArr[k].obj;
				if(listObjArr[k+1]){
					nextElTop = listObjArr[k+1].pos;
					if(scrollTop>=elTop&&scrollTop<nextElTop){
						if(_fixTitleWrapper.firstChild!=cloneTitle){
							console.log("abc");
							_fixTitleWrapper.innerHTML="";
							
							_fixTitleWrapper.appendChild(cloneTitle);
						}
					}
				}else{
					if(scrollTop>=elTop){
						if(_fixTitleWrapper.firstChild!=cloneTitle){
							_fixTitleWrapper.innerHTML="";
							_fixTitleWrapper.appendChild(cloneTitle);
						}
					}
				}
			}
		},
		/*******************************************************************
		 * 渲染详情页
		 */
		renderDetailPage:function(data){
			var self = this,
			title = data["title"],
			contentHTML = data["body"],
			page = self.buildNewPage(),
			
			//文章标题和操作区
			titleWrap = doc.createElement("div"),
			//图片数据
			imgArr = self._convHTMLtoList(contentHTML),
			galleryViewItem,
			detailWrap = doc.createElement("div"),
			height = _wrapper.parentNode.clientHeight,
			width = _wrapper.parentNode.clientWidth;
			
			//将新页面添加到页面中
			_wrapper.appendChild(page);
			//设置detail页容器样式
			detailWrap.className = "gallery-view-block";
			detailWrap.style.cssText = "width:"+(width)+"px; height:"+height+"px;overflow: visible !important;";
			page.appendChild(detailWrap);
			
			//设置标题和操作区
			titleWrap.className = "title-wrap";
			titleWrap.innerHTML = "<span>"+title+"</span><a href=''>图文模式</a>";
			detailWrap.appendChild(titleWrap);
			//初始化详情页视图
			galleryViewItem = new galleryView({
				wrap:detailWrap,
				data:imgArr
			});	
			//拖动载入更多
			galleryViewItem.loadMore = function(){
				self._loadMoreContent(galleryViewItem,imgArr);
			}
			//禁用滚动
			page.ontouchstart = function(e){
			    e.preventDefault();
			    e.stopPropagation();
			}
			self.showNewPage(page);
			
		},
		/**
		 * 将文章内容转成图片数据
		 */
		_convHTMLtoList:function(HTML,arr){
		    var self = this,
		    //文章容器
            fragment = doc.createElement("div"),
            imgs,
            imgArr = arr||[];
            //设置内容
            fragment.innerHTML = HTML;
            //获取文章中的列表
            imgs = fragment.querySelectorAll("img");
            for(k in imgs){
                imgs[k].src&&imgArr.push({img:imgs[k].src});
                
            }
            return imgArr;
		},
		/**
		 * 加载更多图片(或文字数据)
		 */
		_loadMoreContent:function(view,olddata){
		    
            var self = this, newImgArr = [], oldLength, newContent = "", isImgMode = ( view instanceof galleryView);
            
            DA.getMoreDetailContent(function(data) {
                var pagelen = (function() {
                    var pages = data["article_pagination"], i = 0;
                    for(k in pages)
                    i++
                    return i;
                })(), curPage = parseInt(data["page_current"]);
                if( curPage = pagelen) {
                    self.isLastPage = true;
                } else {
                    self.isLastPage = false;
                }
                if(isImgMode) {
                    self._convHTMLtoList(data["body"], olddata);
                    view.updataDataLength(olddata.length);
                    view.goToMore();
                } else {
                    newContent = olddata + data.conent;
                }

            });


		},
		/**********************************************************************
		 * 显示正在载入动画
		 */
		showLoading:function(){
			var tag = loadingCanvas = document.createElement("canvas");
			var ctx = tag.getContext("2d"),
					count = 0,
					edges = 12,
					i;
			doc.body.appendChild(tag);
			tag.width = 140;
			tag.height = 90;
			tag.style.cssText = "position:absolute; top:50%; left:50%; margin:-30px 0 0 -70px; -webkit-transition:all 1s;-webkit-border-radius:5px;z-index:10000; background:rgba(0,0,0,0.7);";
			function drawItem(){
				ctx.save();
				ctx.translate(30,tag.height/2);
				ctx.rotate(Math.PI*count/(edges/2));
				count++;
				for(i=0; i<edges; i++){
					var color = (i)/edges;
					ctx.fillStyle = "rgba(255,255,255,"+color+")";
					ctx.rotate(Math.PI/(edges/2));
					ctx.fillRect(-1,-10,2,5);
				} 
				
				ctx.restore();
				ctx.save();
				ctx.translate(30,tag.height/2);
				ctx.fillStyle = "rgba(255,255,255,1)";
				ctx.font = "16px Arial";
				ctx.fillText("载入中...",20,5);
				ctx.restore();
				
			}
			drawItem();
			canvasInterval = setInterval(function(){
				ctx.clearRect(0,0,100,60);
				drawItem();
			},120);
		},
		/**
		 * 隐藏载入中动画
		 */
		hideLoading:function(fn){
		    if(loadingCanvas){
    			loadingCanvas.style.opacity = 0;
    			loadingCanvas.addEventListener("webkitTransitionEnd",function(){
    				try{
    				    clearInterval(canvasInterval);
	    				loadingCanvas.parentNode.removeChild(loadingCanvas);
	    				loadingCanvas = null;
	    				fn&&fn();
	    			}catch(e){}
    			});
			}
		}
	}
})();
