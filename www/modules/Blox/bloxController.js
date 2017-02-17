bloxApp.controller('bloxController', ['$scope', '$ionicPopup', '$state',
  '$ionicPopover', '$ionicListDelegate', '$ionicActionSheet', '$ionicHistory',
  'schemaService','$rootScope','$localStorage','ionicToast'
    ,function($scope, $ionicPopup, $state, $ionicPopover,
      $ionicListDelegate, $ionicActionSheet, $ionicHistory,schemaService,
      $rootScope,$localStorage,ionicToast)
{

    console.log('bloxController');
    $scope.loaded=true;

  $scope.notificationCount=schemaService.getNotificationCount();
    $rootScope.$on('notificationCount', function (event, args) {

        $scope.notificationCount=args.message;

    })

    $rootScope.$on('errorMsg', function (event, args) {
   ionicToast.show(args.message, 'bottom', false, 800);

    })

        $scope.populateUsers = function(blox)
        {
            var sharedObjArray=blox.shared;

            //console.log(sharedObjArray);

          //   if(sharedObjArray==undefined||sharedObjArray.length==0)
          //   return;
          //
          //
          // //  console.log(scope.owner);
            for(var i=0;i<sharedObjArray.length;i++)
            {


                    if(""+sharedObjArray[i].ID===blox.owner)
                    {
                      console.log('shared array is');
                       return sharedObjArray[i].email;
                    }




            }
        }

    $scope.getBloxData=function()
    {
      schemaService.getDashboardData().then(function(returnedBlox)
      {



          $scope.bloxData = returnedBlox;
          console.log("Got Bloxes");
          console.log($scope.bloxData);
          schemaService.convertEpochTime($scope.bloxData, true, "Last modified ");

          console.log("Getting notifcaitons");
             $scope.loaded=false;


          // schemaService.getAllNotifications().then(function(response) {
          //
          //     /* Set all of the notifications for each blox */
          //     console.log(response);
          //     if(response.data.Result == "Success") {
          //         $scope.allNotifications = response.data.Notifications;
          //         schemaService.convertEpochTime($scope.allNotifications, false, "Last modified ");
          //       //  $scope.setBloxNotifications();
          //     }
          //     else {
          //       {
          //         ionicToast.show('Oops! Something wrong. Please try again in some time! ', 'bottom', false, 800);
          //
          //       }
          //     }
          // });
           $scope.$broadcast('scroll.refreshComplete');

      });

    }

  $scope.getBloxData();

  $scope.goToFolder = function(blox)
  {
    console.log(blox);
    $state.go('app.save',{'blox':blox,id:blox.ID})
  }

  $scope.saveBlox = function(card)

  {
              ionicToast.show('saving...', 'bottom', false);
              schemaService.saveBlox(card).then(function(response) {
                  if(response.data.Result == "Success") {


                      /* Update the values for the new bubble */
                      response.data.Bubble.notifications = [];
                      //$scope.bloxData[0] = response.data.Bubble;

                      schemaService.convertEpochTime([response.data.Bubble], true, "Last modified ");
                      schemaService.addBloxToView(response.data.Bubble);
                      ionicToast.show(response.data.Bubble.name+' saved!', 'bottom', false, 800);
                     // $scope.openFolder(response.data.Bubble);
                  }
                  else {

                      $scope.bloxData.splice(0,1);
                      ionicToast.show(card.name+' could not be saved! Please try again later.', 'bottom', false, 800);

                  }
              });
          }

  $scope.addBlox = function() {
     $scope.data = {create:""}


     // Custom popup
     var myPopup = $ionicPopup.show({
        template: '<input type = "text" ng-model = "data.create" placeholder="Enter folder name">',
        title: 'Folder name ',
        subTitle: '',
        scope: $scope,

        buttons: [
           { text: 'Cancel' }, {
              text: '<b>Create</b>',

                 onTap: function(e) {

                   if (!$scope.data.create) {
                     //don't allow the user to close unless he enters wifi password
                     e.preventDefault();
                   } else {
                      var shared=[];
                      shared.push($localStorage.email)
                     var newBlox= {
                              "id":"",
                              "name":$scope.data.create,
                              "description":"Click on Edit icon to Edit",
                              "icon":"",
                              "created": "",
                              "modified": "",
                              "readOnly":false,
                              "notifications": [],
                              "newone":true,
                              "shared":shared
                          }
                     //blox.name=
                        $scope.saveBlox(newBlox);


                   }
                 }
           }
        ]
     });


   myPopup.then(function(res) {
        console.log('Tapped!', res);


     });

 };


 $ionicPopover.fromTemplateUrl('templates/popover.html', {
   scope: $scope,
 }).then(function(popover) {
   $scope.popover = popover;
 });





  $scope.show1 = false;

 $scope.click1 = function($event) {
   $event.stopPropagation();
   $scope.show1 = !$scope.show1;

   $ionicListDelegate.closeOptionButtons(); }
 $scope.hide = function() {

   $scope.show1 = false;
   $ionicListDelegate.closeOptionButtons(); }


 /* list checkbox*/

   $scope.deList = [ { checked: false }, { checked: false },{ checked: false }];



$scope.deleteBlox = function(blox)
{
   ionicToast.show('Deleting blox '+blox.name, 'bottom', false, 800);
  schemaService.deleteBlox(blox.ID).then(function(response) {
             if(response.data.Result == "Success")
                 {
                   schemaService.deleteBloxFromView(blox.ID).then(function(bloxList) {
                  $scope.bloxData = bloxList;
                    ionicToast.show(blox.name+' deleted', 'bottom', false, 800);

              });


                 }
             else {
                  ionicToast.show('Could not delete blox '+blox.name+'. Please try again in some time.'
                  , 'bottom', false, 800)
             }
         });
}

   $scope.showActionsheet = function(event,blox) {
     event.preventDefault();


   $ionicActionSheet.show({

     buttons: [
       { text: '<i class="icon ion-folder"></i> <b>'+blox.name},
       { text: '<i class="icon ion-person-add"></i> Share' },
       { text: '<i class="icon ion-edit"></i> Rename' },
       { text: '<i class="icon ion-trash-b"></i> Delete'},

     ],



       buttonClicked: function(index, $ionicPopup) {
           console.log('BUTTON CLICKED', blox.name);

     if(index === 1){$state.go('app.share',{'blox':blox,id:blox.ID});}
            else if(index === 2){$scope.showPrompt(blox);}
            else if (index===0)
            {
              $scope.addBlox();
            }
            else if (index===3)
            {
                $scope.deleteBlox(blox);
            }
      return true;

       },





     destructiveButtonClicked: function() {
       console.log('DESTRUCT');
       return true;
     }
   });
 };

$scope.data={
  rename:""
}
 $scope.showPrompt = function(blox) {
       var myPopup = $ionicPopup.show({
       template: '<input type = "text" ng-model = "data.rename" placeholder="Enter folder name">',
        title: 'Rename Folder <b>'+blox.name +'</b>',
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
               var prevName=blox.name
               blox.name=$scope.data.rename
               ionicToast.show('please wait...', 'bottom', false);
               schemaService.saveBlox(blox).then(function(data)
             {
                if(data.data.Result == "Success")
                {
                  ionicToast.show(prevName+ ' renamed to '+data.data.Bubble.name, 'bottom', false,800);
                   //$state.go('app.save',{'blox':blox})
                   return $scope.data.rename;
                }
                else {
                  {
                    ionicToast.show('Something went wrong! Please try again in some time.', 'bottom', false,800);
                  }
                }

             })

             }
           }
         },
       ]
     });
   };

 $scope.page =function(){
  myPopup.then(function() {
        console.log('Tapped!');
      $state.go('app.share');

  });
  }

   schemaService.pollNewNotifications();

$rootScope.$on('newBloxNotification', function (event, args) {
  var notification = args.message
  if(!notification.bubble)
      return;
  schemaService.getBloxById(notification.bubble.ID).then(function(response) {
                  if(response.Result == "Success") {
                      response.Bubble.notifications = [];
                      schemaService.addBloxToView(response.Bubble).then(function(bloxList) {
                          $scope.bloxData = bloxList;
                          schemaService.convertEpochTime($scope.bloxData, true, "Last modified ");
                          /* TODO: Don't delete notification because we share dropbox links */
                          //schemaService.deleteNotification(notification.ID);
                      });
                  }
                  else {
                      schemaService.deleteNotification(notification.ID)
                  }
              });
 });

 $rootScope.$on('deleteBloxNotification', function (event, args) {
var notification = args.message
   //console.log(response.data.Result)



        schemaService.deleteBloxFromView(notification.bubbleId).then(function(bloxList) {
                  $scope.bloxData = bloxList;
                  // ionicToast.show(notification.description, 'bottom', false,800);
                    schemaService.convertEpochTime($scope.bloxData, true, "Last modified ");

                  // message = {
                  //     type: 'success',
                  //     msg: 'Your blox has been successfully deleted'
                  // }
                  // //messagesBusService.publish('alertEvent', message);
                  //   $rootScope.$broadcast('deleteFile', message);
              });






 });



}])
