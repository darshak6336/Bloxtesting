bloxApp.controller('registerController', ['$rootScope', '$scope', '$auth', '$cookies',
    '$state', '$location', 'schemaService', '$cordovaNetwork', '$ionicPopup', '$localStorage',
    '$ionicHistory', 'ionicToast', '$ionicLoading',
    function($rootScope, $scope, $auth, $cookies, $state,
        $location, schemaService, $cordovaNetwork, $ionicPopup, $localStorage,
        ionicHistory, ionicToast, $ionicLoading) {

        console.log('registration controller')

        $scope.user = {
            firstName: "",
            lastName: "",
            email: "",
            rEmail: "",
            password: ""
        }

        $scope.error = false;
        $scope.errorMsg = "";
        $scope.signup = function() {

            if ($scope.user.email != $scope.user.rEmail) {
                $scope.error = true;
                $scope.errorMsg = "Email values do not match. Please verify."
                return;
            }
            $ionicLoading.show({

                content: 'Loading...',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 0
            });
            //ionicToast.show('Registration in progress. Please wait..', 'bottom', false);
            $auth.signup({
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName,
                email: $scope.user.email,
                password: $scope.user.password
            }).then(function(data) {
                // toastr.clear();
                // toastr.info('Welcome '+$scope.rEmail);
                ionicToast.show('Welcome to Blox. Happy Bloxing!', 'bottom', false);
                $rootScope.loginId = $scope.user.email;
                $scope.user.isError = false
                $localStorage.email = $scope.user.email;

                // $localStorage.email=$scope.user.email;
                //e.preventDefault();
                $ionicLoading.hide();
                return $state.go('app.blox');


            }).catch(function(response) {
                console.log("Signup Response");
                console.log(response);
                $scope.user.isError = true
                $auth.removeToken();
                $ionicLoading.hide();
                delete $localStorage.email;
                $scope.error = true;
                if (response.data&&response.data.errors == undefined)
                // sweetAlert('Username is already taken');
                {
                    $ionicLoading.hide();
                    $scope.errorMsg = "Username is already taken! Please try again";
                    //ionicToast.show($scope.errorMsg, 'bottom', false);

                } else {

                    var msg = response.data.errors[0].msg;
                    $scope.errorMsg = msg

                    // ionicToast.show($scope.errorMsg, 'bottom', false);



                }

            });
        };


    }
])
