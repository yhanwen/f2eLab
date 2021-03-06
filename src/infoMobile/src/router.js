Router = (function(){
	var doc = document, 
	loc = location,
	//存储当前参数数组
	curParam,
	//路由配置
	cfg = {
		"index":"indexAction",
		"list":"listAction",
		"tag":"listAction",
		"detail":"detailAction"
	};
	
	function _getParam(){
		var str = loc.hash.substr(1),
		params = str.split("/");
		_gaq.push(['_trackPageview',str]);
		return params;
	}
	
	return {
		init:function(){
			var self = this,
			params = _getParam();
			this.oldHash = "#"+userData.get("index");
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
				self.setHash(userData.get("index"));
			}else{
				self.handleParams();
			}
		},
		handleParams:function(){
			var self = this,
			params = _getParam();
			if(params.length<=1){
				self.setHash(userData.get("index"));
			}
			Control[cfg[params[0]]](params);
			//初始化提示
			TipShow.init();
		},
		setHash:function(str){
			this.oldHash = loc.hash;
			loc.hash="#"+str;
		},
		reload:function(){
			var self = this;
			self.handleParams();
		},
		getUrl:function(url){
		    return "http://it.taobao.com/"+url+"?tpl=minfo";
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
var addToHomeConfig = {
    autostart: false,
    returningVisitor:true
};
var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-30637075-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
function _main(){

      
	window.addEventListener("load",function(){
	    if(location.hash.match("index")){
	        addToHome.show();
	    }
	    
	    window.applicationCache.addEventListener("updateready", function(e) {

        　　if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        
            　　// Browser downloaded a new app cache.
            
            　　// Swap it in and reload the page to get the new hotness.
            
        　    　window.applicationCache.swapCache();
                window.location.reload();
        
        　　} else {
        
        　　// Manifest didn’t changed. Nothing new to server.
        
        　　}
        
        　　}, false);
	    userData.init();
		View.init();
		Router.init();
		
	})
	
}
