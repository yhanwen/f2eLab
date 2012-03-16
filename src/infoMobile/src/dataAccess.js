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
		self.detailDataHandle = function(data){
			View.renderDetailPage(data);
		};
		self.jsonp(url);
	},
	getMoreDetailContent:function(fn){
		var self = this,
		url = Router.getNewPage();
		self.detailDataHandle = fn;
		self.jsonp(url);
	},
	getListData:function(url,tag){
		var self = this;
		self.listDataHandle = function(data){
		    data.tagName = tag;
		    if(data.items.length%2)
		      data.items.pop();
			View.renderListPage(data);
		}
		self.jsonp(url);
	}
}
