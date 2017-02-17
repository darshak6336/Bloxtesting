bloxApp.controller('EditController', ['$scope', '$ionicPopup', '$state',
  '$ionicPopover', '$ionicListDelegate', '$ionicActionSheet', '$cordovaCamera',
  '$localStorage','uploadService',
    function($scope, $ionicPopup, $state, $ionicPopover, $ionicListDelegate,
       $ionicActionSheet, $cordovaCamera,$localStorage, uploadService)
{

  $scope.user={
    email:"",

  }

     $scope.user.email=$localStorage.email;

  $scope.ShowEditprof = function() {
  uploadService.Editprofiledailog($scope.win, $scope.fail, $scope.addFile);
    /*
     $ionicActionSheet.show({
        titleText: 'Update account photo',
        buttons: [
        //  { text: '<i class="icon ion-image"></i> Choose from Blox'},
  		    { text: '<i class="icon ion-images"></i> Choose from gallery' },
  			  { text: '<i class="icon ion-camera"></i> Use camera'},

        ],

        buttonClicked: function(index, $ionicPopup) {
              console.log('BUTTON CLICKED', index);
  			  if(index === 0){$scope.choosePhoto();}
  			  else if(index === 1){$scope.takePhoto();}
               <!--else {$scope.takePhoto();}-->
  			 return true;

  			  },
        destructiveButtonClicked: function() {
          console.log('DESTRUCT');
          return true;
        }
     });*/
    };

/*
  $scope.takePhoto = function () {
                var options = {
                  quality: 75,
                  destinationType: Camera.DestinationType.DATA_URL,
                  sourceType: Camera.PictureSourceType.CAMERA,
                  allowEdit: true,
                  encodingType: Camera.EncodingType.JPEG,
                  targetWidth: 300,
                  targetHeight: 300,
                  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false
              };

                  $cordovaCamera.getPicture(options).then(function (imageData) {
                      $scope.imgURI = "data:image/jpeg;base64," + imageData;
                  }, function (err) {
                      // An error occured. Show a message to the user
                  });
              }
              */

  /*   $scope.choosePhoto = function () {
                var options = {
                  quality: 75,
                  destinationType: Camera.DestinationType.DATA_URL,
                  sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                  allowEdit: true,
                  encodingType: Camera.EncodingType.JPEG,
                  targetWidth: 300,
                  targetHeight: 300,
                  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false
              };

                  $cordovaCamera.getPicture(options).then(function (imageData) {
                      $scope.imgURI = "data:image/jpeg;base64," + imageData;
                  }, function (err) {
                      // An error occured. Show a message to the user
                  });
              }*/
}])
