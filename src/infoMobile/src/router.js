Router = (function(){
	var doc = document, 
	loc = location,
	//�洢��ǰ��������
	curParam,
	//·������
	cfg = {
		"index":"indexAction",
		"list":"listAction",
		"detail":"detailAction"
	};
	
	function _getParam(){
		var str = loc.hash.substr(1),
		params = str.split("/");
		return params;
	}
	
	return {
		init:function(){
			var self = this,
			params = _getParam();
			this.oldHash = "#index/1";
			//todo:��¼�û�״̬������Ĭ�ϵ���Ŀ
			window.addEventListener("hashchange",function(e){
				self.oldHash = "#"+e.oldURL.split("#")[1];
				self.handleParams();
			},false);
			if(params.length<=1){
				self.setHash("index/1");
			}else{
				self.handleParams();
			}
		},
		handleParams:function(){
			var self = this,
			params = _getParam();
			if(params.length<=1){
				self.setHash("index/1");
			}
			Control[cfg[params[0]]](params);
		},
		setHash:function(str){
			this.oldHash = loc.hash;
			loc.hash="#"+str;
		},
		reload:function(){
			var self = this;
			self.handleParams();
		},
		getNewPage:function(){
			var hash = loc.hash, 
			params = _getParam(),
			len = params.length;
			params[len-1] = View.curDetailPage+1+".php";
			return "http://it.taobao.com/"+params.join("/")+"?tpl=minfo";
			
		}
	}
})();

function _main(){
	window.addEventListener("load",function(){
		View.init();
		Router.init();
	})
	
}
