/**
 * picShow
 * 处理图片列表随机切换
 */
(function () {
	var doc = document, win = window;
	picShow = function(sel,config){
		var self = this;
		self.pics = DOM.getAll(sel);
		self.passEls = [];
		self.newEls = [];
		self.timer = null;
		self.config = {
			duration:50,
			animDur:"0.5s",
			sel:sel
		};
		self._setConfig(config);
		self._init();
	}
	picShow.prototype = {
		constructor:picShow,
		_init:function(){
			var self = this;
			self._setNewEls();
		},
		/**
		 * 处理参数
		 * @param {Object} config
		 */
		_setConfig:function(config){
			var self = this;
			if(!config){
				return;
			}
			for(k in config){
				self.config[k] = config[k];
			}
		},
		/**
		 * 将所有元素都移到新元素队列
		 */
		_setNewEls:function(){
			var self = this;
			if(self.newEls.length==0){
				for(i in self.pics){
					self.newEls[i] = self.pics[i];
				}
				return true;
			}
			return;
		},
		/**
		 * 将操作过的元素移出
		 */
		_setPassEls:function(el){
			var self = this;
			if(self.newEls.length>0){
				for(i in self.newEls){
					if(el == self.newEls[i]){
						self.passEls.push(self.newEls.splice(i,1));
						return;
					}
				}
			}
		},
		/**
		 * 从还未操作的元素中随机找一个
		 */
		_randomItem:function(){
			var self = this;
			self._setNewEls();
			var r = Math.random(),
			len = self.newEls.length,
			n =len*r,
			item = self.newEls[parseInt(n)];
			self._setPassEls(item);
			return item;
		},
		/**
		 * 操作选中元素
		 */
		setItem:function(item){
			var self = this,
			wrap = DOM.get(".item",item),
			img = DOM.get("img",item),
			newImg = new Image();
			wrap.style.webkitTransitionDuration=self.config.animDur;
			newImg.src = "http://img.baidu.com/img/iknow/qb/zhidao_app.jpg";
			newImg.onload = function(){
				newImg.className = "back";
				wrap.appendChild(newImg);
				item.className="cur";
				setTimeout(function(){
					wrap.removeChild(img);
					newImg.className="";
					item.className = "";
					wrap.style.webkitTransitionDuration=0;
				},parseFloat(self.config.animDur)*1000)
			}
		},
		/**
		 * 开始动画
		 */
		run:function(){
			var self = this, cfg = self.config;
			self.timer = setTimeout(function(){
				self.setItem(self._randomItem());
				self.run();
			},cfg.duration);
		},
		/**
		 * 结束动画
		 */
		stop:function(){
			clearTimeout(this.timer);
		}
	}
})();
