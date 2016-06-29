/**
 * Created by lawrence on 6/19/16.
 */
Vue.component('category-item', {
    template: `<li class="menu-left-item" 
                    :class="{ 'active':index===selectedIndex}" 
                    v-on:click.prevent="itemClick(index,item)">{{item.typeName}}
                    <span class="menu-count" :class="{ 'num':categoryCartCount>0}">{{categoryCartCount}}</span>
            </li>`,
    props: {
        item: {type: Object},
        index: {type: Number, default: 0},
        selectedIndex: {type: Number, default: 0},
        cartData: {type: Object}
    },
    data: function () {
        return {
            categoryCartCount: 0
        }
    },
    ready: function () {
        for (var i = 0, len = this.cartData.detailList.length; i < len; i++) {
            var cartItem = this.cartData.detailList[i];
            if (cartItem.dishTypeID === this.item.dishTypeID)
                this.categoryCartCount += cartItem.dishNumber;
        }

    },
    methods: {
        itemClick: function (index, item) {
            item.__index = index;
            this.$dispatch('categoryItemClick', item);
        }
    },
    events: {
        cartChange: function (data) {
            if (data.dishTypeID === this.item.dishTypeID) {
                this.categoryCartCount += data.num;
            }
        }
    }
});

var category = Vue.component('menu-category', {
    template: `<div class="panel main-left">
                <div class="panel">
                    <ul class="menu-left-list">
                        <template v-for="item in categoryList">
                            <category-item v-ref:categoryItem :item="item" :index="$index" :selected-index="selectedIndex" :cart-data="cartData"></category-item>
                        </template>
                    </ul>
                </div>
              </div>`,
    props: {
        categoryList: {
            type: Array,
            default: []
        },
        cartData: {type: Object}
    },
    data: function () {
        return {
            selectedIndex: 0
        }
    },
    events: {
        categoryItemClick: function (item) {
            this.selectedIndex = item.__index;
            return true;
        },
        menuScroll: function (index) {
            var activeMemuCategory = $('.menu-left-item').eq(index)[0];
            activeMemuCategory[activeMemuCategory.scrollIntoViewIfNeeded ? "scrollIntoViewIfNeeded" : "scrollIntoView"]();
            this.selectedIndex = index;
        }
    }
});