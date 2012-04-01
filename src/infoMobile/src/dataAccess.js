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
	useLocalData:function(url,fn){
	    var self = this,
	    oldData = localData.getDataWithTime(url);
	    if(oldData){
	        setTimeout(function(){
	            fn(oldData);
	        },10);
	    }else{
	        self.jsonp(url)
	    }
	    return oldData;
	},
	getIndexData:function(url,fn){
		var self = this,oldData;
		self.indexListHandler = function(data){
			View.renderTagList(data);
			if(oldData!=data)
			 localData.setDataWithTime(url,data,1);
		};
		oldData = self.useLocalData(url,self.indexListHandler);
	},
	getIndexScrollData:function(reqList,fn){
	    var self = this,
        cur = 0,
        oldData;
        self.listDataHandle = function(data){
            
            if(data.items.length%2)
              data.items.pop();
            if(oldData!=data)
              localData.setDataWithTime(reqList[cur].url,data,1);
            reqList[cur].fn(data);
            cur++;
            if(reqList[cur])
                oldData = self.useLocalData(reqList[cur].url,self.listDataHandle);
            else
                fn&&fn();
        }
        oldData = self.useLocalData(reqList[cur].url,self.listDataHandle);
	},
	getDetailData:function(url,fn){
		var self = this,
		oldData;
		self.detailDataHandle = function(data){
			setTimeout(function(){View.renderDetailPage(data);},150);
			if(oldData!=data)
			 localData.setDataWithTime(url,data,1);
		};
		oldData = self.useLocalData(url,self.detailDataHandle);
	},
	getMoreDetailContent:function(fn){
		var self = this,
		url = Router.getNewDetailPage(),
		oldData;
		self.detailDataHandle = function(data){
		    fn(data);
		    if(oldData!=data)
		      localData.setDataWithTime(url,data,1);
		};
		oldData = self.useLocalData(url,self.detailDataHandle);
	},
	getListData:function(url,tag){
		var self = this,
		oldData;
		self.listDataHandle = function(data){
		    data.tagName = tag;
		    if(data.items.length%2)
		      data.items.pop();
		    if(oldData!=data)
                localData.setDataWithTime(url,data,1);
			View.renderListPage(data);
		}
		self.curListURL = url;

		oldData = self.useLocalData(url,self.listDataHandle);
	},
	getMoreListContent:function(fn){
	    var self = this,
        url = Router.getNewListPage(),
        oldData = localData.getDataWithTime(self.curListURL);
        self.listDataHandle = function(data){
            if(data.items.length%2)
              data.items.pop();
            fn(data);
            //将新数据拼到旧数据的本地数据中
            if(!oldData)return;
            for(var i=0; i<data.items.length; i++){
                oldData.items.push(data.items[i]);
            }
            oldData["currentpage"] = data["currentpage"];
            localData.setDataWithTime(self.curListURL,oldData,1);
        };
        self.jsonp(url);
	}
}
