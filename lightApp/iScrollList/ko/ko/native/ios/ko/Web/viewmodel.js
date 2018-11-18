var ViewModel = function (first, last) {
    var self = this;
    this.Customers = ko.observableArray([
        {id: 1, memo: '2005-01,��ѹ�����ˮ��'},
        {id: 2, memo: '2006-03,��ѹ������ֻ�'},
        {id: 3, memo: '2006-10,��ѹ������ֻ�'}
    ]);
    for (var i = 0; i < 5; i++) {
        this.Customers.push({id: i + 4, memo: '2005-01,��ѹ�����' + i + '��ˮ��'})
    }


    self.mailbox = ko.observableArray([]);
    for (var i = 0; i < 100; i++) {
        self.mailbox.push({id: i, name: '联系人' + i, num: i})
    }

    self.rowclick = function (item, e) {


        if (confirm("���Ҫɾ����")) {
            self.mailbox.remove(this);
            alert("ʣ��" + self.mailbox().length + "��");
        }
    };

    self.mailboxLen = ko.dependentObservable(function () {
        debugger;
        return self.mailbox().length;
    }, self);

};

myModel = new ViewModel("Planet", "Earth")
//ko.applyBindings(myModel); // This makes Knockout get to work
})