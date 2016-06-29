/**
 * Created by lawrence on 6/21/16.
 */
var cartIco = Vue.component('cart-ico', {
    template: `<div class="cart-ico"
                    v-on:click.prevent="switchShowCart()">
                    <span class="total">{{cartData.total}}</span>
                </div>`,
    props: {
        cartData: {
            type: Object
        }
    },
    methods: {
        switchShowCart: function () {
            this.$dispatch('switchShowCart');
        }
    }
});