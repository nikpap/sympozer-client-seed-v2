/**
 * @TODO : define tests
 */
describe('Test twitterTimelineCtrl - ', function() {

    //Sympozer app has to be loaded first
    beforeEach(module('sympozerApp', 'socialsApp'));

    var ctrl, scope;

    //Loading of the  categoriesDeleteCtrl
    beforeEach(inject(function($controller, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller('twitterTimelineCtrl', {
            $scope: scope
        });
    }));

    //Verify that scope values are well formed
    it('should load scope values', function() {
        expect($scope.tweets).toBeDefined();
        expect($scope.person).toContain("twitterid");
    });

});