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

    var dispatchType = ['BUSINESS_TRIP', 'TEMPORARY_WORK_OVERTIME'];

    for (var i = 0; i < 30; i++) {

        var content = Random.cparagraph(0, 10);

        result.list.data.push({
            id: i,
            state: Random.integer(0, 2),
            dispatchType: dispatchType[Random.integer(0, 1)],
            datetime: Random.datetime('yyyy-MM-dd hh:mm:ss'),
            employees: [
                {
                    id: Random.integer(1000000, 1500000),
                    name: Random.cword(2, 4),
                    workJob: Random.cword(10, 16),
                    startTime: Random.datetime('yyyy-MM-dd hh:mm:ss'),
                    endTime: Random.datetime('yyyy-MM-dd hh:mm:ss'),
                    department: Random.cword(5, 16)
                }
            ]
        })
    }

    return result
}