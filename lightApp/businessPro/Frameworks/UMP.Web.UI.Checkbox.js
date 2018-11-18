//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

UMP.Web.UI.Checkbox = function UMP$Web$UI$SCheckbox(element) {
    UMP.Web.UI.Checkbox.initializeBase(this, [element]);
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

UMP.Web.UI.Checkbox.prototype = {
    initialize: UMP$Web$UI$Checkbox$initialize,
    get_value: UMP$Web$UI$Checkbox$get_value,
    get_domvalue: UMP$Web$UI$Checkbox$get_domvalue,
    set_value: UMP$Web$UI$Checkbox$set_value
}
UMP.Web.UI.Checkbox.registerClass('UMP.Web.UI.Checkbox', UMP.Web.Mvc.JControl);