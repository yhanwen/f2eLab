Control = (function(){
	var doc = document,
	DA = dataAccess,
	requestUrl;
	return {
		indexAction:function(params){
			var id = params[1];
			//设置首页数据请求地址
			switch(id){
				case "1":
					requestUrl = "data/listData.php";
					break;
				case "2":
					requestUrl = "http://www.taobao.com/go/chn/test/asdfkjasklaklsdfjljsdfkl.php";
					break;
				default:
					return false;
					break;
			}
			View.setHeadStatus(id);
			//获取数据并开始渲染
			DA.getIndexData(requestUrl);
		},
		detailAction:function(params){
			requestUrl = "data/detailData.php";//"http://infomobile.taobao.com/"+params.join("/")
			View.setHeadStatus("detail");
			//获取数据并开始渲染
			DA.getDetailData(requestUrl);
		},
		listAction:function(params){
		    var tag = params.pop().split("_");
			requestUrl = "http://it.taobao.com/"+params.join("/")+"/"+tag[0]+"?tpl=minfo";
			View.setHeadStatus("list");
			//获取数据开始渲染
			DA.getListData(requestUrl,tag[1]);
		}
	}
})();
