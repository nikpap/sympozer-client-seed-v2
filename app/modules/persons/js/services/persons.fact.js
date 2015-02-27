/**
 * Persons Factory
 *
 * Service calls for CRUD actions
 *
 * @type {factory}
 */
angular.module('personsApp').factory('personsFact', ['$resource', function ($resource)
{

    var resource =  $resource(
        globalConfig.api.urls.get_persons,
        {},
        {
            get            : {method: 'GET', url: globalConfig.api.urls.get_persons + '/:id', params: {'id': '@id', cache: true}, isArray: false},
            create         : {method: 'POST', params: {}, isArray: false},
            update         : {method: 'PUT', url: globalConfig.api.urls.get_persons + '/:id', params: {id: '@id'}, isArray: false},
            patch          : {method: 'PATCH', url: globalConfig.api.urls.get_persons + '/:id', params: {id: '@id', no_clean: true}, isArray: false},
            delete         : {method: 'DELETE', url: globalConfig.api.urls.get_persons + '/:id', params: {id: '@id'}, isArray: false},
            all            : {method: 'GET', params: {}},
            allByConference: {method: 'GET', url: globalConfig.api.urls.get_mainEvents + '/:mainEventId/persons', params: {'mainEventId': '@mainEventId'}},

        }
    );

    resource.serialize = function (object) {

        var DTObject = {
            'id': object.id,
            'firstName': object.firstName,
            'familyName': object.familyName,
            'description': object.description,
            'email': object.email,
            'img': object.img,
            'papers': [],
            'website': object.website,
            'facebook': object.facebook,
            'twitter': object.twitter,
            'linkedIn': object.linkedIn
        }


        if (object.papers) {
            for (var i = 0; i < object.papers.length; i++) {
                DTObject.papers.push({id: object.papers[i].id});
            }
        }
    }
    return resource;

}]);
