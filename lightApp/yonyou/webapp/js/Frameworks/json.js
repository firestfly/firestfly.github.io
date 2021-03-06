﻿
//-----------------------------------------------------------------------
// Copyright (C) Yonyou Corporation. All rights reserved.
// Author： gct
// UAP Mobile
//

$alert = function(msg){
	try{
		if(typeof msg == "string"){
			alert(msg);
		}else if(msg.__baseClass == "UMP.UI.Mvc.Context"){    
			alert($jsonToString(msg.unload()));
		}else if(typeof msg == "object"){
			alert($jsonToString(msg));
		}else{
			alert(msg);
		}	
	}catch(e){
		alert(msg);
	}
}

$confirm = function(msg){
	try{
		return confirm(msg);
	}catch(e){
		alert(msg);
		return false;
	}
}

if(typeof __$jvm == "undefined"){
	__$jvm = {};
}
__$getInstance = function(className){
	var T = eval(className);
	if(T){
		if(__$jvm[className]){
			return __$jvm[className];
		}else{
			__$jvm[className] = new T();
			__$jvm[className].__typeName = className;
			return __$jvm[className];
		}
	}else{
		alert("当前js运行环境没有"+className+"类型，返回null");
		return null;
	}
}


/**
* 删除左右两端的空格
*/
String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
/**
* 删除左边的空格
*/
String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g, "");
}
/**
* 删除右边的空格
*/
String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g, "");
}

Array.prototype.remove = function(i){
    if(isNaN(i) || i < 0 || i >= this.length){
	    return false;
	}
	this.splice(i,1);
}
Array.prototype.remove2 = function(i){
    if(isNaN(i))
	    return this;
	if(i < 0 || i >= this.length)
	    return this;
	else
	    return this.slice(0,i).concat(this.slice(i+1,this.length));
}
Array.prototype.remove3 = function(dx){
    if(isNaN(dx) || dx > this.length){
		return false;
	}
	for(var i=0,n=0;i<this.length;i++){
		if(this[i]!=this[dx]){
			this[n++]=this[i];
		}
	}
	this.length-=1;
}


//--------------map--------------
Map = function() {
    var struct = function(key, value) {
        this.key = key;
        this.value = value;
    }
    
    var put = function(key, value){
        for (var i = 0; i < this.arr.length; i++) {
            if ( this.arr[i].key === key ) {
                this.arr[i].value = value;
                return;
            }
        }
        this.arr[this.arr.length] = new struct(key, value);
    }
    
    var get = function(key) {
        for (var i = 0; i < this.arr.length; i++) {
            if ( this.arr[i].key === key ) {
                return this.arr[i].value;
            }
        }
        return null;
    }
    
    var remove = function(key) {
        var v;
        for (var i = 0; i < this.arr.length; i++) {
            v = this.arr.pop();
            if ( v.key === key ) {
                continue;
            }
            this.arr.unshift(v);
        }
    }
    
    var size = function() {
        return this.arr.length;
    }
    
    var isEmpty = function() {
        return this.arr.length <= 0;
    }
    this.arr = new Array();
    this.get = get;
    this.put = put;
    this.remove = remove;
    this.size = size;
    this.isEmpty = isEmpty;
}

//-----------------------------------------------------------------------


// json

$jsonToString = function (obj){
    var THIS = this;
    switch(typeof(obj)){
        case 'string':            
			try{
				return eval('"'+ obj.replace(/(["\\])/g, '\\$1') +'"');            
            }catch(e){
				return obj;
            }
		case 'array':
			return '[' + obj.map(THIS.jsonToString).join(',') + ']';
		case 'object':
			if(obj instanceof Array){
				var strArr = [];
				var len = obj.length;
				/*
				for(var i=0; i<len; i++){
					strArr.push(THIS.jsonToString(obj[i]));
				}				
				return '[' + strArr.join(',') + ']';
				*/
				
				for(var i=0; i<len; i++){					
					var item = null;
					if(typeof obj[i] == "string"){
						item = "\"" + obj[i] + "\"";
					}else if(typeof obj[i] == "object"){
						item = THIS.jsonToString(obj[i]);
					}else{						
						item = THIS.jsonToString(obj[i]);
					}
					
					strArr.push(item);
				}				
				return '[' + strArr.join(',') + ']';
			}else if(obj==null){
				//return 'null';
				return "\"\"";
		
			}else{
				var string = [];
				for (var property in obj){
					var vv = THIS.jsonToString(obj[property]);
					var p = THIS.jsonToString(property);
					if(p.indexOf("\"")>=0){

					}else{
						p="\""+p+"\"";
					}
					if(obj[property] instanceof Array){
						
					}else if(vv.toString().indexOf("\"")>=0){//哪一种情况??
					 
					}
					else{
						vv="\"" +vv+"\"" ;
						//string.push("\""+THIS.jsonToString(property)+"\"" + ':'+"\"" + THIS.jsonToString(obj[property])+"\"");
					}
					string.push(p + ':'+vv);
					}
				return '{' + string.join(',') + '}';  
			}  
		case 'number':  
			return obj;
		case 'boolean':  
			return "\"" + obj.toString() + "\"";
		case 'undefined':  
			return "\"\"";
		case false:  
			return obj;  
		}  
}
jsonToString = $jsonToString;

$stringToJSON = function (str){
    if(str == null || (typeof str == "string" && str == ""))
		return null;
		
	if(typeof str == "string"){
		try{
			if(str.indexOf("\n") >= 0){				
				str = str.replace(/\n/g,"\\n");
			}
			if(str.indexOf("\r") >= 0){				
				str = str.replace(/\r/g,"\\r");
			}
			var json = eval('(' + str + ')');	
			return json;
		}catch(e){
			//alert("stringToJSON Exception! not a valid json string ");
			return str;
		}
	}else if(typeof str == "object"){
		return str;
	}else{
		alert("$stringToJSON()出错!未识别的参数类型");
		return str;//不会走到这里
	}
}

$isJSONObject = function (obj) {   
  return Object.prototype.toString.call(obj) === '[object Object]';    
}
$isWindow = function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
}
$isPlainObject = function (obj) {   
	var key;
	if ( !obj || !$isJSONObject(obj) || obj.nodeType || $isWindow( obj ) ) {
		return false;
	}

	try {
		// Not own constructor property must be Object
		if ( obj.constructor &&
				!hasOwnProperty.call(obj, "constructor") &&
				!hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
		}
	} catch ( e ) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}

	// Handle iteration over inherited properties before own properties.
	for ( key in obj ) {
		return hasOwnProperty.call( obj, key );
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	for ( key in obj ) {}

	return key === undefined || hasOwnProperty.call( obj, key );
}
	
$isJSONArray = function (obj) {   
  return Object.prototype.toString.call(obj) === '[object Array]';    
}
$isFunction = function (obj) {   
  return Object.prototype.toString.call(obj) === '[object Function]';    
}

//是否为空字符串
$isEmpty = function(obj){
	if(obj == undefined || obj == null || obj.toString() == ""){
		return true;
	}
}

$translateToArray = function(json){
	for(key in json){
		var val = json[key];
		if(val == "{}"){
			json[key] = {};
		}else if(val == "[]"){
			json[key] = [];
		}
		else if(typeof val == "object"){
			json[key] = $translateToArray(val);
		}
	}
	return json;
}
stringToJSON = $stringToJSON;

function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
 
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;
 
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
 
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
 
    return uuid.join('');
}

// 8 character ID (base=2)
//uuid(8, 2)  //  "01001010"
// 8 character ID (base=10)
//uuid(8, 10) // "47473046"
// 8 character ID (base=16)
//uuid(8, 16) // "098F4D35"
