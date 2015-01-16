'use strict';

/**
 * Navigation main controller. Handles the configuration of the nav bars and search system
 */
angular.module('sympozerApp').controller('navMainCtrl', ['$scope', '$rootScope', '$location', '$timeout', '$global', function ($scope, $rootScope, $location, $timeout, $global)
{



    /**
     * This menu is always present
     * @type {{label: string, iconClasses: string, url: string}[]}
     */
    var basicMenu = [
        {
            label: 'mainEvents.links.mainEvents',
            iconClasses: 'fa fa-calendar',
            url: '#/home/mainEvents/index'
        },
        {
            label: 'organizations.links.organizations',
            iconClasses: 'fa fa-group',
            url: '#/home/organizations/index'
        },
        {
            label: 'persons.links.persons',
            iconClasses: 'fa fa-user',
            url: '#/home/persons/index'
        },
        {
            label: 'papers.links.papers',
            iconClasses: 'glyphicon glyphicon-book',
            url: '#/home/papers/index'
        }


    ];


    /**
     * Current main conference menu
     *     *
     * @type {{label: string, iconClasses: string, children: *[]}[]}
     */
    var menuCurrentConference = function(){

        //Set number off object on nav barre
        var badgeEvents = $rootScope.currentMainEvent.events ? $rootScope.currentMainEvent.events.length : 0;
        var badgeLocations = $rootScope.currentMainEvent.eventLocations ? $rootScope.currentMainEvent.eventLocations.length : 0;

        return [
            {
                label: $rootScope.currentMainEvent ? $rootScope.currentMainEvent.label : '' ,
                iconClasses: 'fa fa-certificate',
                children: [
                    {
                        label: 'navleft.informations',
                        iconClasses: 'fa fa-info-circle',
                        url: '#/home/mainEvents/'+$rootScope.currentMainEvent.id+'/overview/settings'
                    },
                    {
                        label: 'teammates.links.team',
                        iconClasses: 'fa fa-graduation-cap',
                        url        : '#/home/conference/'+$rootScope.currentMainEvent.id+'/teammates'

                    },
                    {
                        label: 'navleft.community',
                        iconClasses: 'fa fa-group',
                        url: '#/home/conference/'+$rootScope.currentMainEvent.id+'/roles/list'

                    },
                    {
                        label: 'navleft.resource',
                        iconClasses: 'fa fa-folder-open',
                        children: [
                            {
                                label: 'papers.links.papers',
                                iconClasses: 'glyphicon glyphicon-book',
                                url: '#/home/conference/'+$rootScope.currentMainEvent.id+'/papers/list'
                            }
                        ]
                    },
                    {
                        label: 'events.links.schedule',
                        iconClasses: 'fa fa-calendar',
                        children: [
                            {
                                label: 'events.links.events',
                                html: '<span class="badge badge-indigo">'+ badgeEvents +'</span>', /** menu notification **/
                                iconClasses: 'fa fa-clock-o',
                                url: '#/home/conference/'+$rootScope.currentMainEvent.id+'/events/list'
                            },
                            {
                                label: 'locations.links.locations',
                                html: '<span class="badge badge-magenta">'+ badgeLocations +'</span>',
                                iconClasses: 'fa fa-map-marker red',
                                url: '#/home/conference/'+$rootScope.currentMainEvent.id+'/locations/list'
                            }
                        ]
                    },
                    {
                        label: 'navleft.analytics',
                        iconClasses: 'fa fa-line-chart',
                        url: '#/home/conference/'+$rootScope.currentMainEvent.id+'/analytics/index'
                    }
                ]
            }
        ];
    }

    /**
     * Set hierarchy among the menu items
     *
     * @param children
     * @param parent
     */
    var setParent = function (children, parent)
    {
        angular.forEach(children, function (child)
        {
            child.parent = parent;
            if (child.children !== undefined)
            {
                setParent(child.children, child);
            }
        });
    };

    /**
     * Get the menu item from the url
     * Goal : set the correct left menu item selected whenever the user
     * change the current main page (or directly from the url)
     *
     * @param children
     * @param url
     * @returns {*} the item from the menu architecture
     */
    $scope.findItemByUrl = function (children, url)
    {
        for (var i = 0, length = children.length; i < length; i++)
        {
            if (children[i].url && children[i].url.replace('#', '') == url)
            {
                return children[i];
            }
            if (children[i].children !== undefined)
            {
                var item = $scope.findItemByUrl(children[i].children, url);
                if (item)
                {
                    return item;
                }
            }
        }
    };

    /**
     * Default opened menus
     *
     * @type {Array}
     */
    $scope.openItems = [];
    /**
     * Default selected menu items
     *
     * @type {Array}
     */
    $scope.selectedItems = [];
    $scope.selectedFromNavMenu = false;

    /**
     * Action triggerred when an item is selected
     * @param item
     */
    $scope.select = function (item)
    {
        // close open nodes
        if (item.open)
        {
            item.open = false;
            return;
        }
        for (var i = $scope.openItems.length - 1; i >= 0; i--)
        {
            $scope.openItems[i].open = false;
        }
        $scope.openItems = [];
        var parentRef = item;
        while (parentRef !== null)
        {
            parentRef.open = true;
            $scope.openItems.push(parentRef);
            parentRef = parentRef.parent;
        }

        // handle leaf nodes
        if (!item.children || (item.children && item.children.length < 1))
        {
            $scope.selectedFromNavMenu = true;
            for (var j = $scope.selectedItems.length - 1; j >= 0; j--)
            {
                $scope.selectedItems[j].selected = false;
            }
            $scope.selectedItems = [];
            parentRef = item;
            while (parentRef !== null)
            {
                parentRef.selected = true;
                $scope.selectedItems.push(parentRef);
                parentRef = parentRef.parent;
            }
        }
    };

    /**
     * Select item according to the current url
     */
    var initSelected = function(){
        //Find current item from url
        var currentItem = $scope.findItemByUrl($scope.menu, $location.path());
        if(currentItem){
            //Mark as selected
            $scope.select(currentItem);
        }
    }

    /**
     * Initialize menu with current mainEvent and current url path
     * @returns {string}
     */
    var initMenu = function ()
    {
        /**
         * Each time there is a change, the menu is actualize
         *
         * @TODO FORZA : TO RETHINK... ?
         */
        $scope.menu = basicMenu;

        // If there is a current conference
        if ($rootScope.currentMainEvent)
        {
            $scope.menu = $scope.menu.concat(menuCurrentConference());
        }

        /**
         * Set hierarchy for a menu item
         */
        setParent($scope.menu, null);

        /**
         * Set selected item
         */
        initSelected();

        return $location.path();
    }

    //Trigger init
    initMenu();



    /**
     * Event listener whenever a new conference context loaded
     */
    $scope.$on('contextFact:changeContext', function(){
        //Update conference menu with new conference infos
        initMenu();
    });





}]);











