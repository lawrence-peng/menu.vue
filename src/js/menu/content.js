/**
 * Created by lawrence on 6/19/16.
 */
var content = Vue.component('menu-content', {
    template: `<section class="menu-content">
                <div class="panel main">
                    <menu-category v-ref:category :category-list="categoryMenuList" :cart-data="cartData"></menu-category>
                    <menu-list v-ref:menulist :menu-list="categoryMenuList" :cart-data="cartData"></menu-list>
                </div>
            </section>`,
    props: {
        categoryMenuList: {type: Array, default: []},
        cartData: {type: Object}
    }
});