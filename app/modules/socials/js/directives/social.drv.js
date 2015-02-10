function template(tmpl, context, filter) {
    'use strict';

    return tmpl.replace(/\{([^\}]+)\}/g, function (m, key) {
        // If key don't exists in the context we should keep template tag as is
        return key in context ? (filter ? filter(context[key]) : context[key]) : m;
    });
}

angular.module('socialsApp').directive('ngSocialButtons', ['$compile', '$q', '$parse', '$http', '$location',
    function ($compile, $q, $parse, $http, $location) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            transclude: true,

            template:   
            '<div>' +
                '<ul>'+
                    '<li class="ng-social-facebook" style="margin: 2px;"></li>'+
                    '<li class="ng-social-google-plus" style="margin: 2px;"></li>'+
                    '<li class="ng-social-linkedin" style="margin: 2px;"></li>'+
                    '<li class="ng-social-twitter" style="margin: 2px;"></li>'+
                '</ul>' +
            '</div>',

            controller: ['$scope', '$rootScope', '$routeParams', 'mainEventsFact', '$q', '$http', 
                function ($scope, $rootScope, $routeParams, mainEventsFact, $q, $http) {

                //recuperation des variables
                $scope.mainEvent = mainEventsFact.get({id: $routeParams.mainEventId}, function(data){
                    //console.log(data);
                });
                
                var getUrl = function () {
                    return $location.absUrl();
                };

                var containsPath = function (val) {
                    var str = $location.path();
                    var res = str.split("/");
                    for(var i in res)
                    {
                        if (res[i] == val)
                            return true;
                    }
                    return false;
                };

                var containsDieze = function (val) {
                    var res = val.substr(0,1);

                    if(res == '#'){
                        return val;
                    }else{
                        return '#'+val;
                    }
                };

                var gestionHashTag = function (val) {
                    var myTab = val.split(" ");
                    var res = "";
                    var isFirst = true;
                    for(var i in myTab)
                    {
                        if (isFirst){
                            res = res + containsDieze(myTab[i]);
                            isFirst = false;
                        }else{
                            res = res +" "+ containsDieze(myTab[i]);
                        }
                    }
                    return res;
                };


                var ctrl = {
                    init: function (scope, element, options) {
                        if (options.counter) {
                            ctrl.getCount(scope.options).then(function(count) {
                                scope.count = count;
                            });
                        }
                    },
                    
                    link: function (options) {
                        options = options || {};
                        var urlOptions = options.urlOptions || {};

                        urlOptions.url = getUrl();
                        urlOptions.showcounts = 'false';
                        //urlOptions.image = getImage();

                        // conferance
                        if(containsPath('mainEvents')){
                            if(options.track.name == 'twitter' && $scope.mainEvent.twitter){
                                urlOptions.title = containsDieze($scope.mainEvent.twitter) + "  " ;
                                if($scope.mainEvent.label)
                                    urlOptions.title += $scope.mainEvent.label+ "  " ;
                                if($scope.mainEvent.description)
                                    urlOptions.title += $scope.mainEvent.description ;
                            }else{
                                urlOptions.title = $scope.mainEvent.label || '';
                            }
                            urlOptions.description = $scope.mainEvent.description || '';
                        }

                        // Papers
                        if(containsPath('papers')){
                            if($scope.paper){
                                urlOptions.title = $scope.paper.label || '';
                                urlOptions.description = $scope.paper.publisher || '';  
                            }else{
                                urlOptions.title = '';
                                urlOptions.description = '';                                
                            }
                        }

                        // Events
                        if(containsPath('events')){
                            if($scope.event){
                                urlOptions.title = $scope.event.label || '';
                                urlOptions.description = $scope.event.description || '';    
                            }else{
                                urlOptions.title = '';
                                urlOptions.description = '';                                
                            }
                        }

                        //persons
                        if(containsPath('persons')){
                            if($scope.person){
                                urlOptions.title = $scope.person.label || '';
                                urlOptions.description = $scope.person.description || '';    
                            }else{
                                urlOptions.title = '';
                                urlOptions.description = '';                                
                            }
                        }

                        //locations
                        if(containsPath('locations')){
                            if($scope.location){
                                urlOptions.title = $scope.location.label || '';
                                urlOptions.description = $scope.location.description || '';    
                            }else{
                                urlOptions.title = '';
                                urlOptions.description = '';                                
                            }
                        }

                        return ctrl.makeUrl(options.clickUrl || options.popup.url, urlOptions);
                    },
                    clickShare: function (e, options) {
                        if (e.shiftKey || e.ctrlKey) {
                            return;
                        }
                        e.preventDefault();

                        if (options.track && typeof _gaq != 'undefined' && angular.isArray(_gaq)) {
                            _gaq.push(['_trackSocial', options.track.name, options.track.action, $scope.url]);
                        }

                        var process = true;
                        if (angular.isFunction(options.click)) {
                            process = options.click.call(this, options);
                        }
                        if (process) {
                            var url = ctrl.link(options);
                            ctrl.openPopup(url, options.popup);
                        }
                    },
                    openPopup: function (url, params) {
                        var left = Math.round(screen.width / 2 - params.width / 2),
                            top = 0;
                        if (screen.height > params.height) {
                            top = Math.round(screen.height / 3 - params.height / 2);
                        }

                        var win = window.open(
                            url,
                                'sl_' + this.service,
                                'left=' + left + ',top=' + top + ',' +
                                'width=' + params.width + ',height=' + params.height +
                                ',personalbar=0,toolbar=0,scrollbars=1,resizable=1'
                        );
                        if (win) {
                            win.focus();
                        } else {
                            location.href = url;
                        }
                    },
                    getCount: function (options) {
                        var def = $q.defer();
                        var urlOptions = options.urlOptions || {};
                        urlOptions.url = getUrl();
                        urlOptions.title = $scope.title;
                        var url = ctrl.makeUrl(options.counter.url, urlOptions),
                            showcounts = angular.isUndefined($scope.showcounts) ? true : $scope.showcounts;

                        if (showcounts) {
                            if (options.counter.get) {
                                options.counter.get(url, def, $http);
                            } else {
                                $http.jsonp(url).success(function (res) {
                                    if (options.counter.getNumber) {
                                        def.resolve(options.counter.getNumber(res));
                                    } else {
                                        def.resolve(res);
                                    }
                                });
                            }
                        }
                        return def.promise;
                    },
                    makeUrl: function (url, context) {
                        return template(url, context, encodeURIComponent);
                    }
                };
                return ctrl;
            }]
        };
    }
]);