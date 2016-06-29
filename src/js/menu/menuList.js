/**
 * Created by lawrence on 6/19/16.
 */

/*
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @param fn {function}  需要调用的函数
 * @param delay  {number}    延迟时间，单位毫秒
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */
var throttle = function (fn, delay, immediate, debounce) {
    var curr = +new Date(),//当前事件
        last_call = 0,
        last_exec = 0,
        timer = null,
        diff, //时间差
        context,//上下文
        args,
        exec = function () {
            last_exec = curr;
            fn.apply(context, args);
        };
    return function () {
        curr = +new Date();
        context = this,
            args = arguments,
            diff = curr - (debounce ? last_call : last_exec) - delay;
        clearTimeout(timer);
        if (debounce) {
            if (immediate) {
                timer = setTimeout(exec, delay);
            } else if (diff >= 0) {
                exec();
            }
        } else {
            if (diff >= 0) {
                exec();
            } else if (immediate) {
                timer = setTimeout(exec, -diff);
            }
        }
        last_call = curr;
    }
}

var menuList = Vue.component('menu-list', {
        template: `<div class="panel main-right">
                    <div class="active-menu">{{categoryName}}</div>
                    <div class="panel food-list-wrap" v-on:scroll.prevent="menuScroll($event)">
                        <div class="food-category-wrap">
                        <template v-for="item in menuList">
                            <dl class="food-category">
                                <dt class="food-category-name">{{item.typeName}}</dt>
                                <template v-for="menuItem in item.dishList">
                                    <menu-item v-ref:menuItem :menu-item="menuItem" :cart-data="cartData"></menu-item>
                                </template>
                            </dl>
                        </template>
                        </div>
                    </div>
                </div>`,
        props: {
            menuList: {type: Array, default: []},
            cartData: {type: Object}
        },
        data: function () {
            return {
                categoryName: ''
            }
        },
        ready: function (resolve, reject) {
            this.$win = $(window);
            this.$foodListWrap = $('.food-list-wrap');
            this.$foodCategoryWrap = $('.food-category-wrap');
            this.$foodCategory = $('.food-category');
            this.$foodImgs = $('.food-img');
            this.loadImage();

            if (this.menuList.length > 0)
                this.categoryName = this.menuList[0].typeName;
        },
        methods: {
            getImage: function ($img) {
                var img = new Image();
                var src = $img.attr('osrc');
                if (src) {
                    img.src = src;
                    img.onload = function () {
                        $img.css('background-image', 'url(' + src + ')').addClass('loaded');
                    }
                }
            },
            loadImage: function () {
                var foodImgs = this.$foodImgs.toArray();
                var $win = this.$win;
                if (!foodImgs.length) {
                    return
                }

                var winTop = $win.scrollTop();
                var topVal = winTop;
                var bottom = winTop + $win.height();
                for (var i = 0, img; img = foodImgs[i]; i++) {
                    var $img = $(img);
                    if ($img.is(".loaded")) {
                        continue
                    }
                    var oTop = $img.offset().top;
                    if (oTop >= topVal && oTop <= bottom) {
                        this.getImage($img);
                        foodImgs.splice(i--, 1)
                    }
                }
            },
            menuScroll: throttle(function () {
                var max = this.menuList.length - 1;
                var sTop = event.target.scrollTop;
                this.loadImage();
                for (var i = 0, $category; $category = this.$foodCategory.eq(i); i++) {
                    if (!$category || !$category.position()) break;
                    var pTop = $category.position().top;
                    var nTop = i < max ? $category.next().position().top : this.$foodCategoryWrap.height();
                    if (sTop >= pTop && sTop < nTop) {
                        this.categoryName = this.menuList[i].typeName;
                        this.$dispatch('menuScroll', i);
                        break;
                    }
                }
            }, 50)
        },
        events: {
            switchSearch: function (isHide, data) {
                if (data) {
                    var dishID = data.item.dishID;
                    var $foodItem = this.$foodListWrap.find('dd#food-item-' + dishID);
                    var top = $foodItem.position().top;
                    this.$foodListWrap.scrollTop(top - 36)
                }
                return true;
            },
            categoryItemClick: function (item) {
                this.categoryName = item.typeName;
            }
        }
    })
    ;
