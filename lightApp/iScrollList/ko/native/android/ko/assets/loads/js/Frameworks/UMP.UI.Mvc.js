//////////////////////////////////////////////////////////////////
// �ں���������ִ��js����
function $UMP$eval(code) {
    if (!code) {
        return;
    }
    var srcCode = "(function() {\n" + code + "}) ();";
    eval(code);
}


