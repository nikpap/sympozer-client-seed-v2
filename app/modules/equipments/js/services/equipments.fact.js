/**
 * Equipments Factory
 *
 * Service calls for CRUD actions
 *
 * @type {factory}
 */
angular.module('equipmentsApp').factory('equipmentsFact',
    ['$resource', '$cachedResource', function ($cachedResource)
    {
        return $cachedResource(
            globalConfig.api.urls.get_equipments,
            {},
            {
                get   : {method: 'GET', url: globalConfig.api.urls.get_equipments + '/:id', params: {'id': '@id', cache: true}, isArray: false},
                create: {method: 'POST', params: {}, isArray: false},
                update: {method: 'PUT', url: globalConfig.api.urls.get_equipments + '/:id', params: {id: '@id'}, isArray: false},
                delete: {method: 'DELETE', url: globalConfig.api.urls.get_equipments + '/:id', params: {id: '@id'}, isArray: false},
                all   : {method: 'GET', params: {}, isArray: false}
            }
        );
        //Construct a DTO object to send to server (Data Transfert Object)
        resource.serialize = function (object) {
            var DTObject = {
                'label': object.label,
                'description' : objet.description
            }

            //create the new resource object from DTObject
            return new resource(DTObject);
        }

        return resource;
    }]);
