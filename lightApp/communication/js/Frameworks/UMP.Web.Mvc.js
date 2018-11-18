//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com 
//-----------------------------------------------------------------------
Type.registerNamespace('UMP.Web');
UMP.Web.EventMgr = function UMP$Web$EventMgr() {
    this._events = {};
    /*
     this._events = {
     "oninit" :[function(){},function(){}],
     "onload" :[function(){},function(){}]
     }
     */
}

function UMP$Web$EventMgr$on(evtName, handler) {
    if (typeof evtName == "undefined") {
        alert("没有指定事件名");
    }
    if (!$isFunction(handler)) {
        alert("请指定" + evtName + "的function");
    }
    if (this._events[evtName] == null) {
        this._events[evtName] = [];
    }
    this._events[evtName].push(handler);
}

function UMP$Web$EventMgr$off(evtName, handler) {
    var handlers = this._events[evtName];
    if (typeof handler == "undefined") {
        delete handlers;
    } else {
        var index = -1;
        for (var i = 0, len = handlers.length; i < len; i++) {
            if (handler == handlers[i]) {
                index = i;
                break;
            }
        }
        if (index > 0)
            handlers.remove(index);
    }
}

function UMP$Web$EventMgr$trigger(evtName, sender, args) {
    var handlers = this._events[evtName] || [];
    var handler;
    var len = handlers.length;
    var i = 0;
    args = args || {};
    for (; i < len; i++) {
        handler = handlers[i];
        if ($isFunction(handler)) {
            args["evtName"] = evtName;
            handler(sender, args);
        } else {
            alert("触发" + evtName + "时，不是有效的function");
        }
    }
}

UMP.Web.EventMgr.prototype = {
    on: UMP$Web$EventMgr$on,
    off: UMP$Web$EventMgr$off,
    trigger: UMP$Web$EventMgr$trigger
};
UMP.Web.EventMgr.registerClass('UMP.Web.EventMgr');


UMP.Web.AttrEventMgr = function UMP$Web$AttrEventMgr() {
    this._events = {};
    /*
     this._events = {
     "change" :{
     "value" : function(){},
     "backgroud":function(){}
     },
     "click" :{
     ""function(){},function(){}]
     }
     */
}

function UMP$Web$AttrEventMgr$on(evtName, attrName, handler) {
    if (typeof this._events[evtName] == "undefined")
        this._events[evtName] = {};

    if (!this._events[evtName][attrName]) {
        this._events[evtName][attrName] = [];
    }

    this._events[evtName][attrName].push(handler);
}

function UMP$Web$AttrEventMgr$trigger(evtName, attrName, sender, args) {
    if (!args) args = {};
    if (typeof this._events[evtName] == "undefined") return;

    if (evtName && attrName !== undefined) {
        var handlers = this._events[evtName][attrName] || [];
        var len = handlers && handlers.length;
        var handler;
        if (!len) return;
        for (var i = 0; i < len; i++) {
            handler = handlers[i];
            if ($isFunction(handler)) {
                args["evtName"] = evtName;
                args["attrName"] = attrName;
                handler(sender, args);
            } else {
                alert("触发[" + evtName + ":" + attrName + "]时，不是一个有效的function");
            }
        }
    } else if (evtName) {
        var attrs = this._events[evtName];
        for (attr in attrs) {
            var handlers = this._events[evtName][attr];
            for (var i = 0, len = handlers.length; i < len; i++) {
                var handler = handlers[i];
                if ($isFunction(handler)) {
                    args["evtName"] = evtName;
                    args["attrName"] = attr;
                    handler(sender, args);
                }
            }
        }
    }
}

UMP.Web.AttrEventMgr.prototype = {
    on: UMP$Web$AttrEventMgr$on,
    trigger: UMP$Web$AttrEventMgr$trigger
};
UMP.Web.AttrEventMgr.registerClass('UMP.Web.AttrEventMgr');
//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.Page | UMP.Web.EventMgr 
// Author gct@yonyou.com 
//-----------------------------------------------------------------------
Type.registerNamespace('UMP.Web');
UMP.Web.Page = function UMP$Web$Page() {
    this._events = new UMP.Web.EventMgr();
    /*
    this._events = {
        "oninit" :[function(){},function(){}],
        "onload" :[function(){},function(){}]
    }
    */
}

function UMP$Web$Page$onInit() {
    this.trigger("onInit");
}

function UMP$Web$Page$onLoad() {
    this.trigger("onLoad");
}

function UMP$Web$Page$beforeBinding() {
    this.trigger("beforeBinding");
}

function UMP$Web$Page$afterBinding() {
    this.trigger("afterBinding");
}

function UMP$Web$Page$on(evtName, handler) {
    this._events.on(evtName, handler);
}

function UMP$Web$Page$off(evtName, handler) {
    this._events.off(evtName, handler);
}

function UMP$Web$Page$trigger(evtName) {
    this._events.trigger(evtName);
}

UMP.Web.Page.prototype = {
    onInit: UMP$Web$Page$onInit,
    onLoad: UMP$Web$Page$onLoad,
    beforeBinding: UMP$Web$Page$beforeBinding,
    afterBinding: UMP$Web$Page$afterBinding,
    on: UMP$Web$Page$on,
    off: UMP$Web$Page$off,
    trigger: UMP$Web$Page$trigger
};
UMP.Web.Page.registerClass('UMP.Web.Page');

//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.Mvc.Model | UMP.Web.Event
// Author gct@yonyou.com
//-----------------------------------------------------------------------
Type.registerNamespace('UMP.Web.Mvc');
UMP.Web.Mvc.Model = function UMP$Web$Mvc$Model(id) {
    this._id = id == null ? "" : id;
    this._type = "UMP.Web.Mvc.Model";
    this._fields = {};
    this._events = new UMP.Web.EventMgr();
    this._attrEvents = new UMP.Web.AttrEventMgr();
    /*
     this._events = {
     fielda : [function(){} , function(){}, function(){}],
     fieldb: [function(){} , function(){}, function(){}],
     fieldc : [function(){} , function(){}, function(){}]
     }
     */
}

//Public Method
function UMP$Web$Mvc$Model$id() {
    return this._id;
}

function UMP$Web$Mvc$Model$getType() {
    return this._type;
}

function UMP$Web$Mvc$Model$set(fieldName, val, silent) {
    var oldValue = this._fields[fieldName];
    if (val != oldValue) {
        this._fields[fieldName] = val;
        if (!silent) {
            var args = {
                "onchange": "onchange",
                "oldValue": oldValue,
                "value": this._fields[fieldName]
            }
            this.trigger("change", fieldName, args);
        }
    }
}

function UMP$Web$Mvc$Model$get(fieldName) {
    return this._fields[fieldName];
}

function UMP$Web$Mvc$Model$add(key, val) {
    this._fields[key] = val;
}

function UMP$Web$Mvc$Model$fields() {
    return this._fields;
}

function UMP$Web$Mvc$Model$toJSON() {
    var result = {};
    for (var key in this._fields) {
        if (this._fields[key].getType && (this._fields[key].getType() == "UMP.Web.Mvc.Model" || this._fields[key].getType() == "UMP.Web.Mvc.Collection")) {
            var json = this._fields[key].toJSON();
            result[key] = json;
        } else {
            result[key] = this._fields[key];
        }
    }
    return result;
}

function UMP$Web$Mvc$Model$on(evtName, fieldName, handler) {
    if (typeof handler == "undefined" && $isFunction(fieldName)) {
        //没有指定fieldName，表示整个Model的事件
        this._events.on(evtName, fieldName);
    } else {
        this._attrEvents.on(evtName, fieldName, handler);
    }
}

function UMP$Web$Mvc$Model$trigger(evtName, fieldName, args) {
    if (!args) args = {};
    if (typeof fieldName == "undefined") {
        //没有指定fieldName，表示整个Model的事件
        this._events.trigger(evtName, this, args);
    } else {
        args["fieldName"] = fieldName;
        args["data-um-bindfield"] = (this.id() != null && this.id() != "") ? this.id() + "." + fieldName : fieldName;
        this._attrEvents.trigger(evtName, fieldName, this, args);
    }
}

UMP.Web.Mvc.Model.prototype = {
    id: UMP$Web$Mvc$Model$id,
    getType: UMP$Web$Mvc$Model$getType,
    get: UMP$Web$Mvc$Model$get,
    set: UMP$Web$Mvc$Model$set,
    add: UMP$Web$Mvc$Model$add,
    fields: UMP$Web$Mvc$Model$fields,
    toJSON: UMP$Web$Mvc$Model$toJSON,
    on: UMP$Web$Mvc$Model$on,
    trigger: UMP$Web$Mvc$Model$trigger
};
UMP.Web.Mvc.Model.registerClass('UMP.Web.Mvc.Model');


UMP.Web.Mvc.Collection = function UMP$Web$Mvc$Collection(id) {
    this._id = id;
    this._rows = [];
    this._type = "UMP.Web.Mvc.Collection";//记录类型
    this._events = new UMP.Web.EventMgr();
    this._attrEvents = new UMP.Web.AttrEventMgr();
    /*
     var _events = {
     rowChange : {
     colName1 : [function(){} , function(){}, function(){}],
     colName2: [function(){} , function(){}, function(){}],
     colName3 : [function(){} , function(){}, function(){}]
     },
     rowClick : {
     value : [function(){} , function(){}, function(){}],
     background: [function(){} , function(){}, function(){}],
     height : [function(){} , function(){}, function(){}]
     },
     event1 : {
     value : [function(){} , function(){}, function(){}],
     background: [function(){} , function(){}, function(){}],
     height : [function(){} , function(){}, function(){}]
     }
     }
     */
}

//Public Method
function UMP$Web$Mvc$Collection$id() {
    return this._id;
}

function UMP$Web$Mvc$Collection$getType() {
    return this._type;
}

function UMP$Web$Mvc$Collection$model(fullName) {
    var paths = fullName.split(".");
    var curModel = null;

    for (var i = 0, len = paths.length; i < len; i++) {
        var path = paths[i];
        curModel = curModel[path];
    }
    return CurrentModel[name];
}

function UMP$Web$Mvc$Collection$get(rowIndex, fieldName) {
    var model = this._rows[rowIndex];
    var val = model.get(fieldName);
    console.log(val);
    return val;
}

function UMP$Web$Mvc$Collection$set(rowIndex, fieldName, fieldValue, silent) {
    var model = this._rows[rowIndex];
    var oldValue = model.get(fieldName);
    if (oldValue == fieldValue)
        return;

    model.set(fieldName, fieldValue, silent);//静默赋值，无需触发change事件,由下面代码触发change事件
    if (!silent) {
        var newValue = model.get(fieldName);
        var args = {
            e: this,
            rowIndex: rowIndex,
            fieldName: fieldName,
            srcValue: fieldValue,
            oldValue: oldValue,
            value: newValue
        };
        this.trigger("rowChange", fieldName, args);
        this.trigger("rowChange", args);
    }
}

function UMP$Web$Mvc$Collection$length() {
    return this._rows.length;
}

function UMP$Web$Mvc$Collection$add(json) {
    //支持add({})
    if (json.getType && json.getType() == "UMP.Web.Mvc.Model") {
        this._rows.push(json);
    } else if ($isJSONObject(json)) {
        var newM = new UMP.Web.Mvc.Model(json);
        this._rows.push(newM);
    }
}

function UMP$Web$Mvc$Collection$rows() {
    return this._rows;
}

function UMP$Web$Mvc$Collection$toJSON() {
    var result = [];
    for (var i = 0, len = this._rows.length; i < len; i++) {
        var md = this._rows[i];
        if (md.getType && md.getType() == "UMP.Web.Mvc.Model") {
            var json = md.toJSON();
            result.push(json);
        } else {
            alert("数组含有不是有效的Model类型");
        }
    }
    return result;
}

function UMP$Web$Mvc$Collection$on(evtName, fieldName, handler) {
    if (typeof handler == "undefined" && $isFunction(fieldName)) {
        this._events.on(evtName, fieldName);
    } else {
        this._attrEvents.on(evtName, fieldName, handler);
    }
}

function UMP$Web$Mvc$Collection$trigger(evtName, fieldName, args) {
    if (typeof args == "undefined") {
        args = fieldName;
        //没有指定fieldName，表示整个Model的事件
        this._events.trigger(evtName, this, args);
    } else {
        this._attrEvents.trigger(evtName, fieldName, this, args);
    }
}

UMP.Web.Mvc.Collection.prototype = {
    id: UMP$Web$Mvc$Collection$id,
    getType: UMP$Web$Mvc$Collection$getType,
    length: UMP$Web$Mvc$Collection$length,
    model: UMP$Web$Mvc$Collection$model,
    get: UMP$Web$Mvc$Collection$get,
    set: UMP$Web$Mvc$Collection$set,
    add: UMP$Web$Mvc$Collection$add,
    rows: UMP$Web$Mvc$Collection$rows,
    toJSON: UMP$Web$Mvc$Collection$toJSON,
    on: UMP$Web$Mvc$Collection$on,
    trigger: UMP$Web$Mvc$Collection$trigger
};
UMP.Web.Mvc.Collection.registerClass('UMP.Web.Mvc.Collection');

//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.Mvc.JControl
// Author gct@yonyou.com
//-----------------------------------------------------------------------

Type.registerNamespace('UMP.Web.Mvc');
UMP.Web.Mvc.JControl = function UMP$Web$Mvc$JControl(element) {
    this._element = element;
    this._attrs = {};
    this._events = new UMP.Web.AttrEventMgr();
    /*
     var __evts = {
     onchange : {
     value : [function(){} , function(){}, function(){}],
     background: [function(){} , function(){}, function(){}],
     height : [function(){} , function(){}, function(){}]
     },
     onvaluechange : {
     value : [function(){} , function(){}, function(){}],
     background: [function(){} , function(){}, function(){}],
     height : [function(){} , function(){}, function(){}]
     },
     event1 : {
     value : [function(){} , function(){}, function(){}],
     background: [function(){} , function(){}, function(){}],
     height : [function(){} , function(){}, function(){}]
     }
     }
     */
}

function UMP$Web$Mvc$JControl$initialize() {

}

//Public Method
function UMP$Web$Mvc$JControl$set(attr, val) {
    var oldValue = this._attrs[attr];
    if (val != oldValue) {
        this._attrs[attr] = val;
        var args = {
            "oldValue": oldValue,
            "value": this._attrs[attr]
        }

        //$(this._element).trigger("change");//子类触发jquery的事件
        //this._element.dispatchEvent
        this.trigger("change", attr, args);
    }
}

function UMP$Web$Mvc$JControl$get(attr) {
    return this._attrs[attr];
}

function UMP$Web$Mvc$JControl$on(evtName, attrName, handler) {
    if (typeof handler == "undefined" && $isFunction(attrName)) {
        //没有指定 attrName，默认value
        handler = attrName;
        attrName = "value";
    }
    this._events.on(evtName, attrName, handler);
}

function UMP$Web$Mvc$JControl$trigger(evtName, attrName, args) {
    this._events.trigger(evtName, attrName, this, args);
}

UMP.Web.Mvc.JControl.prototype = {
    initialize: UMP$Web$Mvc$JControl$initialize,
    set: UMP$Web$Mvc$JControl$set,
    get: UMP$Web$Mvc$JControl$get,
    on: UMP$Web$Mvc$JControl$on,
    trigger: UMP$Web$Mvc$JControl$trigger
};
UMP.Web.Mvc.JControl.registerClass('UMP.Web.Mvc.JControl');
//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

Type.registerNamespace('UMP.Web.UI');
UMP.Web.UI.Input = function UMP$Web$UI$Input(element) {
    UMP.Web.UI.Input.initializeBase(this, [element]);
    this._textbox = element;
    this._id = element.getAttribute('id');
    this.initialize();
}

function UMP$Web$UI$Input$initialize() {
    var path = this._element.getAttribute('data-um-bindfield');
    if (!path) {
        this.modelName = null;
        this.fieldName = null;
    } else if (path.indexOf('.') < 0) {
        this.modelName = null;
        this.fieldName = path;
    } else {
        this.modelName = path.substring(0, path.lastIndexOf("."));
        this.fieldName = path.substring(this.modelName.length + 1);
    }

    UMP.Web.UI.Input.callBaseMethod(this, 'initialize');


    //this._changeHandler = Function.createDelegate(this, this.input_onchange);
    //$addHandler(this._textbox, "change", this._changeHandler);
    //this.on("change",)

    //$(this._textbox).on("change", this.input_onchange);

    /*
     this._onfocusHandler = Function.createDelegate(this, this.input_onfocus);
     $addHandler(this._textbox, "focus", this._onfocusHandler);

     this._onblurHandler = Function.createDelegate(this, this.input_onblur);
     $addHandler(this._textbox, "blur", this._onblurHandler);
     */
}

//Public Method
function UMP$Web$UI$Input$get_value() {
    return this.get("value");
}

function UMP$Web$UI$Input$get_domvalue() {
    var val = '';
    return this._textbox.value;
}

function UMP$Web$UI$Input$set_value(val, silent) {
    var modelName = this.modelName;
    var fieldName = this.fieldName;
    var id = this._element.id;
    if (!fieldName) {
        $alert('id为' + id + '的Input控件由于不存在绑定字段，不存在set_value方法');
        return;
    }
    if (val === undefined) {
        return;
    }
    if (silent) {
        this.set("value", val);
        this._textbox.value = val;
    } else {
        this.set("value", val);
        $model(modelName).set(fieldName, val);
    }
    /*var oldValue = this.get_value();
    if(val != oldValue){
        this.set("value", val);
        this._textbox.value = val;
        var args = {
            "oldValue" : oldValue,
            "value" : val
        }
        debugger;
        //for IE this._element.fireEvent("onchange");
        var evt;
        if (document.createEvent) { // DOM Level 2 standard
            evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("change", true, true, window,       0, 0, 0, 0, 0, false, false, false, false, 0, null);
            this._element.dispatchEvent(evt);
        } else if (this._element.fireEvent) { // IE
            this._element.fireEvent('onclick');
        }
        //this._element.dispatchEvent("change");


        //$(this._element).trigger("change", args);
        //this.firechangeEvent(args);//触发DOM上的onchange
    }*/
}

function UMP$Web$UI$Input$get_attr(attrName) {
    if (attrName && (typeof attrName == 'string')) {
        return this._element.getAttribute(attrName);
    } else {
        console.log('id为' + this._id + '的Input控件的get_attr方法传入的参数不存在或不是字符串!');
    }
}

function UMP$Web$UI$Input$set_attr(attrName, val, silent) {
    if (!attrName || (typeof attrName !== 'string') || (val == undefined)) {
        console.log('id为' + this._id + '的Input控件的set_attr方法传入的参数有误!');
        return;
    }

    if (silent) {
        this._element.setAttribute(attrName, val);
    } else {
        this.set(attrName, val);
        this._element.setAttribute(attrName, val);
    }
}

function UMP$Web$UI$Input$input_onchange() {
    if (this._textbox.value != this.get_value()) {
        var oldValue = this._textbox.value;

        this.set_value(this._textbox.value);


    }
}

function UMP$Web$UI$Input$firechangeEvent(args) {
    args = args || {};
    this.raiseonchange(args);
}

//Event
function UMP$Web$UI$Input$add_onchange(handler) {
    this.get_events().addHandler("onchange", handler);
}

function UMP$Web$UI$Input$remove_onchange(handler) {
    this.get_events().removeHandler("onchange", handler);
}

function UMP$Web$UI$Input$raiseonchange(args) {
    var eh = this.get_events().getHandler("onchange");
    if (eh) {
        eh(this, args);
    }
}

UMP.Web.UI.Input.prototype = {
    initialize: UMP$Web$UI$Input$initialize,
    get_value: UMP$Web$UI$Input$get_value,
    get_domvalue: UMP$Web$UI$Input$get_domvalue,
    set_value: UMP$Web$UI$Input$set_value,
    get_attr: UMP$Web$UI$Input$get_attr,
    set_attr: UMP$Web$UI$Input$set_attr,
    input_onchange: UMP$Web$UI$Input$input_onchange,
    firechangeEvent: UMP$Web$UI$Input$firechangeEvent,
    add_onchange: UMP$Web$UI$Input$add_onchange,
    remove_onchange: UMP$Web$UI$Input$remove_onchange,
    raiseonchange: UMP$Web$UI$Input$raiseonchange
};
UMP.Web.UI.Input.registerClass('UMP.Web.UI.Input', UMP.Web.Mvc.JControl);//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

UMP.Web.UI.Select = function UMP$Web$UI$Select(element) {
    UMP.Web.UI.Select.initializeBase(this, [element]);
    var $elem = $(element);
    this._id = element.getAttribute('id');
    this.options = $elem.find('option');
    this.datasource = eval($elem.attr('data-um-source')) || [];
    //this.datasource = [{value:'北京市东城区东长安街XX号',text:'北京市东城区东长安街XX号'},{value:'北京市海淀区XX街XX院XX号',text:'北京市海淀区XX街XX院XX号'}];
    this.initialize();
}

function UMP$Web$UI$Select$initialize() {
    var path = this._element.getAttribute('data-um-bindfield');
    if (!path) {
        this.modelName = null;
        this.fieldName = null;
    } else if (path.indexOf('.') < 0) {
        this.modelName = null;
        this.fieldName = path;
    } else {
        this.modelName = path.substring(0, path.lastIndexOf("."));
        this.fieldName = path.substring(this.modelName.length + 1);
    }

    if (this.datasource.length && this.options) {
        this.render_options();
    }
    UMP.Web.UI.Select.callBaseMethod(this, 'initialize');

}

function UMP$Web$UI$Select$set_datasource(jsonArray) {
    if ($isJSONArray(jsonArray)) {
        this.datasource = jsonArray;
        this.render_options();
    } else {
        return false;
    }

}

function UMP$Web$UI$Select$renderOptions() {
    var datasource = this.datasource;
    if ($isJSONArray(datasource) && datasource.length) {
        this.options.each(function () {
            var $this = $(this);
            var index = $this.index();
            var jsonItem = datasource[index] || {};
            jsonItem.value ? (this.value = jsonItem['value']) : '';
            jsonItem.text ? (this.textContent = jsonItem['text']) : '';
        });
    } else {
        return false;
    }
}


function UMP$Web$UI$Select$set_value(val, slient) {
    var changed_option = $(this._element).find('option[value=' + val + ']');
    var modelName = this.modelName;
    var fieldName = this.fieldName;
    var id = this._element.id;
    if (!fieldName) {
        $alert('id为' + id + '的Input控件由于不存在绑定字段，不存在set_value方法');
        return;
    }
    var len = changed_option.length;
    if (!len) {
        alert('此控件的OPTION元素不存在此value值!请重新设置');
        return;
    }
    if (val === undefined) {
        return;
    }
    if (slient) {
        this.set("value", val);
        changed_option[0].setAttribute('selected', true);
    } else {
        this.set("value", val);
        $model(modelName).set(fieldName, val);
    }
    /*var oldValue = this.get_value();
    var changed_option;
    var len;
    if (val != oldValue) {
        changed_option = $(this._element).find('option[value=' + val + ']');
        len = changed_option.length;
        if (!len) {
            alert('此控件的OPTION元素不存在此value值!请重新设置');
            return;
        }
        changed_option[0].setAttribute('selected', true);
        this.set("value", val);
        var args = {
            "oldValue" : oldValue,
            "value" : val
        }
        $(this._element).trigger("change", args);
        //this.firechangeEvent(args);//触发DOM上的onchange
    }*/
}

function UMP$Web$UI$Select$get_value() {
    return this.get("value");
}

function UMP$Web$UI$Select$get_domvalue() {
    return this._element.value;
}

function UMP$Web$UI$Select$get_attr(attrName) {
    if (attrName && (typeof attrName == 'string')) {
        return this._element.getAttribute(attrName);
    } else {
        console.log('id为' + this._id + '的Select控件的get_attr方法传入的参数不存在或不是字符串!');
    }
}

function UMP$Web$UI$Select$set_attr(attrName, val, silent) {
    if (!attrName || (typeof attrName !== 'string') || (val == undefined)) {
        console.log('id为' + this._id + '的Select控件的set_attr方法传入的参数有误!');
        return;
    }

    if (silent) {
        this._element.setAttribute(attrName, val);
    } else {
        this.set(attrName, val);
        this._element.setAttribute(attrName, val);
    }
}

UMP.Web.UI.Select.prototype = {
    initialize: UMP$Web$UI$Select$initialize,
    set_datasource: UMP$Web$UI$Select$set_datasource,
    render_options: UMP$Web$UI$Select$renderOptions,
    get_value: UMP$Web$UI$Select$get_value,
    set_value: UMP$Web$UI$Select$set_value,
    get_domvalue: UMP$Web$UI$Select$get_domvalue,
    get_attr: UMP$Web$UI$Select$get_attr,
    set_attr: UMP$Web$UI$Select$set_attr
}
UMP.Web.UI.Select.registerClass('UMP.Web.UI.Select', UMP.Web.Mvc.JControl);//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

UMP.Web.UI.Checkbox = function UMP$Web$UI$SCheckbox(element) {
    UMP.Web.UI.Checkbox.initializeBase(this, [element]);
    this._id = element.getAttribute('id');
    this.initialize();
}

function UMP$Web$UI$Checkbox$initialize() {
    var path = this._element.getAttribute('data-um-bindfield');
    if (!path) {
        this.modelName = null;
        this.fieldName = null;
    } else if (path.indexOf('.') < 0) {
        this.modelName = null;
        this.fieldName = path;
    } else {
        this.modelName = path.substring(0, path.lastIndexOf("."));
        this.fieldName = path.substring(this.modelName.length + 1);
    }

    UMP.Web.UI.Checkbox.callBaseMethod(this, 'initialize');
}

function UMP$Web$UI$Checkbox$set_value(val, slient) {
    var modelName = this.modelName;
    var fieldName = this.fieldName;
    var id = this._element.id;
    if (!fieldName) {
        $alert('id为' + id + '的Input控件由于不存在绑定字段，不存在set_value方法');
        return;
    }

    if (val === undefined) {
        return;
    }

    if (slient) {
        this._element.checked = val;
    } else {
        this.set("value", val);
        $model(modelName).set(fieldName, val);
    }
    /* var oldValue = this.get_value();
     var len;
     if (val !== oldValue) {
         this._element.checked = val;
         this.set("value", val);
         var args = {
             "oldValue" : oldValue,
             "value" : val
         }
         $(this._element).trigger("change", args);
         //this.firechangeEvent(args);//触发DOM上的onchange
     }*/
}

function UMP$Web$UI$Checkbox$get_value() {
    return this.get("value");
}

function UMP$Web$UI$Checkbox$get_domvalue() {
    return this._element.checked;
}

function UMP$Web$UI$Checkbox$set_attr(attrName, val, silent) {
    if (!attrName || (typeof attrName !== 'string') || (val == undefined)) {
        console.log('id为' + this._id + '的Checkbox控件的set_attr方法传入的参数有误!');
        return;
    }

    if (silent) {
        this._element.setAttribute(attrName, val);
    } else {
        this.set(attrName, val);
        this._element.setAttribute(attrName, val);
    }
}

function UMP$Web$UI$Checkbox$get_attr(attrName) {
    if (attrName && (typeof attrName == 'string')) {
        return this._element.getAttribute(attrName);
    } else {
        console.log('id为' + this._id + '的Checkbox控件的get_attr方法传入的参数不存在或不是字符串!');
    }
}

UMP.Web.UI.Checkbox.prototype = {
    initialize: UMP$Web$UI$Checkbox$initialize,
    get_value: UMP$Web$UI$Checkbox$get_value,
    set_value: UMP$Web$UI$Checkbox$set_value,
    get_domvalue: UMP$Web$UI$Checkbox$get_domvalue,
    set_attr: UMP$Web$UI$Checkbox$set_attr,
    get_attr: UMP$Web$UI$Checkbox$get_attr
}
UMP.Web.UI.Checkbox.registerClass('UMP.Web.UI.Checkbox', UMP.Web.Mvc.JControl);//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

UMP.Web.UI.RadioSet = function UMP$Web$UI$SRadioSet(element) {
    UMP.Web.UI.RadioSet.initializeBase(this, [element]);
    this.radioName = '';
    this.radios = [];
    this._id = element.getAttribute('id');
    this.initialize();
}

function UMP$Web$UI$RadioSet$initialize() {
    var path = this._element.getAttribute('data-um-bindfield');
    var $elem = $(this._element);
    var id = this._element.id;
    var radios = $elem.find('input[type=radio]');
    if (radios.length !== 0 && radios[0].name) {
        this.radioName = radios[0].name;
    } else {
        alert('id为' + id + '的RadioSet控件内部必须存在单选框元素且第一个单选框的name属性不能为空');
    }

    if (!path) {
        this.modelName = null;
        this.fieldName = null;
    } else if (path.indexOf('.') < 0) {
        this.modelName = null;
        this.fieldName = path;
    } else {
        this.modelName = path.substring(0, path.lastIndexOf("."));
        this.fieldName = path.substring(this.modelName.length + 1);
    }

    UMP.Web.UI.RadioSet.callBaseMethod(this, 'initialize');
}

function UMP$Web$UI$RadioSet$get_name() {
    var id = this._element.id;
    if (this.radioName) {
        return this.radioName;
    } else {
        alert('id为' + id + '的RadioSet控件内部必须存在单选框元素且第一个单选框的name属性不能为空');
        return false;
    }
}

function UMP$Web$UI$RadioSet$set_value(val, slient) {
    var id = this._element.id;
    var radios;
    var len;
    var modelName = this.modelName;
    var fieldName = this.fieldName;
    var id = this._element.id;
    if (!fieldName) {
        $alert('id为' + id + '的RadioSet控件由于不存在绑定字段，不存在set_value方法');
        return;
    }
    radios = $(this._element).find('input[type=radio][name=' + this.radioName + ']');
    len = radios.length;
    if (!len) {
        alert('id为' + id + '的RadioSet控件在给绑定字段赋值时找不到name属性为' + this.radioName + '的单选框!');
        return;
    }
    if (val === undefined) {
        return;
    }
    if (slient) {
        radios.each(function () {
            if (this.value == val) {
                this.checked = true;
            }
        });
        this.set("value", val);
    } else {
        this.set("value", val);
        $model(modelName).set(fieldName, val);
    }

    /* var oldValue = this.get_value();
     var radios;
     var len;
     var id = this._element.id;
     if (val != oldValue && this.radioName) {
         radios = $(this._element).find('input[type=radio][name=' + this.radioName +']');
         len = radios.length;
         if (!len) {
             alert('id为' + id +'的RadioSet控件在给绑定字段赋值时找不到name属性为'+ this.radioName + '的单选框!');
             return;
         }
         radios.each(function(){
            if(this.value == val){
                this.checked = true;
            }
         });
         this.set("value", val);
         var args = {
             "oldValue" : oldValue,
             "value" : val
         }
         $(this._element).trigger("change", args);
         //this.firechangeEvent(args);//触发DOM上的onchange
     }*/
}

function UMP$Web$UI$RadioSet$get_value() {
    return this.get("value");
}

function UMP$Web$UI$RadioSet$get_domvalue() {
    var radioName = this.get_name();
    var val = $(this._element).find('input:radio[name=' + radioName + ']:checked').val();
    return val;
}

function UMP$Web$UI$RadioSet$get_attr(attrName) {
    if (attrName && (typeof attrName == 'string')) {
        return this._element.getAttribute(attrName);
    } else {
        console.log('id为' + this._id + '的RadioSet控件的get_attr方法传入的参数不存在或不是字符串!');
    }
}

function UMP$Web$UI$RadioSet$set_attr(attrName, val, silent) {
    if (!attrName || (typeof attrName !== 'string') || (val == undefined)) {
        console.log('id为' + this._id + '的RadioSet控件的set_attr方法传入的参数有误!');
        return;
    }

    if (silent) {
        this._element.setAttribute(attrName, val);
    } else {
        this.set(attrName, val);
        this._element.setAttribute(attrName, val);
    }
}

UMP.Web.UI.RadioSet.prototype = {
    initialize: UMP$Web$UI$RadioSet$initialize,
    get_name: UMP$Web$UI$RadioSet$get_name,
    get_value: UMP$Web$UI$RadioSet$get_value,
    set_value: UMP$Web$UI$RadioSet$set_value,
    get_domvalue: UMP$Web$UI$RadioSet$get_domvalue,
    get_attr: UMP$Web$UI$RadioSet$get_attr,
    set_attr: UMP$Web$UI$RadioSet$set_attr
}
UMP.Web.UI.RadioSet.registerClass('UMP.Web.UI.RadioSet', UMP.Web.Mvc.JControl);//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

UMP.Web.UI.Img = function UMP$Web$UI$Img(element) {
    UMP.Web.UI.Img.initializeBase(this, [element]);
    this._id = element.getAttribute('id');
    this.initialize();
}

function UMP$Web$UI$Img$initialize() {
    var path = this._element.getAttribute('data-um-bindfield');
    if (!path) {
        this.modelName = null;
        this.fieldName = null;
    } else if (path.indexOf('.') < 0) {
        this.modelName = null;
        this.fieldName = path;
    } else {
        this.modelName = path.substring(0, path.lastIndexOf("."));
        this.fieldName = path.substring(this.modelName.length + 1);
    }

    UMP.Web.UI.Img.callBaseMethod(this, 'initialize');
}

function UMP$Web$UI$Img$set_value(val, silent) {
    var modelName = this.modelName;
    var fieldName = this.fieldName;
    var id = this._element.id;
    if (!fieldName) {
        $alert('id为' + id + '的Img控件由于不存在绑定字段，不存在set_value方法');
        return;
    }

    if (val === undefined) {
        return;
    }

    if (silent) {
        this.set("value", val);
        this._element.src = val;
    } else {
        this.set("value", val);
        $model(modelName).set(fieldName, val);
    }
    /*var oldValue = this.get('value');
    if (val != oldValue) {
        this.set("value", val);
        this._element.textContent = val;
        var args = {
            "oldValue" : oldValue,
            "value" : val
        }
        $(this._element).trigger("change", args);

    }*/
}

function UMP$Web$UI$Img$get_value() {
    return this.get("value");
}


function UMP$Web$UI$Img$get_domvalue() {
    return this._element.getAttribute('src');
}

function UMP$Web$UI$Img$get_attr(attrName) {
    if (attrName && (typeof attrName == 'string')) {
        return this._element.getAttribute(attrName);
    } else {
        console.log('id为' + this._id + '的Img控件的get_attr方法传入的参数不存在或不是字符串!');
    }
}

function UMP$Web$UI$Img$set_attr(attrName, val, silent) {
    if (!attrName || (typeof attrName !== 'string') || (val == undefined)) {
        console.log('id为' + this._id + '的Img控件的set_attr方法传入的参数有误!');
        return;
    }

    if (silent) {
        this._element.setAttribute(attrName, val);
    } else {
        this.set(attrName, val);
        this._element.setAttribute(attrName, val);
    }
}

UMP.Web.UI.Img.prototype = {
    initialize: UMP$Web$UI$Img$initialize,
    set_value: UMP$Web$UI$Img$set_value,
    get_value: UMP$Web$UI$Img$get_value,
    set_attr: UMP$Web$UI$Img$set_attr,
    get_attr: UMP$Web$UI$Img$get_attr,
    get_domvalue: UMP$Web$UI$Img$get_domvalue
};
UMP.Web.UI.Img.registerClass('UMP.Web.UI.Img', UMP.Web.Mvc.JControl);//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

UMP.Web.UI.Label = function UMP$Web$UI$Label(element) {
    UMP.Web.UI.Label.initializeBase(this, [element]);
    this._id = element.getAttribute('id');
    this.initialize();
}

function UMP$Web$UI$Label$initialize() {
    var path = this._element.getAttribute('data-um-bindfield');
    if (!path) {
        this.modelName = null;
        this.fieldName = null;
    } else if (path.indexOf('.') < 0) {
        this.modelName = null;
        this.fieldName = path;
    } else {
        this.modelName = path.substring(0, path.lastIndexOf("."));
        this.fieldName = path.substring(this.modelName.length + 1);
    }

    UMP.Web.UI.Label.callBaseMethod(this, 'initialize');
}

function UMP$Web$UI$Label$set_value(val, silent) {
    var modelName = this.modelName;
    var fieldName = this.fieldName;
    var id = this._element.id;
    if (!fieldName) {
        $alert('id为' + id + '的Label控件由于不存在绑定字段，不存在set_value方法');
        return;
    }

    if (val === undefined) {
        return;
    }

    if (silent) {
        this.set("value", val);
        this._element.textContent = val;
    } else {
        this.set("value", val);
        $model(modelName).set(fieldName, val);
    }
    /*var oldValue = this.get('value');
    if (val != oldValue) {
        this.set("value", val);
        this._element.textContent = val;
        var args = {
            "oldValue" : oldValue,
            "value" : val
        }
        $(this._element).trigger("change", args);

    }*/
}

function UMP$Web$UI$Label$get_value() {
    return this.get("value");
}

function UMP$Web$UI$Label$get_domvalue() {
    return this._element.textContent;
}

function UMP$Web$UI$Label$get_attr(attrName) {
    if (attrName && (typeof attrName == 'string')) {
        return this._element.getAttribute(attrName);
    } else {
        console.log('id为' + this._id + '的Label控件的get_attr方法传入的参数不存在或不是字符串!');
    }
}

function UMP$Web$UI$Label$set_attr(attrName, val, silent) {
    if (!attrName || (typeof attrName !== 'string') || (val == undefined)) {
        console.log('id为' + this._id + '的Label控件的set_attr方法传入的参数有误!');
        return;
    }

    if (silent) {
        this._element.setAttribute(attrName, val);
    } else {
        this.set(attrName, val);
        this._element.setAttribute(attrName, val);
    }
}

UMP.Web.UI.Label.prototype = {
    initialize: UMP$Web$UI$Label$initialize,
    set_value: UMP$Web$UI$Label$set_value,
    get_value: UMP$Web$UI$Label$get_value,
    get_domvalue: UMP$Web$UI$Label$get_domvalue,
    set_attr: UMP$Web$UI$Label$set_attr,
    get_attr: UMP$Web$UI$Label$get_attr
};
UMP.Web.UI.Label.registerClass('UMP.Web.UI.Label', UMP.Web.Mvc.JControl);//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.UI.List 
// Author gct@yonyou.com 
//-----------------------------------------------------------------------

Type.registerNamespace('UMP.Web.UI');

UMP.Web.UI.ListItem = function UMP$Web$UI$ListItem(parentJcontrol, element, jsonItem, rowIndex) {
    UMP.Web.UI.ListItem.initializeBase(this, [element]);
    this._parentJcontrol = parentJcontrol;
    this._events = parentJcontrol._events;
    this._rowIndex = rowIndex;
    this._curJControlInfo = {};
    this._jsonItem = jsonItem;
    this.initialize();
}

function UMP$Web$UI$ListItem$initialize() {
    var that = this;
    var i = 0;
    $(this._element).find('[data-um-bindfield]').each(function () {
        var category;
        var bindfield = this.getAttribute('data-um-bindfield') || '';
        if (bindfield) {
            category = this.nodeName.toLowerCase();
            if (category == 'input' && this.type == 'checkbox') {
                category = this.type.toLowerCase();
            }
            category = (this.getAttribute('data-um-jControl') || category).toLowerCase();
            $(this).data('category', category);
            that._curJControlInfo[bindfield] = that._curJControlInfo[bindfield] || [];
            that._curJControlInfo[bindfield].push(this);
            that.set_domvalue(this, that._jsonItem[bindfield]);
            $(this).on('change', function () {
                event.stopPropagation();
                var field = this.getAttribute('data-um-bindfield');
                var row = that._parentJcontrol._rows[that._rowIndex] || {};
                var val = that.get_domvalue(this);
                var oldvalue = row[field];
                var value = val;
                var rowIndex = that._rowIndex;
                var args = {
                    'field': field,
                    'oldvalue': oldvalue,
                    'value': value
                };
                that._jsonItem[field] = val;
                that._events.trigger('rowchange', rowIndex, that, args);
            });
        } else {
            return;
        }
    });
    $(this._element).on('click', function () {
        var $elem = $(this);
        var rowIndex = that._rowIndex;
        var args = {};
        args['value'] = that._jsonItem || {};
        args['background'] = $elem.css('background');
        args['height'] = $elem.css('height');
        that._events.trigger('rowclick', rowIndex, that, args);
    });
}


//Public Method
function UMP$Web$UI$ListItem$get_domvalue(elem) {
    if (!elem) return;
    var category = $(elem).data('category') || '';
    var value;
    if (!category) return;
    switch (category) {
        case 'input':
        case 'textarea':
        case 'select':
            value = elem.value;
            break;
        case 'checkbox':
            value = elem.checked;
            break;
        case 'img':
            value = elem.getAttribute('src');
            break;
        case 'label':
        default:
            value = elem.textContent;
    }
    return value;
}

function UMP$Web$UI$ListItem$set_domvalue(elem, value) {
    if (!elem || value == undefined) return;
    var category = $(elem).data('category') || '';
    if (!category) return;
    switch (category) {
        case 'input':
        case 'textarea':
            elem.value = value;
            break;
        case 'select':
            (options = element.find('option[value=' + value + ']')).length ? options[0].selected = true : alert('id为' + id + 'select控件在初始绑定值时找不到value为' + value + '的option!');
            break;
        case 'checkbox':
            elem.checked = value;
            break;
        case 'img':
            elem.setAttribute('src', value);
            break;
        case 'label':
        default:
            elem.innerHTML = value;
    }

}

function UMP$Web$UI$ListItem$set_value(fieldName, fieldValue) {
    var bindElements = this._curJControlInfo[fieldName];
    var bindValue = fieldValue;
    var len = bindElements && bindElements.length;
    var i = 0;
    if (len && fieldValue !== undefined) {
        for (; i < len; i++) {
            this.set_domvalue(bindElements[i], bindValue);
        }
        this._jsonItem[fieldName] = fieldValue;
    }
}

function UMP$Web$UI$ListItem$get_value(fieldName) {
    if (!fieldName) return;
    return this._jsonItem[fieldName];
}


UMP.Web.UI.ListItem.prototype = {
    initialize: UMP$Web$UI$ListItem$initialize,
    get_domvalue: UMP$Web$UI$ListItem$get_domvalue,
    set_value: UMP$Web$UI$ListItem$set_value,
    get_value: UMP$Web$UI$ListItem$get_value,
    set_domvalue: UMP$Web$UI$ListItem$set_domvalue
};
UMP.Web.UI.ListItem.registerClass('UMP.Web.UI.ListItem', UMP.Web.Mvc.JControl);


UMP.Web.UI.List = function UMP$Web$UI$List(element) {
    UMP.Web.UI.List.initializeBase(this, [element]);
    var path = this._element.getAttribute('data-um-bindfield');
    var firstChild = this._element.children[0];
    this._tpl = firstChild && firstChild.outerHTML;
    this._rows = [];
    this.jsonArray = [];
    this._id = element.getAttribute('id');
    if (!path) {
        this.modelName = null;
        this.fieldName = null;
    } else if (path.indexOf('.') < 0) {
        this.modelName = null;
        this.fieldName = path;
    } else {
        this.modelName = path.substring(0, path.lastIndexOf("."));
        this.fieldName = path.substring(this.modelName.length + 1);
    }
    /*
     var _events = {
     rowChange : {
     colName1 : [function(){} , function(){}, function(){}],
     colName2: [function(){} , function(){}, function(){}],
     colName3 : [function(){} , function(){}, function(){}]
     },
     rowClick : {
     value : [function(){} , function(){}, function(){}],
     background: [function(){} , function(){}, function(){}],
     height : [function(){} , function(){}, function(){}]
     },
     event1 : {
     value : [function(){} , function(){}, function(){}],
     background: [function(){} , function(){}, function(){}],
     height : [function(){} , function(){}, function(){}]
     }
     }
     */
}

function UMP$Web$UI$List$set_datasource(jsonArray) {
    /*    var elem = this._element;*/
    var collection;
    if (jsonArray && $isJSONArray(jsonArray)) {
        this.jsonArray = jsonArray;
        this.initialize();
    } else if (this.fieldName) {
        collection = $model(this.modelName).get(this.fieldName);
        collection && (collection = collection.toJSON());
        $isJSONArray(collection) && (this.jsonArray = collection);
        this.initialize();
    }
}

function UMP$Web$UI$List$get_datasource() {
    this.get_value();
}

function UMP$Web$UI$List$initialize() {
    if (!(this._tpl)) return;
    var listItem;
    var listElem;
    this.listItems = [];
    var jsonArray = this.jsonArray;
    var jsonItem;
    var len = this.jsonArray.length;
    var i = 0, j = 0;
    var that = this;
    var fragment = document.createDocumentFragment();
    var item;
    for (; j < len; j++) {
        item = $(this._tpl)[0];
        fragment.appendChild(item);
    }

    $(this._element).html(fragment);
    this.listItemsElems = this._element.children;

    for (; i < len; i++) {
        listElem = this.listItemsElems[i];
        jsonItem = jsonArray[i] || {};
        this._rows[i] = jsonItem || {};
        listItem = new UMP.Web.UI.ListItem(this, listElem, jsonItem, i);
        this.listItems.push(listItem);
        this._events.on('rowchange', i, function (sender, args) {
            var rowIndex = args['attrName'];
            var field = args['field'] || null;
            var value = args['value'];
            var prop;
            if (rowIndex == undefined || value == undefined) return;
            if (!field || typeof value == 'object') {
                that._rows[rowIndex] = value;
                for (prop in value) {
                    that.listItems[rowIndex].set_value(prop, value[prop]);
                }
            } else if (field) {
                that._rows[rowIndex][field] = value;
                that.listItems[rowIndex].set_value(field, value);
            }

        });
    }
}


//Public Method
function UMP$Web$UI$List$set_value(rowIndex, fieldName, fieldValue) {
    if (rowIndex == undefined) return;
    rowIndex = +rowIndex;
    var row;
    var old_row = this.get_value(rowIndex);
    var value;
    var oldvalue;
    var sender = this.listItems[rowIndex] || {};
    if (fieldValue !== undefined && fieldName) {
        value = fieldValue;
        oldvalue = old_row[fieldName];
        if (value == oldvalue) return;
        args = {
            field: fieldName,
            oldvalue: old_row[fieldName],
            value: fieldValue,
            rowIndex: rowIndex
        };
        this._events.trigger('rowchange', rowIndex, sender, args);
        return;

    } else if (fieldValue == undefined && typeof fieldName == 'object' && fieldName !== null) {
        row = fieldName;
        args = {
            oldvalue: old_row,
            value: row,
            rowIndex: rowIndex
        }
        this._events.trigger('rowchange', rowIndex, sender, args);
        return;
    }

    /*var row = (rowIndex !== undefined) && this.get_value(rowIndex);
     var oldrow = (rowIndex !== undefined) && this.get_value(rowIndex);
     var sender;
     var args = {};
     if(row)*/
    /*if(oldvalue !== fieldValue){
     sender = this.listItems[rowIndex] || {};
     args = {
     oldvalue: oldvalue,
     value: fieldValue
     }
     this._rows[rowIndex][fieldName] = fieldValue;
     this._events.trigger('rowchange', rowIndex, sender, args);
     }*/
}

function UMP$Web$UI$List$get_value(rowIndex, fieldName) {
    if (rowIndex == undefined) {
        return this.jsonArray;
    }

    if (fieldName == undefined) {
        return this._rows[rowIndex];
    }

    if (rowIndex !== undefined && fieldName !== undefined) {
        return this._rows[rowIndex][fieldName];
    }

}

function UMP$Web$UI$List$get_attr(attrName) {
    if (attrName && (typeof attrName == 'string')) {
        return this._element.getAttribute(attrName);
    } else {
        console.log('id为' + this._id + '的List控件的get_attr方法传入的参数不存在或不是字符串!');
    }
}

function UMP$Web$UI$List$set_attr(attrName, val, silent) {
    if (!attrName || (typeof attrName !== 'string') || (val == undefined)) {
        console.log('id为' + this._id + '的List控件的set_attr方法传入的参数有误!');
        return;
    }

    if (silent) {
        this._element.setAttribute(attrName, val);
    } else {
        this.set(attrName, val);
        this._element.setAttribute(attrName, val);
    }
}

function UMP$Web$UI$List$getRowIndex(elem) {
    var listItemsElems = this.listItemsElems;
    var len = elem && listItemsElems && listItemsElems.length;
    var rowIndex;
    var i;
    if (len) {
        for (i = 0; i < len; i++) {
            $(listItemsElems[i]).find(elem).andSelf().each(function () {
                if (this == elem) {
                    rowIndex = i;
                    return false;
                }
                ;
            });
            if (rowIndex != undefined) break;
        }
    }
    return rowIndex;
}

/*function UMP$Web$UI$List$set(rowIndex, fieldName, fieldValue){
 var row = this._rows[rowIndex];
 var oldValue = row[attr];
 if(val != oldValue){
 this.row[attr] = val;
 var args = {
 "oldValue" : oldValue,
 "value" : this._attrs[attr]
 }

 //$(this._element).trigger("change");//子类触发jquery的事件
 //this._element.dispatchEvent
 this.trigger("change", attr, args);
 this._events.trigger(evtName, attrName, this, args);
 }
 }*/
/*function UMP$Web$Mvc$Collection$on(evtName, fieldName, handler){
 if(typeof handler == "undefined" && $isFunction(fieldName)){
 this._events.on(evtName, fieldName);
 }else{
 this._attrEvents.on(evtName, fieldName, handler);
 }
 }
 function UMP$Web$Mvc$Collection$trigger(evtName, fieldName, args){
 if(typeof args == "undefined"){
 args = fieldName;
 //没有指定fieldName，表示整个Model的事件
 this._events.trigger(evtName, this, args);
 }else{
 this._attrEvents.trigger(evtName, fieldName, this, args);
 }
 }*/

UMP.Web.UI.List.prototype = {
    initialize: UMP$Web$UI$List$initialize,
    set_datasource: UMP$Web$UI$List$set_datasource,
    get_datasource: UMP$Web$UI$List$get_datasource,
    get_value: UMP$Web$UI$List$get_value,
    set_value: UMP$Web$UI$List$set_value,
    get_attr: UMP$Web$UI$List$get_attr,
    set_attr: UMP$Web$UI$List$set_attr,
    getRowIndex: UMP$Web$UI$List$getRowIndex
};
UMP.Web.UI.List.registerClass('UMP.Web.UI.List', UMP.Web.Mvc.JControl);

//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------
UMP.Web.Mvc.Controller = function UMP$Web$Mvc$Controller(curJControlInfo, curJControlInfo2) {
    this._curJControlInfo = curJControlInfo;
    this._curJControlInfo2 = curJControlInfo2;
    //1个控件有且仅有1个绑定字段
    //1个绑定字段可能对应N个控件

    //1、监听模型，修改控件
    this.regDataBind();

    //2、监听控件，修改模型
    this.regDataCollect();
}

//Public Method
function UMP$Web$Mvc$Controller$regDataBind() {
    //监听模型，修改控件
    var bindfield;
    var path;
    var modelName;
    var fieldName = '';
    var val;
    var cids;
    var curJControlInfo2 = this._curJControlInfo2;
    var i;
    var len;

    for (cid in curJControlInfo2) {
        path = cid;
        if (path.indexOf('.') < 0) {
            modelName = null;
            fieldName = path;
        } else {
            modelName = path.substring(0, path.lastIndexOf("."));
            fieldName = path.substring(modelName.length + 1);
        }
        if ($model(modelName)) {
            $model(modelName).on("change", fieldName, function (sender, args) {
                val = args["value"];
                bindfield = args["data-um-bindfield"];
                cids = curJControlInfo2[bindfield];
                for (i = 0, len = cids.length; i < len; i++) {
                    $view(cids[i]).set_value(val, true);
                }
            });
        }

    }

}

function UMP$Web$Mvc$Controller$regDataCollect() {
    //监听控件，修改模型
    var curJControlInfo = this._curJControlInfo;
    for (var cid in curJControlInfo) {
        if ($view(cid)) {
            $('#' + cid).on("change", function () {
                var id = this.id;
                var val = $view(id).get_domvalue();
                var bdInfo = curJControlInfo[id]["data-um-bindfield"];
                // var bdextInfo = UM.CurrentBindingInfo[cid]["data-bindfield-ext"];
                var modelName = bdInfo["model"];
                var fieldName = bdInfo["field"];
                $model(modelName).set(fieldName, val);
            });
        }

    }
}


function UMP$Web$Mvc$Controller$findViewId(model, field) {
    var ids = [];
    if (this._curJControlInfo) {
        for (id in this._curJControlInfo) {
            var info = this._curJControlInfo[id]
            if (info["Model"] == model && info["Field"] == field) {
                ids.push(info);
            }
        }
    }
    return ids;
}

function UMP$Web$Mvc$Controller$findFieldName(id) {
    var info = this._curJControlInfo["id"];
    if (info) {
        return info;
    } else {
        alert("未找到id为" + id + "控件的绑定信息");
    }

}

UMP.Web.Mvc.Controller.prototype = {
    regDataBind: UMP$Web$Mvc$Controller$regDataBind,
    regDataCollect: UMP$Web$Mvc$Controller$regDataCollect,
    //databind : UMP$Web$Mvc$Controller$databind,
    findViewId: UMP$Web$Mvc$Controller$findViewId,
    findFieldName: UMP$Web$Mvc$Controller$findFieldName

};
UMP.Web.Mvc.Controller.registerClass('UMP.Web.Mvc.Controller');//-----------------------------------------------------------------------
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
            if ($isJSONObject(json[key]) && json[key] !== null) {
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