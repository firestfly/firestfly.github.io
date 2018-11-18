/**
 * Created by deepsky on 2017/3/29.
 */
let Mock = require('mockjs');
let Random = Mock.Random;

module.exports = function () {
    var result = {
        list: {
            data: [],
            recordsTotal: 30
        }
    };

    var dispatchType = ['HOLIDAY_PAY_ANNUAL', 'HOLIDAY_STATUTORY_ANNUAL', 'HOLIDAY_MARRIAGE', 'HOLIDAY_MATERNITY', 'HOLIDAY_ORDINARY_SICK'];
    var quotaType = ['天', '小时'];

    for (var i = 0; i < 30; i++) {

        var content = Random.cparagraph(0, 10);

        result.list.data.push({
            id: i,
            name: Random.cword(2, 4),
            holidayType: dispatchType[Random.integer(0, 4)],
            effectiveDate: Random.datetime('yyyy-MM-dd'),
            expiryDate: Random.datetime('yyyy-MM-dd'),
            quota: Random.integer(1, 10),
            quotaType: quotaType[Random.integer(0, 1)],
            employeeId: Random.integer(1000108464, 1000308464),
            sapId: Random.integer(1000164, 1000464),
            companyName: Random.cword(6, 12),
            departmentName: Random.cword(6, 12),
            workGroups: Random.cword(4, 8),
            postName: Random.cword(4, 8),
            isDelete: Random.boolean(),
            isModify: Random.boolean()
        })
    }

    return result
}