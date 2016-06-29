/**
 * Created by lawrence on 6/22/16.
 */
Vue.component('food-spec', {
    template: `<div class="foodags">
        <ul>
            <template v-for="item in specs">
                <spec-item v-ref:specItem :items="item" :title="$key"></spec-item>
            </template>
        </ul>
    </div>`,
    props: {
        specs: {
            type: Object,
            default: {}
        }
    },
    data: function () {
        return {priceObject: {}}
    },
    events: {
        specChanged: function (data) {
            this.priceObject[data.group] = data.item;
            var val = 0, str = '', specText = '';
            for (var key in this.priceObject) {
                var obj = this.priceObject[key];
                val += obj.price || obj.risePrice;

                switch (key) {
                    case '规格':
                        data['dishUnitID'] = obj.dishUnitID;
                        str += obj.unitName + obj.dishUnitID.toString();
                        if (specText) {
                            specText += '+';
                        }
                        specText += obj.unitName;
                        break;
                    case '口味':
                        data['tasteID'] = obj.dishTasteID;
                        str += obj.tasteName + obj.dishTasteID.toString();
                        if (specText) {
                            specText += '+';
                        }
                        specText += obj.tasteName;
                        break;
                }
            }
            data.specText = specText;
            data.selectedSpecPrice = val;
            data.selectedSpecKey = data.item.dishID + str;
            return true;
        }
    }
});