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
UMP.Web.Mvc.Controller.registerClass('UMP.Web.Mvc.Controller');