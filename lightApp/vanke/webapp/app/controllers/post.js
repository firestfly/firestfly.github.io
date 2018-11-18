'use strict';

VkrmsApp.controller('PostController', ['$scope', '$filter', '$location', '$timeout', 'CommonService', 'PostService', function ($scope, $filter, $location, $timeout, commonService, postService) {
    $scope.title = "万科资源管理信息系统 - 岗位设置";

    $scope.commonSearchBarConfig = {
        companySelecterLabel: "公司/管理中心",
        departmentSelecterLabel: "部门/服务中心",
        isCompanySelectpickerMultiple: false,
        isDepartmentSelectpickerMultipe: false
    };
    var isCheck = location.hash.indexOf("post-check") >= 0;
    $scope.search = search;
    $scope.setRule = setRule;
    $scope.$on('selectpicker-loaded', function () {
        $timeout(search, 0);
    });
    $scope.isForceInPosts = [{
        id: 0,
        text: "否"
    }, {
        id: 1,
        text: "是"
    }];
    var requirePosts = ['出入口', '秩序', '指挥中心'];
    $scope.paginationConfig = {
        pageOptions: [100, 50, 30, 10]
    };
    function setRule(post) {
        var params = {
            departmentId: $scope.departmentId,
            company: $scope.company,
            department: $scope.department,
            postId: post.postId,
            postName: post.postName,
            postShortName: post.postShortName
        };
        if (isCheck) {
            params.checkpage = 'ok';
            sessionStorage["searchState_#/post-rule"] = JSON.stringify(params);
            $location.path('/post-rule');
        } else {
            sessionStorage["searchState_#/post-rule"] = JSON.stringify(params);
            $location.path('/post-rule');
        }
    }
    function getSearchParams() {
        return {
            "length": $scope.page,
            "start": ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            "search[value]": {
                departments: _.pluck($scope.selectedDepartments, 'department_id')
            }
        }
    }
    function search() {
        var departmentIds = $scope.selectedDepartments;
        if (!departmentIds.length) {
            commonService.alert({
                content: "请选择查询部门",
                icon: "fa-exclamation-circle"
            });
            return false;
        }
        $scope.searchIng = true;
        $scope.departmentId = departmentIds[0].department_id;
        $scope.company = $scope.selectedCompanies[0].company_name;
        $scope.department = $scope.selectedDepartments[0].department_name;

        postService.getPost(getSearchParams()).then(function (result) {
            $scope.posts = result.data || [];
            angular.forEach($scope.posts, function (post) {
                requirePosts.forEach(function (v) {
                    if (post.postName.indexOf(v) >= 0) {
                        post.disableForceInPost = 1;
                    }
                });
            });
            $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
            $scope.noData = !$scope.posts || !$scope.posts.length;
            $scope.isEdite = false;
            $scope.inserted = null;
            $scope.searchIng = false;
        });
        commonService.storageSearchStatus($scope, {
            selectedCompanies: $scope.selectedCompanies,
            selectedDepartments: $scope.selectedDepartments,
            departments: $scope.departments
        });
    }

    $scope.editePost = function (rowform) {
        if (!$scope.isEdite) {
            rowform.$show();
        } else {
            commonService.alert({
                content: '请先保存后再修改！',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        }
        $scope.isEdite = true;
    };
    $scope.savePost = function (data, postId, postName, postType, isForceInPost, index) {
        if (!$scope.inserted || $scope.inserted.postId !== postId) {
            setTimeout(function () {
                angular.extend(data, {
                    departmentId: $scope.departmentId,
                    postId: postId,
                    type: postType,
                    isForceInPost: $scope.posts[index].isForceInPost
                });
                if (postType == 1) {
                    data.postName = postName;
                }
                postService.editePost(data).then(function () {
                    $scope.isEdite = false;
                });
            }, 0);
        } else {
            setTimeout(function () {
                $scope.inserted = null;
                requirePosts.forEach(function (v) {
                    if (data.postName.indexOf(v) >= 0) {
                        data.isForceInPost = 1;
                    }
                });
                angular.extend(data, {
                    isForceInPost: $scope.posts[index].isForceInPost || 0,
                    departmentId: $scope.departmentId
                });
                postService.addPost(data).then(function () {
                    $scope.isEdite = false;
                    search();
                });
            }, 0);
        }
    };

    $scope.removePost = function (index, postId) {
        var config = {
            "title": "删除提示",
            "icon": "fa-exclamation-circle",
            "content": "您确认删除此条常规班次设置吗？",
            "callback": function () {
                postService.delPost(postId).then(function () {
                    $scope.posts.splice(index, 1);
                })
            }
        };
        commonService.confirm(config);
    };

    $scope.addPost = function (form) {
        if ($scope.isEdite) {
            return;
        }
        if ($scope.inserted) {
            return;
        }
        $scope.inserted = {
            id: null,
            name: '',
            shortname: ''
        };
        $scope.posts.push($scope.inserted);
        $timeout(function () {
            $scope.shown = $scope.inserted;
            $('.table-bordered tr:last-child a').eq(1).trigger('click');
        }, 10);
    };

    $scope.removeTempPost = function () {
        $scope.isEdite = false;
        var index = $scope.posts.indexOf($scope.inserted);
        if (index >= 0) {
            $scope.posts.splice(index, 1);
        }
        $scope.inserted = null;
    };
    function beforeSaveCheck(index, item, list, key) {
        var isValid = true;
        for (var i = 0, len = list.length; i < len; i++) {
            if (index != i && item == list[i][key]) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    $scope.checkName = function (data, index) {
        if (!data) {
            return "岗位名称不能为空!";
        }
        if (!beforeSaveCheck(index, data, $scope.posts, "postName")) {
            return "岗位名称不能重复!";
        }
        if (data.length >= 20) {
            return "岗位名称长度最多为20！"
        }
    };
    $scope.changePostName = function (data, index) {
        //debugger
        var isDisabled = false;
        requirePosts.forEach(function (v) {
            if (data.indexOf(v) >= 0) {
                isDisabled = true
                console.log(111)
            }
        });
        if(isDisabled) {
            $scope.posts[index].isForceInPost = 1;
            $scope.posts[index].disableForceInPost = 1;
        } else {
            $scope.posts[index].disableForceInPost = 0;
        }
    };
    $scope.changeForceInPosts = function (data, index) {
        $scope.posts[index].isForceInPost = data;
    };
    $scope.checkIsForceInPost = function (data, index) {
        if (data!= 0 && !data) {
            return "必填项!";
        }
    };
    $scope.checkShortName = function (data, index) {
        if (!data) {
            return "岗位简称不能为空!";
        }
        if (!beforeSaveCheck(index, data, $scope.posts, "postShortName")) {
            return "岗位简称不能重复!";
        }
        if (data.length >= 10) {
            return "岗位简称长度最多为10！"
        }
    };

}]);


