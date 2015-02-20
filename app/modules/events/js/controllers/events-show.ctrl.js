/**
 * Show event controller
 *
 * @type {controller}
 */
angular.module('eventsApp').controller('eventsShowCtrl', [ '$scope', '$routeParams', 'eventsFact', function ($scope, $routeParams, eventsFact)
{
    $scope.event = new eventsFact();
    var ns = "http://schema.org/";
    var strJson="";
    var bc = coreFactory.getCore("http://localhost:8080/api/event");//+{id: $routeParams.eventId});

    bc.getState()
        .then(function(g) {


            var serialiser = serializerFactory.getSerializer({
                contentType: "application/ld+json",
                graph: g
            });

            // Serialising the Graph to JSON-LD
            return serialiser(function(line) {
                strJson += line; // Chunks of JSON-LD here !
            }).then(function() {

                var tmp;
                var jsonEvent ="{";
                angular.fromJson(strJson).forEach(function(e) {
                    //json.subject = e["@id"];
                    for (var key in e) {
                        if (e.hasOwnProperty(key) && key !== "@id") {

                            //json.predicate = key.replace(ns, "");
                            jsonEvent+=  '"'+ key.replace(ns, "") + '" : ';

                            if (e[key]["@value"]) {

                                tmp = e[key]["@value"];
                            } else {
                                tmp = e[key]["@id"];
                            }
                            jsonEvent+=  '"'+ tmp + '" ,';
                        }

                    }


                });
                jsonEvent = jsonEvent.substring(0, jsonEvent.length-1);
                jsonEvent+="}";

                var jsonEvent = JSON.parse(jsonEvent);

                $scope.event.id =jsonEvent.id;
                $scope.event.label =jsonEvent.label;
                $scope.event.endAt =jsonEvent.endAt;
                $scope.event.startAt =jsonEvent.startAt;
                $scope.event.comment =jsonEvent.comment;
                $scope.event.description =jsonEvent.description;
                $scope.event.dtype =jsonEvent.dtype;
                $scope.event.allDay =jsonEvent.allDay;
                $scope.event.facebook =jsonEvent.facebook;
                $scope.event.priority =jsonEvent.priority;
                $scope.event.twitter =jsonEvent.twitter;
                $scope.event.url =jsonEvent.url;
                $scope.event.youtube =jsonEvent.youtube;

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


            });
        }).catch(function(reason) {

        });



}]);
