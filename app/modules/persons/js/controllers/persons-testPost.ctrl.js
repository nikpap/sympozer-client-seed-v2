angular.module('personsApp').controller('personsTestPostCtrl', [ '$scope', '$rootScope', '$routeParams', 'personsFact', function ($scope, $rootScope, $routeParams, personsFact )
{
    var subject = "http://vps.schrodingerscat.ovh/api/54dde93531328d7c0741856f";
    $scope.submit = function() {
        if (($scope.newGivenName) && ($scope.newFamilyName)) {
            console.log($scope.newGivenName);
            console.log($scope.newFamilyName);

            var ressource = coreFactory.getCore("http://localhost:8080/api/user/54dde93531328d7c0741856f");
            ressource.edit(function(graph) {
                return graph.addTriple(rdfNode.iri(subject), rdfNode.iri("givenName"), $scope.newGivenName).then(function() {
                    var ressource2 = coreFactory.getCore("http://localhost:8080/api/user/54dde93531328d7c0741856f");

                    ressource2.getState()
                        .then(function (g) {
                            // Here we have an in-memory graph representation
                            var strJson = "";

                            // Creating an instance of the serialiser from the factory
                            var serialiser = serializerFactory.getSerializer({
                                contentType: "application/ld+json",
                                graph: g
                            });

                            // Serialising the Graph to JSON-LD
                            return serialiser(function (line) {
                                strJson += line; // Chunks of JSON-LD here !
                            }).then(function () {

                                console.log("JSONLD REPRESENTATION:");

                                // strJson contains the full JSON-LD
                                // we hope it's the same as the original one
                                console.log(strJson);
                                angular.fromJson(strJson).forEach(function (e) {
                                    var json = {};
                                    json.subject = e["@id"];
                                    for (var key in e) {
                                        if (e.hasOwnProperty(key) && key !== "@id") {
                                            json.predicate = key;
                                            if (e[key]["@value"]) {
                                                json.object = e[key]["@value"];
                                            } else {
                                                json.object = e[key]["@id"];
                                            }
                                        }
                                    }
                                    $scope.triples.push(json);
                                });

                                $scope.$apply(); // ugly

                            });
                        });
                }).catch(function(reason) {
                    console.log(reason);
                });
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