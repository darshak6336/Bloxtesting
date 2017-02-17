bloxApp.controller('profileController', ['$scope', '$ionicPopup', '$state',
  '$ionicPopover', '$ionicListDelegate', '$ionicActionSheet', '$cordovaCamera',
  '$localStorage'
    ,function($scope, $ionicPopup, $state, $ionicPopover, $ionicListDelegate,
       $ionicActionSheet, $cordovaCamera,$localStorage)
{

  $scope.user={
    email:""
  }
  $scope.user.email=$localStorage.email;




}])
