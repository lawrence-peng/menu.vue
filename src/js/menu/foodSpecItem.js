/**
 * Created by lawrence on 6/23/16.
 */
var foodSpecItem = Vue.component('spec-item', {
    template: `<li>
        <div class="foodDetail-title">{{title}}</div>
        <div class="foodDetailList">
            <template v-for="item in items">
                <div class="w30" :class="{'cur':selected===item }" v-on:click="specClick($index,item)">{{item.unitName || item.tasteName}}{{item.price?'：¥'+item.price:''}}</div>
            </template>
        </div>
    </li>`,
    props: {
        title: {
            type: String
        },
        items: {
            type: Array,
            default: []
        }
    },
    data: function () {
        return {
            selectedItem: null
        }
    },
    ready: function () {
        this.$watch('items', function (val) {
            this.selectedItem = null;
            this.specClick(0);
        });
        this.specClick(0);
    },
    computed: {
        selected: function () {
            return this.selectedItem || this.items[0];
        }
    },
    methods: {
        specClick: function (idx, item) {
            if (this.selectedItem === item)return;
            this.selectedItem = this.items[idx];
            this.$dispatch('specChanged', {group: this.title, item: this.selectedItem});
        }
    }
});