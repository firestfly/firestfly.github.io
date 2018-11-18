'use strict';

VkrmsApp.factory('DataTableService', function () {
    return {
        initDataTable: function (tableName, customConfig, data) {
            var basicConfig = {
                "dom": '<"container-fluid"<"row"<"col-md-12"t>><"row datatables-footer"<"col-md-3"l><"col-md-2"f><"col-md-7"pi>>>',
                "ordering": false,
                "scrollX": false,
                "paging": true,
                "searching": true,
                "stateSave": true,
                "iStateDuration": -1,
                "pagingType": "input",
                "language": {
                    "emptyTable": "表内无数据",
                    "lengthMenu": "每页显示 _MENU_ 条",
                    "zeroRecords": "查询无数据",
                    "info": "第 _PAGE_ 页 / 共 _PAGES_ 页",
                    "infoEmpty": "",
                    "infoFiltered": " (共 _MAX_ 条  搜索到 _TOTAL_ 条)",
                    "loadingRecords": "数据读取中...",
                    "processing": "请求处理中...",
                    "search": "搜索",
                    "paginate": {
                        "first": "首页",
                        "last": "末页",
                        "next": "下一页",
                        "previous": "上一页"
                    }
                },
                "lengthMenu": [
                    [10, 50, 100],
                    [10, 50, 100]
                ],
                "processing": true,
                "serverSide": true
            };
            var config = angular.extend(basicConfig, customConfig);
            if (config.ajax && config.ajax.url) {
                config.ajax.url = apiBaseUrl + "/" + config.ajax.url;
            }

            $.fn.dataTable.ext.errMode = 'none';
            if (data) {
                config.search = {
                    "search": JSON.stringify(data)
                };
            }
            window.dataTable = $('#' + tableName).DataTable(config);
        },
        dataTableSearch: function (tableName, data) {
            $('#' + tableName).DataTable().search(JSON.stringify(data)).draw();
        },
        dataTableSearchByColumn: function tableSearch(tableName, i, data) {
            $("#" + tableName).DataTable().column(i).search(data).draw();
        }
    }
});