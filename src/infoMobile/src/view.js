(function() {
    var doc = document,
    DA = dataAccess,
    Log = console.log,
    //loading动画canvas节点用的全局变量
    loadingCanvas, canvasInterval, 
    //布局
    layout, 
    //弹出大图对象（暂时不用）
    popBigPicWrap, 
    //首页列表标题数组
    listObjArr = [],
    //当前列表页面的标题
    curTagname,
    //页面容器
    _wrapper = doc.getElementById("iScrollArea"),
    //用于放置固定的标题使用的容器
    _fixTitleWrapper = doc.createElement("div"),
    //当前正在显示的标题
    _curTitle = 0,
    //上次浏览list页时的位置
    lastListPos = 0,
    //index请求队列
    indexReqList,
    //初次载入
    firstLoad = true,
    pageLoaded = false,
    winHeight;
    
    /**
     * 视图层对象
     */
    View = {
        /**
         * detail页是否是大图模式
         */
        isImgMode:true,
        /**
         * 初始化
         */
        init: function() {
            var self = this;
            layout = new layoutHandler("#wrapper", {
                onScrollMove: function() {
                    self.onScrollMove(-layout.scroll.y);
                }
            });
            var body = doc.body;
            window.addEventListener("scroll",function(){
                if(!layout.scroll){
                     self.onScrollMove(body.scrollTop-48);
                }
            });
            
            layout.init();
            doc.querySelector("#wrapper").insertBefore(_fixTitleWrapper);
            _fixTitleWrapper.style.cssText = "position:absolute; top:0px; left:0;width:100%; z-index:99";

        },
        /**
         * iscoll滚动时触发的事件，各页面通过重写该方法来使用
         */
        onScrollMove: function() {},
        /**
         * 修改头部的状态
         */
        setHeadStatus: function(n, fn) {
            var self = this,
            headTabs = doc.querySelectorAll("#headNav a"),
            curTab = doc.querySelector("#headNav .cur"),
            logo = doc.querySelector("#siteHead .logo"),
            btn = doc.querySelector("#siteHead .backbtn"),
            link = doc.querySelector("#siteHead .backbtn a");
            if(layout.isDestroyed){
                layout.init();
            }
            if(userData.get("index") == "index/2"){
                curTab.setAttribute("class", "");
                headTabs[1].className = "cur";
            }
            if (headTabs[n - 1]) {
                //切换标签状态
                link.href = location.hash;
                btn.className = "backbtn head-hidden";
                if (logo.className.indexOf("head-hidden") > 0) logo.className = "logo";
                curTab.setAttribute("class", "");
                headTabs[n - 1].className = "cur";
            } else {
                //设置并显示返回按钮
                if (n == "detail") {
                    if(Router.oldHash.indexOf("detail")==-1){
                        link.href = Router.oldHash;
                    }
                    //如果不是返回列表页则清空
                    if(Router.oldHash.indexOf("list")==-1&&Router.oldHash.indexOf("tag")==-1){
                        lastListPos = 0;
                    }
                }
                if (n == "list") {
                    link.href = "#"+userData.get("index");
                }
                btn.className = "backbtn";
                logo.className = "logo head-hidden";
            }
            if(layout.scroll)layout._hideHead();
            winHeight = window.innerHeight;
            pageLoaded  = false;
            //显示载入中动画
            this.showLoading(firstLoad);
            firstLoad  = false;
            //初始化全局变量（详情的标题容器，滚动事件）
            this._removeDetailTitle();
            //清空固定标题
            _fixTitleWrapper.innerHTML = "";
            _fixTitleWrapper.style.webkitTransform="translate3d(0,0,0)";
            this.onScrollMove = function() {};
            /**
             * 初始化用户参数（以后使用本地存储来保存手机用户数据）
             */
            View.isImgMode = self._getDetailMode();
            //执行回调
            fn && fn();
        },
        /**
         * 渲染数据模版
         */
        renderHTML: function(template, data) {
            for (k in data) {
                template = template.replace(new RegExp("{{" + k + "}}", "g"));
            }
            return template;
        },
        /**
         * 创建页面框架
         */
        buildNewPage: function(fn) {
            var page = doc.createElement("div"),
            oldPage = _wrapper.querySelector(".switch-block");
            //layout._hideHead();
            page.className = "switch-block";
            page.style.cssText = "top:0; left:0; width:100%; position:absolute";
            page.style.zIndex = -1;
            page.style.opacity = 0;
            layout.scroll&&(page.style.webkitTransform = "scale3d(1.2,1.2,1) translate3d(0,"+(-layout.scroll.y)+"px,0)");
            //清空固定标题位置相关的变量和容器
            listObjArr = [];

            return page;
        },
        /**
         * 显示新页面
         */
        showNewPage: function(page, fn) {
            var self = this,
            oldPage;
            page.addEventListener("webkitTransitionEnd",
            function() {},
            false);

            setTimeout(function() {
                oldPage = _wrapper.querySelectorAll(".switch-block");
                if (oldPage[1]) oldPage[0].style.zIndex = "-1";
                page.style.zIndex = 1000;
                if (popBigPicWrap) {
                    _wrapper.style.zIndex = 100000;
                    if (oldPage[1]) _wrapper.removeChild(oldPage[0]);
                }
                //返回页面顶部
                //if (!oldPage[1])self._scrollToTop(page);
                

                page.style.webkitTransition = "all 0.4s";
                setTimeout(function() {

                    page.style.webkitTransform = "scale3d(1,1,1)";
                    page.style.opacity = 1;
                    self._scrollToTop(page);
                    setTimeout(function() {
                        page.style.webkitTransition = "all 0s";
                        if (oldPage[1]) ! popBigPicWrap && _wrapper.removeChild(oldPage[0]);
                        page.style.position = "relative";
                        self._scrollToTop(page);
                        //清除弹出大图
                        if (popBigPicWrap) {
                            popBigPicWrap.parentNode.removeChild(popBigPicWrap);
                            popBigPicWrap = null;
                        }
                        page.style.zIndex = 0;
                        _wrapper.style.zIndex = 0;
                        self.hideLoading();
                        layout._resize();
                        fn && fn();
                    },
                    600);
                },
                40);

            },
            300)

        },
        /**
         * 把页面滚动到头部
         */
        _scrollToTop: function(page) {
            if (layout.scroll) {
                layout.scroll.refresh();
                layout.scroll.scrollTo(0,0, 0);
            } else {
                window.scrollTo(0, 0);
            }
        },
        /*******************************************************************
         * 渲染标签列表页(首页)
         */
        renderTagList: function(data, fn) {
            var self = this,
            page = self.buildNewPage();
            if (!data.list.length) return;

            _wrapper.appendChild(page);
            setTimeout(function() {
                indexReqList=[];
                for (i in data.list) {
                    self._renderScrollList(data.list[i], page,i);
                }
                DA.getIndexScrollData(indexReqList);
                self.showNewPage(page);
            },
            0);
            _curTitle = 0;
            self.onScrollMove = function() {
                location.href.indexOf("index") > 0 && View.fixListTitle();
            }
        },
        /**
         * 渲染水平列表块
         */
        _renderScrollList: function(data, page, i) {
            var self = this,
            listWrap = doc.createElement("div"),
            scroll,
            colViewItem,
            title,
            showScroll;

            listWrap.className = "scroll-list";
            listWrap.innerHTML = '<div class="scroll-title"><h3>' + data.tagName + '</h3><a data-tag="" href="#' + data.listUrl + '_' + encodeURIComponent(data.tagName) + '" class="more"></a></div>\
            <div class="list-view"><div class="carousel-block"></div></div>';
            title = listWrap.querySelector(".scroll-title");
            scroll = listWrap.querySelector(".carousel-block");
            scroll.listData = data.items;
            page.appendChild(listWrap);
            showScroll = function(d){
                //初始化colview组件
                colViewItem = new colView({
                    el: scroll,
                    scroll: layout.scroll,
                    data: d.items,
                    equalHeight: true
                });
                //展开打图时显示detail页
                colViewItem.onSwitchBig = function(obj) {
                    var url = obj.url;
                    //处理url地址
                    url = url.substr(1);
                    popBigPicWrap = obj.wrap;
                    Router.setHash(url);
                };
            };
            indexReqList.push({url:Router.getUrl(data.listUrl),fn:showScroll});
            
            self.setListTitle(listWrap);
            return listWrap;

        },
        /************************************************
         * 展开列表页面
         */
        renderListPage: function(data) {
            var self = this,
            page = self.buildNewPage(),
            listWrap = doc.createElement("ul");
            listWrap.className = "normal-list";
            self.curListPage = parseInt(data["currentpage"]);
            page.innerHTML = '<div class="scroll-title"><h3>' + decodeURIComponent(data.tagName) + '</h3></div>';

            
            if (!data.items.length) return;
            _wrapper.appendChild(page);
            page.appendChild(listWrap);
            setTimeout(function() {
                for (var i=0; i< Math.min(data.items.length,Math.max(10,(parseInt((lastListPos/200)+2))*2)); i++) {
                    self.curListItemNum = i;
                    self._renderListItem(data.items[i], listWrap);
                }
                self.showNewPage(page,
                function() {

                    self._loadMoreListItem(page,listWrap,data.items);
                    layout.destroy();
                    window.scrollTo(0,lastListPos);
                });
            },
            0);
        },
        _renderListItem: function(data, wrap) {
            var self = this,
            isScroll = false,
            item = doc.createElement("li"),
            template = '<a href="#' + data["publishUrl"].substr(1) + '"><img src="' + data["pic"] + "_160x160.jpg" + '"/></a>';
            item.innerHTML = template;
            
            //发生点击时记录位置
            item.addEventListener("touchstart",function(){
                isScroll = false;
            }); 
            item.addEventListener("touchend",function(){
                isScroll = true;
            }); 
            item.addEventListener("touchend",function(){
                if(isScroll)return;
                lastListPos = doc.body.scrollTop;
                wrap.parentNode.style.opacity=0;
            }); 
            item.addEventListener("click",function(){
                lastListPos = doc.body.scrollTop;
                wrap.parentNode.style.opacity=0;
            });         
            wrap.appendChild(item);
        },
        /**
         * 加载更多列表内容
         */
        _loadMoreListItem:function(page,listWrap,items){
            var self = this;
            var scroller = _wrapper,
            scrollTop,
            loadBox = doc.createElement("div");
            loadBox.className = "text-loading-box";
            loadBox.innerHTML = "正在载入更多...";
            page.appendChild(loadBox);
            self.onScrollMove = function(y){
                if (layout.scroll) return;
                if(!self.isLastPage){
                    scrollTop = y;
                    if(scroller.clientHeight-scrollTop<(window.innerHeight+20)&&! self.loadingMoreList){
                        if(self.curListItemNum<items.length-1){
                            var cur = self.curListItemNum,i;
                            for(i = cur+1 ; i<Math.min(items.length,cur+11); i++){
                                self.curListItemNum = i;
                                self._renderListItem(items[i], listWrap);
                            }
                            return;
                        }
                        self.loadingMoreList = true;
                        DA.getMoreListContent(function(data){
                            self.curListPage = parseInt(data["currentpage"]);
                            self.loadingMoreList = false;
                            // if(loadBox&&loadBox.parentNode){
                                // loadBox.parentNode.removeChild(loadBox);
                                // loadBox = null;
                            // }
                            for (i in data.items) {
                                self._renderListItem(data.items[i], listWrap);
                            }
                            
                        });
                    }
                }
            }
            
            
            
        },
        /**
         * 上下滚动时将标题固定在顶部
         */
        setListTitle: function(el) {
            if (!layout.scroll) return;
            var self = this,
            scroll = layout.scroll,
            scrollTop, title = el.querySelector(".scroll-title"),
            pos = scroll._offset(el),
            elWidth = el.clientWidth,
            elHeight = el.clientHeight,
            elTop,
            cloneTitle = title.cloneNode(true);
            pos.left += scroll.wrapperOffsetLeft;
            pos.top += scroll.wrapperOffsetTop;
            elTop = Math.abs(pos.top);

            listObjArr.push({
                pos: elTop,
                obj: cloneTitle
            });
        },
        fixListTitle: function() {
            if (!layout.scroll) return;
            var self = this,
            scroll = layout.scroll,
            scrollTop, elTop, cloneTitle, nextElTop,prevElTop;

            scrollTop = -scroll.y;
            elTop = listObjArr[_curTitle].pos;
            cloneTitle = listObjArr[_curTitle].obj;
            if (listObjArr[_curTitle - 1]) {
                prevElTop = listObjArr[_curTitle -1].pos
                if(scrollTop < prevElTop){
                    _curTitle--;
                    _fixTitleWrapper.innerHTML = "";
                    if(_curTitle!=0)_fixTitleWrapper.appendChild(listObjArr[_curTitle-1].obj);
                    
                }
            }
            if (listObjArr[_curTitle + 1]) {
                nextElTop = listObjArr[_curTitle + 1].pos;
                
                if (scrollTop >= elTop && scrollTop < nextElTop) {
                    if (_fixTitleWrapper.firstChild != cloneTitle) {
                        _fixTitleWrapper.innerHTML = "";
                        _fixTitleWrapper.appendChild(cloneTitle);
                        _curTitle++;
                    }
                }
                if(scrollTop < elTop&&Math.abs(scrollTop-elTop)<_fixTitleWrapper.clientHeight){
                    _fixTitleWrapper.style.webkitTransform="translate3d(0,-"+(_fixTitleWrapper.clientHeight-Math.abs(scrollTop-elTop))+"px,0)";
                }else{
                    _fixTitleWrapper.style.webkitTransform="translate3d(0,0,0)";
                }
            }
            if(scrollTop<0){
               _fixTitleWrapper.innerHTML = "";
               _curTitle = 0;
            }

        },
        /*******************************************************************
         * 渲染详情页
         */
        renderDetailPage: function(data) {
            if(!data)return;

            var self = this,
            title = data["title"],
            contentHTML = data["body"],
            page = self.buildNewPage(),

            //文章标题和操作区
            titleWrap = doc.createElement("div"),
            titleBtn,
            
            //图片数据
            imgArr = self._convHTMLtoList(contentHTML),
            galleryViewItem,
            detailWrap = doc.createElement("div"),
            height = window.innerHeight-48,
            width = _wrapper.parentNode.clientWidth;
            self.curDetailPage = parseInt(data["page_current"]),
            contentWrap = doc.createElement("div");
            //获取总页数
            var pagelen = (function() {
                var pages = data["article_pagination"],
                i = 0;
                for (k in pages)
                i++
                return i;
            })();
            //获取当前页
            self.curDetailPage = parseInt(data["page_current"]);
            //判断是不是最后一页
            if (self.curDetailPage == pagelen) {
                self.isLastPage = true;
            } else {
                self.isLastPage = false;
            }
            //将新页面添加到页面中
            _wrapper.appendChild(page);
            //设置标题和操作区
            titleWrap.className = "title-wrap";
            titleWrap.innerHTML = "<span>" + title + "</span><a href=''><em>图文模式</em><b></b></a>";
            titleBtn = titleWrap.querySelector("em");
            titleBtn.addEventListener("click",
            function(e) {
                e.preventDefault();
                self.isImgMode = !self.isImgMode;
                self._setDetailMode();
                Router.reload();
            });

            if (self.isImgMode) {
                //大图模式初始化
                //设置detail页容器样式
                detailWrap.className = "gallery-view-block";
                detailWrap.style.cssText = "width:" + (width) + "px; height:" + height + "px;overflow: visible !important;";
                page.appendChild(detailWrap);

                titleBtn.innerHTML = "图文模式";

                //初始化详情页视图
                galleryViewItem = new galleryView({
                    wrap: detailWrap,
                    data: imgArr,
                    relationList:'<div class="relation-article"><ul><li>相关文章：<a href="#" class="back-to-first">返回第一张大图</a></li>'+data["correlationArticle"].replace(/href='\//ig,"href='#").replace(/_blank/g,"")+'</ul></div>',
                    isLastPage:self.isLastPage
                });
                //拖动载入更多
                galleryViewItem.loadMore = function() {
                    self._loadMoreContent(galleryViewItem, imgArr);
                }
                //禁用滚动
                page.ontouchstart = function(e) {
                    
                }
                page.ontouchmove = function(e) {
                    
                }
            } else {
                //图文模式初始化
                titleBtn.innerHTML = "大图模式";
                page.appendChild(contentWrap);
                contentWrap.className = "text-detail";
                contentWrap.innerHTML = '<h2>' + data["title"] + '</h2>'
                contentWrap.innerHTML += data["body"].replace(/\.(jpg|png)/g,function($0){
                    return $0+"_160x160.jpg";
                });
                
            }
            //插入页面
            self.showNewPage(page,
            function() {
                //显示标题容器
                self._removeDetailTitle();
                doc.querySelector("#wrapper").appendChild(titleWrap);
                setTimeout(function(){titleWrap.style.webkitTransform = "translate3d(0,0,0)";},0);
                if(!self.isImgMode)self._loadMoreTextDetailPage(contentWrap);

            });
            self.isLastPage = false;
        },
        _getDetailMode:function(){
            return userData.get("isImgMode");
        },
        _setDetailMode:function(){
            userData.set("isImgMode",this.isImgMode);
        },
        _removeDetailTitle: function() {
            if (doc.querySelector("#wrapper .title-wrap")) doc.querySelector("#wrapper").removeChild(doc.querySelector("#wrapper .title-wrap"));
        },
        /**
         * 渲染更多文本模式
         */
        _loadMoreTextDetailPage: function(contentWrap) {
            var self = this;
            self.onScrollMove = function(y){
                if(!self.isLastPage){
                    var scroller = _wrapper,
                    scrollTop = y,
                    count = 0,
                    text = "正在载入更多",
                    interval,
                    loadBox = doc.createElement("div");
                    loadBox.className = "text-loading-box";
                    loadBox.innerHTML = text;
                    interval = setInterval(function(){
                        if(loadBox){
                            loadBox.innerHTML = text;
                            for(var i=0; i<count%4; i++){
                                loadBox.innerHTML+=".";
                            }
                            count++;
                        }else{
                            clearInterval(interval);
                        }
                    },400);
                    if(scroller.clientHeight-scrollTop<(window.innerHeight+20)&&! self.loadingMore){
                        contentWrap.appendChild(loadBox);
                        self._loadMoreContent(null,null,contentWrap,function(){
                            if(loadBox&&loadBox.parentNode){
                                loadBox.parentNode.removeChild(loadBox);
                                loadBox = null;
                            }
                            setTimeout(function(){scroll.refresh();},2000);
                            
                        });
                    }
                }
            }
        },
        /**
         * 将文章内容转成图片数据
         */
        _convHTMLtoList: function(HTML, arr) {
            var self = this,
            //文章容器
            fragment = doc.createElement("div"),
            imgs,
            imgArr = arr || [];
            //设置内容
            fragment.innerHTML = HTML;
            //获取文章中的列表
            imgs = fragment.querySelectorAll("img");
            for (k in imgs) {
                imgs[k].src && imgArr.push({
                    img: imgs[k].src
                });

            }
            return imgArr;
        },
        /**
         * 加载更多图片(或文字数据)
         */
        _loadMoreContent: function(view, olddata, contentWrap,fn) {

            var self = this, html="";

            ! self.loadingMore && DA.getMoreDetailContent(function(data) {
                if (data) {
                    //获取总页数
                    var pagelen = (function() {
                        var pages = data["article_pagination"],
                        i = 0;
                        for (k in pages)
                        i++
                        return i;
                    })();
                    //获取当前页
                    self.curDetailPage = parseInt(data["page_current"]);
                    //判断是不是最后一页
                    if (self.curDetailPage == pagelen) {
                        self.isLastPage = true;
                    } else {
                        self.isLastPage = false;
                    }
                    //关闭正在加载状态
                    self.loadingMore = false;
                    //如果是在图片模式
                    if (self.isImgMode) {
                        //显示数据
                        self._convHTMLtoList(data["body"], olddata);
                        view.updataDataLength(olddata.length);
                        setTimeout(function() {
                            if(self.isLastPage){
                                html = '<ul class="relation-article">'+data["correlationArticle"].replace(/href='\//ig,"href='#").replace("_blank","")+'</ul>';
                            }
                            view.goToMore(self.isLastPage,html);
                        },
                        200);
                    }else{
                        var newTextWrap = doc.createElement("div"),
                        imgs;
                        newTextWrap.innerHTML = data["body"].replace(/\.(jpg|png)/g,function($0){
                            return $0+"_160x160.jpg";
                        });
                        imgs = newTextWrap.querySelectorAll("img");
                        for(var k=0; k<imgs.length; k++){
                            imgs[k].addEventListener("load",function(){
                                layout.scroll&&layout.scroll.refresh();
                            });
                        }
                        //更新文本模式html
                        contentWrap.appendChild(newTextWrap);
                    }
                    fn&&fn();
                }
            });
            self.loadingMore = true;

        },
        
        /**********************************************************************
         * 显示正在载入动画
         */
        showLoading: function(flag) {
            if (!canvasInterval) {
                var tag = loadingCanvas = document.createElement("canvas");
                var back = doc.createElement("a");
                var ctx = tag.getContext("2d"),
                count = 0,
                edges = 12,
                i,
                mask = doc.createElement("div");
                if(!flag){
                    back.href = "javascript:history.go(-1)";
                    back.className = "J_cancleLoading";
                    back.innerHTML = "取消";
                    back.style.cssText = "position:fixed; width:80px; height:40px; line-height:40px; -webkit-border-radius:5px;background:rgba(0,0,0,0.6); color:#fff; font-size:14px; text-align:center;left:"+(window.innerWidth/2-40)+"px;top:"+(window.innerHeight/2+140)+"px;z-index:10000;";
                    setTimeout(function(){if(!pageLoaded)doc.body.appendChild(back);},4000);
                }
                mask.className="J_loadingMask";
                doc.body.appendChild(tag);
                doc.body.appendChild(mask);
                
                tag.width = 280;
                tag.height = 180;
                tag.style.cssText = "position:fixed; top:"+(window.innerHeight/2-60)+"px; left:"+(window.innerWidth/2-140)+"px;-webkit-transform:scale3d(0.5,0.5,1); -webkit-transition:all 0.4s;-webkit-border-radius:15px;z-index:10000; background:rgba(0,0,0,0.7);";
                mask.style.cssText = "position:fixed; top:0; left:0; width:100%; height:1000px; background:rgba(0,0,0,0.1);z-index:9999;";
                mask.addEventListener("touchmove",function(e){
                    e.preventDefault();
                });
                function drawItem() {
                    ctx.save();
                    ctx.translate(60, tag.height / 2);
                    ctx.rotate(Math.PI * count / (edges / 2));
                    count++;
                    for (i = 0; i < edges; i++) {
                        var color = (i) / edges;
                        ctx.fillStyle = "rgba(255,255,255," + color + ")";
                        ctx.rotate(Math.PI / (edges / 2));
                        ctx.fillRect( - 2, -20, 4, 10);
                    }

                    ctx.restore();
                    ctx.save();
                    ctx.translate(60, tag.height / 2);
                    ctx.fillStyle = "rgba(255,255,255,1)";
                    ctx.font = "32px Arial";
                    ctx.fillText("载入中...", 40, 10);
                    ctx.restore();

                }

                drawItem();
                canvasInterval = setInterval(function() {
                    ctx.clearRect(0, 0, 280, 180);
                    drawItem();
                },
                120);
            }
        },
        /**
         * 隐藏载入中动画
         */
        hideLoading: function(fn) {
            var mask = doc.querySelector(".J_loadingMask"),
            back = doc.querySelector(".J_cancleLoading");
            if(back){
                back.parentNode.removeChild(back);
                back = null;
            }
            pageLoaded  = true;
            if (loadingCanvas) {
                loadingCanvas.style.opacity = 0;
                loadingCanvas.style.webkitTransform = "scale3d(1,1,1)";
                
                loadingCanvas.addEventListener("webkitTransitionEnd",
                function() {
                    try {
                        clearInterval(canvasInterval);
                        canvasInterval = null;
                        loadingCanvas.parentNode.removeChild(loadingCanvas);
                        if(mask){
                            mask.parentNode.removeChild(mask);
                            mask = null;
                        }
                        
                        loadingCanvas = null;
                        fn && fn();
                    } catch(e) {}
                });
            }
        }
    }
})();