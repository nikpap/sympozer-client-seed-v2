angular.module('personsApp').controller('personsShowCtrl', [ '$scope', '$rootScope', '$routeParams', 'personsFact', 'papersFact', function ($scope, $rootScope, $routeParams, personsFact, papersFact )
{
    $scope.person = new personsFact();

    var strJson = "";
    var ns = "http://schema.org/";

    "use strict";

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
                var tmpPaper = new Array; // pour la gestion des papiers
                var strPerson ="{";
                angular.fromJson(strJson).forEach(function(e) {
                    //json.subject = e["@id"];
                    for (var key in e) {
                        if (e.hasOwnProperty(key) && key !== "@id") {

                            //json.predicate = key.replace(ns, "");

                            if(key.replace(ns, "") == "papers") {
                                tmpPaper.push(e[key]["@value"]); // pour la gestion des papiers
                            }else{
                                strPerson+=  '"'+ key.replace(ns, "") + '" : ';
                                if (e[key]["@value"]) {

                                    tmp = e[key]["@value"];
                                   // console.log("dans parser value : "+e[key]["@value"]);
                                } else {
                                    tmp = e[key]["@id"];
                                    //console.log("dans parser id : "+e[key]["@id"]);
                                }
                                strPerson+=  '"'+ tmp + '" ,';
                            }

                        }

                    }
                });
                strPerson = strPerson.substring(0, strPerson.length-1);
                strPerson+="}";
                var jsonPerson = JSON.parse(strPerson);


                $scope.person.id =jsonPerson.id;
                $scope.person.firstName =jsonPerson.firstName;
                $scope.person.familyName =jsonPerson.familyName;
                $scope.person.description =jsonPerson.description;
                $scope.person.email =jsonPerson.email;
                $scope.person.img =jsonPerson.img;
                $scope.person.papers = new Array; // pour la gestion des papiers

                $scope.person.website =jsonPerson.website;
                $scope.person.facebook =jsonPerson.facebook;
                $scope.person.twitter =jsonPerson.twitter;
                $scope.person.linkedIn =jsonPerson.linkedIn;


//////////////////////////////////////////////////DEBUUUUUUUUUUUUUUUUUUUUT DU PAPERRRRRRRRRRRRR///////////////////////////////////////////////////
                if(tmpPaper.length != 0){
                    for(var i = 0; i< tmpPaper.length; i++) {

                        var corePaper = coreFactory.getCore("http://localhost:8080/api/" + tmpPaper[i]);
                        corePaper.getState()// a remplacer par la fonction getStatePartiel
                            .then(function (g) {

                                var strJson = "";
                                serialiser = serializerFactory.getSerializer({
                                    contentType: "application/ld+json",
                                    graph: g
                                });

                                return serialiser(function (line) {
                                    strJson += line; // Chunks of JSON-LD here !
                                }).then(function () {

                                    // strJson contains the full JSON-LD
                                    // we hope it's the same as the original one

                                    //console.log(strJson);
                                    var tmp;
                                    var strPaper = "{";
                                    angular.fromJson(strJson).forEach(function (e) {
                                        //json.subject = e["@id"];
                                        for (var key in e) {
                                            if (e.hasOwnProperty(key) && key !== "@id") {

                                                //json.predicate = key.replace(ns, "");
                                                strPaper += '"' + key.replace(ns, "") + '" : ';

                                                if (e[key]["@value"]) {

                                                    tmp = e[key]["@value"];
                                                } else {
                                                    tmp = e[key]["@id"];
                                                }
                                                strPaper += '"' + tmp + '" ,';
                                            }

                                        }


                                    });
                                    strPaper = strPaper.substring(0, strPaper.length - 1);
                                    strPaper += "}";

                                    //console.log("strPaper : "+strPaper);
                                    var jsonPaper = JSON.parse(strPaper);
                                    $scope.person.papers[jsonPaper.id] = new papersFact();
                                    $scope.person.papers[jsonPaper.id].id = jsonPaper.id;
                                    $scope.person.papers[jsonPaper.id].label = jsonPaper.label;
                                    $scope.person.papers[jsonPaper.id].url = jsonPaper.url;


                                    //console.log("test : "+$scope.person.papers[0].a);


                                    //$scope.person.papers.id  = jsonPaper.id;
                                    //$scope.person.papers[jsonPaper.id].label  = jsonPaper.label;
                                    //console.log("test : "+ jsonPaper.id);
                                    //console.log("test2 : "+ $scope.person.papers[jsonPaper.id].id);

                                    //alert("titre = "+$scope.person.paper.titre);
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




                            });//fin thenPaper      */
                    }// fin for
}
//////////////////////////////////////////////////FIN DU PAPERRRRRRRRRRRRR///////////////////////////////////////////////////

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



    // strJson.serialize();

}]);