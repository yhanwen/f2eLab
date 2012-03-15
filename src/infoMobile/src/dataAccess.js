dataAccess = {
	jsonp:function(url,fn,charset) {
	    var doc = document,
	        head = doc.head || doc.getElementsByTagName("head")[0],
	        node = doc.createElement('script'),
	        timestamp = new Date().getTime(),
	        sp = (url.indexOf("?")>0)?"&":"?";
	    node.type = "text/javascript";
	    url = url+sp+"_="+timestamp;
	    node.src = url;
	    node.async = true;
	    if (charset) {
	        node.charset = charset;
	    }
	    node.addEventListener("load",function(){
	    	fn&&fn();
	    });
	    head.insertBefore(node, head.firstChild);
	    return node;
	},
	getIndexData:function(url,fn){
		var self = this;
		self.indexListHandler = function(data){
			View.renderTagList(data);
		};
		self.jsonp(url);
	},
	getDetailData:function(url,fn){
		var self = this;
		self.detailDataHandler = function(data){
			View.renderDetailPage(data);
		};
		self.jsonp(url);
	},
	getMoreDetailContent:function(fn){
		var self = this,
		url = Router.getNewPage();
		self.detailDataHandler = fn;
		self.jsonp(url);
	},
	getListData:function(url,fn){
		var self = this;
		self.listDataHandle = function(data){
			View.renderListPage(data);
		}
		self.jsonp(url);
	}
}
