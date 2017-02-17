bloxApp.controller('notificationController',['$scope', '$ionicActionSheet',
   '$cordovaCamera',  '$cordovaInAppBrowser', '$stateParams',
   'schemaService','applicationService','$auth','$window',
   '$timeout','$cordovaFileTransfer','$state','ionicToast'
    ,function($scope, $ionicActionSheet,
       $cordovaCamera,  $cordovaInAppBrowser, $stateParams,
       schemaService,applicationService,$auth,$window,$timeout,$cordovaFileTransfer,$state,
     ionicToast)
{

console.log('notificationController');
$scope.loaded=true;
$scope.groupByBlox=false;
$scope.listCanSwipe = true;
$scope.shouldShowDelete = true;
$scope.shouldShowReorder = true;

$scope.selectedNotifications=[]

$scope.selectNotif=function(notification,ev)
{
  //  console.log(notification);
   ev.stopPropagation();
  if(notification.Selected)
    {
      $scope.selectedNotifications.push(notification);
    }

  else
    {
      for(var i=0;i<$scope.selectedNotifications.length;i++)
      {
        if($scope.selectedNotifications[i].ID===notification.ID)
        {
          $scope.selectedNotifications.splice(i,1);
          // console.log($scope.selectedNotifications);
          break;
        }
      }
    }


}

$scope.remove = function(notification,ev)
{
    ev.stopPropagation();
   $scope.allNotifications.splice($scope.allNotifications.indexOf(notification), 1);
   //TODO: call remove api
  console.log(notification);
    ionicToast.show('The notification has been deleted', 'bottom', false, 800);
}

$scope.toggleChange = function()
{
  if ($scope.groupByBlox == false) {
              $scope.groupByBlox = true;
            }
  else
  {
      $scope.groupByBlox = false;
      $scope.selectedNotifications=[];
      for(var i=0;i<$scope.allNotifications.length;i++)
      {
        if($scope.allNotifications[i].Selected===true)
        {
          $scope.allNotifications[i].Selected=false;
        }
      }
  }



}



$scope.getNotifications = function()
{
  schemaService.getAllNotifications().then(function(response) {

      /* Set all of the notifications for each blox */

      console.log('getting notifications');
      console.log(response);
      if(response.data.Result&&response.data.Result == "Success") {
          $scope.allNotifications = response.data.Notifications;
          schemaService.convertEpochTime($scope.allNotifications, false, "Last modified ");
          // $scope.groupedNotifications = schemaService.groupBy($scope.allNotifications, function(item)
          // {
          //   return [item.bubbleId, item.created];
          // });
          // console.log(  $scope.groupedNotifications);

        //  $scope.setBloxNotifications();
      }
      $scope.loaded=false;
          $scope.$broadcast('scroll.refreshComplete');
  });

}

$scope.getNotifications();


$scope.openNotifications=function(notification)
{
    if($scope.groupByBlox)
    {
      notification.Selected=true;
      return;
    }


    $scope.markAsRead(notification);
   schemaService.getBloxById (notification.bubbleId).then(function(data)
{
    if(data.Result == "Success")
    {
        $state.go('app.save',{'blox':data.Bubble})
    }

},
function(response)
{
    ionicToast.show('The blox no longer exists!', 'bottom', false, 800);
})

}

  $scope.markAsRead = function(notification)
  {
       var notificationList =[];
       if(!notification)
       {
          notificationList=$scope.selectedNotifications;


       }

       else {
         notification.read=1;
         notificationList.push(notification);
       }

      schemaService.markNotification(notificationList).then(function(data)
   {
       if(data.Result == "Success")
       {
           //$state.go('app.save',{'blox':data.Bubble})
          // ionicToast.show('The blox no longer exists!', 'bottom', false, 800);
          for (var i=o;i<$scope.selectedNotifications.length ;i++)
          {
            $scope.selectedNotifications[i].read=1;
          }
       }
       else {
         ionicToast.show('Oops! there was something wrong. Please try again.', 'bottom', false, 800);
       }

   },
   function(response)
   {
       ionicToast.show('Oops something went wrong! Please try in sometime.', 'bottom', false, 800);
   })


  }

  $scope.deleteNotification = function(notification,ev)
  {
      //  var notificationList =[];
      //  if(!notification)
      //  notificationList=$scope.selectedNotifications;
      //  else {
      //    notification.read=1;
      //    notificationList.push(notification);
      //  }
       $scope.allNotifications=$scope.allNotifications.filter(function(el) {
         return el.ID !== notification.ID;
        });



      schemaService.deleteNotification(notification.ID).then(function(data)
   {
       if(data.data.Result == "Success")
       {
           //$state.go('app.save',{'blox':data.Bubble})

          ionicToast.show('The notification has been deleted!', 'bottom', false, 800);
       }

   },
   function(response)
   {
       ionicToast.show('Oops something went wrong! Please try in sometime.', 'bottom', false, 800);
   })


  }

}])
