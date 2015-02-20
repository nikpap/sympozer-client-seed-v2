angular.module('personsApp').controller('personsShowCtrl', [ '$scope', '$rootScope', '$routeParams', 'personsFact', function ($scope, $rootScope, $routeParams, personsFact )
{
    $scope.person = new personsFact();

    var strJson = "";
    var ns = "http://schema.org/";

    "use strict";
    $scope.triples = []; // Here it's a JSON-LD

    var bc = coreFactory.getCore("http://localhost:8080/api/user/1");
    bc.getState()
        .then(function(g) {
            // Here we have an in-memory graph representation

            // Creating an instance of the serialiser from the factory
            var serialiser = serializerFactory.getSerializer({
                contentType: "application/ld+json",
                graph: g
            });

            // Serialising the Graph to JSON-LD
            return serialiser(function(line) {
                strJson += line; // Chunks of JSON-LD here !
            }).then(function() {

                // strJson contains the full JSON-LD
                // we hope it's the same as the original one

                //console.log(strJson);
                var tmp;
                var jsonPerson ="{";
                angular.fromJson(strJson).forEach(function(e) {
                    //json.subject = e["@id"];
                    for (var key in e) {
                        if (e.hasOwnProperty(key) && key !== "@id") {

                            //json.predicate = key.replace(ns, "");
                            jsonPerson+=  '"'+ key.replace(ns, "") + '" : ';

                            if (e[key]["@value"]) {

                                tmp = e[key]["@value"];
                            } else {
                                tmp = e[key]["@id"];
                            }
                            jsonPerson+=  '"'+ tmp + '" ,';
                        }

                    }


                });
                jsonPerson = jsonPerson.substring(0, jsonPerson.length-1);
                jsonPerson+="}";

                var jsonPerson = JSON.parse(jsonPerson);


                $scope.person.id =jsonPerson.id;
                $scope.person.firstName =jsonPerson.firstName;
                $scope.person.familyName =jsonPerson.familyName;
                $scope.person.description =jsonPerson.description;
                $scope.person.email =jsonPerson.email;
                $scope.person.img =jsonPerson.img;
                $scope.person.website =jsonPerson.website;
                $scope.person.facebook =jsonPerson.facebook;
                $scope.person.twitter =jsonPerson.twitter;
                $scope.person.linkedIn =jsonPerson.linkedIn;


                $scope.$apply(); // ugly

                // OPTIONAL, juste because i want ntriples
                // We can use the g that you have before,
                // but we can do a round trip:
                // the new JSON-LD -> GRAPH -> NTRIPLES

                var parser = parserFactory.getParser({
                    contentType: "application/ld+json", // it take Json-LD
                    graph: graph.graph()               // to construct a graph()
                });

                parser.addChunk(strJson); // Fill it with the whole Json-LD
                return parser.finalize();

            }).then(function(parsedGraph) {

                // Creating an instance of the serialiser from the factory
                var nTriplesSerialiser = serializerFactory.getSerializer({
                    contentType: "application/n-triples",
                    graph: parsedGraph
                });

                console.log("NTRIPLE REPRESENTATION:");

                return nTriplesSerialiser(function(line) {
                    console.log(line);
                });
            });
        }).catch(function(reason) {
            console.log(reason);
        });



    // strJson.serialize();

}]);