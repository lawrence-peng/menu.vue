/**
 * Created by lawrence on 6/19/16.
 */

var menuItem = Vue.component('menu-item', {
    template: `<dd class="food-item" id="food-item-{{menuItem.dishID}}"
                    :class="{ 'shouqin':menuItem.limitNumber===0}" >
                        <div v-if="menuItem.imageList.length>0" class="food-img" osrc="http://7xoxig.com1.z0.glb.clouddn.com/{{menuItem.imageList[0].split('/')[4]}}?imageView2/3/w/80" style="height:80px;" v-on:click.prevent="showDetail()"></div>
                        <template v-else>
                        <div v-if="menuItem.defaultImageUrl" class="food-img" osrc="http://7xoxig.com1.z0.glb.clouddn.com/{{menuItem.defaultImageUrl.split('/')[4]}}?imageView2/3/w/80" style="height:80px;" v-on:click.prevent="showDetail()"></div>
                        <div v-else class="food-img" osrc="http://7xoxig.com1.z0.glb.clouddn.com/nil.jpg"  style="height:80px;" v-on:click.prevent="showDetail()"></div>
                        </template>
                        <div class="food-info">
                            <h5 v-if="displayEN" class="food-name">{{menuItem.dishEnglishName}}</h5>
                            <template v-else>
                                <h5 v-if="displayKO" class="food-name">{{menuItem.dishOtherName}}</h5>
                                <h5 v-else class="food-name">{{menuItem.dishName}}</h5>
                            </template>
                            <ul class="food-units">
                                <li class="food-unit">
                                    <p class="price-wrap">
                                        <span class="c-ee4">￥</span>
                                        <span class="f-price-z c-ee4">{{menuItem.price}}</span>
                                        <span class="unit">/{{menuItem.measureUnitName}}</span>
                                    </p>
                                    <div v-if="isHaveTaste || isHaveUnit" class="spec_choice count" v-on:click.prevent="showDetail()">选规格</div>
                                    <menu-counter v-else v-ref:menuCounter :dish-number="cartNum"></menu-counter>
                                </li>
                            </ul>
                           <div v-if="menuItem.limitNumber==0" class="shouqinicon"></div>
                        </div>
                    </dd>`,
    props: {
        menuItem: {
            type: Object,
            default: {}
        },
        cartData: {
            type: Object,
            default: {detailList: []}
        },
        language: {
            type: String,
            default: ''
        }
    },
    computed: {
        isHaveUnit: function () {
            return this.menuItem.isHaveUnit === 1;
        },
        isHaveTaste: function () {
            return this.menuItem.isHaveTaste === 1;
        },
        cartNum: function () {
            for (var i = 0, len = this.cartData.detailList.length; i < len; i++) {
                var item = this.cartData.detailList[i];
                if (item.__id === this.__id) {
                    return item.dishNumber;
                }
            }
            return 0;
        },
        displayEN: function () {
            return (this.language === 'en' && this.menuItem.dishEnglishName);
        },
        displayKO: function () {
            return (this.language === 'Ko' && this.menuItem.dishOtherName);
        },
        __id: function () {
            return this.menuItem.dishID.toString();
        }
    },
    methods: {
        showDetail: function () {
            this.$dispatch('toggleView', 'detailView',this.menuItem);
        }
    },
    events: {
        incrementClick: function () {
            this.$dispatch('cartDataChange', {
                dishTypeID: this.menuItem.dishTypeID,
                __id: this.__id,
                dishID: this.menuItem.dishID,
                dishName: this.menuItem.dishName,
                price: this.menuItem.price,
                num: 1,
                money: this.menuItem.price
            });
        },
        decrementClick: function () {
            this.$dispatch('cartDataChange', {
                dishTypeID: this.menuItem.dishTypeID,
                __id: this.__id,
                num: -1,
                money: -this.menuItem.price
            });
        }
    }
});