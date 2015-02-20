angular.module('personsApp').controller('personsTestPostCtrl', [ '$scope', '$rootScope', '$routeParams', 'personsFact', function ($scope, $rootScope, $routeParams, personsFact )
{
    var subject = "http://vps.schrodingerscat.ovh/api/54dde93531328d7c0741856f";
    $scope.submit = function() {
        if (($scope.newGivenName) && ($scope.newFamilyName)) {
            console.log($scope.newGivenName);
            console.log($scope.newFamilyName);

            var ressource = coreFactory.getCore("http://localhost:8080/api/user/54dde93531328d7c0741856f");
            ressource.edit(function(graph) {
                   /* forEach(){
                        graph.addTriple(rdfNode.iri(subject), rdfNode.iri("givenName"), $scope.newGivenName)
                    }*/


                    return null;
            });


            /*ressource.edit(function(graph) {
                return graph.addTriple(rdfNode.iri(subject), rdfNode.iri("familyName"), $scope.newFamilyName).then(function() {

                }).catch(function(reason) {
                    console.log(reason);
                });
            });*/
        }
    };
}]);