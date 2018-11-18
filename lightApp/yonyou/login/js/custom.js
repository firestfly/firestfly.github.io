$(function () {
    var list1 = $("#list1");
    var contactsJson = {};
    list1.delegate("li", "click", function () {
        var index = $(this).index();
        localStorage.setItem("curItemIndex", index);
        localStorage.setItem("curItem", JSON.stringify(contactsJson.list[index]));
        $.mobile.changePage("edit.html", {"transition": "slide"});
    });
    $(document).on("click", "#save", function () {
        var ifSave = confirm("确定要保存吗?");
        if (ifSave) {
            localStorage.setItem("contacts", JSON.stringify(contactsJson));
        }
    });
    $(document).on("pagebeforecreate", "#page4", function () {
        var contactsForm = $("#contactsForm");
        var curItem = localStorage.getItem("curItem") || "";
        var item;
        if (curItem) {
            curItem = JSON.parse(curItem);
            for (item in curItem) {
                contactsForm.find("input[name=" + item + "]").attr("value", curItem[item]);
            }
        }
    });
    $(document).on("pagebeforehide", "#page4", function () {
        var formData = $("form[id=contactsForm]").serializeArray();
        var name, value;
        var index = localStorage.getItem("curItemIndex");
        var dealedData = {};
        for (var i = 0; i < formData.length; i++) {
            name = formData[i]['name'];
            value = formData[i]['value'];
            dealedData[name] = value;
        }
        contactsJson.list[index] = dealedData;
        render(contactsJson.list);
    });

    display();

    function display() {
        var contactsList = {
            list: [
                {"name": "林彪", "phone": "1111111", "birth": "2013-04-25", "experience": 2},
                {"name": "周恩来", "phone": "1111111", "birth": "2013-04-25", "experience": 3},
                {"name": "宋庆龄", "phone": "1111111", "birth": "2013-04-25", "experience": 5},
                {"name": "蒋介石", "phone": "1111111", "birth": "2013-04-25", "experience": 7}
            ]
        };

        var contacts = localStorage.getItem("contacts");
        if (contacts) {
            contactsJson = JSON.parse(contacts);

        } else {
            localStorage.setItem("contacts", JSON.stringify(contactsList));
            contactsJson = contactsList || {};
        }
        render(contactsJson.list);
    }

    function render(list) {
        var i;
        var len = Array.isArray(list) && list.length;
        var fragment = document.createDocumentFragment();
        if (len) {
            for (i = 0; i < len; i++) {
                li = document.createElement('li');
                li.innerHTML = '<a href="#"><img src="img/setting_highlight.png" alt=""><h3>' + list[i].name + '</h3><p>' + list[i].phone + '</p></a>';
                fragment.appendChild(li);
            }
            list1.html(fragment).listview("refresh")
        }
    }

    function save() {

    }
});
