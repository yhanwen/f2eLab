Router = (function(){
	var doc = document, 
	loc = location,
	//存储当前参数数组
	curParam,
	//路由配置
	cfg = {
		"index":"indexAction",
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
			
			//todo:记录用户状态，设置默认的类目
			window.addEventListener("hashchange",function(){
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
			Control[cfg[params[0]]](params[1]);
		},
		setHash:function(str){
			loc.hash="#"+str;
		}
	}
})();

function _main(){
	window.addEventListener("load",function(){
		Router.init();
	})
	
}
