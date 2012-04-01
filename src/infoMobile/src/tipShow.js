TipShow = {
    pages:{
        "index":{
            tip1:{
                img:"http://img04.taobaocdn.com/tps/i4/T1nAq5XhXpXXXXXXXX-554-109.png",
                style:{
                    left:"37px",
                    top:"142px",
                    width:"277px",
                    height:"54.5px"
                }
            },
            tip2:{
                img:"http://img03.taobaocdn.com/tps/i3/T1X7q5XhJpXXXXXXXX-265-265.png",
                style:{
                    right:"-5px",
                    top:"265px",
                    width:"132.5px",
                    height:"132.5px"
                }
            },
            btn:{
                img:"http://img02.taobaocdn.com/tps/i2/T147m5XiXpXXXXXXXX-284-112.png",
                style:{
                    left:"31px",
                    top:"316px",
                    width:"142px",
                    height:"56px"
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
                tip.addEventListener("click",function(){
                    self.hideTip();
                },false);
            }
        }
    },
    "showTip":function(){
        var self = this;
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
