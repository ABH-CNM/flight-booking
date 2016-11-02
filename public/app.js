// create our angular app and inject ngAnimate and ui-router
// =============================================================================
var token ='';
var mApp = angular.module('formApp', ['ngMaterial', 'ngAnimate', 'ngRoute']);

mApp.config(function($routeProvider) {
	$routeProvider
	// route for the home page
		.when('/', {
			templateUrl: 'form-infomation.html',
		})
		.when('/complete', {
			templateUrl: 'form-complete.html',
			// controller: 'formController'
		})
		// route for the about page
		.when('/infomation', {
			templateUrl: 'form-infomation.html',
			// controller: 'formController'
		})
		.when('/flights', {
			templateUrl: 'form-flight.html',
			// controller: 'formController'
		})
        //route admin page
        .when('/admin',{
            templateUrl: 'form-admin.html', 
            isLogin: true
        })
        .when('/login',{
            templateUrl: function(){
                console.log(token);
                return 'form-login?token=' + token
            },
        })
		// route for the contact page
		.when('/booking', {
			templateUrl: 'form-booking.html',
			// controller: 'formController'
		});
})

// configuring our routes
// =============================================================================
// .config(function($stateProvider, $urlRouterProvider) {
//     $stateProvider
//     // route to show our basic form (/form)
//         .state('form', {
//             url: '/form',
//             templateUrl: 'form.html',
//             controller: 'formController'
//         })
//         // nested states
//         // each of these sections will have their own view
//         // url will be nested (/form/profile)
//         .state('form.profile', {
//             url: '/profile',
//             templateUrl: 'form-profile.html'
//         })
//         // url will be /form/interests
//         .state('form.interests', {
//             url: '/interests',
//             templateUrl: 'form-interests.html'
//         })
//         // url will be /form/payment
//         .state('form.payment', {
//             url: '/payment',
//             templateUrl: 'form-payment.html'
//         });
//     // catch all route
//     // send users to the form page
//     $urlRouterProvider.otherwise('/form/profile');
// })
 
// our controller for the form
// =============================================================================
mApp.controller('formController', function($scope, $http, $location, $rootScope,$mdDialog) {
    var self = this;
    var url = 'http://localhost:3000/flights/departures/all';
    $scope.flights =[];
    $scope.bookings = [];
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
        $scope.flights = null;
        $scope.formData.message = "";
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
            url: '/flights/available?departure=' + $scope.formData.xuatphat + '&arrival=' + $scope.formData.diemden + 
            '&date='+ date + '&seats_amount=' + $scope.formData.hang
        }).then(function(response){
            $scope.flights = response.data.data.flights;
        },function(response){
            $scope.formData.message = response.data.data.message;
        });   
    }
    //$scope.dd = ["HCM", "HN"];
    $scope.nTickets = [1, 2, 3, 4, 5, 6];
    /*$scope.ngaydi = new Date();
    $scope.minDate = new Date(
        $scope.ngaydi.getFullYear(),
        $scope.ngaydi.getMonth(),
        $scope.ngaydi.getDate());*/
    $scope.createBooking = function(){
        $http({
            method: "PUT",
            url: "/booking/create"
        }).then(function(response){
           $scope.bookingId = response.data.data.booking.booking_id;
           alert("Mã đặt chỗ của bạn là: " + $scope.bookingId);
        },function(response){
        });
    }
    $scope.addFlightDetail = function(){
        var flight_id = $scope.formData.flightChecked.flight_id;
        var date = $scope.formData.flightChecked.date;
        var cl = $scope.formData.flightChecked.class;
        var price = $scope.formData.flightChecked.price;
        console.log($scope.bookingId);
        $http({
            method: "POST",
            url: "/booking/"+$scope.bookingId+"/add_flight_detail",
            dataType: 'json',
            data: {
              flight_id: flight_id,
              date: date,
              class: cl,
              price: price
            }
        }).then(function(response){
           console.log(response.data);
            $scope.formData.notification = response.data.data.message + ' Please insert Information!';
        },function(response){
          console.log(response.data);
           $scope.formData.notification = response.data.data.message + ' Please choose another Flight!';
        });
    }
    $scope.addPassengers = function(){
        var status = 1;
        var passenger = {
          title: $scope.formData.title,
          last_name: $scope.formData.lastname,
          first_name: $scope.formData.firstname 
        };
        $http({
            method: "POST",
            url: "/passengers/create",
            dataType: 'json',
            data: {
                bookingId: $scope.bookingId,
                passenger: passenger
            }
        }).then(function(response){
           console.log(response.data.data.message);
           $scope.formData.notifications = response.data.data.message;
        },function(response){
        });
    }
    $scope.bookingComplete = function(){
         $http({
            method: "GET",
            url: "/booking/" + $scope.bookingId
        }).then(function(response){
           console.log(response.data);
           $scope.formData.booking = response.data.data.booking;
           console.log($scope.formData.booking);
        },function(response){
        });
    }
    //Admin login
    $scope.login =function(){
        $http({
            method: "POST",
            url: "http://localhost:3000/admin/authenticate",
            dataType: 'json',
            data:{
                username: $scope.formData.username,
                password: $scope.formData.password
            }
        }).then(function(response, body){
            console.log(response);
            token = response.data.data.token;
            console.log(token);
            $location.path('/login')
        },function(response){

        });
    }
    //admin get all flight
    $scope.getFlight = function(){
        $http({
            method: "GET",
            url: "http://localhost:3000/flights/all",
            headers: {
              "x-access-token": token
            }
        }).then(function(response){
           $scope.flights = response.data.data.flights;
           console.log(response);
        },function(response){

        });
    }
    //Delete Flight
    $scope.deleteFlight = function(){
        var _id = $scope.formData.flightChecked._id;
        $http({
            method: "DELETE",
            url: "http://localhost:3000/flight/remove/" + _id,
            headers: {
              "x-access-token": token
            }
        }).then(function(response){
            console.log(response);
            alert("Delete Success!")
        },function(response){

        });
        $http({
            method: "GET",
            url: "http://localhost:3000/flights/all",
            headers: {
              "x-access-token": token
            }
        }).then(function(response){
            console.log(response);
           $scope.flights = response.data.data.flights;
        },function(response){

        });
    }

    this.AddFlight = function(){
        console.log('Nice');
    }
    //show dialog eidt and add flight
    $scope.showDialog = function($event, btn, st) {
        $mdDialog.show({
            controller: function(){
                return self;
            },
            controllerAs: 'ctrl',
            templateUrl: 'dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: true
        });
        if (btn === 'add') {
            self.title = 'Add new Flight';
            self.edit = false;
            self.btntext = 'Add';
            self.flight = {};
        } else {
            self.title = 'Edit Flight';
            self.edit = true;
            self.btntext = 'Save';
            self.flight = $scope.formData.flightChecked;
        }
    };


    self.cancel = function($event) {
        $mdDialog.cancel();
    };

    self.finish = function($event, btn, flight) {
        var month = flight.ngaydi.getMonth() + 1;
        var day;
        if (flight.ngaydi.getDate() < 10) {
            day = '0' + flight.ngaydi.getDate();
        }else{
            day = flight.ngaydi.getDate();
        }
        var date = flight.ngaydi.getFullYear()+'-'+ month +'-'+ day;
        console.log(date);
        $mdDialog.hide();
        var flight = {
            flight_id: flight.flight_id,
            departure: flight.departure,
            arrival: flight.arrival,
            date: date,
            hours: flight.hours,
            class: flight.class,
            price: flight.price,
            seats_amount: flight.seats_amount,
            cost: flight.cost 
        }
        console.log(flight);
        if (btn === 'Add') {
        $http({
            method: "POST",
            url: "http://localhost:3000/flight/create",
            dataType: 'json',
            data: {
                flight: flight,
            },
            headers: {
              "x-access-token": token
            }
            }).then(function(response){
                console.log(response);
            },function(response){
            });   
  
        } else if (btn === 'Save') {
            var _id = $scope.formData.flightChecked._id;
            console.log(flight);
            $http({
            method: "PUT",
            url: "http://localhost:3000/flight/update/"+ _id,
            dataType: 'json',
            data: {
                flight: flight,
            },
            headers: {
              "x-access-token": token
            }
            }).then(function(response){
                console.log(response);
            },function(response){
            });   
        }
        $http({
            method: "GET",
            url: "http://localhost:3000/flights/all",
            headers: {
              "x-access-token": token
            }
        }).then(function(response){
           $scope.flights = response.data.data.flights;
        },function(response){

        });
    };

});

