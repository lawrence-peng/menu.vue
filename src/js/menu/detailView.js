/**
 * Created by lawrence on 6/22/16.
 */

var menuDetail = Vue.component('menu-detail', {
    template: `<div class="detail-view" :class="{ 'main-pb':cartData.total>0}">
        <div class="maketime" v-if="showMakeTime">
            <i></i>
            <p class="maketime-size">
                <span id="J_maketime">{{food.makeTime}}</span>
                <span class="timemin">分钟</span>
            </p>
            <div class="shanktimer"></div>
            <em></em>
        </div>
        <div class="backicon" @click.prevent="backMenu()"><i></i></div>
        <div class = "f-wrap">
            <foodimg-slide v-ref:foodimgSlide :food="food"></foodimg-slide>
            <div class="foodname">
                <h5>{{food.dishName}}</h5>
            </div>
            <div class="food-info ">
                <ul class="food-units">
                    <li class="food-unit food-choose">
                        <div class="price-wrap foodwrap">
                            <span class="c-ee4">￥</span>
                            <span class="f-price-z c-ee4">{{finalPrice}}</span>
                        </div>
                        <div class="cart-opt">
                            <menu-counter v-show="cartNum>0" v-ref:menuDetailCounter :dish-number="cartNum"></menu-counter>
                            <div v-show="cartNum===0" class="gocart" v-on:click="addCart()">加入购物车</div>
                        </div>
                    </li>
                </ul>
            </div>
            <food-spec v-ref:foodSpec :specs="foodSpecs" v-if="foodSpecs!==null"></food-spec>
        </div>
    </div>`,
    props: {
        cartData: {type: Object}
    },
    data: function () {
        return {
            food: {},
            price: 0.0,
            selectedSpecKey: ''
        }
    },
    computed: {
        foodSpecs: function () {
            var ret = null;
            if (this.food.dishUnitList) {
                ret = {};
                ret['规格'] = this.food.dishUnitList;
            }
            if (this.food.dishTasteList) {
                if (!ret)ret = {};
                ret['口味'] = this.food.dishTasteList;
            }
            return ret;
        },
        showMakeTime: function () {
            if (this.food.makeTime) {
                return true;
            } else {
                return false;
            }
        },
        cartNum: function () {
            for (var i = 0, len = this.cartData.detailList.length; i < len; i++) {
                var item = this.cartData.detailList[i];
                if (item.__id === this.selectedSpecKey) {
                    return item.dishNumber;
                }
            }
            return 0;
        },
        finalPrice: function () {
            return this.price || this.food.price
        }
    },
    methods: {
        backMenu: function () {
            this.$dispatch('toggleView', 'menuView');
        },
        addCart: function () {
            var item = {
                dishTypeID: this.food.dishTypeID,
                __id: this.selectedSpecKey,
                dishID: this.food.dishID,
                dishName: this.food.dishName,
                price: this.finalPrice,
                num: 1,
                money: this.finalPrice
            };
            if (this.selectedDishUnitID)item.dishUnitID = this.selectedDishUnitID;
            if (this.selectedDishTasteID)item.tasteID = this.selectedDishTasteID;
            if (this.dishSpecText) item.dishName += ' (' + this.dishSpecText + ')';
            this.$dispatch('cartDataChange', item);
        }
    },
    events: {
        incrementClick: function () {
            this.addCart();
        },
        decrementClick: function () {
            this.$dispatch('cartDataChange', {
                dishTypeID: this.food.dishTypeID,
                __id: this.selectedSpecKey,
                num: -1,
                money: -this.finalPrice
            });
        },
        specChanged: function (data) {
            this.selectedDishUnitID = data.dishUnitID;
            this.selectedDishTasteID = data.dishTasteID;
            this.dishSpecText = data.specText;
            this.price = data.selectedSpecPrice;
            this.selectedSpecKey = data.selectedSpecKey;
        },
        showDetail: function (callback) {
            //var self = this;
            callback(this);
        }
    }
});