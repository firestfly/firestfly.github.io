(function() {
  var jq_houseOwner = null,
    temp_houseOwner = null,
    jq_a = null,
    temp_a = null;
  var d_cardType = null,
    d_temp_cardType = null,
    d_customerType = null,
    d_temp_customerType = null,
    d_affiliationType = null,
    d_temp_affiliationType = null,
    d_sex = null,
    d_temp_sex = null,
    d_job = null,
    d_temp_job = null,
    d_bloodType = null,
    d_temp_bloodType = null,
    d_hobby = null,
    d_temp_hobby = null,
    d_sp = null,
    d_temp_sp = null,
    d_houseRel = null,
    d_temp_houseRel = null; //锟斤拷染锟斤拷锟斤拷锟街碉拷
  var temp_relationOption = null,
    data_relationOption = null;
  var hasInit = false;
  var curPage = 1,
    pageSize = 10;
  var config = {
    url_NewhouseRel: servicePath.customer + '/v1/carport/relation',
    url_seacth_list: servicePath.customer + "/v1/customer/queryCustomer4Carport" + "/" + curPage + "/" + pageSize,
    url_submitForm: servicePath.customer + "/v1/customer/carport",
    url_getcustomerlist: servicePath.customer + "/v1/customer/house/" + window.carportId + "/owners",
    url_dictionary: servicePath.customer + "/v1/dict/items",
    url_detail: path.server + "/page/carport/" + window.carportId + "/details",
    formTempId: "#__view_customer_listBody",
    searchTempId: "#__view_search_list",
    d_cardTypeTempId: "#__d_cardType",
    d_customerTypeTempId: "#__d_customerType",
    d_affiliationTempId: "#__d_affiliation",
    d_sexTempId: "#__d_sex",
    d_jobTempId: "#__d_job",
    d_bloodType: "#__d_bloodType",
    d_hobby: "#__d_hobby",
    d_sp: "#__d_sp",
    d_houseRelTempId: "#__d_houseRel",
    selectTemplate: "#selectTemplate",
    checkboxTemplate: "#checkboxTemplate"
  };
  var p = new Pagination({
    template: "#paginationtmpl",
    selector: "#pagination",
    onchange: function(pageInfo) {
      curPage = pageInfo.curpage;
      pageSize = pageInfo.pagesize;
      config.url_seacth_list = servicePath.customer + "/v1/customer/queryCustomer4Carport" + "/" + curPage + "/" + pageSize;
      var paramData = Common.getFormData(searchForm);
      paramData.carportId = window.carportId;
      ajaxGet(paramData);
    }
  });
  /**
   * 绑定事件
   * @return {[type]} [description]
   */
  function bindEvent() {
    $("#addUserBtn").bind("click", function() {
      ajaxGetDictionary();
      $(".c_form").slideDown();
      $(".c_search").slideUp();
    });
    $("#searchBtn").bind("click", function() {
      var str = "";
      $("#searchForm").find("input").each(function() {
        str += $(this).val();
      });
      if(str == "") {
        alert("请输入查询条件")
      } else {
        var paramData = Common.getFormData($("#searchForm")[0]);
        paramData.carportId = window.carportId;
        ajaxGet(paramData);
      }
    });
    $("#customerTableBody").on("click", "a", function() {
      var customerId = $(this).attr("data-id");
      var paramData = Common.getFormData($("#" + customerId)[0]);
      paramData.customerIds = customerId;
      paramData.carportId = window.carportId;
      ajaxPostHouseRel(paramData);
    });
    $("#addc_form_btn").bind("click", function() {
      $("#form_Customer").find('.errortip').removeClass('on').tooltip("destroy");
      $("#form_CustomerDetail").find('.errortip').removeClass('on').tooltip("destroy");
      // $("#form_houseRel").find('.errortip').removeClass('on').tooltip("destroy");
      var validateResultBasic = validate($("#form_Customer")[0], {
        validateAll: true,
        onerror: function(caller, text) {
          $(caller).closest("td").find(".errortip").addClass("on").tooltip({
            title: text,
            placement: "bottom"
          })
        }
      });
      var validateResultDetail = validate($("#form_CustomerDetail")[0], {
        validateAll: true,
        onerror: function(caller, text) {
          $(caller).closest("td").find(".errortip").addClass("on").tooltip({
            title: text,
            placement: "bottom"
          })
        }
      });
      // var validateResultRelation = true;
      // if (!Common.getFormData(form_houseRel).houseRelationTypes) {
      //     validateResultRelation = true;
      //     $("#form_houseRel").find(".errortip").addClass("on").tooltip({
      //         title: "请选择一种关系",
      //         placement: "bottom"
      //     })
      // }
      if(validateResultBasic || validateResultDetail) {
        return;
      };
      submitForm(window.carportId);
    });
    $("#cancelc_form_btn").bind("click", function() {
      $(".c_form").slideUp();
      $(".c_search").slideDown();
      $("#form_Customer")[0].reset();
      $("#form_CustomerDetail")[0].reset();
      $("#form_hobbies")[0].reset();
      $("#form_houseRel")[0].reset();
      // $("#form_kehuRel")[0].reset();
      $("#form_Specialidentity")[0].reset();
    });
  }
  var ajaxGet_ajaxHandle = null;
  /**
   * 获取客户数据
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function ajaxGet(data) {
    if(ajaxGet_ajaxHandle) {
      ajaxGet_ajaxHandle.abort();
    }
    ajaxGet_ajaxHandle = Common.ajax({
      url: config.url_seacth_list,
      type: "get",
      data: data,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      success: function(res) {
        if(res.success) {
          renderSearch(res);
        } else {}
      },
      error: function(error) {},
      complete: function() {}
    })
    Common.loading({
      text: "",
      container: "#customerTableDiv",
      handle: ajaxGet_ajaxHandle
    });
  }
  var ajaxPostHouseRel_ajaxHandle = null;
  /**
   * 新增客户与房屋关系
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function ajaxPostHouseRel(data) {
    if(ajaxPostHouseRel_ajaxHandle) {
      ajaxPostHouseRel_ajaxHandle.abort();
    }
    ajaxPostHouseRel_ajaxHandle = Common.ajax({
      url: config.url_NewhouseRel,
      type: "post",
      data: data,
      success: function(res) {
        if(res.success) {
          alert("新增与车位关系成功，即将跳转页面.");
          window.location.href = config.url_detail;
          //var paramData = Common.getFormData($("#searchForm")[0]);
          //paramData.carportId = window.carportId;
          //ajaxGet(paramData);
        } else {
          alert(res.message);
        }
      },
      error: function(error) {
        alert("保存失败：" + error.message);
      },
      complete: function() {}
    })
  }
  /**
   * 渲染数据
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function renderSearch(data) {
    var html = temp_a(data);
    jq_a.html(html);
    var pageInfo = data.details.pagination;
    p.render({
      curpage: pageInfo.curPage,
      pagesize: pageInfo.pageSize,
      totalpage: pageInfo.totalPage,
      totalsize: pageInfo.totalSize
    })
    p.pagesize = pageInfo.pageSize;
  }
  var ajaxGetHouseOwnerList_ajaxHandle = null;
  /**
   * 获取业主关系
   * @return {[type]} [description]
   */
  function ajaxGetHouseOwnerList() {
    if(ajaxGetHouseOwnerList_ajaxHandle) {
      ajaxGetHouseOwnerList_ajaxHandle.abort();
    }
    ajaxGetHouseOwnerList_ajaxHandle = Common.ajax({
      url: config.url_getcustomerlist,
      type: "get",
      success: function(res) {
        // alert(JSON.stringify(res));
        if(res.success) {
          renderHouseOwnerList(res);
        }
      },
      error: function(error) {
        alert(error.message);
      },
      complete: function() {}
    })
  }
  /**
   * 渲染业主关系
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function renderHouseOwnerList(data) {
    // alert(JSON.stringify(data));
    var html = temp_houseOwner(data);
    jq_houseOwner.html(html);
    //填充select数据
    $(".relationselect").html(temp_relationOption({
      list: data_relationOption
    }));
  }
  var ajaxGetDictionary_ajaxHandle = null;
  /**
   * 获取字典数据
   * @return {[type]} [description]
   */
  function ajaxGetDictionary() {
    if(ajaxGetDictionary_ajaxHandle) {
      ajaxGetDictionary_ajaxHandle.abort();
    }
    ajaxGetDictionary_ajaxHandle = Common.ajax({
      url: config.url_dictionary,
      type: "POST",
      data: {
        codes: 'CustomerAffilication,CustomerSex,CustomerType,CustomerIdentity,CustomerHobbies,HouseCustomerRelationType,CustomerRelationType,CustomerOccupation,CustomerBlood,CustomerCertificateType#CRMv2'
      },
      success: function(res) {
        if(res.success) {
          renderDictionary(res);
          //ajaxGetHouseOwnerList();
        }
      },
      error: function(error) {
        alert(error.message);
      },
      complete: function() {}
    });
  }
  /**
   * 渲染字典
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  function renderDictionary(data) {
    // alert(JSON.stringify(data))
    //var data_cardType = d_temp_cardType(data);
    var data_customerType = d_temp_customerType(data);
    var data_affiliationType = d_temp_affiliationType(data);
    var data_sex = d_temp_sex(data);
    var data_job = d_temp_job(data);
    var data_blood = d_temp_bloodType(data);
    var data_hobby = d_temp_hobby(data);
    var data_sp = d_temp_sp(data);
    var data_houseRel = d_temp_houseRel(data);
    var data_cardType = d_temp_cardType(data);
    //d_cardType.html(data_cardType);
    d_customerType.html(data_customerType);
    d_affiliationType.html(data_affiliationType);
    d_sex.html(data_sex);
    d_job.html(data_job);
    d_bloodType.html(data_blood);
    d_hobby.html(data_hobby);
    d_sp.html(data_sp);
    d_cardType.html(data_cardType);
    //车位关系
    //d_houseRel.html(data_houseRel);
    var list = data["details"].CustomerRelationType;
    data_relationOption = list;
    // var selectHtml = template.compile($(config.selectTemplate).html());
    // jq_relation.html(temp_relationOption({list:list}));
    legalDispute();
  }
  /**
   * 绑定字典
   * @return {[type]} [description]
   */
  function bindDictionary() {
    d_cardType = $("#_d_cardType");
    d_customerType = $("#_d_customerType");
    d_affiliationType = $("#_d_affiliation");
    d_sex = $("#_d_sex");
    d_job = $("#_d_job");
    d_bloodType = $("#_d_bloodType");
    d_hobby = $("#_d_hobby");
    d_sp = $("#_d_sp");
    d_houseRel = $("#_d_houseRel");
    d_temp_cardType = template.compile($(config.d_cardTypeTempId).html());
    d_temp_customerType = template.compile($(config.d_customerTypeTempId).html());
    d_temp_affiliationType = template.compile($(config.d_affiliationTempId).html());
    d_temp_sex = template.compile($(config.d_sexTempId).html());
    d_temp_job = template.compile($(config.d_jobTempId).html());
    d_temp_bloodType = template.compile($(config.d_bloodType).html());
    d_temp_hobby = template.compile($(config.d_hobby).html());
    d_temp_sp = template.compile($(config.d_sp).html());
    d_temp_houseRel = template.compile($(config.d_houseRelTempId).html());
  }

  function bindVariable() {
    jq_a = $("#customerTableBody");
    jq_houseOwner = $("#_view_customer_listBody");
    temp_a = template.compile($(config.searchTempId).html());
    temp_houseOwner = template.compile($(config.formTempId).html());
    temp_relationOption = template.compile($(config.selectTemplate).html());
  }
  /**
   * 提交表单
   * @param  {[type]} houseId [description]
   * @return {[type]}         [description]
   */
  function submitForm(houseId) {
    $("#addc_form_btn").hide();
    var c_customer = Common.getFormData(form_Customer);
    var c_customerDetail = Common.getFormData(form_CustomerDetail);
    var c_hobbies = Common.getFormData(form_hobbies);
    var c_special = Common.getFormData(form_Specialidentity);
    var c_starttime = Common.getFormData(form_starttime);
    var c_chixutime = Common.getFormData(form_chixutime);
    var c_houseID = houseId;
    var c_kehuRel = Common.getFormData(form_kehuRel);
    var c_houseRel = Common.getFormData(form_houseRel);
    var c__customer = {};
    var c__customerDetail = {};
    var c__hobbies = {};
    var c__special = {};
    var c__starttime = {};
    var c__chixutime = {};
    var c__houseID = {};
    var c__kehuRel = {};
    var c__houseRel = {};
    c__houseID.carportId = c_houseID;
    c__customer = c_customer;
    c__customerDetail = c_customerDetail;
    c__hobbies = c_hobbies;
    c__special = c_special;
    c__starttime = c_starttime;
    c__chixutime = c_chixutime;
    c__kehuRel = c_kehuRel;
    c__houseRel = c_houseRel;
    var s = $.extend({}, c__kehuRel);
    var customerId = s.customerId && s.customerId.split(",") || [],
      relationType = s.relationType && s.relationType.split(",") || [],
      b = {};
    for(var i = 0; i < customerId.length; i++) {
      b["customerRelations[" + i + "].customerId"] = customerId[i]
    }
    for(var j = 0; j < relationType.length; j++) {
      b["customerRelations[" + j + "].relationType"] = relationType[j]
    }
    var sp = $.extend({}, c_special);
    var dd = sp.identity && sp.identity.split(",") || [],
      obj = {};
    for(var z = 0; z < dd.length; z++) {
      obj["identities[" + z + "].identity"] = dd[z]
    }
    for(var t = 0; t < dd.length; t++) {
      obj["identities[" + t + "].duration"] = sp.duration
    }
    for(var y = 0; y < dd.length; y++) {
      obj["identities[" + y + "].beginDate"] = sp.beginDate
    }
    var e = $.extend({}, c__hobbies, c__houseID, c__houseRel, c__customer, c__customerDetail, b, obj);
    // var e = $.extend({}, c__hobbies, c__houseID, c__houseRel, c__customer, c__customerDetail, obj);
    Common.ajax({
      url: config.url_submitForm,
      type: "post",
      data: e,
      success: function(res) {
        $("#addc_form_btn").show();
        if(res.success) {
          alert("新增客户成功，即将跳转页面.");
          window.location.href = config.url_detail;
        } else {
          alert(res.message);
        }
      },
      error: function(error) {
        $("#addc_form_btn").show();
        alert("保存失败");
      },
      complete: function() {}
    })
  }

  function legalDispute() {
    var checkText = $(".addc_specialidentity").find("input");
    checkText.each(function() {
      if($(this).val() == "8") {
        $(this).click(function() {
          $(".jiufen").toggleClass("on");
          $("._begintime").attr("name", "beginDate");
          $("._staytime").attr("name", "duration");
        })
      }
    })
  }

  function active() {}

  function init(opt) {
    if(!hasInit) {
      hasInit = true;
      bindEvent();
      bindVariable();
      bindDictionary();
    }
    active(opt);
  }
  init();
})();

function validateIdcard() {
  if($("[name='basic.certificateType']").val() !== '1') {
    return {
      isError: false
    };
  }
  var code = $("[name='basic.certificateId']").val().toUpperCase();
  if(code == "") {
    return {
      isError: false
    };
  }
  var city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
  };
  var tip = "";
  var pass = true;
  if(!code || !/^[1-9][0-9]{5}(1[0-9]{3}|2[0-9]{3})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(code)) {
    tip = "身份证号格式错误";
    pass = false;
  } else if(!city[code.substr(0, 2)]) {
    tip = "地址编码错误";
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if(code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for(var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if(parity[sum % 11] != code[17]) {
        tip = "校验位错误";
        pass = false;
      }
    }
  }
  if(!pass) console.log(tip);
  return {
    isError: !pass,
    errorInfo: tip
  };
}
