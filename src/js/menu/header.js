/**
 * Created by lawrence on 6/18/16.
 */
var header = Vue.component('menu-header', {
    template: `<div class="top-bar">
        <span class="left">{{ shopName }}</span>
        <span>
        <i class="btn btn-search" v-on:click.prevent="search()"></i>
        <i class="btn btn-order"></i>
        </span>
        </div>`,
    props: {
        shopName: {
            type: String,
            default: '',
            required: true
        }
    },
    methods: {
        search: function () {
            this.$dispatch('showSearchView');
        }
    }
});