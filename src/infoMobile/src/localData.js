(function(){
    var doc = document,
    win = window,
    LS = win.localStorage;
    
    function _get(name){
        return LS.getItem(name);
    }
    function _getData(name){
        return JSON.parse(_get(name));
    }
    /**
     * 获取没有过期的数据
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
        return LS.setItem(name,str);
    }
    function _setData(name,data){
        return _set(name,JSON.stringify(data));
    }
    /**
     * 设置带过期时间的数据(单位：小时)
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
