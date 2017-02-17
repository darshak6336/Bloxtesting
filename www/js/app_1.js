var bloxApp=angular.module('bloxApp',
['ionic',
'ngTagsInput',
'ngCordova',
'serviceModule',
'factoryModule',
'satellizer',
'ngCookies',

])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})




.config(function($stateProvider, $urlRouterProvider, $cordovaInAppBrowserProvider,$authProvider,$ionicConfigProvider)
{

  $authProvider.loginUrl = 'https://devprivasera.com:6199/auth/login';
  $authProvider.signupUrl = 'https://devprivasera.com:6199/auth/signup';
  $ionicConfigProvider.views.maxCache(0);

  $stateProvider


 .state('app', {
      url: '/app',
	   abstract: true,
        templateUrl: 'templates/menu.html',
		controller:'AppCtrl'

  })

	  .state('app.recent', {
    url: '/recent',
    views: {
      'menuContent' :{
        templateUrl: 'templates/recent.html',
		controller:'RecentCtrl'
      }
    }
  })




	  .state('app.save', {
    url: '/save',
    views: {
      'menuContent' :{
        templateUrl: 'templates/save.html',
		controller:'SaveCtrl'

      }
    }
  })



	  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent' :{
        templateUrl: 'templates/profile.html',
		controller:'RecentCtrl'

      }
    }
  })


   .state('app.blox', {
    url: '/blox',
    views: {
      'menuContent' :{
        templateUrl: 'modules/Blox/bloxTemplate.html',
		// controller:'bloxController'
      }
    }
  })


   .state('app.application', {
    url: '/application',
    views: {
      'menuContent' :{
        templateUrl: 'templates/application.html',
		controller:'RecentCtrl'

      }
    }
  })
/*
 .state('app.offline-files', {
    url: '/offline-files',
    views: {
      'menuContent' :{
        templateUrl: 'templates/offline-files.html',
      }
    }
  })
*/

   .state('app.notification', {
    url: '/notification',
    views: {
      'menuContent' :{
        templateUrl: 'templates/notification.html',

      }
    }
  })


 .state('login', {
      url: '/login',
	   	//abstract: true,
        templateUrl: 'modules/login/loginTemplate.html',
		controller:'loginController'

  })


   .state('app.share', {
    url: '/share',
    views: {
      'menuContent' :{
        templateUrl: 'templates/share.html',
		controller:'NotifCtrl'

      }
    }
  })


   .state('app.member', {
    url: '/member',
    views: {
      'menuContent' :{
        templateUrl: 'templates/member.html',
      }
    }
  })


  .state('search', {
    url: '/search',
        templateUrl: 'templates/search.html',


  })



.state('signup', {
	url: '/signup',
  templateUrl: 'templates/signup.html',
  controller:'SignInCtrl'
});



  $urlRouterProvider.otherwise('/login');
})




//   .controller('SignInCtrl', function($scope, $state) {
//
//   $scope.aaa = function(user) {
//     //console.log('menu-In');
//
//     $state.go('app.recent');
//   }
//
// })
 .controller('NotifCtrl', function($scope, $state, $http) {


   $scope.click = function(notif) {
	   FCMPlugin.getToken(
   function(token){
    	$scope.Tokenvalue = token;
		/*alert(token);*/
	/*console.log('Token',token);*/
  })

	   }


 $scope.add = function(Tokenn) {




			console.log("this is passotoken", Tokenn);
            var data = {"notification": { "title":"Blox invitation", "body":"You are invited"}, "to" : Tokenn };


            $http.post(
                'https://fcm.googleapis.com/fcm/send',
                JSON.stringify(data),
                {
                    headers: {
                        'Content-Type': 'application/json',
						'Authorization': 'key=AIzaSyADwqK7OsToJ7kVTx0DEj_4vJG1HM-n6Sg'

                    }
                }
            ).success(function (data) {
                $scope.person = data;
				            });


 }
})


  .controller('AppCtrl', function($scope, $state,$ionicHistory) {
            $scope.myGoBack = function(back) {
				console.log('Back-In');
                $ionicHistory.goBack();

            };


	 $scope.doRefresh = function() {
		PersonService.GetNewUser().then(function(items){
			$scope.items = items.concat($scope.items);

			//Stop the ion-refresher from spinning
			$scope.$broadcast('scroll.refreshComplete');
		});
  };

   })


  .controller('SaveCtrl', function($scope, $ionicActionSheet, $cordovaCamera,  $cordovaInAppBrowser) {

  $scope.showActionsheet = function() {

    $ionicActionSheet.show({
      titleText: 'Add to Blox',
      buttons: [
        { text: '<i class="icon ion-image"></i> Upload photos or videos' },
        { text: '<i class="icon ion-upload"></i> Upload files' },
		    { text: '<i class="icon ion-document-text"></i> Create a new text file' },
			  { text: '<i class="icon ion-camera"></i> Take a photo' },

      ],

			  buttonClicked: function(index, $ionicPopup) {
            console.log('BUTTON CLICKED', index);
			  if(index === 0){$scope.choosePhoto();}
			  else if(index === 3){$scope.takePhoto();}
             <!--else {$scope.takePhoto();}-->
			 return true;

			  },

      destructiveButtonClicked: function() {
        console.log('DESTRUCT');
        return true;
      }
    });
  };




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

       $scope.choosePhoto = function () {
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
                }




$scope.openBrowser = function () {
console.log("Button clicked....!!!!");
    var platform;
	onDeviceReady();
function onDeviceReady() {
    platform = device.platform.toLowerCase();
   if(platform.match(/win/)){
		console.log("platform");
      platform = "windows";
   }
   else{
	   console.log("asfdfasfdfdsdfsdsffdsfd")

   }
    $('body').addClass(platform);

      console.log(platform);





    // iOS+Android settings
    //$('#cardlist').on("click", function(){

        cordova.plugins.diagnostic.requestCameraAuthorization(function(status){
            console.log("Successfully requested camera authorization: authorization was " + status);
			if (status = 'GRANTED'){



				/*
				 var options = {
                    toolbarColor: '#da4436', // Background color of the toolbar in #RRGGBB
                    toolbarHeight: '130',
                    closeButtonText: ' < Back ',
					closeButtonAlign: 'Center',
                    closeButtonSize: '25',
                    closeButtonColor: '#ffffff',
                    openHidden: false
                  };*/

    if( window.cordova && cordova.platformId === "android" ) {

        var browser = window.inAppBrowserXwalk.open("https://opentokrtc.com");

       browser.addEventListener("loadstart", function ( url ) {
            console.log(url);
        });

        browser.addEventListener("loadstop", function ( url ) {
            console.log(url);
        });

        browser.addEventListener("exit", function () {
            console.log("browser closed");
        });
    }
    else {
        window.open("https://opentokrtc.com");
    }

				 checkState();
				}

        }, function(error){
            console.error(error);
        });
    //});


 setTimeout(checkState, 500);
}


function checkState(){
    console.log("Checking state...");

// $('#state li').removeClass('on off');




    // Camera
    var onGetCameraAuthorizationStatus;
    cordova.plugins.diagnostic.isCameraAvailable(function(available){
		console.log("camera is avalable ...!!!!!!!!!!!!!!!!!!", available);
       // $('#state .camera').addClass(available ? 'on' : 'off');
    }, onError);

    if(platform === "android" || platform === "ios") {
        cordova.plugins.diagnostic.isCameraPresent(function (enabled) {
			console.log("camera is present ...!!!!!!!!!!!!!!!!!!", enabled);
            //$('#state .camera-present').addClass(enabled ? 'on' : 'off');
        }, onError);

        cordova.plugins.diagnostic.isCameraAuthorized(function (enabled) {
            //$('#state .camera-authorized').addClass(enabled ? 'on' : 'off');
			console.log("camera is authorization ...!!!!!!!!!!!!!!!!!!", enabled);
        }, onError);

        cordova.plugins.diagnostic.getCameraAuthorizationStatus(function (status) {
            //$('#state .camera-authorization-status').find('.value').text(status.toUpperCase());
			console.log("camera is avalaauthorization status,,,...!!!!!!!!!!!!!!!!!!", status);
            onGetCameraAuthorizationStatus(status);
        }, onError);
    }



    if(platform === "android"){
        onGetCameraAuthorizationStatus = function(status){
            $('#request-camera').toggle(status != cordova.plugins.diagnostic.permissionStatus.GRANTED && status != cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS);
        }
    }






}

function onError(error){
    console.error("An error occurred: "+error);
}

function onResume(){
    checkState();
}




$(document).on("deviceready", onDeviceReady);

};
	/*	 var options = {
      location: 'yes',
      clearcache: 'no',
      toolbar: 'yes'
    };*/
				/*
				 document.addEventListener("deviceready", function () {
				 $scope.openBrowser = function() {

		 // Open in app browser

   window.open('https://shagle.com','_self' );


	  			 };

		  }, false);
	*/
 })




 //  .controller('BloxCtrl', function($scope, $ionicPopup, $state, $ionicPopover, $ionicListDelegate, $ionicActionSheet, $ionicHistory) {
 //
 //  $scope.aaa = function() {
 //      $scope.data = {}
 //
 //      // Custom popup
 //      var myPopup = $ionicPopup.show({
 //         template: '<input type = "text" ng-model = "data.model" placeholder="Enter folder name">',
 //         title: 'Folder name',
 //         subTitle: '',
 //         scope: $scope,
 //
 //         buttons: [
 //            { text: 'Cancel' }, {
 //               text: '<b>Create</b>',
 //
 //                  onTap: function(e) {
 //
 //                     if (!$scope.data.model) {
 //                        //don't allow the user to close unless he enters model...
 //                           e.preventDefault();
 //                     } else {
 // 					  $state.go('app.save');
 //                        return $scope.data.model;
 //                     }
 //                  }
 //            }
 //         ]
 //      });
 //
 //    myPopup.then(function(res) {
 //         console.log('Tapped!', res);
 //
 //
 //      });
 //
 // };
 //
 //
 // $ionicPopover.fromTemplateUrl('templates/popover.html', {
 //    scope: $scope,
 //  }).then(function(popover) {
 //    $scope.popover = popover;
 //  });
 //
 //
 //
 //
 //
 //   $scope.show1 = false;
 //
 //  $scope.click1 = function($event) {
 //    $event.stopPropagation();
 //    $scope.show1 = !$scope.show1;
 //
 //    $ionicListDelegate.closeOptionButtons(); }
 //  $scope.hide = function() {
 //
 //    $scope.show1 = false;
 //    $ionicListDelegate.closeOptionButtons(); }
 //
 //
 // /* list checkbox*/
 //
 //   $scope.deList = [ { checked: false } ];
 //
 //   $scope.deeList = [{ checked: false } ];
 //
 //   $scope.deeeList = [{ checked: false } ];
 //
 //
 //
 //   $scope.showActionsheet = function() {
 //
 //    $ionicActionSheet.show({
 //
 //      buttons: [
 //        { text: '<i class="icon ion-folder"></i> <b>Folder-blox1'},
 //        { text: '<i class="icon ion-person-add"></i> Share' },
 // 	    { text: '<i class="icon ion-edit"></i> Rename' },
 // 		  { text: '<i class="icon ion-trash-b"></i> Delete'},
 //
 //      ],
 //
 //
 //
 // 		  buttonClicked: function(index, $ionicPopup) {
 //            console.log('BUTTON CLICKED', index);
 // 		if(index === 1){$state.go('app.share');}
 //             else if(index === 2){$scope.showPrompt();}
 // 		 return true;
 //
 // 		  },
 //
 //
 //
 //
 //
 //      destructiveButtonClicked: function() {
 //        console.log('DESTRUCT');
 //        return true;
 //      }
 //    });
 //  };
 //
 //
 //  $scope.showPrompt = function() {
 //        var myPopup = $ionicPopup.show({
 //        template: '<input type = "text" ng-model = "data.rename" placeholder="Enter folder name">',
 //         title: 'Rename Folder',
 //        scope: $scope,
 //         buttons: [
 //            { text: 'Cancel' }, {
 //               text: '<b>Rename</b>',
 //
 //           <!-- type: 'button-positive',-->
 //            onTap: function(e) {
 //              if (!$scope.data.model) {
 //                //don't allow the user to close unless he enters wifi password
 //                e.preventDefault();
 //              } else {
 // 					  $state.go('app.save');
 // 					   return $scope.data.rename;
 //              }
 //            }
 //          },
 //        ]
 //      });
 //    };
 //
 // $scope.page =function(){
 //  myPopup.then(function() {
 //         console.log('Tapped!');
 // 	   $state.go('app.share');
 //
 //  });
 //  }
 //
 //
 //
 //
 //
 //  })


 .controller('RecentCtrl', function($scope, $ionicPopup, $state, $ionicPopover, $ionicListDelegate, $ionicActionSheet, $cordovaCamera) {

   // When button is clicked, the popup will be shown...
   $scope.showPopup = function() {
      $scope.data = {}

      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<input type = "text" ng-model = "data.model" placeholder="Enter folder name">',
         title: 'Create Folder',
         subTitle: '',
         scope: $scope,

         buttons: [
            { text: 'Cancel' }, {
               text: '<b>Save</b>',

                  onTap: function(e) {

                     if (!$scope.data.model) {

                        //don't allow the user to close unless he enters model...
                           e.preventDefault();

                     }  else {
						  $state.go('app.save');
						   return $scope.data.model;
						}
                  }
            }
         ]
      });



    myPopup.then(function() {
         console.log('Tapped!');

      });



 };





  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });




  /*show  and  hide function for che*/
  $scope.show1 = false;

  $scope.click1 = function($event) {
    $event.stopPropagation();
    $scope.show1 = !$scope.show1;

    $ionicListDelegate.closeOptionButtons(); }
  $scope.hide = function() {

    $scope.show1 = false;
    $ionicListDelegate.closeOptionButtons(); }


	/* list checkbox*/

	  $scope.devList = [ { checked: false } ];

	  $scope.devvList = [{ checked: false } ];

	  $scope.devvvList = [{ checked: false } ];



	  /* actionsheet for recent */
 $scope.showActionsheet = function() {

    $ionicActionSheet.show({

      buttons: [
        { text: '<i class="icon ion-folder"></i> <b>Folder-blox1'},
        { text: '<i class="icon ion-person-add"></i> Share' },
		    { text: '<i class="icon ion-edit"></i> Rename' },
			  { text: '<i class="icon ion-trash-b"></i> Delete'},

      ],

	  /*onclick rename button popup open */

			  buttonClicked: function(index, $ionicPopup) {
            console.log('BUTTON CLICKED', index);
			if(index === 1){$state.go('app.share');}
             else if(index === 2){$scope.showPrompt();}
			 return true;

			  },



      destructiveButtonClicked: function() {
        console.log('DESTRUCT');
        return true;
      }
    });
  };


  $scope.showPrompt = function() {
        var myPopup = $ionicPopup.show({
        template: '<input type = "text" ng-model = "data.rename" placeholder="Enter folder name">',
         title: 'Rename Folder',
        scope: $scope,
         buttons: [
            { text: 'Cancel' }, {
               text: '<b>Rename</b>',

           <!-- type: 'button-positive',-->
            onTap: function(e) {
              if (!$scope.data.rename) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
						  $state.go('app.save');
						   return $scope.data.rename;
              }
            }
          },
        ]
      });
    };

/* profile actionsheet open on click */

$scope.showActionsheetprof = function() {
   $ionicActionSheet.show({
      titleText: 'Update account photo',
      buttons: [
        <!--{ text: '<i class="icon ion-image"></i> Choose from Blox'},-->
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
    });
  };
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

       $scope.choosePhoto = function () {
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
                }

$scope.openBrowser = function () {
console.log("Button clicked....!!!!");
    var platform;
	onDeviceReady();
function onDeviceReady() {
    platform = device.platform.toLowerCase();
   if(platform.match(/win/)){
		console.log("platform");
      platform = "windows";
   }
   else{
	   console.log("asfdfasfdfdsdfsdsffdsfd")

   }
    $('body').addClass(platform);

      console.log(platform);





    // iOS+Android settings
    //$('#cardlist').on("click", function(){

        cordova.plugins.diagnostic.requestCameraAuthorization(function(status){
            console.log("Successfully requested camera authorization: authorization was " + status);
			if (status = 'GRANTED'){



				/*
				 var options = {
                    toolbarColor: '#da4436', // Background color of the toolbar in #RRGGBB
                    toolbarHeight: '130',
                    closeButtonText: ' < Back ',
                    closeButtonSize: '25',
                    closeButtonColor: '#ffffff',
                    openHidden: false
                  };*/

    if( window.cordova && cordova.platformId === "android" ) {

        var browser = window.inAppBrowserXwalk.open("https://opentokrtc.com");

        browser.addEventListener("loadstart", function ( url ) {
            console.log(url);
        });

        browser.addEventListener("loadstop", function ( url ) {
            console.log(url);
        });

        browser.addEventListener("exit", function () {
            console.log("browser closed");
        });
    }
    else {
        window.open("https://opentokrtc.com");
    }

				 checkState();
				}

        }, function(error){
            console.error(error);
        });
    //});


 setTimeout(checkState, 500);
}


function checkState(){
    console.log("Checking state...");

// $('#state li').removeClass('on off');




    // Camera
    var onGetCameraAuthorizationStatus;
    cordova.plugins.diagnostic.isCameraAvailable(function(available){
		console.log("camera is avalable ...!!!!!!!!!!!!!!!!!!", available);
       // $('#state .camera').addClass(available ? 'on' : 'off');
    }, onError);

    if(platform === "android" || platform === "ios") {
        cordova.plugins.diagnostic.isCameraPresent(function (enabled) {
			console.log("camera is present ...!!!!!!!!!!!!!!!!!!", enabled);
            //$('#state .camera-present').addClass(enabled ? 'on' : 'off');
        }, onError);

        cordova.plugins.diagnostic.isCameraAuthorized(function (enabled) {
            //$('#state .camera-authorized').addClass(enabled ? 'on' : 'off');
			console.log("camera is authorization ...!!!!!!!!!!!!!!!!!!", enabled);
        }, onError);

        cordova.plugins.diagnostic.getCameraAuthorizationStatus(function (status) {
            //$('#state .camera-authorization-status').find('.value').text(status.toUpperCase());
			console.log("camera is avalaauthorization status,,,...!!!!!!!!!!!!!!!!!!", status);
            onGetCameraAuthorizationStatus(status);
        }, onError);
    }



    if(platform === "android"){
        onGetCameraAuthorizationStatus = function(status){
            $('#request-camera').toggle(status != cordova.plugins.diagnostic.permissionStatus.GRANTED && status != cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS);
        }
    }






}

function onError(error){
    console.error("An error occurred: "+error);
}

function onResume(){
    checkState();
}




$(document).on("deviceready", onDeviceReady);

};
		 /*






*/
 })





.controller('AppCtrl', function($scope) {
});
