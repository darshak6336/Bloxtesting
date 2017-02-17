bloxApp.controller('sharingController', ['$scope', '$state',
'$http','schemaService','$stateParams','ionicToast','$auth'
    ,function($scope, $state, $http,schemaService,$stateParams,ionicToast,$auth)
{


console.log('sharing');
$scope.loaded=true;
// if($stateParams.blox)
//  $scope.items=$stateParams.blox;
//
//  else {
//    $scope.items={
//      id:null
//    }
   $scope.items ={
     id:null
   }
 // }
 if($stateParams.blox)
 $scope.items.ID=$stateParams.blox.ID

 else {
   $scope.items.ID=$stateParams.id
 }

 if($scope.items.id==undefined)
      $scope.items.id=$scope.items.ID;

      $scope.test=[]
      $scope.existingUsers=[];

$scope.onModalOpen = function()
       {
           schemaService.findBubbleById($scope.items.ID).then(function(data)
           {
             $scope.loaded=false;
               $scope.bubble=data;
               $scope.modalName=$scope.bubble.name;
               console.log($scope.bubble)
               $scope.existingUsers =  $scope.bubble.shared;

           });

       }

       $scope.checkIfUserPresent=function(value)
       {
           for(var i=0;i<$scope.existingUsers.length;i++)
           {
               if($scope.existingUsers.name==value.text)
                   $scope.test.pop();

               else return true;
           }


       }

       $scope.actions = [
          {id: 'action1', name: 'Can view'},
          {id: 'action2', name: 'Can edit'}
      ];
      $scope.selectedAction  = $scope.actions[0];
      $scope.setAction = function(action) {
          $scope.selectedAction = action;
      };


       $scope.ok = function () {
         //call application service to save the bubble data
         console.log($scope.items);
         console.log($scope.test);
         console.log("SHARING");

         var value=$scope.test.map(function(tag) {
             if(tag.length!=0)
                 return tag.text;
             else return [];
         });

         var bubbles = [];
         bubbles.push($scope.items.id);
         var blox = {
             'users':value,
             'bubbles':$scope.bubble.ID,
             'permission':$scope.selectedAction.name,
             'message':$scope.description,
             'token': $auth.getToken()
         }

         schemaService.shareApplication(blox).then(function(success)
         {
              if(success.data && success.data.ErrorCode && success.data.ErrorCode===800)
              {
                  ionicToast.show(success.data.UserMessage, 'bottom', false);
                  $scope.test=[];
                  return;
              }
             schemaService.findBubbleById($scope.items.id).then(function(data)
             {

                if(data.data && data.data.ErrorCode && data.data.ErrorCode===800)
                {
                  ionicToast.show(data.data.UserMessage, 'bottom', false);
                  $scope.test=[]

                }
                   ionicToast.show('save successful!', 'bottom', false);
                 $scope.bubble=data
                 var value=$scope.test.map(function(tag) {
                     if(tag.length!=0)
                         return tag.text;
                     else return [];
                 })
                 console.log('after sharing data')
                 console.log(success);
                 //var sharedUserObj= {
                 //    pictureUrl: "http://ljtrust.org:8080/static/icons/unknown.png",
                 //    email: value[0]
                 //}

                 //$scope.bubble = schemaService.findBubbleById($scope.items.id);
                 //$scope.existingUsers =  $scope.bubble.shared;
                 $scope.bubble.shared = success.data.Bubble.shared;
                 //messagesBusService.publish('shareBlox');
                 console.log($scope.bubble);

                 $scope.currentCommand ="";
                 //$rootScope.$broadcast('shareBlox'+$rootScope.currentBlox, $scope.bubble);
                // var message = { type: 'success', msg: 'Your Blox has been shared successfully!' }
                 //$rootScope.$broadcast('shareAlert'+$rootScope.currentBlox,message);
             });

         },
         function(error)
         {
            ionicToast.show('oops!Something went wrong.Please try in sometime.', 'bottom', false);
         });
         console.log(blox);


     };






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
  $scope.loadUsers = function(query) {
            return schemaService.getUserByEmail(query);
        };
     $scope.onModalOpen();

}])
