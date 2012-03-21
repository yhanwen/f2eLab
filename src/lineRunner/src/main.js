/**
 * project namespace
 */
var LR = {
    //小人
    person:null,
    //跑道
    road:null,
    //大小
    size:[320,300],
    //地面高度
    ground:200,
    //动画控制
    AM:null,
    //最大跃高度
    jumpTop:140,
    //障碍大小
    cubeSize:15
};

function _main(cfg){
    LR.AM = new AnimMgr();
    LR.person = new LRPerson(cfg.personItem);
    LR.road = new LRRoad(cfg.canvas,Map[0],LR.person.item);
    
    LR.AM.begin();
}

/**
 * 小人类
 */
function LRPerson(item){
    this.item = item;
    this.jumping = false;
    this.jumpTimer = 0;
    this.scrolling = false;
    this.isLongPress = false;
    this.born();
}
LRPerson.prototype = {
    constructor:LRPerson,
    born:function(){
        var self = this,
        pressTime;
        //构造小人
        self._setItemStyle();
        //绑定操作
        document.addEventListener("keydown",function(e){
            self.isLongPress = true;
            if(e.keyCode == 32&&!self.jumping){
                e.preventDefault();
                self.jump();
            }
            if(e.keyCode == 40&&!self.scrolling){
                self.recover(self.scroll);
            }
        });
        document.addEventListener("keyup",function(e){
            self.isLongPress = false;
        });
        document.addEventListener("touchstart",function(e){
            self.jump();
        });
    },
    //设置初始样式
    _setItemStyle:function(){
        var self = this,
        item = self.item;
        item.style.cssText = "width:20px; height:60px; top:"+(LR.ground-61)+"px; left:30px; position:absolute; background:#ccc;"
    },
    //恢复初始
    recover:function(fn){
        var self = this,
        item = self.item;
        if(self.jumping||self.scrolling){
            item.style.cssText = "-webkit-transition:0s; -webkit-transform:translate3d(0,0px,0);"+"width:20px; height:60px; top:"+(LR.ground-61)+"px; left:30px; position:absolute; background:#ccc;";
            item.addEventListener("webkitTransitionEnd",function(e){
                item.removeEventListener("webkitTransitionEnd",arguments.callee);
                self.jumping=false;
                self.scrolling=false;
                fn&&fn.call(self);
                
            });
        }else{
            fn&&fn.call(self);
        }
    },
    jumpFrame:function(step){
        var self = this,
        item = self.item,
        t = self.jumpTimer/2,
        v = 50-9.8*t,
        dis = 50*t-(9.8*t*t/2);
        if(dis<=0&t!=0){
           
           dis = 0; 
        }
        item.style.webkitTransform= "translate3d(0,-"+(dis)+"px,0)";
        item.setAttribute("data-top",dis);
        if(dis==0&&t!=0){
            self.jumpTimer = 0;
            LR.AM.stop(arguments.callee);
            return;
        }
        
        self.jumpTimer++;
    },
    //跳一下
    jump:function( ){
        var self = this;
        LR.AM.run(self.jumpFrame,self);
        
    },
    //
    scroll:function(){
        var self = this,
        item = self.item,
        originHeight = item.clientHeight;
        self.scrolling = true;
        item.style.webkitTransition="0s";
        self.item.style.height = originHeight/3+"px";
        item.style.marginTop = (originHeight*2/3)+"px";
        setTimeout(function(){
            setTimeout(function(){
                self.scrolling = false;
                self.item.style.height = originHeight+"px";
                item.style.margin = "0";
            },self.isLongPress?400:0)
            
        },200)
    }
}

/**
 * 跑道类
 * @param {Canvas} canvas 画布
 * @param {LRMap} map 选中的地图
 */
function LRRoad(canvas,map,personItem){
    this.canvas = canvas;
    this.map = map;
    this.maxX = Math.max(map.length*LR.cubeSize,this.canvas.width);
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
    this.person = personItem;
    
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
        step = parseInt(this.canvas.width/LR.cubeSize),
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
      self.checkHit();
      self.drawRoad();
      if(!self.isSafe)
        LR.AM.stop(arguments.callee);
    },
    checkHit:function(){
        var self = this;
        self.isSafe = true;
        self.hitArea = [self.person.offsetLeft,self.person.offsetTop-self.person.getAttribute("data-top"),self.person.clientWidth,self.person.clientHeight];
    },
    drawRoad:function(){
        var self = this;
        self.drawClip(self.map);
        if(self.maxX+self.realx<self.canvas.width){
           self.drawClip(self.map,true);     
        }
    },
    drawClip:function(clip,append){
        var self = this,
        curX;
        for(var i=append?0:self.curMin; i<clip.length; i++){
            curX = self.realx+i*LR.cubeSize;
            if(append){
                curX = self.maxX+self.realx+i*LR.cubeSize 
            }
            
            if(curX<=-LR.cubeSize){
                self.curMin = i;
            }
            if(self.curMin==clip.length){
                self.curMin = 0;
            }
            if(curX>=-LR.cubeSize&&curX<=self.canvas.width)
                self.drawBlock(curX,clip[i]);
            if(curX>self.canvas.width)return;
        }
    },
    drawBlock:function(x,value){
        var self = this,
        ground = LR.ground,
        ctx = self.ctx,
        hit = self.hitArea,
        p1 = {x:x,y:ground-LR.cubeSize*value},
        p2 = {x:p1.x+LR.cubeSize,y:ground-LR.cubeSize*value},
        p3 = {x:x, y:ground-LR.cubeSize*value+LR.cubeSize},
        p4 = {x:p1.x+LR.cubeSize,y:ground-LR.cubeSize*value+LR.cubeSize},
        cube = [p1,p2,p3,p4];
        if(value==0)return;
        ctx.save();
        
        ctx.fillRect(p1.x,p1.y,LR.cubeSize,LR.cubeSize);
        ctx.restore();
        for(k in cube){
            if(cube[k].x>hit[0]&&cube[k].x<hit[0]+hit[2]&&cube[k].y>hit[1]&&cube[k].y<hit[1]+hit[3])
            self.isSafe = false;
            if(self.isSafe==false){
                console.log([cube,hit])
            }
            return;
        }
        self.isSafe = self.isSafe&&true;
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
               frames[k].fn&&frames[k].fn.call(frames[k].context,self.step);
           }
       } 
    },
    run:function(fn,context){
       var self = this,
       frames = self.frames,
       hasFn = false;
       for(k in frames){
           if(frames[k].fn==fn){
               frames[k].run=true;
               hasFn = true;
           }
       }
       if(!hasFn){
           self.addFrame(fn,context,true);
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
    [0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,2,0,2,2,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,2]
]
