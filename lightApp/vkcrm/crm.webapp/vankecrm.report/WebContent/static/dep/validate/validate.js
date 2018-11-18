define(function(require, exports, module) {
    var options = {
        validtorAttr: "data-validator"
    }
    var isError = false,
        promptText = [];
    var validationRules = {
        "required": { // Add your regex rules here, you can take telephone as an example
            "executor": "_required"
        },
        "func": {
            "executor": "_funcCall"
        },
        "length": {
            "executor": "_length"
        },
        "range": {
            "executor": "_range"
        },
        "url": {
            "regex": /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i,
            "executor": "_customRegex",
            "alertText": "网址输入不正确"
        },
        "qq": {
            "regex": /^[1-9][0-9]{4,}$/,
            "executor": "_customRegex",
            "alertText": "QQ号码输入不正确（非零开头的四位以上的数字）"
        },
        "telephone": {
            "regex": /^(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
            "executor": "_customRegex",
            "alertText": "电话号码输入不正确"
        },
        "mobile": {
            "regex": /^1[3|5|7|8]\d{9}$/,
            "executor": "_customRegex",
            "alertText": "手机号码输入不正确"
        },
        "mobileAndTel": {
            "regex": /(^(\d{3,4})?\d{7,8})$|(1[3|5|7|8][0-9]{9})/,
            "executor": "_customRegex",
            "alertText": "号码输入不正确"
        },
        "zip": {
            "regex": /^[1-9]\d{5}$/,
            "executor": "_customRegex",
            "alertText": "邮政编码输入不正确"
        },
        "email": {
            "regex": /^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/,
            "executor": "_customRegex",
            "alertText": "邮箱地址输入不正确"
        },
        "date": {
            "regex": /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/,
            "executor": "_customRegex",
            "alertText": "日期输入格式不正确（YYYY-MM-DD）"
        },
        "identity": {
            "regex": /\d{15}|\d{18}/,
            "executor": "_customRegex",
            "alertText": "身份证输入不正确"
        },
        "money": {
            "regex": /^[0-9]+(.[0-9]{2})?$/,
            "executor": "_customRegex",
            "alertText": "金额格式输入不正确"
        },
        "integer": {
            "regex": /^\d+$/,
            "executor": "_customRegex",
            "alertText": "输入值必须是正整数"
        },
        "double": {
            "regex": /^[0-9]+(.[0-9]+)?$/,
            "executor": "_customRegex",
            "alertText": "输入值必须是数值"
        },
        "digit": {
            "regex": /^[0-9]+$/,
            "executor": "_customRegex",
            "alertText": "只能输入数字"
        },
        "noSpecialCaracters": {
            "regex": /^[0-9a-zA-Z]+$/,
            "executor": "_customRegex",
            "alertText": "不允许输入字母和数字之外的特殊字符"
        },
        "letter": {
            "regex": /^[a-zA-Z]+$/,
            "executor": "_customRegex",
            "alertText": "只允许输入英文"
        },
        "chinese": {
            "regex": /^[\u0391-\uFFE5]+$/,
            "executor": "_customRegex",
            "alertText": "只允许输入中文"
        },
        "IP": {
            "regex": /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            "executor": "_customRegex",
            "alertText": "IP输入不正确"
        }
    }

    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    function trim(str) {
        return (str + "").replace(rtrim, '');
    }

    /* validator */
    var validator = {};
    validator._required = function(caller, rule) { // VALIDATE BLANK FIELD

        var callerType = caller.type;
        var tagName = caller.tagName;

        if (callerType == "text" || callerType == "number" || callerType == "password" || tagName == "TEXTAREA" || callerType == "hidden") {
            if (!trim(caller.value)) {
                isError = true;
                promptText.push("该输入项必填")
                return true;
            }
        } else if (callerType == "radio" || callerType == "checkbox") {
            callerName = caller.name;
            var checkbox = document.querySelectorAll("input[name='" + callerName + "']");
            var checked = false;
            for (var i = 0; i < checkbox.length; i++) {
                if (checkbox[i].checked) {
                    checked = true;
                    break;
                }
            };
            if (checked === false) {
                isError = true;
                if (checkbox.length == 1) {
                    promptText.push("该选项为必选项")
                } else {
                    promptText.push("必须选择一个选项")
                }
                return true;
            }
        } else if (callerType == "select-multiple") { // added by paul@kinetek.net for select boxes, Thank you	
            if (!caller.value) {
                isError = true;
                promptText.push("该选择项必选")
                return true;
            }
        } else if (caller && tagName == 'SELECT') { // added by paul@kinetek.net for select boxes, Thank you
            if (!caller.value) {
                isError = true;
                promptText.push("该选择项必选")
                return true;
            }
        }
    }

    validator._customRegex = function(caller, rule) { // VALIDATE REGEX RULES suport custom[email[errorInfo]] or email[errorInfo]

        if (_isValueEmpty(caller)) {
            return false;
        }
        var customRule = rule.name;
        if (customRule == "pattern") {
            customRule = rule.options[0];
        }



        var customPT = customRule.match(/\[[^\]]+\]/g);
        if (customPT) {
            customRule = customRule.replace(customPT[0], "");
            customPT = customPT[0].replace(/^\[|\]$/g, "");
        }

        var pattern = validationRules[customRule];

        if (!pattern) {
            console.error("正则表达式:" + customRule + " 没有定义，请检查拼写是否正确");
        }
        //alert(pattern.regex);
        if (typeof pattern.regex == 'string') {
            pattern = new RegExp(pattern.regex);
        } else {
            pattern = eval(pattern.regex);
        }


        if (!pattern.test(trim(caller.value))) {
            isError = true;
            promptText.push(validationRules[customRule]["alertText"]);
            return true;
        }
    }

    validator._funcCall = function(caller, rule, eventType) { // VALIDATE CUSTOM FUNCTIONS OUTSIDE OF THE ENGINE SCOPE
        var funce = rule.option;

        var fn = window[funce];
        if (typeof(fn) === 'function') {
            var fn_result = fn(caller, eventType);
            if (fn_result.isError) {
                isError = true;
                promptText.push(fn_result.errorInfo)
                return true;
            }
        }
    }


    validator._length = function(caller, rule) { // VALIDATE LENGTH
        if (_isValueEmpty(caller)) {
            return false;
        }
        var mx = rule.option.split("~");

        var minL = mx[0] || 0;
        var maxL = mx[1] || Infinity;
        // var feildLength = trim(caller.value).replace(/[^\x00-\xff]/g, '**').length;
        var feildLength = caller.value.length;

        if (feildLength < minL || feildLength > maxL) {
            isError = true;
            promptText.push("当前输入长度为" + feildLength + " [ 输入长度必须在" + minL + (maxL > minL ? ("和" + maxL + "之间") : "以上") + " ]")
            // promptText.push("当前输入长度为" + feildLength + "[输入长度必须在" + minL + (maxL > minL ? ("和" + maxL + "之间") : "以上") + ",中文长度为2]")
            return true;
        }
    }

    validator._range = function(caller, rule) {
        var mx = rule.option.split("~");
        var min = mx[0] || 0;
        var max = mx[1] || Infinity;

        var callerType = caller.type;
        if (callerType == "radio" || callerType == "checkbox") {
            var checkbox = document.querySelectorAll("input[name=" + caller.name + "]");
            var groupSize = 0;
            for (var i = 0; i < checkbox.length; i++) {
                if (checkbox[i].checked) {
                    groupSize++;
                }
            };
            if (groupSize < min || groupSize > max) {
                isError = true;
                promptText.push("必须选择" + min + (max > min ? ("到" + max) : '') + "选项")
                return true;
            }
        } else {
            if (_isValueEmpty(caller)) {
                return false;
            }
            var inputValue = parseFloat(trim(caller.value)) || 0;
            if (inputValue < min || inputValue > max) {
                isError = true;
                promptText.push("输入的值必须在" + min + "到" + max + "之间")
                return true;
            }
        }
    }



    function _isValueEmpty(caller) {
        return !(caller.value && trim(caller.value).length > 0);
    }

    function validateCall(caller, rules) {
        var promptText = "",
            isError = false,
            rule, validatorName;

        var callerName = caller.name,
            callerType = caller.type;
        for (var i = 0; i < rules.length; i++) {
            rule = rules[i];
            rule.options = rule.options || [];
            validatorName = validationRules[rule.name] && validationRules[rule.name]["executor"];
            if (validator[validatorName]) {
                if (validator[validatorName](caller, rule)) {
                    isError = true;
                }
            } else {
                console.error("不存在该校验方法: " + rule.name);
            }
        };

        return isError;
    };


    function loadValidation(caller) {
        var rules = [],
            rule, name, option;
        var getRules = caller.getAttribute(options.validtorAttr);
        if (!getRules) {
            return false;
        }
        getRules = getRules.split(",");
        for (var i = 0; i < getRules.length; i++) {
            rule = getRules[i].split("[");
            name = rule[0];
            option = rule[1] && rule[1].slice(0, -1);
            rules.push({
                name: name,
                option: option
            })
        };
        return validateCall(caller, rules)
    }

    function validate(caller, options) {
        isError = false;
        var errorInfo = "",
            elements = caller.elements || caller;
        for (var i = 0; i < elements.length; i++) {
            var elem = elements[i];
            promptText = [];
            if (loadValidation(elem)) {
                if (options.onerror) {
                    options.onerror(elem, promptText.join(","))
                }
                if (!options.validateAll) {
                    break;
                }
            }
        };
        return isError;
    }
    return validate;

})