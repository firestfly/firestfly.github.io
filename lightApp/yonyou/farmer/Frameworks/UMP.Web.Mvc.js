//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

(function (window, undefined) {
    var UM = function (json, events, context) {
        if (!(this instanceof UM)) {
            return new UM(json, events, context);
        }
        this.CurrentModel = new UMP.Web.Mvc.Model();
        this.CurrentJControlInfo = {};
        this.CurrentJControlInfo2 = {};
        this.CurrentController = null;
        this.jcontrols = {};
        this.context = context || document;
        this.userEvents = events || [];
        this.json = json || {};
        this.init();
    }

    var curUM;

    UM.prototype = {
        init: function () {
            var i;
            var __userEvents = this.userEvents;
            //var __events = ["onBeforeInit","onInit","onBeforeLoad","onLoad","onBeforeBinding","onBinding","onAfterBinding"];
            var __userEvent;
            var ctx = this.CurrentModel;
            var that = this;
            window.curUM = this;
            window.currentModel = ctx;
            $page.on('onInit', function () {
                __userEvent = __userEvents['onBeforeInit'];
                __userEvent && __userEvent();
                that.initJControlInfo();
                that.initJControl();
                $page.trigger('onLoad');
            });

            $page.on('onLoad', function () {
                __userEvent = __userEvents['onBeforeLoad'];
                __userEvent && __userEvent();
                that.loadModel(ctx, that.json);
                that.initController();
                $page.trigger('onBinding');
            });

            $page.on('onBinding', function () {
                __userEvent = __userEvents['onBeforeBinding'];
                __userEvent && __userEvent();
                that.dataBind(ctx, that.CurrentJControlInfo);
                __userEvent = __userEvents['onAfterBinding'];
                __userEvent && __userEvent();
            });

            $page.trigger('onInit');
        },
        model: function (fullName) {
            if (fullName == undefined) {
                return this.CurrentModel;
            }
            var pathArray = fullName.split(".");
            var curModel = this.CurrentModel;
            for (var i = 0, len = pathArray.length; i < len; i++) {
                curModel = curModel.get(pathArray[i]);
            }
            return curModel;
        },
        view: function (id) {
            return $("#" + id);
        }
    };

    //-------------------------------------------------------- CRUD Load------------------------------------------------------- Begin
    //$面向开发人员  _$面向平台内部

    UM.prototype.initJControlInfo = function () {
        var context = this.context;
        var curJControlInfo = this.CurrentJControlInfo;
        var curJControlInfo2 = this.CurrentJControlInfo2;
        $(context).find("[data-um-bindfield],[data-um-jControl]").each(function () {
            var bd = {};
            var cid = this.getAttribute("id");
            var category = ''; //控件类别
            var bindfield = this.getAttribute("data-um-bindfield") || '';
            if (bindfield) {
                category = this.nodeName.toLowerCase();
                curJControlInfo2[bindfield] = curJControlInfo2[bindfield] || [];
                curJControlInfo2[bindfield].push(cid);
            }
            if (category == 'input' && this.type == 'checkbox') {
                category = this.type.toLowerCase();
            }
            category = (this.getAttribute('data-um-jControl') || category).toLowerCase();
            /*if (curBindingInfo2[bindfield] == null)
             curBindingInfo2[bindfield] = [];
             curBindingInfo2[bindfield].push(cid);

             var bindfieldext = $(this).attr("data-bindfield-ext");*/
            //data-bindfield-ext="{{'background':'a.b.c.xxx'},{'width':'a.b.c.yyy'}}"
            if (cid && category) {
                curJControlInfo[cid] = {};
                curJControlInfo[cid]["data-um-jcontrol"] = category;
                bd = {"bindfield": bindfield};

                if (bindfield == '') {
                    return;
                } else if (bindfield.indexOf(".") < 0) {
                    bd["field"] = bindfield;
                    bd["model"] = null;
                } else {
                    var paths = bindfield.split(".");
                    bd["field"] = paths[paths.length - 1];
                    bd["model"] = bindfield.substring(0, bindfield.lastIndexOf("."))
                }

                curJControlInfo[cid]["data-um-bindfield"] = bd;

                //curBindingInfo[cid]["data-bindfield-ext"] = $stringToJSON(bindfieldext);
            } else {
                ////if(console != null)
                //console.log("initBindingInfo...该控件没有指定id,该控件html为"+this.outerHTML);
            }
        });
    }

    UM.prototype.initJControl = function () {
        var curJControlInfo = this.CurrentJControlInfo;
        var elem;
        var category;
        for (var i in curJControlInfo) {
            if (curJControlInfo.hasOwnProperty(i)) {
                elem = document.querySelector("#" + i);
                category = curJControlInfo[i]['data-um-jcontrol'];
                switch (category) {
                    case 'select':
                        this.jcontrols[i] = new UMP.Web.UI.Select(elem);
                        break;
                    case 'textarea':
                    case 'input':
                        this.jcontrols[i] = new UMP.Web.UI.Input(elem);
                        break;
                    case 'img':
                        this.jcontrols[i] = new UMP.Web.UI.Img(elem);
                        break;
                    case 'checkbox':
                        this.jcontrols[i] = new UMP.Web.UI.Checkbox(elem);
                        break;
                    case 'radioset':
                        this.jcontrols[i] = new UMP.Web.UI.RadioSet(elem);
                        break;
                    case 'list':
                        this.jcontrols[i] = new UMP.Web.UI.List(elem);
                        break;
                    case 'label':
                    default:
                        this.jcontrols[i] = new UMP.Web.UI.Label(elem);
                }
            }
        }
    }

    UM.prototype.initController = function () {
        this.CurrentController = new UMP.Web.Mvc.Controller(this.CurrentJControlInfo, this.CurrentJControlInfo2);
    }

    UM.prototype.unload = function (ctx) {//相当于数据卸载过程--------->unload
        return ctx.toJSON();
    }
    UM.prototype.loadCollection = function (ctxN, jsonArray) {
        if (!$isJSONArray(jsonArray)) {
            $alert("UM.loadCollection()中的jsonArray参数不是一个有效的JSONArray");
            return;
        }
        for (var i = 0, len = jsonArray.length; i < len; i++) {
            var ctx1 = new UMP.Web.Mvc.Model();
            this.loadModel(ctx1, jsonArray[i]);
            ctxN.add(ctx1);
        }
    }
    UM.prototype.loadModel = function (ctx, json) {
        if (!json)
            return;
        for (var key in json) {
            if ($isJSONObject(json[key])) {
                var mid = "";
                if (ctx.id() == null || ctx.id() == "") {
                    mid = key;
                } else {
                    mid = ctx.id() + "." + key;
                }
                var ctx1 = new UMP.Web.Mvc.Model(mid);
                this.loadModel(ctx1, json[key]);
                ctx.add(key, ctx1);
            } else if ($isJSONArray(json[key])) {
                var mid = "";
                if (ctx.id() == null || ctx.id() == "") {
                    mid = key;
                } else {
                    mid = ctx.id() + "." + key;
                }
                var ctxN = new UMP.Web.Mvc.Collection(mid);
                this.loadCollection(ctxN, json[key]);
                ctx.add(key, ctxN);
            } else {
                ctx.add(key, json[key]);
            }
        }
    }
    UM.prototype.dataBind = function (ctx, curJControlInfo) {//相当于数据加载过程------->load
        var dbinfo = {};
        var field = '';
        var val = '';
        var category;
        for (var cid in curJControlInfo) {
            if (!$view(cid)) continue;
            dbinfo = curJControlInfo[cid]["data-um-bindfield"];
            field = dbinfo ? dbinfo["bindfield"] : '';
            if (field == '') {
                continue;
            } else if (field.indexOf(".") < 0) {
                val = ctx.get(field);
            } else {
                var paths = field.split(".");
                var curM = ctx;
                for (var i = 0, len = paths.length - 1; i < len; i++) {
                    curM = curM.get(paths[i]);
                }
                val = curM.get(paths[paths.length - 1]);
            }
            category = curJControlInfo[cid]["data-um-jcontrol"];
            if (category !== 'list') {
                $view(cid).set_value(val, true);
            } else {
                $view(cid).set_datasource();
            }
            /*            var dbinfo = curJControlInfo[cid]["data-um-bindfield"];
             var field = dbinfo["bindfield"];
             var element = $("#" + cid);
             //jquery对象
             var elem = element[0];
             var id = elem.id;
             //dom对象
             var category = (elem.getAttribute('data-um-jControl') || elem.nodeName).toLowerCase();
             //控件类别;
             var val = '';
             var options;
             var radios;
             var initUI = function () {
             switch (category) {
             case 'input':
             case 'textarea':
             elem.value = val;
             break;
             case 'select':
             ( options = element.find('option[value=' + val + ']')).length ? options[0].selected = true : alert('id为' + id + 'select控件在初始绑定值时找不到value为' + val + '的option!');
             break;
             case 'checkbox':
             elem.checked = val;
             break;
             case 'radioset':
             ( radios = element.find('input[type=radio][value=' + val + ']')).length ? radios[0].checked = true : alert('id为' + id + '的RadioSet的控件在初始绑定值时找不到value为' + val + '的单选框!');
             break;
             case 'list':
             break;
             case 'label':
             default:
             elem.innerHTML = val;
             }
             };
             if (category == 'input' && (elem.type == 'radio' || elem.type == 'checkbox')) {
             category = elem.type;
             //如果是元素是单选框或是复选框，那么category代表的就不是input了，而是input的type类型;
             }

             if (field.indexOf(".") < 0) {
             val = ctx.get(field);
             } else {
             var paths = field.split(".");
             var curM = ctx;
             for (var i = 0, len = paths.length - 1; i < len; i++) {
             curM = curM.get(paths[i]);
             }
             val = curM.get(paths[paths.length - 1]);
             }
             initUI();*/
        }
    }
    window.UM = UM;
})(window);
//Public Global Variable
CurrentModel = function () {
}
//Public Global Method
$view = function (id) {
    return curUM.jcontrols[id];
}
$model = function (fullName) {
    return curUM.model(fullName);
}
$page = new UMP.Web.Page();