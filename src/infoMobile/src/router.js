Router = (function(){
	var doc = document, 
	loc = location,
	//存储当前参数数组
	curParam,
	//路由配置
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
			//todo:记录用户状态，设置默认的类目
			self.curHash = loc.hash;
			window.onhashchange = function(e){
				self.oldHash = self.curHash;
				self.handleParams();
				self.curHash = loc.hash;
			}
			// alert("");
			// if(!"onhashchange" in window){
			    // alert("");
			    // self.curHash = loc.hash;
			    // setInterval(function(){
			        // if(self.curHash!=loc.hash){
			            // self.oldHash = "#"+self.curHash.split("#")[1];
                        // self.handleParams();
                        // self.curHash = loc.hash;
			        // }
			    // },100);
			// }
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
		getNewDetailPage:function(){
			var hash = loc.hash, 
			params = _getParam(),
			len = params.length;
			params[len-1] = View.curDetailPage+1+".php";
			return "http://it.taobao.com/"+params.join("/")+"?tpl=minfo";
			
		},
		getNewListPage:function(){
            var hash = loc.hash, 
            params = _getParam(),
            len = params.length;
            params[len-1] = View.curListPage+1+".php";
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
