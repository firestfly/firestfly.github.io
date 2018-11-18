template.helper('str', function (data, field, append, defaultVal) {
    if (data && data[field] != undefined) {
        if (append) {
            return data[field] + append;
        } else {
            return data[field];
        }
    } else {
        return defaultVal;
    }
});

template.helper('bool', function (data, field, trueVal, falseVal, defaultVal) {
    if (data && data[field] != undefined) {
        return data[field] == true ? trueVal : falseVal;
    } else {
        return defaultVal;
    }
});

template.helper('option', function (field, selectedVal) {
    if (field && field != undefined) {
        if(field.code == selectedVal){
            return '<option value=' + field.code + ' selected>'+field.value+'</option>';
        } else{
            return '<option value=' + field.code + '>'+field.value+'</option>';
        }
    } else {
        return defaultVal;
    }
});

template.helper('radio', function (field, name, selectedVal, clazz) {
    if (field && field != undefined) {
        if(field.code == selectedVal){
            return '<option value=' + field.code + ' selected>'+field.value+'</option>';
        } else{
            return '<option value=' + field.code + '>'+field.value+'</option>';
        }
    } else {
        return defaultVal;
    }
});

