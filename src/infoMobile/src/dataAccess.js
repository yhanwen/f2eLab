dataAccess = {
	jsonp:function(url,fn,charset) {
	    var doc = document,
	        head = doc.head || doc.getElementsByTagName("head")[0],
	        node = doc.createElement('script');
	    node.type = "text/javascript";
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
	}
}
