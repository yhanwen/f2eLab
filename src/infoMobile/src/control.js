Control = (function(){
	var doc = document,
	DA = dataAccess,
	requestUrl;
	return {
		indexAction:function(params){
			var id = params[1];
			//������ҳ���������ַ
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
			//��ȡ���ݲ���ʼ��Ⱦ
			DA.getIndexData(requestUrl);
		},
		detailAction:function(params){
			requestUrl = "data/detailData.php";//"http://infomobile.taobao.com/"+params.join("/")
			View.setHeadStatus("detail");
			//��ȡ���ݲ���ʼ��Ⱦ
			DA.getDetailData(requestUrl);
		},
		listAction:function(params){
		    var tag = params.pop().split("_");
			requestUrl = "http://it.taobao.com/"+params.join("/")+"/"+tag[0]+"?tpl=minfo";
			View.setHeadStatus("list");
			//��ȡ���ݿ�ʼ��Ⱦ
			DA.getListData(requestUrl,tag[1]);
		}
	}
})();
