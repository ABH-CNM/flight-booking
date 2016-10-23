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
    var url = 'http://localhost:3000/flights/departures/all';
    $scope.flights =[];
    $scope.booking = [];
    $scope.bookingId;
    $http({
        method: "GET",
        url: url
    }).then(function mySucces(response) {
        $scope.xp = response.data.data.departures;
    }, function myError(response) {
    });
    // we will store all of our form data in this object
    $scope.formData = {};

    $scope.loadArrivals = function(){
        $http({
        method: "GET",
        url: 'http://localhost:3000/flights/arrivals?departure=' + $scope.formData.xuatphat
        }).then(function mySucces(response) {
            $scope.dd = response.data.data.arrivals;
        }, function myError(response) {
        });
    }

    $scope.findFlight = function(){
        //flights/available?departure=[string]&arrival=[string]&date=[string]&seats_amount=[integer]
        var month = $scope.formData.ngaydi.getMonth() + 1;
        var day;
        if ($scope.formData.ngaydi.getDate() < 10) {
            day = '0' + $scope.formData.ngaydi.getDate();
        }else{
            day = $scope.formData.ngaydi.getDate();
        }
        var date = $scope.formData.ngaydi.getFullYear()+'-'+ month +'-'+ day;
        $http({
            method: "GET",
            url: 'http://localhost:3000/flights/available?departure=' + $scope.formData.xuatphat + '&arrival=' + $scope.formData.diemden + 
            '&date='+ date + '&seats_amount=' + $scope.formData.hang
        }).then(function(response){
            $scope.flights = response.data.data.flights;
        },function(response){
            $scope.formData.message = response.data.data.message;
        });
    }
    $scope.saveFlight = function(){
        console.log($scope.formData.saveFlight);
    }
    //$scope.dd = ["HCM", "HN"];
    $scope.nTickets = [1, 2, 3, 4, 5, 6];
    /*$scope.ngaydi = new Date();
    $scope.minDate = new Date(
        $scope.ngaydi.getFullYear(),
        $scope.ngaydi.getMonth(),
        $scope.ngaydi.getDate());*/
    $scope.createBooking = function(){
        console.log($scope.formData.flightChecked);
        $http({
            method: "PUT",
            url: "http://localhost:3000/booking/create"
        }).then(function(response){
           console.log(response.data.data.booking.booking_id);
           $scope.bookingId = response.data.data.booking.booking_id;
        },function(response){
        });
    }
    $scope.addFlightDetail = function(){
        var flight_id = $scope.formData.flightChecked.flight_id;
        console.log(flight_id);
        var date = $scope.formData.flightChecked.date;
        console.log(date);
        var cl = $scope.formData.flightChecked.class;
        console.log(cl);
        var price = $scope.formData.flightChecked.price;
        console.log(price);
        $http({
            method: "POST",
            url: "http://localhost:3000/booking/"+$scope.bookingId+"/add_flight_detail",
            dataType: 'json',
            data: {
              flight_id: flight_id,
              date: date,
              class: cl,
              price: price
            }
        }).then(function(response){
           console.log(response.data);
        },function(response){
          console.log(response.data);
        });
    }
    $scope.completeBooking = function(){
        var passenger = {
          title: $scope.formData.title,
          last_name: $scope.formData.lastname,
          first_name: $scope.formData.firstname 
        };
        $http({
            method: "POST",
            url: "http://localhost:3000/passengers/create",
            dataType: 'json',
            data: {
                bookingId: $scope.bookingId,
                passenger: passenger
            }
        }).then(function(response){
           console.log(response.data.data.message);
        },function(response){
        });
    }
});
