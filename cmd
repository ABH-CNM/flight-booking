chạy mongodb: mongod -dbpath "C:\Users\Thanh An\Documents\MongoDB"
chạy server-test: npm run watch-test
chạy test: npm test

// create our angular app and inject ngAnimate and ui-router
// =============================================================================
angular.module('formApp', ['ngMaterial', 'ngAnimate', 'ui.router'])

// configuring our routes
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'form.html',
            controller: 'formController'
        })
        // nested states
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('form.profile', {
            url: '/profile',
            templateUrl: 'form-profile.html'
        })
        // url will be /form/interests
        .state('form.interests', {
            url: '/interests',
            templateUrl: 'form-interests.html'
        })
        // url will be /form/payment
        .state('form.payment', {
            url: '/payment',
            templateUrl: 'form-payment.html'
        });
    // catch all route
    // send users to the form page
    $urlRouterProvider.otherwise('/form/profile');
})

// our controller for the form
// =============================================================================
.controller('formController', function($scope, $http) {
    // we will store all of our form data in this object
    var url = 'http://localhost:3000/flights/departures/all';
    $http({
        method: "GET",
        url: url
    }).then(function mySucces(response) {
        $scope.xp = response.data.data.departures;
    }, function myError(response) {
    });
    $scope.formData = {};
    /*$scope.xp = [
        "Hồ Chí Minh",
        "Hà Nội",
        "Nha Trang",
        "Đà Nẵng"
    ];*/

    $scope.loadArrivals = function(){
        $scope.dd = '';
        $http({
        method: "GET",
        url: 'http://localhost:3000/flights/arrivals?departure=' + $scope.formData.xuatphat
        }).then(function mySucces(response) {
            $scope.dd = response.data.data.arrivals;
        }, function myError(response) {
        });
    }

    $scope.findFlight = function(){
       
    }
    //$scope.dd = ["HCM", "HN"];
    $scope.nTickets = [1, 2, 3, 4, 5, 6];
    $scope.ngaydi = new Date();
    $scope.minDate = new Date(
        $scope.ngaydi.getFullYear(),
        $scope.ngaydi.getMonth(),
        $scope.ngaydi.getDate());
});
