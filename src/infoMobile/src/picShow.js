/**
 * picShow
 * ����ͼƬ�б�����л�
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
		 * �������
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
		 * ������Ԫ�ض��Ƶ���Ԫ�ض���
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
		 * ����������Ԫ���Ƴ�
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
		 * �ӻ�δ������Ԫ���������һ��
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
		 * ����ѡ��Ԫ��
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
		 * ��ʼ����
		 */
		run:function(){
			var self = this, cfg = self.config;
			self.timer = setTimeout(function(){
				self.setItem(self._randomItem());
				self.run();
			},cfg.duration);
		},
		/**
		 * ��������
		 */
		stop:function(){
			clearTimeout(this.timer);
		}
	}
})();
