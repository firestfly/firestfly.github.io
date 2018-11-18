//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

UMP.Web.UI.Label = function UMP$Web$UI$Label(element) {
    UMP.Web.UI.Label.initializeBase(this, [element]);
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

function UMP$Web$UI$Label$set_value(val, slient) {
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

    if (slient) {
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

UMP.Web.UI.Label.prototype = {
    initialize: UMP$Web$UI$Label$initialize,
    set_value: UMP$Web$UI$Label$set_value,
    get_value: UMP$Web$UI$Label$get_value,
    get_domvalue: UMP$Web$UI$Label$get_domvalue
};
UMP.Web.UI.Label.registerClass('UMP.Web.UI.Label', UMP.Web.Mvc.JControl);