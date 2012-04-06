TipShow = {
    pages:{
        "index":{
            tip1:{
                img:"http://img04.taobaocdn.com/tps/i4/T1kLe7XjJfXXXXXXXX-530-90.png",
                style:{
                    left:"34px",
                    top:"135px",
                    width:"265px",
                    height:"45px"
                }
            },
            tip2:{
                img:"http://img02.taobaocdn.com/tps/i2/T1zfe7XjdfXXXXXXXX-355-128.png",
                style:{
                    right:"-2px",
                    top:"271px",
                    width:"177.5px",
                    height:"64px"
                }
            },
            btn:{
                img:"http://img01.taobaocdn.com/tps/i1/T1sLe7XjtfXXXXXXXX-203-87.png",
                style:{
                    left:"190px",
                    top:"355px",
                    width:"101.5px",
                    height:"43.5px"
                }
            }
        }
    },
    "mask":document.createElement("div"),
    "showMask":function(){
        var self = this;
        
        self.mask.style.cssText = 'width:100%; height:1000px; position:absolute; z-index:10000000; background:rgba(0,0,0,0.6);display:block;top:0; left:0;';
        document.body.appendChild(self.mask);
    },
    "hideTip":function(){
        var self = this;
        self.mask.innerHTML = "";
        self.mask.style.cssText = 'width:100%; height:100%; position:absolute; z-index:10000000; background:rgba(0,0,0,0.6);display:none;';
    },
    "curPage":null,
    "curTips":[],
    "init":function(){
        var self = this, hash = location.hash;
        for(k in self.pages){
            if(hash.indexOf(k)>0){
                self.curPage = k;
            }
        }
        if(!self.curPage){
            return;
        }
        if(localData.get(self.curPage+"tip")=="shown"){
            return;
        }
        self.mask.addEventListener("touchmove",function(e){
            e.preventDefault();
        })
        self.curTips = [];
        for(k in self.pages[self.curPage]){
            var tip = new Image(),
            data = self.pages[self.curPage][k];
            tip.src = data.img;
            tip.style.position = "absolute";
            for(n in data.style){
               tip.style[n] = data.style[n]; 
            }
            self.curTips.push(tip);
            if(k == "btn"){
                
            }
        }
        self.mask.addEventListener("click",function(e){
            e.preventDefault();
            e.stopPropagation();
            self.hideTip();
        },false);
    },
    "showTip":function(){
        var self = this;
        if(!self.curPage){
            return;
        }
        if(localData.get(self.curPage+"tip")=="shown"){
            return;
        }
        localData.set(self.curPage+"tip","shown");
        for(k in self.curTips){
            self.mask.appendChild(self.curTips[k]);
        }
        self.showMask();
    }
}
