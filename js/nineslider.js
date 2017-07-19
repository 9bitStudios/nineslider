/*
* File: nineslider.js
* Version: 1.0.0
* Description: Responsive slider JavaScript plugin
* Author: 9bit Studios
* Copyright 2016, 9bit Studios
* http://www.9bitstudios.com
* Free to use and abuse under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

var nineslider = window.nineslider = function(element, options){

    var defaults = {
        autoPlay: {
            enable: true,
            interval: 5000,
            pauseOnHover: false
        },
        navigationTargetSelector: null,
        pagingTargetSelector: null,
        loaded: function() { },
        before: function() { },
        after: function() { }
    };

    var object = element;
    if(!options) { options = {} }
    var settings = extend(defaults, options);
    var canNavigate = true; 
    var resizeTimeout;
    var autoPlayInterval;
    var itemCount = 0;        
    var currentIndex = 0;

    var methods = {
        init: function(){
            this.appendHTML();
            this.setEventHandlers();
            this.initializeItems();
        },
        appendHTML: function(){

            // object.children returns an HTMLCollection and not an array, so we need to convert
            object.className += "nbs-nineslider-ul";
            var childSet = [].slice.call(object.children);
            itemCount = childSet.length;

            childSet.forEach(function(item, index){
                item.className += "nbs-nineslider-item";
                item.setAttribute("data-nineslider-index", index);
                item.setAttribute('style', 'display: none; z-index: 0; top: 0; left: 0;');
            });

            // wrap container
            var wrapper = document.createElement("div");
            wrapper.className = "nbs-nineslider-container";
            wrap(object, wrapper);

            //set up paging
            var paging = document.createElement("ul");
            paging.className = "nbs-nineslider-paging";
            childSet.forEach(function(item, index){
                var pagingItem = document.createElement("li");
                pagingItem.setAttribute("data-nineslider-paging-index", index);
                paging.appendChild(pagingItem);
            });

            if(settings.pagingTargetSelector) {
                var pagingElement = document.querySelector(settings.pagingTargetSelector);    
                if(pagingElement) {
                    pagingElement.appendChild(paging);
                }
            } else {
                settings.pagingTargetSelector = object.parentNode;
                insertAfter(object, paging);
            } 

            // set up navigation
            var prev = document.createElement("div");
            prev.className = "nbs-nineslider-nav-left";
            var next = document.createElement("div");
            next.className = "nbs-nineslider-nav-right";

            if(settings.navigationTargetSelector) {
                var navigationElement = document.querySelector(settings.navigationTargetSelector);
                if (navigationElement) {
                    navigationElement.appendChild(prev);
                    navigationElement.appendChild(next);
                }
            } else {
                settings.navigationTargetSelector = object.parentNode;
                insertAfter(object, next);
                insertAfter(object, prev);
            }            

        },
        setEventHandlers: function(){

            // navigation event handlers
            var prev = settings.navigationTargetSelector.getElementsByClassName("nbs-nineslider-nav-left")[0];
            if(prev) { 
                prev.addEventListener("click", function(event){
                    methods.navigate(true);
                }); 
            }

            var next = settings.navigationTargetSelector.getElementsByClassName("nbs-nineslider-nav-right")[0];
            if(next) { 
                next.addEventListener("click", function(event){
                    methods.navigate(false);
                }); 
            } 

            var paging = settings.pagingTargetSelector.getElementsByClassName("nbs-nineslider-paging")[0];
            
            paging.addEventListener("click", function(e) {

                var attr = e.target.getAttribute("data-nineslider-paging-index");
                if(attr) {
                    var slideIndex = parseInt(attr);
                    methods.navigateTo(slideIndex);
                }
                
            });

            if(settings.autoPlay.enable) {

                methods.setAutoplayInterval();

                object.addEventListener("mouseover", function(){
                    canNavigate = false;
                });

                object.addEventListener("mouseout", function(){
                    canNavigate = true;
                });
            }
            object.addEventListener('touchstart', methods.touchHandler.handleTouchStart, false);        
            object.addEventListener('touchmove', methods.touchHandler.handleTouchMove, false);            

        },
        initializeItems: function(){
            var item = object.querySelectorAll('[data-nineslider-index="'+ currentIndex +'"]');
            if(item.length > 0) {
                item[0].style.display = "block";
                item[0].style.zIndex = 2;
            }

            var pagingItem = object.parentNode.querySelectorAll('[data-nineslider-paging-index="'+ currentIndex +'"]');

            if(pagingItem.length > 0) {
                pagingItem[0].className += "active";
            }

            settings.loaded();
        },
        navigate: function(reverse){
            if(typeof reverse === 'undefined') { reverse = true }
            if(canNavigate) {

                settings.before(currentIndex);

                canNavigate = false;
                if(settings.autoPlay.enable) {
                    clearInterval(autoPlayInterval);
                }
                
                var currentSlide = object.querySelectorAll('[data-nineslider-index="'+ currentIndex +'"]');

                if(reverse) {
                    if(currentIndex === 0) { // are we at the beginning?
                        currentIndex = itemCount - 1;
                    } else {
                        currentIndex--;
                    }
                } else {
                    if(currentIndex === itemCount - 1) { // are we at the end?
                        currentIndex = 0;
                    } else {
                        currentIndex++;
                    }
                }

                methods.setPaging(currentIndex);

                var nextSlide = object.querySelectorAll('[data-nineslider-index="'+ currentIndex +'"]');

                methods.transition(currentSlide, nextSlide);

            }
        },
        navigateTo: function(index) {
            if(canNavigate) {
                canNavigate = false;

                settings.before(currentIndex);

                if(settings.autoPlay.enable) {
                    clearInterval(autoPlayInterval);
                }

                methods.setPaging(index);
                
                var currentSlide = object.querySelectorAll('[data-nineslider-index="'+ currentIndex +'"]');
                var nextSlide = object.querySelectorAll('[data-nineslider-index="'+ index +'"]');
                currentIndex = index;   
                
                methods.transition(currentSlide, nextSlide);

            }
        },
        setPaging: function(index){
            var currentPagingItem = settings.pagingTargetSelector.querySelectorAll(".active");
            if(currentPagingItem.length > 0) {
                currentPagingItem[0].classList.remove("active");
            }
            var nextPagingItem = settings.pagingTargetSelector.querySelectorAll('[data-nineslider-paging-index="'+ index +'"]');
            if(nextPagingItem.length > 0) {
                nextPagingItem[0].className += "active";
            }  
        },
        transition: function(currentSlide, nextSlide){
            if(nextSlide.length > 0) {
                nextSlide[0].style.display = "block";
                nextSlide[0].style.position = "absolute";
                nextSlide[0].style.zIndex = 1;
            }

            if(currentSlide.length > 0) {
                fadeOut(currentSlide[0], function(){
                    currentSlide[0].style.display = "none";
                    currentSlide[0].style.zIndex = 1;

                    nextSlide[0].style.position = "relative";
                    nextSlide[0].style.zIndex = 2;                        
                    
                    settings.after(currentIndex);
                    
                    canNavigate = true;
                    
                    if(settings.autoPlay.enable) {
                        methods.setAutoplayInterval();
                    }

                });
            }
        },
        touchHandler: {

            xDown: null,
            yDown: null,
            handleTouchStart: function(evt) {                                         
                this.xDown = evt.touches[0].clientX;                                      
                this.yDown = evt.touches[0].clientY;
            }, 
            handleTouchMove: function (evt) {
                if (!this.xDown || !this.yDown) {
                    return;
                }

                var xUp = evt.touches[0].clientX;                                    
                var yUp = evt.touches[0].clientY;

                var xDiff = this.xDown - xUp;
                var yDiff = this.yDown - yUp;
                
                // only comparing xDiff
                // compare which is greater against yDiff to determine whether left/right or up/down  e.g. if (Math.abs( xDiff ) > Math.abs( yDiff ))
                if (Math.abs( xDiff ) > 0) {
                    if ( xDiff > 0 ) {
                        // swipe left
                        methods.navigate(false);
                    } else {
                        //swipe right
                        methods.navigate(true);
                    }                       
                }
                
                /* reset values */
                this.xDown = null;
                this.yDown = null;
                canNavigate = true;
            }
        },
        setAutoplayInterval: function(){
            autoPlayInterval = setInterval(function() {
                methods.navigate(false);
            }, settings.autoPlay.interval);                    
        }               
    };


    /******************************
    Utility Methods
    *******************************/ 
    function extend(targetObject, extendingObject){
        for(var key in extendingObject) {
            targetObject[key] = extendingObject[key];
        }
        return targetObject;
    }

    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function wrap(el, wrapper) {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }    

    function fadeOut(el, callback){
        var opacity = 1;
        var timer = setInterval(function(){
            if(opacity < 0.1){
                clearInterval(timer);
                el.style.display = "none";
                el.style.opacity = 1;                
                callback(); //this executes the callback function!
            } else {
                el.style.opacity = opacity;
                opacity -=  0.1;
            }

        }, 50);
    }

    methods.init();

};