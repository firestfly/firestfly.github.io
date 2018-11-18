$(function () {
    ContactsDataModel = function () {
        self.Contacts = ko.observableArray([]);
        for (var i = 0; i < 1000; i++) {
            self.Contacts.push({id: i, name: '联系人' + i, phone: 13810013000 + i,})
        }

        self.rowclick = function (item, e) {
            if (confirm("真的要删除吗？")) {
                self.Contacts.remove(this);
                alert("剩余" + self.Contacts().length + "条");
            }
        };

        self.lengthOfContacts = ko.dependentObservable(function () {
            return self.Contacts().length;
        }, self);

    };

    var myDM = new ContactsDataModel()
    ko.applyBindings(myDM);
});