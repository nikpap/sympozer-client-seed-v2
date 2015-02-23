/**
 * Show equipment controller
 *
 * @type {controller}
 */
angular.module('equipmentsApp').controller('equipmentsShowCtrl', [ '$scope', '$routeParams', 'equipmentsFact', function ($scope, $routeParams, equipmentsFact)
{
    $scope.equipment = new equipmentsFact();

    var strJson = "";
    var ns = "http://schema.org/";

    "use strict";

    var bc = coreFactory.getCore("http://localhost:8080/api/equipement");
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
                var strEquipment ="{";
                angular.fromJson(strJson).forEach(function(e) {
                    //json.subject = e["@id"];
                    for (var key in e) {
                        if (e.hasOwnProperty(key) && key !== "@id") {

                            //json.predicate = key.replace(ns, "");
                            strEquipment+=  '"'+ key.replace(ns, "") + '" : ';

                            if (e[key]["@value"]) {

                                tmp = e[key]["@value"];
                            } else {
                                tmp = e[key]["@id"];
                            }
                            strEquipment+=  '"'+ tmp + '" ,';
                        }

                    }


                });
                strEquipment = strEquipment.substring(0, strEquipment.length-1);
                strEquipment+="}";

                var jsonEquipment = JSON.parse(strEquipment);


                $scope.equipment.label =jsonEquipment.label;
                $scope.equipment.description =jsonEquipment.description;

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

}]);