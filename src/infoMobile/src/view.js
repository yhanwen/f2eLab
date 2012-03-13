View = (function(){
	var doc = document,
	DA = dataAccess,
	Log = console.log,
	//loading�����õ�ȫ�ֱ���
	loadingCanvas,
	canvasInterval,
	_wrapper = doc.getElementById("iScrollArea");
	var layout = new layoutHandler("#wrapper");
	layout._init();
	return {
		/**
		 * �޸�ͷ���ı�ǩ״̬
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
		 * ��Ⱦ����ģ��
		 */
		renderHTML:function(template,data){
			for(k in data){
				template = template.replace(new RegExp("{{"+k+"}}","g"));
			}
			return template;
		},
		/**
		 * ����ҳ����
		 */
		buildNewPage:function(fn){
			var page = doc.createElement("div");
			page.className = "switch-block";
			// _wrapper.appendChild(page);
			// fn&&fn();
			return page;
		},
		/**
		 * ��Ⱦ��ǩ�б�ҳ(��ҳ)
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
			},0);
			
			
		},
		/**
		 * ��Ⱦˮƽ�б��
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
			//��ʼ��colview���
			new colView({
				el:scroll,
				scroll:layout.scroll,
				data:data.items,
				equalHeight:true
			});
			return listWrap;
			
		},
		/**
		 * ��ʾ�������붯��
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
				ctx.fillText("������...",20,5);
				ctx.restore();
				
			}
			drawItem();
			canvasInterval = setInterval(function(){
				ctx.clearRect(0,0,100,60);
				drawItem();
			},60);
		},
		/**
		 * ���������ж���
		 */
		hideLoading:function(fn){
			loadingCanvas.style.opacity = 0;
			loadingCanvas.addEventListener("webkitTransitionEnd",function(){
				loadingCanvas.parentNode.removeChild(loadingCanvas);
				loadingCanvas = null;
				fn&&fn();
			});
		}
	}
})();
