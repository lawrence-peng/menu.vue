/**
 * Created by lawrence on 6/19/16.
 */

var counter = Vue.component('menu-counter', {
    template: `<div class="count" :class="{ 'active':this.dishNumber>0}">
                    <a class="minus click" v-on:click="decrement($event)"></a>
                    <span class="ipt-no-app sum">{{dishNumber}}</span>
                    <a class="plus click" v-on:click="increment($event)"></a>
                </div>`,
    props: {
        dishNumber: {type: Number, default: 0}
    },
    data: function () {
        return {
            count: 0
        }
    },
    created: function () {
        this.count = this.dishNumber;
    },
    methods: {
        increment: function (event) {
            event.preventDefault();
            this.count++;
            this.$dispatch('incrementClick');
        },
        decrement: function (event) {
            event.preventDefault();
            this.count--;
            this.$dispatch('decrementClick');
        }
    }
});