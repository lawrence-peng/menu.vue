/**
 * Created by lawrence on 6/20/16.
 */
var cartItem = Vue.component('cart-item', {
    template: `<li class="food-unit">
        <div class="cartName">{{cartItem.dishName}}</div>
        <div class="cartNum">￥{{cartItem.finalPrice}}</div>
        <menu-counter v-ref:cartCounter :dish-number="num"></menu-counter>
        </li>`,
    props: {
        cartItem: {
            type: Object,
            default: {}
        }
    },
    computed: {
        num: function () {
            return this.cartItem.dishNumber;
        }
    },
    events: {
        incrementClick: function () {
            this.$dispatch('cartDataChange', {
                dishTypeID: this.cartItem.dishTypeID,
                __id: this.cartItem.__id,
                dishID: this.cartItem.dishID,
                dishName: this.cartItem.dishName,
                price: this.cartItem.price,
                num: 1,
                money: this.cartItem.price
            });
        },
        decrementClick: function () {
            this.$dispatch('cartDataChange', {
                cmdType: 'cart_decrement',
                dishTypeID: this.cartItem.dishTypeID,
                __id: this.cartItem.__id,
                num: -1,
                money: -this.cartItem.price
            });
        }
    }
});