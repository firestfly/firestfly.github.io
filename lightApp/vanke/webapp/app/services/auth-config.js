'use strict';

VkrmsApp.factory('AuthConfig', ['UserService', 'CommonService', function (userService, commonService) {
    return {
        saveUserAuthConfig: function (id, data) {
            if (id && data) {
                userService.updateSelectedUser(id, data).then(
                    function () {
                        commonService.alert({
                            content: "保存成功",
                            icon: "fa-exclamation-circle"
                        });
                    },
                    function () {
                        commonService.alert({
                            content: "保存失败",
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                );
            }
        },
        saveUserAuthRoleGroups: function (id, data) {
            if (id && data) {
                userService.updateSelectedUserRoleGroups(id, data).then(
                    function () {
                        commonService.alert({
                            content: "保存成功",
                            icon: "fa-exclamation-circle"
                        });
                    },
                    function () {
                        commonService.alert({
                            content: "保存失败",
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                );
            }
        },
        switchTab: function (tabIndex) {
            $(".nav-tabs li").eq(tabIndex).addClass("active").siblings().removeClass("active");
        },
        initOrganizationsWithSelectTag: function (orgs, authorizedOrgs) {
            var parentKey = "company_id";
            var childKey = "department_id";
            var companyIds = commonService.getIds(orgs, parentKey);

            angular.forEach(authorizedOrgs, function (company) {
                var companyIndex = companyIds.indexOf(company[parentKey]);

                if (companyIndex >= 0) {
                    var departments = orgs[companyIndex].departments;
                    var departmentsIds = commonService.getIds(departments, childKey);

                    angular.forEach(company.departments, function (item) {
                        var orgIndex = departmentsIds.indexOf(item[childKey]);

                        if (orgIndex >= 0) {
                            departments[orgIndex].isSelected = true;
                        }
                    });
                }
            });
            return orgs;
        },
        initWorkgroupsWithSelectTag: function (groups, authorizedGroups) {
            var key = "work_group_id";
            var groupsIds = commonService.getIds(groups, key);

            angular.forEach(authorizedGroups, function (item) {
                var orgIndex = groupsIds.indexOf(item[key]);

                if (orgIndex >= 0) {
                    groups[orgIndex].isSelected = true;
                }
            });

            return groups;
        },
        initRoleGroupsWithSelectTag: function (functions, authorizedFunctions) {
            var key = "id";
            var parentIds = commonService.getIds(functions, key);

            angular.forEach(authorizedFunctions, function (parent) {
                var parentIndex = parentIds.indexOf(parent[key]);

                if (parentIndex >= 0) {
                    var childrenList = functions[parentIndex].children;
                    var childrenIds = commonService.getIds(childrenList, key);

                    if (childrenList && childrenList.length > 0) {
                        angular.forEach(parent.children, function (item) {
                            var childIndex = childrenIds.indexOf(item[key]);

                            if (childIndex >= 0) {
                                childrenList[childIndex].isSelected = true;
                            }
                        });
                    }

                }
            });

            return functions;
        },
        updateAuthorizedOrganizations: function (orgs) {
            var key = "departments";
            var i = orgs.length;

            while (i--) {
                var departmentList = orgs[i][key];
                this.updateCheckboxData(departmentList);
                if (departmentList.length < 1) {
                    orgs.splice(i, 1);
                }
            }
        },
        updateAuthorizedWorkgroups: function (workgroups) {
            this.updateCheckboxData(workgroups);
        },
        updateAuthorizedRoleGroups: function (parentsList) {
            var key = "children";
            var i = parentsList.length;

            while (i--) {
                var childrenList = parentsList[i][key];
                this.updateCheckboxData(childrenList);
                if (childrenList.length < 1) {
                    parentsList.splice(i, 1);
                }
            }
        },
        updateCheckboxData: function (data) {
            var key = "isSelected";
            var i = data.length;

            while (i--) {
                var item = data[i];
                if (!item[key]) {
                    data.splice(i, 1);
                }
                delete data[key];
            }
        }
    }
}]);