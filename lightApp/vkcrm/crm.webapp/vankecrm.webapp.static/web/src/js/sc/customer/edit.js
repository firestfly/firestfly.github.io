(function() {
  //渲染数据
  var jq_basic_name = null,
    temp_basic_name = null,
    jq_basic_cardType = null,
    temp_basic_cardType = null,
    jq_basic_sex = null,
    temp_basic_sex = null,
    jq_basic_customerType = null,
    temp_basic_customerType = null,
    jq_basic_affType = null,
    temp_basic_affType = null,
    jq_basic_idcard = null,
    temp_basic_idcard = null,
    jq_basic_mainMobile = null,
    temp_basic_mainMobile = null,
    jq_basic_standbyMobile = null,
    temp_basic_standbyMobile = null,
    jq_basic_officeTel = null,
    temp_basic_officeTel = null,
    jq_basic_homeTel = null,
    temp_basic_homeTel = null;
  var jq_details_postCode = null,
    temp_details_postCode = null,
    jq_details_email = null,
    temp_details_email = null,
    jq_details_qq = null,
    temp_details_qq = null,
    jq_details_wechat = null,
    temp_details_wechat = null,
    jq_details_birthday = null,
    temp_details_birthday = null,
    jq_details_blood = null,
    temp_details_blood = null,
    jq_details_J_name = null,
    temp_details_J_name = null,
    jq_details_J_phone = null,
    temp_details_J_phone = null,
    jq_details_c_addre = null,
    temp_details_c_addre = null,
    jq_details_h_addre = null,
    temp_details_h_addre = null,
    jq_details_conaddre = null,
    temp_details_conaddre = null,
    jq_details_c = null,
    temp_details_c = null,
    jq_details_job = null,
    temp_details_job = null,
    jq_details_remark = null,
    temp_details_remark = null;
  var jq_tags = null,
    temp_tags = null;
  var tags = null,
    dictionaryTags = null,
    basicFormData = null,
    detailsFormData = null;
  //渲染数据字典
  var d_cardType = null,
    d_temp_cardType = null,
    d_customerType = null,
    d_temp_customerType = null,
    d_affiliationType = null,
    d_temp_affiliationType = null,
    d_tags = null,
    d_temp_tags = null,
    d_sex = null,
    d_temp_sex = null,
    d_job = null,
    d_temp_job = null,
    d_bloodType = null,
    d_temp_bloodType = null;
  var hasInit = false;
  var config = {
    url_editCustomer: servicePath.customer + "/v1/customer/" + window.customerId + "/basic",
    url_editDetailsCustomer: servicePath.customer + "/v1/customer/" + window.customerId + "/details",
    url_dictionary: servicePath.customer + "/v1/dict/items",
    url_dictionaryTags: servicePath.customer + "/v1/batch/dict/CustomerTags/items",
    url_tags: servicePath.customer + "/v1/customer/" + window.customerId + "/tags",
    url_update_basic: servicePath.customer + "/v1/customer/updateBasic",
    url_update_details: servicePath.customer + "/v1/customer/updateDetails",
    url_update_tags: servicePath.customer + "/v1/customer/" + window.customerId + "/updateTags",
    nameTempId: "#__view_name",
    cardTypeTempId: "#__view_cardType",
    customerTypeTempId: "#__view_customerType",
    idcardTempId: "#__view_idcard",
    mainMobileTempId: "#__view_mainMobile",
    standbyMobileTempId: "#__view_standbyMobile",
    officeTelTempId: "#__view_officeTel",
    homeTelTempId: "#__view_homeTel",
    postCodeTempId: "#__view_postCode",
    emailTempId: "#__view_email",
    qqTempId: "#__view_qq",
    wechatTempId: "#__view_wechat",
    birthdayTempId: "#__view_birthday",
    bloodTempId: "#__view_blood",
    J_nameTempId: "#__view_J_name",
    J_phoneTempId: "#__view_J_phone",
    J_telTempId: "#__view_J_tel",
    c_addreTempId: "#__view_c_addre",
    h_addreTempId: "#__view_h_addre",
    c_TempId: "#__view_c",
    job_TempId: "#__view_job",
    conAdree_TempId: "#__view_conAddre",
    remark_TempId: "#__view_remark",
    tagsTempId: "#__view_tags",
    sexTempId: "#__view_sex",
    affTypeTempId: "#__view_affType",
    //数据字典
    d_cardTypeTempId: "#__d_cardType",
    d_customerTypeTempId: "#__d_customerType",
    d_affiliationTempId: "#__d_affiliation",
    d_sexTempId: "#__d_sex",
    d_jobTempId: "#__d_job",
    d_bloodType: "#__d_bloodType",
    d_tagsTempId: "#__d_tags"
  };

  function changeStatic() {
    $("#Add_userBtn").click(function() {
      $(".c_form").show();
      $(".c_search").hide();
    });
    $(".btn.btn-success").hide();
  }
  var ajaxGet_basicForm_ajaxHandle = null;

  function ajaxGetBasicForm() {
    if(ajaxGet_basicForm_ajaxHandle) {
      ajaxGet_basicForm_ajaxHandle.abort();
    }
    $("._basic_view").removeClass("on");
    $(".c_hide").addClass("on");
    ajaxGet_basicForm_ajaxHandle = Common.ajax({
      url: config.url_editCustomer,
      type: "get",
      success: function(res) {
        if(res.success) {
          basicFormData = res.details;
          renderBasicForm(res);
          basicEdit();
        }
      },
      error: function(error) {
        basicEdit();
      },
      complete: function() {}
    })
  }
  var ajaxGet_tags_ajaxHandle = null;

  function ajaxGetTags() {
    if(ajaxGet_tags_ajaxHandle) {
      ajaxGet_tags_ajaxHandle.abort();
    }
    $("._tags_view").removeClass("on");
    $(".c_tags_hide").addClass("on");
    ajaxGet_tags_ajaxHandle = Common.ajax({
      url: config.url_tags,
      type: "get",
      success: function(res) {
        if(res.success) {
          tagIds = [];
          for(var i = res.details.length - 1; i >= 0; i--) {
            tagIds.push(res.details[i].contentId);
          }
          tags = {
            tagIds: tagIds
          };
          renderTags(res);
        }
      },
      error: function(error) {},
      complete: function() {}
    })
  }
  var ajaxGet_detailsForm_ajaxHandle = null;

  function ajaxGetDetailsForm() {
    if(ajaxGet_detailsForm_ajaxHandle) {
      ajaxGet_detailsForm_ajaxHandle.abort();
    }
    $("._details_view").removeClass("on");
    $(".c_d_hide").addClass("on");
    ajaxGet_detailsForm_ajaxHandle = Common.ajax({
      url: config.url_editDetailsCustomer,
      type: "get",
      success: function(res) {
        if(res.success) {
          detailsFormData = res.details;
          renderDetailForm(res);
        }
        detailsEdit();
      },
      error: function(error) {
        renderDetailForm(error);
        detailsEdit();
      },
      complete: function() {}
    })
  }
  var ajaxGet_dictionaryTags_ajaxHandle = null;

  function ajaxGetDictionaryTags() {
    if(ajaxGet_dictionaryTags_ajaxHandle) {
      ajaxGet_dictionaryTags_ajaxHandle.abort();
    }
    ajaxGet_dictionaryTags_ajaxHandle = Common.ajax({
      url: config.url_dictionaryTags,
      type: "GET",
      success: function(res) {
        if(res.success) {
          dictionaryTags = res.details;
          renderDictionaryTags(res);
          dictionaryTagsEdit();
        }
      },
      error: function(error) {
        renderDictionaryTags();
        dictionaryTagsEdit();
      },
      complete: function() {}
    });
  }
  var ajaxGet_dictionary_ajaxHandle = null;

  function ajaxGetDictionary() {
    if(ajaxGet_dictionary_ajaxHandle) {
      ajaxGet_dictionary_ajaxHandle.abort();
    }
    ajaxGet_dictionary_ajaxHandle = Common.ajax({
      url: config.url_dictionary,
      type: "POST",
      data: {
        codes: 'CustomerAffilication,CustomerSex,CustomerType,CustomerIdentity,CustomerHobbies,HouseCustomerRelationType,CustomerRelationType,CustomerOccupation,CustomerBlood,CustomerCertificateType#CRMv2'
      },
      success: function(res) {
        if(res.success) {
          renderDictionary(res);
          ajaxGetBasicForm();
          ajaxGetDetailsForm();
          ajaxGetTags();
          ajaxGetDictionaryTags();
        }
      },
      error: function(error) {
        ajaxGetBasicForm();
        ajaxGetDetailsForm();
        ajaxGetTags();
        ajaxGetDictionaryTags();
      },
      complete: function() {}
    });
  }

  function renderTags(data) {
    var data_tags = temp_tags(data);
    $("#tags_edit_btn").show();
    $("#tags_save_btn").hide();
    $("#tags_cancel_btn").hide();
    jq_tags.html(data_tags);
  }

  function renderDictionaryTags(data) {
    var data_tags = d_temp_tags(data);
    d_tags.html(data_tags);
    $("#tags_edit_btn").show();
    dictionaryTagsEdit();
  }

  function renderDetailForm(data) {
    var data_details_postCode = temp_details_postCode({
      customerDetails: data.details
    });
    var data_details_email = temp_details_email({
      customerDetails: data.details
    });
    var data_details_qq = temp_details_qq({
      customerDetails: data.details
    });
    var data_details_wechat = temp_details_wechat({
      customerDetails: data.details
    });
    var data_details_birthday = temp_details_birthday({
      customerDetails: data.details
    });
    var data_details_blood = temp_details_blood({
      customerDetails: data.details
    });
    var data_details_J_name = temp_details_J_name({
      customerDetails: data.details
    });
    var data_details_J_phone = temp_details_J_phone({
      customerDetails: data.details
    });
    var data_details_J_tel = temp_details_J_tel({
      customerDetails: data.details
    });
    var data_details_c_addre = temp_details_c_addre({
      customerDetails: data.details
    });
    var data_details_h_addre = temp_details_h_addre({
      customerDetails: data.details
    });
    var data_details_c = temp_details_c({
      customerDetails: data.details
    });
    var data_details_job = temp_details_job({
      customerDetails: data.details
    });
    var data_details_conAdree = temp_details_conaddre({
      customerDetails: data.details
    });
    var data_details_remark = temp_details_remark({
      customerDetails: data.details
    });
    jq_details_postCode.html(data_details_postCode);
    jq_details_email.html(data_details_email);
    jq_details_qq.html(data_details_qq);
    jq_details_wechat.html(data_details_wechat);
    jq_details_birthday.html(data_details_birthday);
    jq_details_blood.html(data_details_blood);
    jq_details_J_name.html(data_details_J_name);
    jq_details_J_phone.html(data_details_J_phone);
    jq_details_J_tel.html(data_details_J_tel);
    jq_details_c_addre.html(data_details_c_addre);
    jq_details_h_addre.html(data_details_h_addre);
    jq_details_c.html(data_details_c);
    jq_details_job.html(data_details_job);
    jq_details_conaddre.html(data_details_conAdree);
    jq_details_remark.html(data_details_remark);
    $("#details_edit_btn").show();
  }

  function renderBasicForm(data) {
    var data_basic_name = temp_basic_name({
      customer: data.details
    });
    var data_basic_cardType = temp_basic_cardType({
      customer: data.details
    });
    var data_basic_idcard = temp_basic_idcard({
      customer: data.details
    });
    var data_basic_mainMobile = temp_basic_mainMobile({
      customer: data.details
    });
    var data_basic_standbyMobile = temp_basic_standbyMobile({
      customer: data.details
    });
    var data_basic_officeTel = temp_basic_officeTel({
      customer: data.details
    });
    var data_basic_homeTel = temp_basic_homeTel({
      customer: data.details
    });
    var data_basic_sex = temp_basic_sex({
      customer: data.details
    });
    var data_basic_customerType = temp_basic_customerType({
      customer: data.details
    });
    var data_basic_affType = temp_basic_affType({
      customer: data.details
    });
    jq_basic_name.html(data_basic_name);
    jq_basic_cardType.html(data_basic_cardType);
    jq_basic_sex.html(data_basic_sex);
    jq_basic_idcard.html(data_basic_idcard);
    jq_basic_mainMobile.html(data_basic_mainMobile);
    jq_basic_standbyMobile.html(data_basic_standbyMobile);
    jq_basic_officeTel.html(data_basic_officeTel);
    jq_basic_homeTel.html(data_basic_homeTel);
    jq_basic_customerType.html(data_basic_customerType);
    jq_basic_affType.html(data_basic_affType);
    $("#basic_edit_btn").show();
  }

  function renderDictionary(data) {
    //var data_cardType = d_temp_cardType(data);
    var data_customerType = d_temp_customerType(data);
    var data_affiliationType = d_temp_affiliationType(data);
    var data_sex = d_temp_sex(data);
    var data_job = d_temp_job(data);
    var data_blood = d_temp_bloodType(data);
    var data_cardType = d_temp_cardType(data);
    //d_cardType.html(data_cardType);
    d_customerType.html(data_customerType);
    d_affiliationType.html(data_affiliationType);
    d_sex.html(data_sex);
    d_job.html(data_job);
    d_bloodType.html(data_blood);
    d_cardType.html(data_cardType);
  }

  function bindDictionary() {
    d_cardType = $("#_d_cardType");
    d_customerType = $("#_d_customerType");
    d_affiliationType = $("#_d_affiliation");
    d_sex = $("#_d_sex");
    d_job = $("#_d_job");
    d_bloodType = $("#_d_bloodType");
    d_temp_cardType = template.compile($(config.d_cardTypeTempId).html());
    d_temp_customerType = template.compile($(config.d_customerTypeTempId).html());
    d_temp_affiliationType = template.compile($(config.d_affiliationTempId).html());
    d_temp_sex = template.compile($(config.d_sexTempId).html());
    d_temp_job = template.compile($(config.d_jobTempId).html());
    d_temp_bloodType = template.compile($(config.d_bloodType).html());
  }

  function bindDictionaryTags() {
    d_tags = $("#_d_tags");
    d_temp_tags = template.compile($(config.d_tagsTempId).html());
  }

  function bindTags() {
    jq_tags = $("#_view_tags");
    temp_tags = template.compile($(config.tagsTempId).html());
  }

  function bindVariable() {
    jq_basic_name = $("#_view_name");
    jq_basic_cardType = $("#_view_cardType");
    jq_basic_sex = $("#_view_sex");
    jq_basic_customerType = $("#_view_customerType");
    jq_basic_affType = $("#_view_affType");
    jq_basic_idcard = $("#_view_idcard");
    jq_basic_mainMobile = $("#_view_mainMobile");
    jq_basic_standbyMobile = $("#_view_standbyMobile");
    jq_basic_officeTel = $("#_view_officeTel");
    jq_basic_homeTel = $("#_view_homeTel");
    jq_details_postCode = $("#_view_postCode");
    jq_details_email = $("#_view_email");
    jq_details_qq = $("#_view_qq");
    jq_details_wechat = $("#_view_wechat");
    jq_details_birthday = $("#_view_birthday");
    jq_details_blood = $("#_view_blood");
    jq_details_J_name = $("#_view_J_name");
    jq_details_J_phone = $("#_view_J_phone");
    jq_details_J_tel = $("#_view_J_tel");
    jq_details_c_addre = $("#_view_c_addre");
    jq_details_h_addre = $("#_view_h_addre");
    jq_details_c = $("#_view_c");
    jq_details_job = $("#_view_job");
    jq_details_conaddre = $("#_view_conAddre");
    jq_details_remark = $("#_view_remark");
    temp_basic_name = template.compile($(config.nameTempId).html());
    temp_basic_cardType = template.compile($(config.cardTypeTempId).html());
    temp_basic_sex = template.compile($(config.sexTempId).html());
    temp_basic_customerType = template.compile($(config.customerTypeTempId).html());
    temp_basic_affType = template.compile($(config.affTypeTempId).html());
    temp_basic_idcard = template.compile($(config.idcardTempId).html());
    temp_basic_mainMobile = template.compile($(config.mainMobileTempId).html());
    temp_basic_standbyMobile = template.compile($(config.standbyMobileTempId).html());
    temp_basic_officeTel = template.compile($(config.officeTelTempId).html());
    temp_basic_homeTel = template.compile($(config.homeTelTempId).html());
    temp_details_postCode = template.compile($(config.postCodeTempId).html());
    temp_details_email = template.compile($(config.emailTempId).html());
    temp_details_qq = template.compile($(config.qqTempId).html());
    temp_details_wechat = template.compile($(config.wechatTempId).html());
    temp_details_birthday = template.compile($(config.birthdayTempId).html());
    temp_details_blood = template.compile($(config.bloodTempId).html());
    temp_details_J_name = template.compile($(config.J_nameTempId).html());
    temp_details_J_phone = template.compile($(config.J_phoneTempId).html());
    temp_details_J_tel = template.compile($(config.J_telTempId).html());
    temp_details_c_addre = template.compile($(config.c_addreTempId).html());
    temp_details_h_addre = template.compile($(config.h_addreTempId).html());
    temp_details_c = template.compile($(config.c_TempId).html());
    temp_details_job = template.compile($(config.job_TempId).html());
    temp_details_conaddre = template.compile($(config.conAdree_TempId).html());
    temp_details_remark = template.compile($(config.remark_TempId).html());
  }

  function basicEdit() {
    var basic_edit_btn = $("#basic_edit_btn");
    var basic_cancel_btn = $("#basic_cancel_btn");
    $("#basic_save_btn").hide();
    $("#basic_cancel_btn").hide();
    basic_edit_btn.unbind("click");
    basic_edit_btn.click(function() {
      $("#basic_save_btn").show();
      $("#basic_cancel_btn").show();
      $("#basic_edit_btn").hide();
      $("._basic_view").addClass("on");
      $(".c_hide").removeClass("on");
      Common.setFormData(basic_info, basicFormData);
      basicSubmit();
    });
    basic_cancel_btn.unbind("click");
    basic_cancel_btn.click(function() {
      $("#basic_save_btn").hide();
      $("#basic_cancel_btn").hide();
      $("#basic_edit_btn").show();
      $("._basic_view").removeClass("on");
      $(".c_hide").addClass("on");
      $("#basic_info").find('.errortip').removeClass('on').tooltip("destroy");
    });
  }

  function dictionaryTagsEdit() {
    var tags_edit_btn = $("#tags_edit_btn");
    var tags_cancel_btn = $("#tags_cancel_btn");
    $("#tags_save_btn").hide();
    $("#tags_cancel_btn").hide();
    tags_edit_btn.unbind("click");
    tags_edit_btn.click(function() {
      $("#tags_save_btn").show();
      $("#tags_cancel_btn").show();
      $("#tags_edit_btn").hide();
      $("._tags_view").addClass("on");
      $(".c_tags_hide").removeClass("on");
      Common.setFormData(edit_person_tips, tags);
      tagsSubmit();
    });
    tags_cancel_btn.unbind("click");
    tags_cancel_btn.click(function() {
      $("#tags_save_btn").hide();
      $("#tags_cancel_btn").hide();
      $("#tags_edit_btn").show();
      $("._tags_view").removeClass("on");
      $(".c_tags_hide").addClass("on");
    });
  }

  function detailsEdit() {
    var details_edit_btn = $("#details_edit_btn");
    var details_cancel_btn = $("#details_cancel_btn");
    $("#details_save_btn").hide();
    $("#details_cancel_btn").hide();
    details_edit_btn.unbind("click");
    details_edit_btn.click(function() {
      $("#details_save_btn").show();
      $("#details_cancel_btn").show();
      $("#details_edit_btn").hide();
      $("._details_view").addClass("on");
      $(".c_d_hide").removeClass("on");
      Common.setFormData(detail_info, detailsFormData || false);
      detailsSubmit();
    });
    details_cancel_btn.unbind("click");
    details_cancel_btn.click(function() {
      $("#details_save_btn").hide();
      $("#details_cancel_btn").hide();
      $("#details_edit_btn").show();
      $("._details_view").removeClass("on");
      $(".c_d_hide").addClass("on");
      $("#detail_info").find('.errortip').removeClass('on').tooltip("destroy");
    });
  }
  var ajaxGet_basicSubmit_ajaxHandle = null;

  function basicSubmit() {
    $("#basic_save_btn").unbind("click");
    $("#basic_save_btn").click(function() {
      $("#basic_info").find('.errortip').removeClass('on').tooltip("destroy");
      var isError = validate($("#basic_info")[0], {
        validateAll: true,
        onerror: function(caller, text) {
          $(caller).closest("td").find(".errortip").addClass("on").tooltip({
            title: text,
            placement: "bottom"
          })
        }
      });
      if(isError) {
        Common.tip.add({
          text: "保存失败,请检查是否填写正确",
          type: 'warning'
        });
        return;
      }
      var basicInfo = Common.getFormData($("#basic_info")[0]);
      if(ajaxGet_basicSubmit_ajaxHandle) {
        ajaxGet_basicSubmit_ajaxHandle.abort();
      }
      ajaxGet_basicSubmit_ajaxHandle = Common.ajax({
        url: config.url_update_basic,
        type: "post",
        data: basicInfo,
        success: function(res) {
          if(res.success) {
            Common.tip.add({
              text: "保存成功",
              type: 'info'
            });
            ajaxGetBasicForm();
            customerInfoInit();
          } else {
            Common.tip.add({
              text: "保存失败",
              type: 'warning'
            });
          }
        },
        error: function(error) {
          if(error.code == '403') {
            alert(error.message);
          }
          Common.tip.add({
            text: "保存失败",
            type: 'warning'
          });
        },
        complete: function() {}
      })
    })
  }
  var ajaxGet_tagsSubmit_ajaxHandle = null;

  function tagsSubmit() {
    $("#tags_save_btn").unbind("click");
    $("#tags_save_btn").click(function() {
      var tagsInfo = Common.getFormData(edit_person_tips);
      if(ajaxGet_tagsSubmit_ajaxHandle) {
        ajaxGet_tagsSubmit_ajaxHandle.abort();
      }
      ajaxGet_tagsSubmit_ajaxHandle = Common.ajax({
        url: config.url_update_tags,
        type: "post",
        data: tagsInfo,
        success: function(res) {
          if(res.success) {
            Common.tip.add({
              text: "保存成功",
              type: 'info'
            });
            ajaxGetTags();
            customerInfoInit();
          } else {
            Common.tip.add({
              text: "保存失败",
              type: 'warning'
            });
          }
        },
        error: function(error) {
          Common.tip.add({
            text: "保存失败",
            type: 'warning'
          });
        },
        complete: function() {}
      })
    })
  }
  var ajaxGet_detailsSubmit_ajaxHandle = null;

  function detailsSubmit() {
    $("#details_save_btn").unbind("click");
    $("#details_save_btn").click(function() {
      $("#detail_info").find('.errortip').removeClass('on').tooltip("destroy");
      var isError = validate($("#detail_info")[0], {
        validateAll: true,
        onerror: function(caller, text) {
          $(caller).closest("td").find(".errortip").addClass("on").tooltip({
            title: text,
            placement: "bottom"
          })
        }
      });
      if(isError) {
        Common.tip.add({
          text: "保存失败,请检查是否填写正确",
          type: 'warning'
        });
        return;
      }
      var detailsInfo = Common.getFormData($("#detail_info")[0]);
      if(ajaxGet_detailsSubmit_ajaxHandle) {
        ajaxGet_detailsSubmit_ajaxHandle.abort();
      }
      ajaxGet_detailsSubmit_ajaxHandle = Common.ajax({
        url: config.url_update_details,
        type: "post",
        data: detailsInfo,
        success: function(res) {
          if(res.success) {
            Common.tip.add({
              text: "保存成功",
              type: 'info'
            });
            ajaxGetDetailsForm();
            customerInfoInit();
          } else {
            Common.tip.add({
              text: "保存失败",
              type: 'warning'
            });
          }
        },
        error: function(error) {
          Common.tip.add({
            text: "保存失败",
            type: 'warning'
          });
        },
        complete: function() {}
      })
    });
  }

  function active() {
    changeStatic();
    ajaxGetDictionary();
  }

  function init(opt) {
    if(!hasInit) {
      hasInit = true;
      bindVariable();
      bindTags();
      bindDictionary();
      bindDictionaryTags();
    }
    active(opt);
  }
  init();
})();

function validateIdcard() {
  if($("[name='certificateType']").val() !== '1') {
    return {
      isError: false
    };
  }
  var code = $("[name='certificateId']").val().toUpperCase();
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
