/**
 * Created by Christopher on 2016/1/9.
 */
'use strict';
(function(){
    function HMobile(settings){
        var defaultSettings = {
            pushState:false,
            onAjaxStart: function (xhr) {},
            onAjaxComplete: function (xhr) {}
        };
        for(var i in settings){
            if(settings.hasOwnProperty(i)){
                defaultSettings[i] = settings[i];
            }
        }
        this.settings = defaultSettings;
    }
    HMobile.prototype.addView = function(url,setting){
        var me = this;
        var pushState = me.settings.pushState;
        var globalHash = '',ifNewPage = false;
        if(pushState){
            window.addEventListener('popstate', function(){
                var hash = location.hash;
                if(globalHash.length > hash.length){
                    locationBack();
                }else{
                    if(!ifNewPage){
                        locationForward()
                    }
                }
            });
        }
        function locationForward(){
            DOM7('.page-on-center').removeClass('page-on-center').addClass('page-on-left');
            var pageOnRight = DOM7('.page-on-right');
            pageOnRight[0].className = 'page page-on-center';
            globalHash = location.hash;
        }
        function locationBack(){
            DOM7('.page-on-center').removeClass('page-on-center').addClass('page-on-right');
            var pageOnLeft = DOM7('.page-on-left');
            pageOnLeft[pageOnLeft.length-1].className = 'page page-on-center';
            globalHash = location.hash;
        }
        function backFun(){
            var hash = location.hash;
            var hashArray = hash.split('#');
            var hashString = '';
            for(var i = 1;i<hashArray.length-1;i++){
                hashString += '#'+hashArray[i]
            }
            window.location.hash = hashString;
            globalHash = hashString;
        }
        return {
            router:{
                loadPage:function(url,func){
                    me.settings.onAjaxStart();
                    var urlString = url.split('.')[0];
                    var pageString = DOM7('[data-page]').attr('data-page').toString();
                    var ct = document.createElement('div');
                    ct.className = 'page page-on-right';
                    ct.setAttribute('data-page',urlString);
                    ifNewPage = pageString.indexOf(urlString) == -1;
                    if(ifNewPage){
                        /*先做页面动画*/
                        DOM7('.pages')[0].appendChild(ct);
                        DOM7('.page-on-center').removeClass('page-on-center').addClass('page-on-left',function(){
                            setTimeout(function () {
                                ct.className = 'page page-on-center';
                            })
                        });
                        if(pushState){
                            var hash = location.hash;
                            window.location.hash = hash+'#'+urlString;
                            globalHash = hash+'#'+urlString;
                        }
                        /*再加载页面实体*/
                        DOM7.ajax({
                            url:url,
                            type:'GET',
                            success:function(data){
                                ct.innerHTML = data;
                                if(func){func(data)}
                                me.settings.onAjaxComplete();
                            }
                        });
                    }else{
                        if(pushState){
                            window.location.hash = location.hash+'#'+url.split('.')[0];
                            globalHash = window.location.hash;
                        }else{
                            locationForward();
                        }
                    }
                },
                back:function(){
                    me.settings.onAjaxStart();
                    if(pushState){
                        backFun()
                    }else{
                        locationBack();
                    }
                },
                refreshPage:function(url){}
            }
        }
    };
    HMobile.prototype.showIndicator = function(){
        console.log(0);
    };
    HMobile.prototype.hideIndicator = function(){
        console.log(1);
    };
    /*DOM7*/
    var DOM7 = (function(){
        var $$ = function (arr) {
            var _this = this;
            // Create array-like object
            for (var i = 0; i < arr.length; i++) {
                _this[i] = arr[i];
            }
            _this.length = arr.length;
            // Return collection with methods
            return this;
        };
        $$.prototype = {
            addClass:function(className,func){
                if (typeof className === 'undefined') {
                    return this;
                }
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
                    }
                }
                if(func){func()}
                return this;
            },
            removeClass: function (className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
                    }
                }
                return this;
            },
            hasClass: function (className) {
                if (!this[0]) return false;
                else return this[0].classList.contains(className);
            },
            toggleClass: function (className) {
                var classes = className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    for (var j = 0; j < this.length; j++) {
                        if (typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
                    }
                }
                return this;
            },
            css:function(style){
                var _this = this;
                for(var i in style){
                    if(style.hasOwnProperty(i)){
                        for(var t=0;t<_this.length;t++){
                            _this[t].style[i] = style[i]
                        }
                    }
                }
                return this;
            },
            width:function(){
                return this[0].style.width;
            },
            height:function(){
                return this[0].style.height;
            },
            attr:function(attrs, value){
                var _this = this;
                var attr = [];
                for(var i=0;i<_this.length;i++){
                    if(arguments.length == 1){
                        attr.push(_this[i].getAttribute(attrs))
                    }else if(arguments.length == 2){
                        _this[i].setAttribute(attrs, value)
                    }else{
                        return false;
                    }
                }
                return attr;
            }
        };
        var $ = function (selector, context) {
            var arr = [], i = 0;
            if (selector && !context) {
                if (selector instanceof $$) {
                    return selector;
                }
            }
            if (selector) {
                // String
                if (typeof selector === 'string') {
                    var els, tempParent, html = selector.trim();
                    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                        var toCreate = 'div';
                        if (html.indexOf('<li') === 0) toCreate = 'ul';
                        if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                        if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                        if (html.indexOf('<tbody') === 0) toCreate = 'table';
                        if (html.indexOf('<option') === 0) toCreate = 'select';
                        tempParent = document.createElement(toCreate);
                        tempParent.innerHTML = selector;
                        for (i = 0; i < tempParent.childNodes.length; i++) {
                            arr.push(tempParent.childNodes[i]);
                        }
                    }
                    else {
                        if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                            // Pure ID selector
                            els = [document.getElementById(selector.split('#')[1])];
                        }
                        else {
                            // Other selectors
                            els = (context || document).querySelectorAll(selector);
                        }
                        for (i = 0; i < els.length; i++) {
                            if (els[i]) arr.push(els[i]);
                        }
                    }
                }
                // Node/element
                else if (selector.nodeType || selector === window || selector === document) {
                    arr.push(selector);
                }
                //Array of elements or instance of Dom
                else if (selector.length > 0 && selector[0].nodeType) {
                    for (i = 0; i < selector.length; i++) {
                        arr.push(selector[i]);
                    }
                }
            }
            return new $$(arr);
        };
        /*AJAX*/
        $.ajax = function(option){
            var options = {
                type:'GET',
                async:true,
                data:null,
                success:function(){},
                error:function(){}
            };
            for(var i in option){
                if(option.hasOwnProperty(i)){
                    options[i] = option[i];
                }
            }
            var xmlhttp = new XMLHttpRequest();
            if(xmlhttp){
                xmlhttp.open(options.type,options.url,true);
                xmlhttp.send(options.data,options.async);
                xmlhttp.onreadystatechange=function(){
                    if (xmlhttp.readyState==4){// 4 = "loaded"
                        if (xmlhttp.status==200){
                            options.success(xmlhttp.responseText);
                        }else{
                            options.error(xmlhttp.statusText);
                        }
                    }
                };
            }
        };
        return $;
    })();
    /*export*/
    if (typeof module != 'undefined' && module['exports']) {
        module.exports = HMobile;
    } else if(typeof define === 'function' && define['amd']){
        define(function() { return HMobile});
    } else if(typeof this != 'undefined') {
        this.HMobile = HMobile;
    }
}).call(this);