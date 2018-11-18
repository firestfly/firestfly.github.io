//-----------------------------------------------------------------------
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
    //this._field = this._element.getAttribute('data-um-bindfield');
    this._tpl = firstChild && firstChild.outerHTML;
    this._rows = [];
    this.jsonArray = [];
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
    /*    var curModel = $model();
        var paths;
        var field;
        var paths_len;
        var field_len;
        var i,j;*/
    if (jsonArray && $isJSONArray(jsonArray)) {
        this.jsonArray = jsonArray;
        this.initialize();
    } else if (this._field) {
        collection = $model(this.modelName).get(this.fieldName);
        collection && (collection = collection.toJSON());
        $isJSONArray(collection) && (this.jsonArray = collection);
        this.initialize();
        /* paths = this._field.split('.');
         for(i = 0,paths_len = paths.length; i < paths_len; i++){
             field = paths[0].split(/[\[,\]]/);
             for(j = 0; j < field.length; j++){
                 if(!field) continue;
                 if(curModel.getType() == 'UMP.Web.Mvc.Collection'){
                     curModel = curModel._rows[field] && curModel
                 }
             }

         }*/
    }
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
                console.log(that.listItems[rowIndex]);
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
    set_datasource: UMP$Web$UI$List$set_datasource,
    initialize: UMP$Web$UI$List$initialize,
    get_value: UMP$Web$UI$List$get_value,
    set_value: UMP$Web$UI$List$set_value
};
UMP.Web.UI.List.registerClass('UMP.Web.UI.List', UMP.Web.Mvc.JControl);

