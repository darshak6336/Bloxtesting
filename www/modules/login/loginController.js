bloxApp.controller('loginController', ['$rootScope', '$scope', '$auth', '$cookies',
    '$state', '$location', 'schemaService', '$cordovaNetwork', '$ionicPopup', '$localStorage',
    '$ionicHistory', '$ionicLoading',
    function($rootScope, $scope, $auth, $cookies, $state,
        $location, schemaService, $cordovaNetwork, $ionicPopup, $localStorage, ionicHistory, $ionicLoading) {
        ionicHistory.removeBackView()
        console.log('cordovaNetwork');
        document.removeEventListener("deviceready", onDeviceReady, false);

        document.addEventListener("deviceready", onDeviceReady, false)

        function onDeviceReady() {

            $scope.network = $cordovaNetwork.getNetwork();
            $scope.isOnline = $cordovaNetwork.isOnline();
            if (!$scope.isOnline) {
                // var alertPopup = $ionicPopup.alert({
                //  title: 'No Network Connection!',
                //  template: 'Please check your connection and try again'
                // });
                //
                // alertPopup.then(function(res) {
                //    console.log(res);
                //      ionic.Platform.exitApp();
                //  });
            }
            if (!$scope.$$phase) {
                $scope.$apply();
                //$digest or $apply
            }


            // listen for Online event
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                $scope.isOnline = true;
                $scope.network = $cordovaNetwork.getNetwork();

                if (!$scope.$$phase) {
                    $scope.$apply();
                    //$digest or $apply
                }
            })

            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                console.log("got offline");
                $scope.isOnline = false;
                $scope.network = $cordovaNetwork.getNetwork();

                if (!$scope.$$phase) {
                    $scope.$apply();
                    //$digest or $apply
                }
                if (window.cordova && cordova.platformId === "android") {
                    var alertPopup = $ionicPopup.alert({
                        title: 'No Network Connection!',
                        template: 'Please check your connection and try again'
                    });

                    alertPopup.then(function(res) {
                        console.log(res);
                        ionic.Platform.exitApp();
                    });

                }


            })

        };


        $auth.logout();
        $auth.removeToken();
        $rootScope.loginId = ""
        delete $localStorage.email;
        schemaService.clearDashboardData();

        $scope.user = {
            email: "",
            password: "",
            isError: false
        }

        $scope.login = function() {
            console.log($scope.user.email);
            console.log($scope.user.password);
            //return;
            //  console.log($cookies._csrf);
            $scope.text


            if ($scope.user.email == "") {
                $ionicLoading.hide();
            } else if ($scope.user.password == "") {
                $ionicLoading.hide();

            } else {
                $ionicLoading.show({

                    content: 'Loading...',
                    animation: 'fade-in',
                    showBackdrop: false,
                    maxWidth: 200,
                    showDelay: 0



                });

            }



            $auth.login({ email: $scope.user.email, password: $scope.user.password, csrf: $cookies.get('XSRF-TOKEN') })
                .then(function(data) {

                        //changeLocation('dashboard',false);

                        $rootScope.loginId = $scope.user.email;
                        $scope.user.isError = false
                        $localStorage.email = $scope.user.email;

                        // $localStorage.email=$scope.user.email;
                        //e.preventDefault();

                        $ionicLoading.hide();
                        return $state.go('app.blox');
                        // $location.url('/blox');
                        ////$scope.$apply();
                    },
                    function(error) {

                        console.log(error);
                        console.log('error recieved');
                        //$ionicLoading.hide();
                        $scope.user.isError = true

                        $auth.removeToken();
                        $ionicLoading.hide();
                        delete $localStorage.email;
                        //  $state.go('app.blox');
                        //            $alert({
                        //                content: 'Error in user name password field',
                        //                animation: 'fadeZoomFadeDown',
                        //                type: 'material',
                        //                duration: 3
                        //            });
                        //  sweetAlert('Please check username or password.');
                    })
                .catch(function(response) {
                    //  $alert({
                    //      content: response.data.message,
                    //      animation: 'fadeZoomFadeDown',
                    //      type: 'material',
                    //      duration: 3
                    //  });

                    $scope.user.isError = true
                });
        };

    }
])