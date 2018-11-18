/**
 * Created by wangq34 on 2016/7/20.
 */

(function () {

    'use strict';

    angular
        .module('rmMobile')
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
        }])
        .factory('httpInterceptor', ['$q', '$injector', function ($q, $injector) {
            var httpInterceptor = {
                'responseError': function (response) {
                    if (response.status == 401) {
                        var rootScope = $injector.get('$rootScope');
                        var state = $injector.get('$rootScope').$state.current.name;
                        rootScope.stateBeforLogin = state;
                        rootScope.$state.go("/");
                        return $q.reject(response);
                    } else if (response.status === 404) {
                        console.log("404!");
                        return $q.reject(response);
                    }
                },
                'response': function (response) {
                    return response;
                }
            };
            return httpInterceptor;
        }]);

})();