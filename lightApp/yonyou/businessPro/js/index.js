var app = angular.module("business", []);
app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/categories", {templateUrl: "tpl/categories.html", controller: "CategoriesCtrl"})
        .when("/category/:category_id", {templateUrl: "tpl/category.html", controller: "CategoryCtrl"})
        .when("/item/:item_id", {templateUrl: "tpl/item.html", controller: "ItemCtrl"})
        .when("/store/:store_id", {templateUrl: "tpl/store.html", controller: "StoreCtrl"})
        .otherwise({redirectTo: '/categories'});
}])

app.factory('UModal', function () {
    function _UModal() {
        var that = this;
        var title = window.location.host || "来自外星的对话";
        this.defaultOptions = {
            title: title,
            text: "觉得咋样？",
            btnText: ["确定", "取消"],
            cancle: function () {
            },
            ok: function (data) {
            }
        }
        this._modal = '';
    }

    _UModal.countWindow = 0;
    _UModal.prototype.modal = function (type, options) {
        _UModal.countWindow++;
        var overlay = $('<div class="overlay"></div>');
        var _opt = $.extend(this.defaultOptions);
        var that = this;
        if (!!options) {
            _opt = $.extend(_opt, options);
        }
        var isStr = options.constructor === String;
        var html = '<div class="um-modal"><div class="um-modal-content"><div class="um-modal-title">' +
            (isStr ? "" : _opt.title) + '</div><div class="um-modal-text">' +
            (isStr ? options : _opt.text) + '</div>';
        if (type === "prompt") {
            html += '<div class="um-modal-input">' +
                '<input type="text" class="form-control"></div>';
        }
        if (type === "login") {
            html += '<div class="um-modal-input">' +
                '<input type="text" class="form-control">' +
                '<input type="text" class="form-control"></div>';
        }
        html += '</div><div class="um-modal-btns">';
        if (type === "confirm" || type === "login") {
            html += '<a href="##" class="btn cancle">' + _opt.btnText[1] + '</a>';
        }

        html += '<a href="##" class="btn ok">' + _opt.btnText[0] +
            '</a></div></div>';

        var overlay = overlay.appendTo($("body"));
        this._modal = $(html).appendTo($("body"));
        var modalH = this._modal.outerHeight(),
            wh = window.innerHeight;
        this._modal.css("top", (wh - modalH - 20) / 2)
        setTimeout(function () {
            that._modal.addClass("um-modal-in");
        }, 0);

        this._modal.on("click", ".btn", function (e) {
            e.preventDefault();
            if ($(this).hasClass("cancle")) {
                _opt.cancle();
            }
            if ($(this).hasClass("ok")) {
                var input = that._modal.find(".form-control"), inputLen = input.length, data;
                if (inputLen > 0) {
                    if (inputLen == 1) data = that._modal.find(".form-control").val();
                    else {
                        data = [];
                        $.each(input, function () {
                            data.push(this.value);
                        })
                    }
                }
                _opt.ok(data);
            }

            that._modal.removeClass("um-modal-in").addClass("um-modal-out");

            that._modal.on("webkitTransitionEnd transitionEnd", function () {
                that._modal.removeClass("um-modal-out");
                that._modal.remove();
                _UModal.countWindow--;
            })
            // 避免遮罩闪烁
            if (_UModal.countWindow > 0) {
                overlay.remove();
            }
            return false;
        })
    }
    _UModal.prototype.alert = function (options) {
        this.modal("alert", options || this.defaultOptions);
    }
    _UModal.prototype.confirm = function (options) {
        this.modal("confirm", options || this.defaultOptions);
    }
    _UModal.prototype.prompt = function (options) {
        this.modal("prompt", options || this.defaultOptions);
    }
    _UModal.prototype.login = function (options) {
        this.modal("login", options || this.defaultOptions);
    };

    return {
        createModal: function () {
            return new _UModal();
        }
    }
});

app.controller("CategoriesCtrl", function ($scope, $http) {
    $http.get('http://uapma.yonyou.com:8443/weixin/mobile/mobile_menu.json', {}).success(function (data) {
        $scope.categoryData = data.data;
    });
    $scope.curSelectedIndex = 0;
    $scope.select = function (index) {
        $scope.curSelectedIndex = index;
    };
    var resizeMenusHeight = function () {
            $('.left-list,.right-list').height($(window).height() - 140);
        },
        initMenusHeight = function () {
            $('.left-list,.right-list').height($(window).height() - 110);
        };

    $(window).resize(resizeMenusHeight);
    initMenusHeight();
})
    .controller("CategoryCtrl", function ($scope, $http) {

        $http.get('http://uapma.yonyou.com:8443/weixin/mobile/mobile_cgoods.json', {}).success(function (data) {
            $scope.productsData = data.data;
        });

        $scope.curOrderIndex = 0;
        $scope.orders = [{name: '销量', ifdec: true, field: 'total_sold', sortField: 'total_sold'}, {
            name: '价格',
            ifdec: true,
            field: 'priceEnd',
            sortField: 'priceEnd'
        }, {name: '运费', ifdec: true, field: 'fastPostFee', sortField: 'fastPostFee'}];
        $scope.changeOrder = function (index) {
            var order = $scope.orders[index];
            order.ifdec = !(order.ifdec);
            order.sortField = order.ifdec > 0 ? order.field : ('-' + order.field);
            $scope.curOrderIndex = index;
            $scope.sortField = order.sortField;
        };
    })
    .controller("ItemCtrl", function ($scope, $http, $window, $routeParams, UModal) {
        console.log(UModal);
        var item_id = $routeParams['item_id'];
        var url = 'http://uapma.yonyou.com:8443/weixin/mobile/mobile_goods' + item_id + '.json';
        $http.get(url, {}).success(function (data) {
            $scope.itemData = data.data;
        });
        $scope.addItemTimes = 0;
        $scope.itemNum = 1;
        $scope.reduceNum = function () {
            if ($scope.itemNum <= 0) return;
            $scope.itemNum--;
        };
        $scope.addNum = function () {
            $scope.itemNum++;
        };
        $scope.back = function () {
            $window.history.go(-1);
        };
        $scope.addItem = function () {
            var goods = JSON.parse(localStorage.getItem('goods'));
            var ifUnique = true;
            goods = goods || [];
            $scope.itemData.buyNum = $scope.itemNum || 0;
            if ($scope.itemData.buyNum > 0) {
                angular.isArray(goods) && goods.length && goods.forEach(function (good) {
                    if (good.item_id == $scope.itemData.item_id) {
                        good.buyNum += $scope.itemData.buyNum;
                        ifUnique = false;
                        return false;
                    }
                });
                ifUnique && (goods.push($scope.itemData));
                localStorage['goods'] = JSON.stringify(goods);
            }
        }
        $scope.buyNow = function () {
            $scope.addItem();
            $window.location.href = "shopcar.html";
        };
        $scope.addToShopcar = function () {
            $scope.addItem();
            var successModal = UModal.createModal();
            successModal.alert('该物品成功加入购物车！');
            setTimeout(function () {
                successModal._modal.find('.btn.ok').trigger('click');
            }, 2500);


        };
    })
    .controller("StoreCtrl", function ($scope, $http, $window, $routeParams) {
        var store_id = $routeParams['store_id'];
        var url = 'http://uapma.yonyou.com:8443/weixin/mobile/mobile_storeInfo.json';
        $http.get(url, {}).success(function (data) {
            $scope.storeInfo = data.data;
        });

        $scope.back = function () {
            $window.history.go(-1);
        };
    });


