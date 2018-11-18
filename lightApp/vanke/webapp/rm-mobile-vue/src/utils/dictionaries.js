/*
 * 字典文件
 */
exports.temporaryType = () => {
  return [
    {
      code: 'EMPORARY_EMERGENCY',
      name: '突发事件'
    },
    {
      code: 'TEMPORARY_BAD_WEATHER',
      name: '恶劣天气、自然灾害'
    },
    {
      code: 'TEMPORARY_COMMUNITY',
      name: '社区活动'
    },
    {
      code: 'TEMPORARY_PROJECT_OPEN',
      name: '项目开盘'
    },
    {
      code: 'TEMPORARY_PROJECT_FOREST',
      name: '项目开荒、入住'
    },
    {
      code: 'TEMPORARY_COMPLAINT',
      name: '客户投诉处理'
    },
    {
      code: 'TEMPORARY_STAFF',
      name: '员工活动'
    },
    {
      code: 'TEMPORARY_TRAINING',
      name: '培训、训练及竞聘等人力资源活动'
    },
    {
      code: 'TEMPORARY_NEW_EMPLOYEES',
      name: '新员工跟岗'
    },
    {
      code: 'TEMPORARY_OWNER',
      name: '业主大会、业委会相关活动'
    },
    {
      code: 'TEMPORARY_PROPERTY_FEE',
      name: '物业费收缴'
    },
    {
      code: 'TEMPORARY_AWARDS_EVENTS',
      name: '各类评优活动'
    },
    {
      code: 'TEMPORARY_RECEPTION',
      name: '接待及公关活动'
    },
    {
      code: 'TEMPORARY_QUALITY',
      name: '品质提升'
    },
    {
      code: 'TEMPORARY_GOVERNMENT',
      name: '政府相关部门协助'
    },
    {
      code: 'TEMPORARY_OTHER',
      name: '其他'
    }]
}
// 休假类型
exports.leaveType = () => {
  return [
    {
      id: 'HOLIDAY_ADJUSTABLE',
      name: '调休假',
      unit: 'hour',
      ontOff: false
    }, {
      id: 'HOLIDAY_STATUTORY_ANNUAL',
      name: '法定年休假',
      unit: 'day',
      ontOff: false
    }, {
      id: 'HOLIDAY_PAY_ANNUAL',
      name: '额外带薪年休假',
      unit: 'day',
      ontOff: false
    }, {
      id: 'HOLIDAY_SPRING_FESTIVAL',
      name: '春节调休假',
      unit: 'day',
      ontOff: false
    }, {
      id: 'HOLIDAY_CARRY_OVER',
      name: '结转年休假',
      unit: 'day',
      ontOff: false
    }, {
      id: 'HOLIDAY_MARRIAGE',
      name: '婚假',
      unit: 'day',
      ontOff: true
    }, {
      id: 'HOLIDAY_FUNERAL',
      name: '丧假',
      unit: 'day',
      ontOff: true
    }, {
      id: 'HOLIDAY_MATERNITY',
      name: '产假',
      unit: 'day',
      ontOff: true
    }, {
      id: 'HOLIDAY_NURSING',
      name: '护理假',
      unit: 'day',
      ontOff: true
    }, {
      id: 'HOLIDAY_CONTRACEPTION',
      name: '节育假',
      unit: 'day',
      ontOff: true
    }, //  {
    //   id: 'HOLIDAY_FAMILY_PLANNING',
    //   name: '计划生育假',
    //   unit: 'day',
    //   ontOff: true
    // },
    {
      id: 'HOLIDAY_ORDINARY_SICK',
      name: '普通病假或医疗期外',
      unit: 'hour',
      ontOff: false
    }, {
      id: 'HOLIDAY_STATUTORY_SICK',
      name: '法定病假医疗期',
      unit: 'hour',
      ontOff: true
    }, {
      id: 'HOLIDAY_INDUSTRIAL_INJURY',
      name: '法定工伤医疗期',
      unit: 'hour',
      ontOff: true
    }, {
      id: 'HOLIDAY_PRIVATE_AFFAIR',
      name: '事假',
      unit: 'hour',
      ontOff: false
    }, {
      id: 'HOLIDAY_OTHER_PAY',
      name: '其他带薪假',
      unit: 'day',
      ontOff: false
    }
  ]
}
