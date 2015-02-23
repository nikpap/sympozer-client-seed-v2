/**
 * Show paper controller
 *
 * @type {controller}
 */
angular.module('papersApp').controller('papersShowCtrl', [ '$scope', '$routeParams', 'papersFact', function ($scope, $routeParams, papersFact)
{

    $scope.paper = new papersFact();

    var strJson = "";
    var ns = "http://schema.org/";

    "use strict";

    var bc = coreFactory.getCore("http://localhost:8080/api/paper/1");
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
                var strPaper ="{";
                angular.fromJson(strJson).forEach(function(e) {
                    //json.subject = e["@id"];
                    for (var key in e) {
                        if (e.hasOwnProperty(key) && key !== "@id") {

                            //json.predicate = key.replace(ns, "");
                            strPaper+=  '"'+ key.replace(ns, "") + '" : ';

                            if (e[key]["@value"]) {

                                tmp = e[key]["@value"];
                            } else {
                                tmp = e[key]["@id"];
                            }
                            strPaper+=  '"'+ tmp + '" ,';
                        }

                    }


                });
                strPaper = strPaper.substring(0, strPaper.length-1);
                strPaper+="}";

                var jsonPaper = JSON.parse(strPaper);

                $scope.paper.label =jsonPaper.label;
                $scope.paper.abstract =jsonPaper.abstract;
                $scope.paper.publisher =jsonPaper.publisher;
                $scope.paper.publishDate =jsonPaper.publishDate;
                $scope.paper.url =jsonPaper.url;


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

            });
        }).catch(function(reason) {
            console.log(reason);
        });
}]);