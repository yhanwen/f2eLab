userData = {
    /**
     * 获取值
     */
    get:function(key){
        return this.data[key];
        
    },
    /**
     * 写入值
     */
    set:function(key,val){
        this.data[key] = val;
        this.sync();
    },
    /**
     * 同步到本地存储
     */
    sync:function(){
        localData.setData("userData",this.data);
    },
    /**
     * 初始化并获取本地数据
     */
    init:function(){
      this.data = localData.getData("userData")||this.data;  
    },
    data:{
        /**
         * 用户正在使用的主页
         */
        index:"index/1",
        /**
         * 详情页是否使用大图模式
         */
        isImgMode:true
    }
}
