var curPage = 1,
  pageSize = 10;
jQuery(document).ready(function($) {
  //ajaxGetData({
  //    curPage: curPage,
  //    pageSize: pageSize
  //});
  ajaxGetCustomerCertificateType();
});
/**
 * 设置分页信息
 */
var p = new Pagination({
  template: "#paginationtmpl",
  selector: "#pagination",
  onchange: function(pageInfo) {
    curPage = pageInfo.curpage;
    pageSize = pageInfo.pagesize;
    var paramData = Common.getFormData(searchForm);
    paramData.curPage = curPage;
    paramData.pageSize = pageSize;
    ajaxGetData(paramData);
  }
});
/**
 * 绑定事件
 */
$("#searchBtn").bind("click", function() {
  var paramData = Common.getFormData(searchForm);
  curPage = 1;
  pageSize = 10;
  paramData.curPage = curPage;
  paramData.pageSize = pageSize;
  ajaxGetData(paramData);
});
$("#resetBtn").bind("click", function() {
  $("#searchForm")[0].reset();
});
/**
 * 查询客户信息
 */
var ajaxGetData_handle = null;

function ajaxGetData(paramData) {
  if(ajaxGetData_handle) {
    ajaxGetData_handle.abort();
  }
  var url = servicePath.customer + "/v1/customers";
  ajaxGetData_handle = Common.ajax({
    url: url,
    type: "GET",
    data: paramData,
    success: function(data) {
      if(data.success) {
        var html = template("customerTableTemplate", data.details);
        $("#customerTable").html(html);
        var pageInfo = data.details.pagination;
        p.render({
          curpage: pageInfo.curPage,
          pagesize: pageInfo.pageSize,
          totalpage: pageInfo.totalPage,
          totalsize: pageInfo.totalSize
        })
        p.pagesize = pageInfo.pageSize;
      } else {}
    },
    error: function() {},
    complete: function() {}
  });
  Common.loading({
    text: "",
    container: ".panel-body",
    handle: ajaxGetData_handle
  });
}
//获取证件类型
function ajaxGetCustomerCertificateType() {
  var url = servicePath.customer + "/v1/dict/items";
  Common.ajax({
    url: url,
    type: "POST",
    data: {
      codes: 'CustomerCertificateType#CRMv2'
    },
    success: function(res) {
      if(res.success) {
        var html = template("selectTemplate", res);
        $("#certificateType").html(html);
      } else {}
    },
    error: function() {},
    complete: function() {}
  });
}
