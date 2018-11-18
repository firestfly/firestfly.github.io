//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

UMP.Web.UI.RadioSet = function UMP$Web$UI$SRadioSet(element) {
    UMP.Web.UI.RadioSet.initializeBase(this, [element]);
    this.radioName = '';
    this.radios = [];
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

function UMP$Web$UI$RadioSet$get_name(val) {
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

UMP.Web.UI.RadioSet.prototype = {
    initialize: UMP$Web$UI$RadioSet$initialize,
    get_name: UMP$Web$UI$RadioSet$get_name,
    get_value: UMP$Web$UI$RadioSet$get_value,
    get_domvalue: UMP$Web$UI$RadioSet$get_domvalue,
    set_value: UMP$Web$UI$RadioSet$set_value
}
UMP.Web.UI.RadioSet.registerClass('UMP.Web.UI.RadioSet', UMP.Web.Mvc.JControl);