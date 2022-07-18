/*
* File: vue.nineslider.js
* Version: 1.0.0
* Description: Responsive slider for Vue.js
* Author: 9bit Studios
* Copyright 2017, 9bit Studios
* http://www.9bitstudios.com
* Free to use and abuse under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

var nineslider = window.nineslider = function(element, options, data, template){

    var defaults = {
        autoPlay: {
            enable: true,
            interval: 5000,
            pauseOnHover: false
        },
        loaded: function() { },
        before: function() { },
        after: function() { }
    };

    if(!options) { options = {}; }

    function extend (targetObject, extendingObject){
        for(var key in extendingObject) {
            targetObject[key] = extendingObject[key];
        }
        return targetObject;
    } 

    var Nineslider = Vue.extend({
        template: template,
        data: function() {
            return {
                items: [],
                settings: extend(defaults, options),
                currentIndex: 0,
                canNavigate: true,
                autoPlayInterval: null
            }
        },
        created: function(){

            var self = this;

            this.items = data;

            if(this.items.length <= 1) {
                this.canNavigate = false;
            }

        },
        mounted: function(){

            var self = this;

            var item = this.$refs["nbs-nineslider-index-" + this.currentIndex][0];

            if(item) {
                item.style.display = "block";
                item.style.zIndex = 2; 
            }
            
            if(this.settings.autoPlay.enable) {
                this.setAutoplayInterval();
            }

            var touchHandler = {
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
                            self.navigate(true);
                        } else {
                            //swipe right
                            self.navigate(false);
                        }                       
                    }
                    
                    /* reset values */
                    this.xDown = null;
                    this.yDown = null;
                    canNavigate = true;   
                }             
            };

            this.$el.addEventListener('touchstart', touchHandler.handleTouchStart, false);   
            this.$el.addEventListener('touchmove', touchHandler.handleTouchMove, false);  

            this.settings.loaded.call(this);                    
        },
        methods: {
            navigate: function(reverse){                
                if(typeof reverse === 'undefined') { reverse = true }

                if(this.canNavigate) {
                    this.canNavigate = false;

                    this.settings.before(this.currentIndex);

                    if(this.settings.autoPlay.enable) {
                        clearInterval(this.autoPlayInterval);
                    }
                    var currentSlide = this.$refs["nbs-nineslider-index-" + this.currentIndex][0];
                    var itemCount = this.items.length;

                    if(reverse) {
                        if(this.currentIndex === 0) { // are we at the beginning?
                            this.currentIndex = itemCount - 1;
                        } else {
                            this.currentIndex--;
                        }
                    } else {
                        if(this.currentIndex === itemCount - 1) { // are we at the end?
                            this.currentIndex = 0;
                        } else {
                            this.currentIndex++;
                        }
                    }

                    var nextSlide = this.$refs["nbs-nineslider-index-" + this.currentIndex][0];

                    this.transition(currentSlide, nextSlide);
                }
            },
            navigateTo: function(index) {
                if(this.canNavigate) {

                    this.canNavigate = false;

                    this.settings.before.call(this, this.currentIndex);

                    if(this.settings.autoPlay.enable) {
                        clearInterval(this.autoPlayInterval);
                    }                    
                    var currentSlide = this.$refs["nbs-nineslider-index-" + this.currentIndex][0];
                    var nextSlide = this.$refs["nbs-nineslider-index-" + index][0];
                    this.currentIndex = index;                    
                    this.transition(currentSlide, nextSlide);
                }
            },
            transition: function(currentSlide, nextSlide){
                var self = this;
                nextSlide.style.display = "block";
                nextSlide.style.position = "absolute";
                nextSlide.style.zIndex = 1;
            
                this.fadeOut(currentSlide, function(){
                    currentSlide.style.display = "none";
                    currentSlide.style.zIndex = 1;

                    nextSlide.style.position = "relative";
                    nextSlide.style.zIndex = 2;                        

                    self.settings.after.call(this, self.currentIndex)

                    self.canNavigate = true;

                    if(self.settings.autoPlay.enable) {
                        self.setAutoplayInterval();
                    }


                });
                
            },
            fadeOut: function(el, callback){
                var opacity = 1;
                var timer = setInterval(function(){
                    if(opacity < 0.1){
                        clearInterval(timer);
                        el.style.display = "none";
                        el.style.opacity = 1;
                        callback();
                    } else {
                        el.style.opacity = opacity;
                        opacity -=  0.1;
                    }

                }, 50);
            },
            setAutoplayInterval: function(){
                var self = this;
                this.autoPlayInterval = setInterval(function() {
                    self.navigate(false);
                }, this.settings.autoPlay.interval);                    
            },
            mouseOver: function(){
                if(this.settings.autoPlay.pauseOnHover && this.items.length > 1){
                    this.canNavigate = false;
                }
            },
            mouseOut: function(){
                if(this.settings.autoPlay.pauseOnHover && this.items.length > 1){
                    this.canNavigate = true;
                }
            }                     
        }
    });

    new Nineslider().$mount(element)

}