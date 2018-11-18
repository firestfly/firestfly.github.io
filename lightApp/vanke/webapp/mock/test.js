/**
 * Created by deepsky on 2017/3/29.
 */
const file1 = require('./api/detail.json')
const file2 = require('./api/department.json')
const person = require('./api/addperson.json')
const list = require('./api/list.json')
const revoke = require('./api/app-revoke.json')
module.exports = () => ({
    detail: file1,
    department: file2,
    addperson: person,
    list: list,
    revoke: revoke
});