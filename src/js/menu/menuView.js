/**
 * Created by lawrence on 6/22/16.
 */
var menuContainer = Vue.component('menu-view', {
    template: `<div class="menu-view" :class="{ 'main-pb':cartData.total>0}" >
        <menu-header v-ref:header :shop-name="shopName"></menu-header>
        <menu-content v-ref:content :category-menu-list="categoryMenuList" :cart-data="cartData"></menu-content>
    </div>`,
    props: {
        shopName: {type: String, default: ''},
        categoryMenuList: {type: Array, default: []},
        cartData: {type: Object},
        showCartbox: {type: Boolean}
    },
    events: {
        categoryItemClick: function (item) {
            $('.food-category').eq(item.__index)[0].scrollIntoView();
            this.$broadcast('categoryItemClick', item);
        },
        menuScroll: function (index) {
            this.$broadcast('menuScroll', index);
        }
    }
});