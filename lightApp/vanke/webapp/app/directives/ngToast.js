'use strict';

/**
 * @ngdoc service
 * @name nglabs.service:ngToast
 * @description
 * A minimalist, open source Toast Service for angular app(s).
 *
 * @author Hamzeen. H.
 * http://github.com/hamzeen/ngToast
 * @created Sunday, 25/09/2016 10:15PM
 */
angular.module('vkrmsApp')
    .service('ngToast', ['$rootScope', '$q', '$timeout',
        function ($rootScope, $q, $timeout) {

            return {
                show: show
            };

            /**
             * msg: string
             * type: string
             * duration: boolean | number
             * NOTE: if the duration is false, the toast will be shown forever
             */
            function show(msg, type, time) {
                var toast = angular.element("#toast_cont");
                var content = angular.element("#toast_content");
                var duration = time || 5000;

                if ((toast.attr('class') == null) || toast.attr('class').indexOf('visible') < 0) {
                    content.html(msg);
                    if (type != null) {
                        removeAttr(content, 'class');
                        addClass(content, type);
                    } else {
                        removeAttr(content, 'class');
                        addClass(content, 'info');
                    }
                    addClass(toast, "visible");

                    // when a boolean is provided
                    if (typeof duration === 'boolean' && duration) {
                        $timeout(function () {
                            removeClass(toast, "visible");
                            if (type != null)
                                removeClass(toast, type);
                        }, 5000);
                    }

                    // when the time to live is set
                    if (typeof duration === 'number') {
                        $timeout(function () {
                            removeClass(toast, "visible");
                            if (type != null)
                                removeClass(toast, type);
                        }, duration);
                    }

                }
            }

            /**
             * A utility method to add class to an element in the DOM / markup
             */
            function addClass(elem, className) {
                elem.addClass(className);
            }

            /**
             * A utility method to remove a class from an element in the DOM / markup
             */
            function removeClass(elem, className) {
                elem.removeClass(className);
            }

            /**
             * A utility method to remove an attribute from an element in the DOM / markup
             */
            function removeAttr(elem, attrib) {
                elem.removeAttr(attrib);
            }

        }]);
