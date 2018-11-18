/**
 * Created by abuhena on 1/25/16.
 */
angular.module('ng-toast', []).
    factory('ngToast', ['$document', '$interval', '$timeout', '$rootScope', function ($document, $interval, $timeout, $rootScope) {

        return {
            show: function (text, status, interval) {

                if (typeof $rootScope.toastInterval != 'undefined') return false;

                $rootScope.toastInterval = true;

                interval = ((typeof interval == "undefined") ? 2500 : interval);
                status = status ? status : 'danger';
                var divider = $document[0].createElement('div');
                divider.id = "toast";
                divider.style.top = "30px";
                divider.style.opacity = "0";
                divider.className = 'alert alert-' + status;
                divider.style.left = (document.body.clientWidth / 2 - 125) + "px";
                var textNode = $document[0].createTextNode(text);
                divider.appendChild(textNode);

                divider.addEventListener("click", function () {
                    opacity = 1;
                    promised = 0;
                    var hide = $interval(function () {
                        promised += 25;
                        opacity -= 0.1;
                        divider.style.opacity = opacity;
                        divider.style.top = parseInt(divider.style.top.replace("px", "")) - 2 + "px";

                        if (promised > 250) {
                            $interval.cancel(hide);
                            opacity = 0;
                            promised = 0;
                            var elem = document.getElementById("toast");
                            elem.parentNode.removeChild(elem);
                            delete $rootScope.toastInterval;
                        }
                    }, 25);
                });

                $document[0].body.insertBefore(divider, $document[0].body.firstChild);

                var promised = 0;
                var opacity = 0;

                var show = $interval(function () {
                    promised += 25;
                    opacity += 0.1;
                    divider.style.opacity = opacity;

                    divider.style.top = parseInt(divider.style.top.replace("px", "")) + 2 + "px";

                    if (promised > 250) $interval.cancel(show);
                }, 25);

                $timeout(function () {
                    opacity = 1;
                    promised = 0;
                    var hide = $interval(function () {
                        promised += 25;
                        opacity -= 0.1;
                        divider.style.opacity = opacity;
                        divider.style.top = parseInt(divider.style.top.replace("px", "")) - 2 + "px";

                        if (promised > 250) {
                            $interval.cancel(hide);
                            opacity = 0;
                            promised = 0;
                            var elem = document.getElementById("toast");
                            elem.parentNode.removeChild(elem);
                            delete $rootScope.toastInterval;
                        }
                    }, 25);

                }, interval);
            }
        }
    }]);