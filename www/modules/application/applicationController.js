bloxApp.controller('applicationController',['$scope', '$ionicActionSheet',
   '$cordovaCamera',  '$cordovaInAppBrowser', '$stateParams',
   'schemaService','applicationService','$auth','$window','$timeout','$cordovaFileTransfer'
    ,function($scope, $ionicActionSheet,
       $cordovaCamera,  $cordovaInAppBrowser, $stateParams,
       schemaService,applicationService,$auth,$window,$timeout,$cordovaFileTransfer)
{


// $scope.page={title:"Files"};
console.log($stateParams);
// $scope.bloxId=$stateParams.blox.ID;
// $scope.page.title=$stateParams.blox.name
    $scope.loaded=true;

$scope.openBrowser=function(file)
{

  if (!window.cordova) {

    console.log('browser mode');
    var tabWindowId = $window.open('about:blank', '_blank');
                 tabWindowId.location.href = BLOX.URL.executeApplicationURL() + '/app/' + file.ID + '/' + $auth.getToken();
  }
  else {


    if( window.cordova && cordova.platformId === "android" ) {

        //window.inAppBrowserXwalk.open('');

        var options = {
                  toolbarColor: '#DA4436', // Background color of the toolbar in #RRGGBB
                  toolbarHeight: '120',
                  closeButtonText: '< Blox',
                  closeButtonSize: '25',
                  closeButtonColor: '#f9f9f9',
                  openHidden: false
                };

          var browser = window.inAppBrowserXwalk.open(BLOX.URL.executeApplicationURL()
          + '/app/' + $scope.id + '/' + $auth.getToken(),options);


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
        window.open(BLOX.URL.executeApplicationURL() + '/app/' + file.ID + '/' + $auth.getToken());

    }

  }
}


$scope.getAppData = function() {

  applicationService.getApplicationData().then(function(value)
      {
          $scope.loaded=false;
          console.log("Getting Applications For Blox Controller"+value);
          /* Set all of the types to application for rendering */
          for(var i = 0; i < value.length; i++) {
              value[i].application = true;
          }
          $scope.appData=value;
          schemaService.convertEpochTime($scope.appData, true, "Created on");
          console.log("App data");
          console.log($scope.appData);
      });

    }

 $scope.getAppData();



}])
