/*
* File: jquery.nineslider.js
* Version: 1.0.0
* Description: Responsive slider jQuery plugin
* Author: 9bit Studios
* Copyright 2016, 9bit Studios
* http://www.9bitstudios.com
* Free to use and abuse under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

(function ($) {

    $.fn.nineslider = function (options) {

        var defaults = $.extend({
            autoPlay: {
                enable: true,
                interval: 5000,
                pauseOnHover: false
            },
            navigationTargetSelector: null,
            pagingTargetSelector: null
        }, options);
        
        /******************************
        Private Variables
        *******************************/         
        
        var object = $(this);
        var settings = $.extend(defaults, options);
        var canNavigate = true; 
        var resizeTimeout;
        var autoPlayInterval;
        var itemCount = 0;        
        var currentIndex = 0;

        /******************************
        Public Methods
        *******************************/        
        
        var methods = {
                
            init: function() {
                return this.each(function () {
                    methods.appendHTML();
                    methods.setEventHandlers();                  
                    methods.initializeItems();                    
                });
            },

            /******************************
            Initialize Items
            *******************************/            
            
            initializeItems: function() {
                
                $('[data-nineslider-index="'+ currentIndex +'"]').css({
                    "z-index": 2,
                    "display": "block"
                });
            },
            
            /******************************
            Append HTML
            *******************************/            
            
            appendHTML: function() {
                var childSet = object.children();
                itemCount = childSet.length;
                object.addClass("nbs-nineslider-ul");
                object.wrap("<div class='nbs-nineslider-container'></div>");
                object.find("li").addClass("nbs-nineslider-item").css({
                    "display": "none",
                    "z-index": 1,
                    "top": 0,
                    "left": 0                    
                });
                
                var navHTML = "<div class='nbs-nineslider-nav-left'></div><div class='nbs-nineslider-nav-right'></div>";

                if(settings.navigationTargetSelector && $(settings.navigationTargetSelector).length > 0) {
                    $(navHTML).appendTo(settings.navigationTargetSelector);
                } else {
                    settings.navigationTargetSelector = object.parent();
                    $(navHTML).insertAfter(object);    
                }

                var pagingHTML = '<ul class="nbs-nineslider-paging">';
                
                childSet.each(function(index){
                    $(this).attr('data-nineslider-index', index).css('z-index', 1);
                    pagingHTML += '<li data-nineslider-paging-index="'+ index +'"></li>'
                });

                pagingHTML += "</ul>";

                if(settings.pagingTargetSelector && $(settings.pagingTargetSelector).length > 0) {
                    $(pagingHTML).appendTo(settings.pagingTargetSelector);
                } else {
                    settings.pagingTargetSelector = object.parent();
                    $(pagingHTML).insertAfter(object);    
                }                                  
            },
                    
            
            /******************************
            Set Event Handlers
            *******************************/
            setEventHandlers: function() {
                
                $(settings.navigationTargetSelector).find('.nbs-nineslider-nav-left').on('click', function(){
                    methods.navigate(true);
                });

                $(settings.navigationTargetSelector).find('.nbs-nineslider-nav-right').on('click', function(){
                    methods.navigate(false);
                });

                $(settings.pagingTargetSelector).find('.nbs-nineslider-paging').on('click', 'li', function(e){
                    var slideIndex = parseInt($(e.currentTarget).attr('data-nineslider-paging-index'));
                    if(currentIndex != slideIndex){
                        methods.navigateTo(slideIndex);
                    }                    
                });

                if(settings.autoPlay.enable) {

                    methods.setAutoplayInterval();

                    if (settings.autoPlay.pauseOnHover === true) {
                        object.on({
                            mouseenter : function() {
                                canNavigate = false;
                            },
                            mouseleave : function() {
                                canNavigate = true;
                            }
                        });        
                    }            
                    
                }

                object[0].addEventListener('touchstart', methods.touchHandler.handleTouchStart, false);        
                object[0].addEventListener('touchmove', methods.touchHandler.handleTouchMove, false);                
                
            },                      
            
            /******************************
            Scroll
            *******************************/                
            
            navigate: function(reverse) {

                if(typeof reverse === 'undefined') { reverse = true }
                if(canNavigate == true) {
                    canNavigate = false;
                    if(settings.autoPlay.enable) {
                        clearInterval(autoPlayInterval);
                    }

                    var currentSlide = $('[data-nineslider-index="'+ currentIndex +'"]');

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

                    var nextSlide = $('[data-nineslider-index="'+ currentIndex +'"]');
                    nextSlide.css({
                        "display": "block",
                        "position": "absolute",
                        "z-index": 1

                    });
                    currentSlide.fadeOut(function(){
                        $(this).css({
                            "display": "none",
                            "z-index": 1
                        });

                        nextSlide.css({
                            "z-index": 2,
                            "position": "relative"
                        });

                        canNavigate = true;

                        if(settings.autoPlay.enable) {
                            methods.setAutoplayInterval();
                        }

                    });
                }
                
            },
            
            navigateTo: function(index) {
                if(canNavigate) {
                    canNavigate = false;

                    if(settings.autoPlay.enable) {
                        clearInterval(autoPlayInterval);
                    }

                    var currentSlide = $('[data-nineslider-index="'+ currentIndex +'"]');
                    var nextSlide = $('[data-nineslider-index="'+ index +'"]');
                    currentIndex = index;
                    nextSlide.css({
                        "display": "block",
                        "position": "absolute",
                        "z-index": 1
                    });
                    currentSlide.fadeOut(function(){
                        $(this).css({
                            "display": "none",
                            "z-index": 1
                        });

                        nextSlide.css({
                            "z-index": 2,
                            "position": "relative"
                        });

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
            
            /******************************
            Utility Functions
            *******************************/
            setAutoplayInterval: function(){
                autoPlayInterval = setInterval(function() {
                    methods.navigate(false);
                }, settings.autoPlay.interval);                    
            }                                   
            
        };

        if (methods[options]) {     // $("#element").pluginName('methodName', 'arg1', 'arg2');
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {     // $("#element").pluginName({ option: 1, option:2 });
            return methods.init.apply(this);  
        } else {
            $.error( 'Method "' +  method + '" does not exist in flexisel plugin!');
        }        
};

})(jQuery);
