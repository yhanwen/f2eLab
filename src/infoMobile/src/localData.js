(function(){
    var doc = document,
    win = window,
    LS = win.localStorage;
    
    function _get(name){
        try{
            return LS.getItem(name);
        }catch(e){
            return null;
        }
    }
    function _getData(name){
        var data = _get(name);
        if(!data)
            return null;
        return JSON.parse(data);
    }
    /**
     * ��ȡû�й��ڵ�����
     */
    function _getDataWithTime(name){
        var t = new Date().getTime(),
        data = _getData(name);
        if(!data)return null;
        if(!data.expire){
            return data;
        }else{
            if(data.expire>t){
                return data;
            }else{
                LS.removeItem(name);
                return null;
            }
        }
    }
    
    
    function _set(name,str){
        try{
            return LS.setItem(name,str);
        }catch(e){
            return null;
        }
        
    }
    function _setData(name,data){
        return _set(name,JSON.stringify(data));
    }
    /**
     * ���ô�����ʱ�������(��λ��Сʱ)
     */
    function _setDataWithTime(name,data,expire){
        data.expire = new Date().getTime() + expire*60*60*1000;
        return _setData(name,data); 
    }
    
    localData = {
        get:_get,
        getData:_getData,
        getDataWithTime:_getDataWithTime,
        set:_set,
        setData:_setData,
        setDataWithTime:_setDataWithTime
    }
})();
