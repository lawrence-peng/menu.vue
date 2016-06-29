/**
 * Created by lawrence on 6/18/16.
 */

(function (window, Vue, $) {
    var app = {};
    var rootUrl = 'http://localhost:3000';
    var storage = {
        setStorage: function (args) {
            if (!window.localStorage || !window.sessionStorage) return;
            if ("local" == args.type) {
                for (var i in args.data) {
                    try {
                        localStorage.setItem(i, JSON.stringify(args.data[i]))
                    } catch (e) {
                        for (var k in localStorage) {
                            if (/menu_\d+.*/.test(k)) {
                                localStorage.removeItem(k)
                            }
                        }
                        localStorage.setItem(i, JSON.stringify(args.data[i]))
                    }
                }
            } else {
                for (var i in args.data) {
                    sessionStorage.setItem(i, JSON.stringify(args.data[i]))
                }
            }
        },
        getStorage: function (key, type) {
            if (!window.localStorage || !window.sessionStorage) return null;
            if ("local" == type || !type) {
                if (localStorage.getItem(key)) {
                    try {
                        return JSON.parse(localStorage.getItem(key))
                    } catch (e) {
                        return localStorage.getItem(key)
                    }
                } else {
                    return null
                }
            } else {
                if ("session" == type) {
                    if (sessionStorage.getItem(key)) {
                        try {
                            return JSON.parse(sessionStorage.getItem(key))
                        } catch (e) {
                            return sessionStorage.getItem(key)
                        }
                    } else {
                        return null
                    }
                }
            }
        },
        removeStorage: function (key) {
            if (!window.localStorage || !window.sessionStorage) return;
            localStorage.removeItem(key);
            sessionStorage.removeItem(key)
        }
    };
    var cookie = function (name, value, options) {
        if (typeof value != 'undefined') {
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = $.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };

    window.shopID = cookie('shopID') || '122';
    window.shopName = cookie('shopName') || '沙县大国际';
    window.tableID = cookie('tableID');
    window.tableName = cookie('tableName');

    window.sid = cookie('sid') || '11hw080vt7k3f5f0axe13vopetest';
    window.currentMenuVersion = cookie('menuVersion');

    var menuKey = "menu_" + shopID;
    var menuDetailKey = "detail_" + shopID;
    var cartKey = 'cart_' + shopID;
    var cartData = storage.getStorage(cartKey, 'session') || {
            total: 0,
            totalPrice: 0,
            shopID: shopID,
            tableID: tableID,
            shopName: tableName,
            detailList: []
        };

    app.createComponent = function (menu) {
        new Vue({
            el: '#app',
            data: {
                currentView: 'menuView',
                showCartbox: false,
                showSearchbox: false,
                cartData: cartData,
                shopData: menu
            },
            computed: {
                categoryMenuList: function () {
                    return this.shopData.categoryMenuList || [];
                },
                foods: function () {
                    var list = [];
                    for (var i = 0, len = this.categoryMenuList.length; i < len; i++) {
                        var item = this.categoryMenuList[i];
                        for (var j = 0, count = item.dishList.length; j < count; j++) {
                            list.push(item.dishList[j]);
                        }
                    }
                    return list;
                },
                shopName: function () {
                    return this.shopData.shopName;
                }
            },
            methods: {
                getCartItem: function (id) {
                    for (var i = 0, len = this.cartData.detailList.length; i < len; i++) {
                        var item = this.cartData.detailList[i];
                        if (item.__id === id) {
                            item.__idx = i;
                            return item;
                        }
                    }
                    return null;
                },
                saveCart: function (data) {
                    var item = this.getCartItem(data.__id);
                    if (item) {
                        item.dishNumber += data.num;
                        item.finalPrice += data.money;
                        if (item.dishNumber === 0) {
                            this.cartData.detailList.splice(item.__idx, 1);
                        }
                    } else {
                        item = {
                            __id: data.__id,
                            dishTypeID: data.dishTypeID,
                            dishID: data.dishID,
                            dishName: data.dishName,
                            price: data.price,
                            dishNumber: data.num,
                            finalPrice: data.money
                        };
                        this.cartData.detailList.push(item);
                    }
                    this.syncStorage();
                },
                syncStorage: function () {
                    var data = {};
                    shopID = shopID || this.shopID;
                    data['cart_' + shopID] = this.cartData;
                    storage.setStorage({
                        data: data,
                        type: "session"
                    });
                }
            },
            events: {
                toggleView: function (viewName, data) {
                    if (viewName === 'detailView') {
                        this.$broadcast('showDetail', function (sender) {
                            var detailObj = storage.getStorage(menuDetailKey, 'local');
                            if (detailObj && detailObj.menuVersion === currentMenuVersion && detailObj[data.dishID]) {
                                sender.$set('food', detailObj[data.dishID]);
                                return;
                            }
                            $.getJSON(rootUrl + '/data/detail-'+data.dishID+'.json', function (remoteData) {
                                if (remoteData.code == 1) {
                                    var menu = remoteData.data;
                                    detailObj = detailObj || {};
                                    detailObj.menuVersion = currentMenuVersion;
                                    detailObj[data.dishID] = menu;
                                    var cachaData = {};
                                    cachaData[menuDetailKey] = detailObj;

                                    storage.setStorage({
                                        type: 'local',
                                        data: cachaData
                                    });
                                    sender.$set('food', menu);
                                }
                                else {
                                    console.error(remoteData.message);
                                }
                            });
                        });
                    }
                    this.currentView = viewName;
                },
                showSearchView: function (data) {
                    this.showSearchbox = !this.showSearchbox;
                    this.$broadcast('switchSearch', this.showSearchbox, data);
                },
                switchShowCart: function (flag) {
                    this.showCartbox = !this.showCartbox;
                },
                cartDataChange: function (data) {
                    this.cartData.total += data.num;
                    this.cartData.totalPrice += data.money;
                    this.saveCart(data);
                    this.$broadcast('cartChange', data);
                    if (this.cartData.detailList.length === 0) {
                        this.showCartbox = false;
                    }
                }
            }
        });
    };

    var menu = storage.getStorage(menuKey, 'local');
    if (menu && menu.menuVersion === currentMenuVersion) {
        app.createComponent(menu);
        $('#app').gfxPopIn({
            scale: ".8"
        });
        return;
    }
    $.getJSON(rootUrl + '/data/menu.json', function (remoteData) {
        if (remoteData.code == 1) {
            var records = remoteData.data;
            menu = {};
            menu.categoryMenuList = records || [];
            menu.title = tableName;
            menu.shopID = shopID;
            menu.shopName = shopName;
            menu.menuVersion = currentMenuVersion;
            var data = {};
            data[menuKey] = menu;

            storage.setStorage({
                type: 'local',
                data: data
            });

            app.createComponent(menu);
        }
        else {
            console.error('getShopDish', remoteData.message);
        }
    });
})(window, Vue, $);
