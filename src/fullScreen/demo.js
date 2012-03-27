//创建基本页面框架
var frames = new FullFrames("#J_wrapper",{
    size:{
        headerHeight:100,
        leftWidth:300,
        rightWidth:0,
        footerHeight:0
    },
    //如果能确定的话
    /*
    views:{
        header:xxx,
        left:xxx,
        right:xxx,
        main:xxx,
        footer:xxx
    }*/
});
//创建main
var mainArea = new baseView({
    style:{
        overflow:"auto"
    },
    fullSize:true
});
//设置main区内容
frames.setView("main",mainArea);

//初始化滚动列表(完真)
new ScrollList(mainArea,config);

//创建left
var leftSide = new baseView({
    style:{
        overflow:"hidden"
    },
    fullSize:true
});


var accordion = new Accordion();
leftSide.append(accordion);
