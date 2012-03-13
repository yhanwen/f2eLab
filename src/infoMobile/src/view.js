View = (function(){
	var doc = document,
	DA = dataAccess,
	Log = console.log,
	//loading动画用的全局变量
	loadingCanvas,
	canvasInterval,
	_wrapper = doc.getElementById("iScrollArea");
	var layout = new layoutHandler("#wrapper");
	layout._init();
	return {
		/**
		 * 修改头部的标签状态
		 */
		setHeadStatus:function(n,fn){
			var headTabs = doc.querySelectorAll("#headNav a"),
			curTab = doc.querySelector("#headNav .cur");
			console.log(curTab);
			curTab.setAttribute("class","");
			headTabs[n].className = "cur";
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
			page.className = "switch-block";
			
            page.style.cssText = "position:absolute; top:0; left:0; width:100%;";
            page.style.zIndex=-1;
            page.style.opacity = 0;
            page.style.webkitTransition = "all 1s";
            
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
		       oldPage = _wrapper.querySelectorAll(".switch-block");
               if(oldPage[1])_wrapper.removeChild(oldPage[0]);
               page.style.position = "relative";
               self.hideLoading();
            },false);
		    setTimeout(function(){
		        page.style.zIndex=100;
                page.style.opacity = 1;
		    },0)
		    
		    
		    
		},
		/**
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
			scroll;
			listWrap.className = "scroll-list";
			
			listWrap.innerHTML = '<h3>'+data.tagName+'</h3>\
			<div class="list-view"><div class="carousel-block"></div></div>';
			
			scroll = listWrap.querySelector(".carousel-block");
			scroll.listData = data.items;
			page.appendChild(listWrap);
			//初始化colview组件
			new colView({
				el:scroll,
				scroll:layout.scroll,
				data:data.items,
				equalHeight:true
			});
			return listWrap;
			
		},
		/**
		 * 显示正在载入动画
		 */
		showLoading:function(){
			var tag = loadingCanvas = document.createElement("canvas");
			var ctx = tag.getContext("2d"),
					count = 0,
					edges = 12,
					i;
			doc.body.appendChild(tag);
			tag.width = 100;
			tag.height = 60;
			tag.style.cssText = "position:absolute; top:50%; left:50%; margin:-30px 0 0 -50px; -webkit-transition:all 1s;-webkit-border-radius:5px;z-index:10000; background:rgba(0,0,0,0.7);";
			function drawItem(){
				ctx.save();
				ctx.translate(20,tag.height/2);
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
				ctx.translate(20,tag.height/2);
				ctx.fillStyle = "rgba(255,255,255,"+(Math.abs(Math.sin(count/8)))+")";
				ctx.font = "12px Arial";
				ctx.fillText("载入中...",20,5);
				ctx.restore();
				
			}
			drawItem();
			canvasInterval = setInterval(function(){
				ctx.clearRect(0,0,100,60);
				drawItem();
			},60);
		},
		/**
		 * 隐藏载入中动画
		 */
		hideLoading:function(fn){
		    if(loadingCanvas){
    			loadingCanvas.style.opacity = 0;
    			loadingCanvas.addEventListener("webkitTransitionEnd",function(){
    				loadingCanvas.parentNode.removeChild(loadingCanvas);
    				loadingCanvas = null;
    				fn&&fn();
    			});
			}
		}
	}
})();
