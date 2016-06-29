/**
 * Created by lawrence on 6/22/16.
 */
Vue.filter('getImage', function (val) {
    var url = 'http://7xoxig.com1.z0.glb.clouddn.com/';
    if (val) {
        url += val.split('/')[4];
    } else {
        url += 'no.jpg';
    }
    return `<li  style="background: url(${url}) center center no-repeat;  -webkit-background-size: cover;-moz-background-size: cover;  -o-background-size: cover;  background-size: cover;"></li>`
});
Vue.component('foodimg-slide', {
    template: `<div class="f-img">
            <div id="js-slide" class="swipe" >
                <ul class="swipe-wrap">
                    {{{defaultImage}}}
                    <template v-for="imgurl in food.imageList">
                        {{{imgurl |getImage}}}
                    </template>
                </ul>
                <div class="swipe-pagination" id="js-bullet">
                    <template v-for="imgurl in food.imageList">
                        <span class="swipe-pagination-bullet js-bullet" :class="{ 'current':$index===0}"></span>
                    </template>
                </div>
            </div>
        </div>`,
    props: {
        food: {
            type: Object,
            default: {},
            required: true
        }
    },
    computed: {
        defaultImage: function () {
            return this.getImage(this.food.defaultImageUrl);
        }
    },
    methods: {
        getImage: function (val) {
            var url = 'http://7xoxig.com1.z0.glb.clouddn.com/';
            if (val) {
                url += val.split('/')[4];
            } else {
                url += 'no.jpg';
            }
            return `<li  style="background: url(${url}) center center no-repeat;  -webkit-background-size: cover;-moz-background-size: cover;  -o-background-size: cover;  background-size: cover;"></li>`
        }
    }
});