userData = {
    /**
     * ��ȡֵ
     */
    get:function(key){
        return this.data[key];
        
    },
    /**
     * д��ֵ
     */
    set:function(key,val){
        this.data[key] = val;
        this.sync();
    },
    /**
     * ͬ�������ش洢
     */
    sync:function(){
        localData.setData("userData",this.data);
    },
    /**
     * ��ʼ������ȡ��������
     */
    init:function(){
      this.data = localData.getData("userData")||this.data;  
    },
    data:{
        /**
         * �û�����ʹ�õ���ҳ
         */
        index:"index/1",
        /**
         * ����ҳ�Ƿ�ʹ�ô�ͼģʽ
         */
        isImgMode:true
    }
}
