/*
* File: vue.nineslider.js
* Version: 1.0.0
* Description: Responsive slider for Vue.js
* Author: 9bit Studios
* Copyright 2016, 9bit Studios
* http://www.9bitstudios.com
* Free to use and abuse under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

var nineslider = window.nineslider = function(element, options, data){

    new Vue({
        el: element,
        data: {
            items: [],
            currentIndex: 0,
            canNavigate: true
        },
        created: function(){
            this.items = data;
        },
        mounted: function(){
            var item = this.$el.querySelectorAll('[data-nineslider-index="'+ this.currentIndex +'"]');
            item[0].style.display = "block";
            item[0].style.zIndex = 2;                     
        },
        methods: {
            navigate: function(reverse){                
                if(typeof reverse === 'undefined') { reverse = true }

                if(this.canNavigate) {
                    this.canNavigate = false;

                    var currentSlide = this.$el.querySelectorAll('[data-nineslider-index="'+ this.currentIndex +'"]');
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

                    var nextSlide = this.$el.querySelectorAll('[data-nineslider-index="'+ this.currentIndex +'"]');

                    this.transition(currentSlide[0], nextSlide[0]);
                }
            },
            navigateTo: function(index) {
                if(this.canNavigate) {

                    this.canNavigate = false;
                    var currentSlide = this.$el.querySelectorAll('[data-nineslider-index="'+ this.currentIndex +'"]');
                    var nextSlide = this.$el.querySelectorAll('[data-nineslider-index="'+ index +'"]');
                    this.currentIndex = index;                    
                    this.transition(currentSlide[0], nextSlide[0]);
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

                    self.canNavigate = true;

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
            }            
        }
    });
}