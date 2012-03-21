/**
 * project namespace
 */
var LR = {
    //小人
    person:null,
    //跑道
    road:null,
    //大小
    size:[300,300],
    //地面高度
    ground:200,
    //动画控制
    AM:null
};

function _main(cfg){
    LR.AM = new AnimMgr();
    LR.road = new LRRoad(cfg.canvas,Map[0]);
    LR.person = new LRPerson(cfg.personItem);
    LR.AM.begin();
}

/**
 * 小人类
 */
function LRPerson(item){
    this.item = item;
    this.jumping = false;
    this.scrolling = false;
    this.born();
}
LRPerson.prototype = {
    constructor:LRPerson,
    born:function(){
        var self = this;
        //构造小人
        self._setItemStyle();
        //绑定操作
        document.addEventListener("keydown",function(e){
            
            if(e.keyCode == 32&&!self.scrolling&&!self.jumping){
                e.preventDefault();
                self.jump();
            }
            if(e.keyCode == 40&&!self.scrolling&&!self.jumping){
                
                self.scroll();
            }
        })
    },
    //设置初始样式
    _setItemStyle:function(){
        var self = this,
        item = self.item;
        item.style.cssText = "width:20px; height:40px; top:"+(LR.ground-41)+"px; left:30px; position:absolute; background:#ccc;"
    },
    //跳一下
    jump:function(){
        var self = this,
        item = self.item;
        self.jumping = true;
        item.style.webkitTransition = "all 0.3s cubic-bezier(0,0,0.4,1)";  
        item.style.webkitTransform = "translate3d(0,-80px,0)";
        item.addEventListener("webkitTransitionEnd",function(e){
            item.removeEventListener("webkitTransitionEnd",arguments.callee);
            item.addEventListener("webkitTransitionEnd",function(e){
                item.removeEventListener("webkitTransitionEnd",arguments.callee);
                
                item.style.webkitTransition = "all 0s cubic-bezier(0.4,0,1,1)";
                setTimeout(function(){
                    self.jumping = false;
                },0);
                
            });
            item.style.webkitTransition = "all 0.3s cubic-bezier(0.4,0,1,1)";  
            item.style.webkitTransform = "translate3d(0,0px,0)";
        });
        
    },
    //
    scroll:function(){
        var self = this;
        item = self.item,
        originHeight = item.clientHeight;
        self.scrolling = true;
        self.item.style.height = originHeight/2+"px";
        item.style.webkitTransform = "translate3d(0,"+(originHeight/2)+"px,0)";
        setTimeout(function(){
            self.scrolling = false;
            self.item.style.height = originHeight+"px";
            item.style.webkitTransform = "translate3d(0,0px,0)";
        },800)
    }
}

/**
 * 跑道类
 * @param {Canvas} canvas 画布
 * @param {LRMap} map 选中的地图
 */
function LRRoad(canvas,map){
    this.canvas = canvas;
    this.map = map;
    this.maxX = map.length*20;
    this.x = 0;
    this.realx = 0;
    this.clips = [];
    this.canvas.width = LR.size[0];
    this.canvas.height = LR.size[1];
    this.ctx = this.canvas.getContext("2d");
    this.curClip = 0;
    this.speed = 5;
    this.step = LR.size[0]/20;
    this.curMin = 0;
    this.curMax = map.length;
    
    //this.getClips();
    this.run();
    
}
LRRoad.prototype = {
    constructor:LRRoad,
    drawGround:function(){
        var self = this,
        ctx = self.ctx,
        ground = LR.ground;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0,ground);
        ctx.lineTo(LR.size[0],ground);
        ctx.strokeStyle="#000";
        ctx.stroke();
        ctx.restore();
        
    },
    getClips:function(){
        var self = this,
        clips = self.clips,
        step = parseInt(this.canvas.width/20),
        page = Math.ceil(this.map.length/step),
        count = 0;
        this.maxX = page*this.canvas.width;
        for(var i=0; i<page; i++){
            clips[i] = [];
            for(var k = 0; k<step; k++){
                if(this.map[count])
                    clips[i].push(this.map[count]);
                else
                    clips[i].push(0);
                count++;
            }
        }
    },
    run:function(){
        var self = this;
        LR.AM.addFrame(self.frame,self,true);
        //self.frame();
    },
    frame:function(){
      var self = this;
      
      self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
      this.drawGround();
       
      if(self.realx-this.speed>-self.maxX){
          self.realx = self.realx-this.speed;
      }else{
          self.realx = (self.realx-this.speed)+self.maxX;
          self.curMin = 0;
      }
      //document.querySelector("#log").innerHTML = self.x+" , "+self.realx;
      self.drawRoad();
    },
    drawRoad:function(){
        var self = this;
        self.drawClip(self.map);
        if(self.maxX+self.realx<self.canvas.width){
           self.drawClip(self.map,true);     
        }
        //self.drawClip(self.clips[nextClip],true);
        document.querySelector("#log").innerHTML = self.realx; 
    },
    drawClip:function(clip,append){
        var self = this,
        curX;
        for(var i=append?0:self.curMin; i<clip.length; i++){
            curX = self.realx+i*20;
            if(append){
                curX = self.maxX+self.realx+i*20 
            }
            
            if(curX<0){
                self.curMin = i;
            }
            if(self.curMin==clip.length){
                self.curMin = 0;
            }
            if(curX>=0&&curX<=self.canvas.width)
                self.drawBlock(curX,clip[i]);
            if(curX>self.canvas.width)return;
        }
    },
    drawBlock:function(x,value){
        var self = this,
        ground = LR.ground,
        ctx = self.ctx;
        if(value==0)return;
        ctx.save();
        ctx.fillRect(x,ground-20*value,20,20);
        ctx.restore();
    }
}

/**
 * 动画管理
 */
function AnimMgr(){
    this.step = 20;
    this.frames = [];
}
AnimMgr.prototype = {
    constructor:AnimMgr,
    startInterval:function(){
        var self = this;
        self.interval = setTimeout(function(){
            self.startInterval();
        },self.step);
        self.frame();
    },
    stopInterval:function(){
        
        clearInterval(self.interval);
    },
    addFrame:function(fn,context,run){
        this.frames.push({
            fn:fn,
            context:context,
            run:!!run
        });
        return true;
    },
    frame:function(){
       var self = this,
       frames = self.frames;
       for(k in frames){
           if(frames[k].run){
               frames[k].fn&&frames[k].fn.call(frames[k].context);
           }
       } 
    },
    run:function(fn){
       var self = this,
       frames = self.frames;
       for(k in frames){
           if(frames[k].fn==fn){
               frames[k].run=true;
           }
       } 
    },
    stop:function(fn){
        var self = this,
       frames = self.frames;
       for(k in frames){
           if(frames[k].fn==fn){
               frames[k].run=false;
           }
       } 
    },
    begin:function(){
        this.startInterval();
    }
}
/**
 * 地图包
 */
Map = [
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,0,0,0,3,3,3,1,0,0,0,0,0,0,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,1],
]
