Control = (function(){
	var doc = document,
	DA = dataAccess,
	requestUrl;
	return {
		indexAction:function(id){
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
			//��ȡ���ݲ���ʼ��Ⱦ
			DA.getIndexData(requestUrl);
		}
	}
})();
