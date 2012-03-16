(function() {
    var doc = document,
    DA = dataAccess,
    Log = console.log,
    //loading����canvas�ڵ��õ�ȫ�ֱ���
    loadingCanvas, canvasInterval, 
    //����
    layout, 
    //������ͼ������ʱ���ã�
    popBigPicWrap, 
    //��ҳ�б��������
    listObjArr = [],
    //��ǰ�б�ҳ��ı���
    curTagname,
    //ҳ������
    _wrapper = doc.getElementById("iScrollArea"),
    //���ڷ��ù̶��ı���ʹ�õ�����
    _fixTitleWrapper = doc.createElement("div");
    doc.querySelector("#wrapper").insertBefore(_fixTitleWrapper);
    _fixTitleWrapper.style = "position:absolute; top:48px; left:0;width:100%; z-index:1000";
    
    /**
     * ��ͼ�����
     */
    View = {
        /**
         * ��ʼ��
         */
        init: function() {
            var self = this;
            layout = new layoutHandler("#wrapper", {
                onScrollMove: function() {
                    self.onScrollMove();
                }
            });
            layout._init();
        },
        /**
         * iscoll����ʱ�������¼�����ҳ��ͨ����д�÷�����ʹ��
         */
        onScrollMove: function() {},
        /**
         * �޸�ͷ����״̬
         */
        setHeadStatus: function(n, fn) {
            var headTabs = doc.querySelectorAll("#headNav a"),
            curTab = doc.querySelector("#headNav .cur"),
            logo = doc.querySelector("#siteHead .logo"),
            btn = doc.querySelector("#siteHead .backbtn"),
            link = doc.querySelector("#siteHead .backbtn a");
            
            if (headTabs[n - 1]) {
                //�л���ǩ״̬
                link.href = location.hash;
                btn.className = "backbtn head-hidden";
                if (logo.className.indexOf("head-hidden") > 0) logo.className = "logo";
                curTab.setAttribute("class", "");
                headTabs[n - 1].className = "cur";
            } else {
                //���ò���ʾ���ذ�ť
                if (n == "detail") {
                    link.href = Router.oldHash;
                }
                if (n == "list") {
                    link.href = "#index/1";
                }
                btn.className = "backbtn";
                logo.className = "logo head-hidden";
            }
            //��ʾ�����ж���
            this.showLoading();
            //��ʼ��ȫ�ֱ���������ı��������������¼���
            this._removeDetailTitle();
            this.onScrollMove = function() {};
            /**
             * ��ʼ���û��������Ժ�ʹ�ñ��ش洢�������ֻ��û����ݣ�
             */
            View.isImgMode = (typeof View.isImgMode == "undefined") ? true: View.isImgMode;
            //ִ�лص�
            fn && fn();
        },
        /**
         * ��Ⱦ����ģ��
         */
        renderHTML: function(template, data) {
            for (k in data) {
                template = template.replace(new RegExp("{{" + k + "}}", "g"));
            }
            return template;
        },
        /**
         * ����ҳ����
         */
        buildNewPage: function(fn) {
            var page = doc.createElement("div"),
            oldPage = _wrapper.querySelector(".switch-block");
            layout._hideHead();
            page.className = "switch-block";
            page.style.cssText = "top:0; left:0; width:100%; position:absolute";
            page.style.zIndex = -1;
            page.style.opacity = 0;
            page.style.webkitTransform = "scale3d(1.2,1.2,1)";
            //��չ̶�����λ����صı���������
            listObjArr = [];

            return page;
        },
        /**
         * ��ʾ��ҳ��
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
                //����ҳ�涥��
                self._scrollToTop(page);
                //��չ̶�����
                _fixTitleWrapper.innerHTML = "";

                page.style.webkitTransition = "all 0.4s";
                setTimeout(function() {

                    page.style.webkitTransform = "scale3d(1,1,1)";
                    page.style.opacity = 1;

                    setTimeout(function() {
                        page.style.webkitTransition = "all 0s";
                        if (oldPage[1]) ! popBigPicWrap && _wrapper.removeChild(oldPage[0]);
                        page.style.position = "relative";
                        self._scrollToTop(page);
                        //���������ͼ
                        if (popBigPicWrap) {
                            popBigPicWrap.parentNode.removeChild(popBigPicWrap);
                            popBigPicWrap = null;
                        }
                        page.style.zIndex = 0;
                        _wrapper.style.zIndex = 0;
                        self.hideLoading();
                        fn && fn();
                    },
                    600);
                },
                40);

            },
            1000)

        },
        /**
         * ��ҳ�������ͷ��
         */
        _scrollToTop: function(page) {
            if (layout.scroll) {
                layout.scroll.refresh();
                layout.scroll.scrollToElement(page, 5);
            } else {
                window.scrollTo(0, 0);
            }
        },
        /*******************************************************************
         * ��Ⱦ��ǩ�б�ҳ(��ҳ)
         */
        renderTagList: function(data, fn) {
            var self = this,
            page = self.buildNewPage();
            if (!data.list.length) return;

            _wrapper.appendChild(page);
            setTimeout(function() {
                for (i in data.list) {
                    self._renderScrollList(data.list[i], page);
                }
                self.showNewPage(page);
            },
            0);
            self.onScrollMove = function() {
                location.href.indexOf("index") > 0 && View.fixListTitle();
            }
        },
        /**
         * ��Ⱦˮƽ�б��
         */
        _renderScrollList: function(data, page, fn) {
            var self = this,
            listWrap = doc.createElement("div"),
            scroll,
            colViewItem,
            title;

            listWrap.className = "scroll-list";
            listWrap.innerHTML = '<div class="scroll-title"><h3>' + data.tagName + '</h3><a data-tag="" href="#list/' + data.tagId + '/1.php_' + encodeURIComponent(data.tagName) + '" class="more"></a></div>\
            <div class="list-view"><div class="carousel-block"></div></div>';
            title = listWrap.querySelector(".scroll-title");
            scroll = listWrap.querySelector(".carousel-block");
            scroll.listData = data.items;
            page.appendChild(listWrap);
            //��ʼ��colview���
            colViewItem = new colView({
                el: scroll,
                scroll: layout.scroll,
                data: data.items,
                equalHeight: true
            });
            //չ����ͼʱ��ʾdetailҳ
            colViewItem.onSwitchBig = function(obj) {
                var url = obj.url;
                //����url��ַ
                url = url.replace(/http:\/\/[^\/]+\//i, "");
                popBigPicWrap = obj.wrap;
                Router.setHash(url);
            };
            self.setListTitle(listWrap);
            return listWrap;

        },
        /************************************************
         * չ���б�ҳ��
         */
        renderListPage: function(data) {
            var self = this,
            page = self.buildNewPage(),
            listWrap = doc.createElement("ul"),
            title;
            listWrap.className = "normal-list";

            page.innerHTML = '<div class="scroll-title"><h3>' + decodeURIComponent(data.tagName) + '</h3></div>';

            title = page.querySelector(".scroll-title");

            if (!data.items.length) return;
            _wrapper.appendChild(page);
            page.appendChild(listWrap);
            setTimeout(function() {
                for (i in data.items) {
                    self._renderListItem(data.items[i], listWrap);
                }
                self.showNewPage(page,
                function() {
                    _fixTitleWrapper.appendChild(title.cloneNode(true));
                });
            },
            0);
        },
        _renderListItem: function(data, wrap) {
            var self = this,
            item = doc.createElement("li"),
            template = '<a href="#' + data["publishUrl"].substr(1) + '"><img src="' + data["pic"] + "_160x160.jpg" + '"/></a>';
            item.innerHTML = template;
            
            wrap.appendChild(item);
            var img = item.querySelector("img");
            img.onerror = function(e){
                console.log(img.readyStatus);
            }
        },
        /**
         * ���¹���ʱ������̶��ڶ���
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
            scrollTop, elTop, cloneTitle, nextElTop;

            scrollTop = Math.abs(scroll.y);

            for (var k = 0; k < listObjArr.length; k++) {
                elTop = listObjArr[k].pos;
                cloneTitle = listObjArr[k].obj;
                if (listObjArr[k + 1]) {
                    nextElTop = listObjArr[k + 1].pos;
                    if (scrollTop >= elTop && scrollTop < nextElTop) {
                        if (_fixTitleWrapper.firstChild != cloneTitle) {
                            console.log("abc");
                            _fixTitleWrapper.innerHTML = "";

                            _fixTitleWrapper.appendChild(cloneTitle);
                        }
                    }
                } else {
                    if (scrollTop >= elTop) {
                        if (_fixTitleWrapper.firstChild != cloneTitle) {
                            _fixTitleWrapper.innerHTML = "";
                            _fixTitleWrapper.appendChild(cloneTitle);
                        }
                    }
                }
            }
        },
        /*******************************************************************
         * ��Ⱦ����ҳ
         */
        renderDetailPage: function(data) {
            var self = this,
            title = data["title"],
            contentHTML = data["body"],
            page = self.buildNewPage(),

            //���±���Ͳ�����
            titleWrap = doc.createElement("div"),
            titleBtn,
            
            //ͼƬ����
            imgArr = self._convHTMLtoList(contentHTML),
            galleryViewItem,
            detailWrap = doc.createElement("div"),
            height = _wrapper.parentNode.clientHeight,
            width = _wrapper.parentNode.clientWidth;
            self.curDetailPage = parseInt(data["page_current"]),
            contentWrap = doc.createElement("div");

            //����ҳ����ӵ�ҳ����
            _wrapper.appendChild(page);
            //���ñ���Ͳ�����
            titleWrap.className = "title-wrap";
            titleWrap.innerHTML = "<span>" + title + "</span><a href=''><em>ͼ��ģʽ</em><b></b></a>";
            titleBtn = titleWrap.querySelector("em");
            titleBtn.addEventListener("click",
            function(e) {
                e.preventDefault();
                self.isImgMode = !self.isImgMode;
                Router.reload();
            });

            if (self.isImgMode) {
                //��ͼģʽ��ʼ��
                //����detailҳ������ʽ
                detailWrap.className = "gallery-view-block";
                detailWrap.style.cssText = "width:" + (width) + "px; height:" + height + "px;overflow: visible !important;";
                page.appendChild(detailWrap);

                titleBtn.innerHTML = "ͼ��ģʽ";

                //��ʼ������ҳ��ͼ
                galleryViewItem = new galleryView({
                    wrap: detailWrap,
                    data: imgArr
                });
                //�϶��������
                galleryViewItem.loadMore = function() {
                    self._loadMoreContent(galleryViewItem, imgArr);
                }
                //���ù���
                page.ontouchstart = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            } else {
                //ͼ��ģʽ��ʼ��
                titleBtn.innerHTML = "��ͼģʽ";
                page.appendChild(contentWrap);
                contentWrap.className = "text-detail";
                contentWrap.innerHTML = '<h2>' + data["title"] + '</h2>'
                contentWrap.innerHTML += data["body"].replace(/\.(jpg|png)/g,function($0){
                    return $0+"_160x160.jpg";
                });
                self._loadMoreTextDetailPage(contentWrap);
            }
            //����ҳ��
            self.showNewPage(page,
            function() {
                //��ʾ��������
                self._removeDetailTitle();
                doc.querySelector("#wrapper").appendChild(titleWrap);
                setTimeout(function(){titleWrap.style.webkitTransform = "translate3d(0,0,0)";},0);
            });
            self.isLastPage = false;
        },
        _removeDetailTitle: function() {
            if (doc.querySelector("#wrapper .title-wrap")) doc.querySelector("#wrapper").removeChild(doc.querySelector("#wrapper .title-wrap"));
        },
        /**
         * ��Ⱦ�����ı�ģʽ
         */
        _loadMoreTextDetailPage: function(contentWrap) {
            var self = this;
            self.onScrollMove = function(){
                if (!layout.scroll) return;
                if(!self.isLastPage){
                    var scroll = layout.scroll,
                    scroller = scroll.scroller,
                    scrollTop = Math.abs(scroll.y),
                    loadBox = doc.createElement("div");
                    loadBox.className = "text-loading-box";
                    loadBox.innerHTML = "�����������...";
                    if(scroller.clientHeight-scrollTop<700&&! self.loadingMore){
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
         * ����������ת��ͼƬ����
         */
        _convHTMLtoList: function(HTML, arr) {
            var self = this,
            //��������
            fragment = doc.createElement("div"),
            imgs,
            imgArr = arr || [];
            //��������
            fragment.innerHTML = HTML;
            //��ȡ�����е��б�
            imgs = fragment.querySelectorAll("img");
            for (k in imgs) {
                imgs[k].src && imgArr.push({
                    img: imgs[k].src
                });

            }
            return imgArr;
        },
        /**
         * ���ظ���ͼƬ(����������)
         */
        _loadMoreContent: function(view, olddata, contentWrap,fn) {

            var self = this;

            ! self.loadingMore && DA.getMoreDetailContent(function(data) {
                if (data) {
                    //��ȡ��ҳ��
                    var pagelen = (function() {
                        var pages = data["article_pagination"],
                        i = 0;
                        for (k in pages)
                        i++
                        return i;
                    })();
                    //��ȡ��ǰҳ
                    self.curDetailPage = parseInt(data["page_current"]);
                    //�ж��ǲ������һҳ
                    if (self.curDetailPage == pagelen) {
                        self.isLastPage = true;
                    } else {
                        self.isLastPage = false;
                    }
                    //�ر����ڼ���״̬
                    self.loadingMore = false;
                    //�������ͼƬģʽ
                    if (self.isImgMode) {
                        //��ʾ����
                        self._convHTMLtoList(data["body"], olddata);
                        view.updataDataLength(olddata.length);
                        setTimeout(function() {
                            view.goToMore();
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
                        //�����ı�ģʽhtml
                        contentWrap.appendChild(newTextWrap);
                    }
                    fn&&fn();
                }
            });
            self.loadingMore = true;

        },
        /**********************************************************************
         * ��ʾ�������붯��
         */
        showLoading: function() {
            if (!canvasInterval) {
                var tag = loadingCanvas = document.createElement("canvas");
                var ctx = tag.getContext("2d"),
                count = 0,
                edges = 12,
                i;
                doc.body.appendChild(tag);
                tag.width = 140;
                tag.height = 90;
                tag.style.cssText = "position:absolute; top:50%; left:50%; margin:-30px 0 0 -70px; -webkit-transition:all 0.4s;-webkit-border-radius:5px;z-index:10000; background:rgba(0,0,0,0.7);";
                function drawItem() {
                    ctx.save();
                    ctx.translate(30, tag.height / 2);
                    ctx.rotate(Math.PI * count / (edges / 2));
                    count++;
                    for (i = 0; i < edges; i++) {
                        var color = (i) / edges;
                        ctx.fillStyle = "rgba(255,255,255," + color + ")";
                        ctx.rotate(Math.PI / (edges / 2));
                        ctx.fillRect( - 1, -10, 2, 5);
                    }

                    ctx.restore();
                    ctx.save();
                    ctx.translate(30, tag.height / 2);
                    ctx.fillStyle = "rgba(255,255,255,1)";
                    ctx.font = "16px Arial";
                    ctx.fillText("������...", 20, 5);
                    ctx.restore();

                }

                drawItem();
                canvasInterval = setInterval(function() {
                    ctx.clearRect(0, 0, 100, 60);
                    drawItem();
                },
                120);
            }
        },
        /**
         * ���������ж���
         */
        hideLoading: function(fn) {
            if (loadingCanvas) {
                loadingCanvas.style.opacity = 0;
                loadingCanvas.addEventListener("webkitTransitionEnd",
                function() {
                    try {
                        clearInterval(canvasInterval);
                        canvasInterval = null;
                        loadingCanvas.parentNode.removeChild(loadingCanvas);
                        loadingCanvas = null;
                        fn && fn();
                    } catch(e) {}
                });
            }
        }
    }
})();