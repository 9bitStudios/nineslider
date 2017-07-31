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
        template: `
            <div class="nbs-nineslider-container">
                <ul class="nbs-nineslider-ul" @mouseover="mouseOver" @mouseout="mouseOut"> 
                    <li v-for="(item, index) in items" class="nbs-nineslider-item" :ref="'nbs-nineslider-index-' + index">
                        <template v-if="item.link">
                            <a :href="item.link">
                                <img :src="item.image" />
                                <div v-html="item.caption" class="caption" v-if="item.caption"></div>
                            </a>
                        </template>
                        <template v-else>
                            <img :src="item.image" />
                            <div v-html="item.caption" class="caption" v-if="item.caption"></div>                
                        </template>
                    </li>
                </ul>
                <div class="nbs-nineslider-nav-left" @click="navigate(true)"></div>
                <div class="nbs-nineslider-nav-right" @click="navigate(false)"></div>  
                <ul class="nbs-nineslider-paging">
                    <li v-for="(item, index) in items" @click="navigateTo(index)" :class="{ active: index == currentIndex }"></li>
                </ul>
            </div>        
        `,
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
            this.items = data;
        },
        mounted: function(){
            var item = this.$refs["nbs-nineslider-index-" + this.currentIndex][0];
            item.style.display = "block";
            item.style.zIndex = 2; 
            
            if(this.settings.autoPlay.enable) {
                this.setAutoplayInterval();
            }

            this.settings.loaded();                    
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

                    this.settings.before(this.currentIndex);

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

                    self.settings.after(self.currentIndex)

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
                if(this.settings.autoPlay.pauseOnHover){
                    this.canNavigate = false;
                }
            },
            mouseOut: function(){
                if(this.settings.autoPlay.pauseOnHover){
                    this.canNavigate = true;
                }
            }                     
        }
    });

    new Nineslider().$mount(element)

}