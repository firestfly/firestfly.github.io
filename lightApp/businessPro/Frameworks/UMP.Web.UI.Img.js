//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// include : UMP.Web.EventMgr | UMP.Web.AttrEventMgr
// Author gct@yonyou.com
//-----------------------------------------------------------------------

UMP.Web.UI.Img = function UMP$Web$UI$Img(element) {
    UMP.Web.UI.Img.initializeBase(this, [element]);
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

function UMP$Web$UI$Img$set_value(val, slient) {
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

    if (slient) {
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
    return this._element.textContent;
}

UMP.Web.UI.Img.prototype = {
    initialize: UMP$Web$UI$Img$initialize,
    set_value: UMP$Web$UI$Img$set_value,
    get_value: UMP$Web$UI$Img$get_value,
    get_domvalue: UMP$Web$UI$Img$get_domvalue
};
UMP.Web.UI.Img.registerClass('UMP.Web.UI.Img', UMP.Web.Mvc.JControl);