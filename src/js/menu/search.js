/**
 * Created by lawrence on 6/18/16.
 */
var search = Vue.component('menu-search', {
    template: `<div id="search" class="search-view">
                <div class="search-content" v-on:click.prevent.stop="searchClose($event)">
                    <div class="search-form">
                        <label class="search-label" :class="{ 'active': isActive}">
                            <span class="search-icon"></span>
                            <input placeholder="支持菜名中文或拼音首字母搜索" class="search-input" v-model="searchKey"/>
                            <span class="search-close" v-on:click.prevent="searchClear()"></span>
                        </label>
                        <a class="search-button"  v-on:click.prevent.stop="searchClose($event)">完成</a></div>
                    <ul class="search-results">
                        <li v-on:click.prevent="selectSearchResult(food)" class="search-results-li" v-for="food in results">{{food.dishName}} {{food.measureUnitName ? "/" + food.measureUnitName : ""}}<span class="price">￥{{food.price}}</span></li>
                    </ul>
                </div>
            </div>`,
    props: {
        foods: {
            type: Array,
            default: []
        }
    },
    data: function () {
        return {
            searchKey: ''
        }
    },
    computed: {
        isActive: function () {
            if (this.searchKey)return true;
            else return false
        },
        results: function () {
            var results = [];
            var keyword = this.searchKey;
            if (!keyword) return results;
            for (var i = 0, len = this.foods.length; i < len; i++) {
                var item = this.foods[i];
                if ((item.code && item.code.indexOf(keyword.toUpperCase()) > -1) || (item.dishName && item.dishName.indexOf(keyword) > -1)) {
                    results.push(item);
                }
            }
            return results;
        }
    },
    methods: {
        searchClose: function (event) {
            var tc = event.target.className;
            if (tc != 'search-content' && tc != 'search-button') return;
            this.searchKey = '';
            this.$dispatch('showSearchView');
        },
        searchClear: function () {
            if (this.searchKey) {
                this.searchKey = '';
            }
            $('.search-input').focus();
        },
        selectSearchResult: function (food) {
            this.searchKey = '';
            this.$dispatch('showSearchView', {item: food});
        }
    },
    events: {
        switchSearch: function (flag) {
            setTimeout(function () {
                if (flag) {
                    $('.search-input').focus();
                }
                else {
                    $('.search-input').blur();
                }
            }, 300);

        }
    }
});