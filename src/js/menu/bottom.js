/**
 * Created by lawrence on 6/20/16.
 */
var bottom = Vue.component('menu-bottom', {
    template: `<div class="bottom-bar" :class="{'none':cartData.total===0}">
                    <cart-ico v-ref:cartIco v-show="showCartIco" :cart-data="cartData" style="bottom:20px;"></cart-ico>
                    <div class="col">
                        <span class="totalPrice">￥{{cartData.totalPrice}}</span>
                    </div>
                    <div class="col">
                        <div class="payButton" v-on:click="pay($event)">选好了</div>
                    </div>
               </div>`,
    props: {
        showCart: {
            type: Boolean,
            default: false
        },
        cartData: {
            type: Object
        }
    },
    computed: {
        showCartIco: function () {
            return !this.showCart;
        }
    },
    methods: {
        pay: function (event) {
            event.preventDefault();
            console.log('toPay');
        }
    }
});