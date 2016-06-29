/**
 * Created by lawrence on 6/20/16.
 */
var cart = Vue.component('user-cart', {
    template: `<div class="cart-view" v-on:click.prevent.stop="hideCart($event)">
                <div class="cart-main">
                    <cart-ico v-ref:cartIco :cart-data="cartData" style="bottom: 6px;"></cart-ico>
                    <div class="cart-body">
                        <h3>购物车<i></i></h3>
                        <div class="J_cartinfo">
                            <div class="food-info">
                                <ul class="food-units">
                                    <template v-for="cartItem in cartData.detailList">
                                    <cart-item :cart-item="cartItem" ></cart-item>
                                    </template>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`,
    props: {
        cartData: {
            type: Object
        }
    },
    methods: {
        hideCart: function (event) {
            var tc = event.target.className;
            if (tc === 'cart-view') {
                this.$dispatch('switchShowCart');
            }
        }
    }
});