bloxApp.controller('menuController',['$scope', '$state', '$ionicHistory', '$auth',
    '$localStorage', '$rootScope', 'schemaService', '$ionicPopup', '$localStorage'
    ,function($scope, $state, $ionicHistory, $auth,
        $localStorage, $rootScope, schemaService, $ionicPopup, $localStorage)
{

  console.log('menu controller')

  // $scope.notificationCount = 0;

   $scope.notificationCount=schemaService.getNotificationCount()

  $rootScope.$on('notificationCount', function (event, args) {

    if ($scope.notificationCount)
    {
        $scope.notificationCount++;
    }
    else
      $scope.notificationCount=args.message;

  })

$scope.clickNotification = function()
{
  $state.go('app.notification');

}
  $scope.showLogout = true;
  $scope.user = {
      email: ""
  }
  $scope.user.email = $localStorage.email;


  if (window.cordova && cordova.platformId != "android") {
      $scope.showLogout = false
  }
  $scope.myGoBack = function(back) {
      console.log('Back-In');
      $ionicHistory.goBack();

  };

  $scope.logout = function() {


      $scope.showConfirm = function() {
          if (!window.cordova) {
              delete $localStorage.email;
              delete $localStorage.accessToken;
              $auth.removeToken();
              $state.go('login');
              return;
          }
          var confirmPopup = $ionicPopup.confirm({
              title: 'Exiting Blox',
              template: 'Are you sure you want to logout and exit Blox?'
          });

          confirmPopup.then(function(res) {
              if (res) {
                  delete $localStorage.email;
                  delete $localStorage.accessToken;
                  $auth.removeToken();
                  ionic.Platform.exitApp();

              } else {
                  return;
              }
          });
      };
      $scope.showConfirm();




  }

  $scope.doRefresh = function() {
      PersonService.GetNewUser().then(function(items) {
          $scope.items = items.concat($scope.items);

          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
      });
  };


}])
