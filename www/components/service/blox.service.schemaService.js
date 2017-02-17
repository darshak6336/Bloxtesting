
angular.module('serviceModule').
    service('schemaService',['HttpService','$q','guid','$timeout','poller','$rootScope'
        ,function(HttpService,$q,guid,$timeout,poller,$rootScope){

        var POLLING_DELAY = 30000;

        var schemaData = "";
        var dashBoardData = [];
        var applicationData = "";
        var notifications = [];
        var currentBlox = "";
        var allRequest = true;
        var lastTimestamp="";
        var notificationCountBlox=[];
        // var notificationApplication=[];

        this.clearDashboardData= function()
        {
          dashBoardData=[];
        }


        this.getSchemaData = function()
        {
            var deferred = $q.defer();
            if(schemaData!="")
            {
                deferred.resolve(schemaData);
            }
            else
                HttpService.get(BLOX.URL.getApplicationSchema()).  then(
                    function(data)
                    {
                        schemaData=data;
                        deferred.resolve(schemaData);
                        // messagesBusService.publish('schemaUpdate', { msg: schemaData });

                    },
                    function(error)
                    {
                        var message = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }
                        // messagesBusService.publish('alertEvent',message);
                        deferred.reject(error);
                    }
                );
            return deferred.promise;
        },

        this.getSchemaObjectByPage = function(page)
        {
            //console.log(schemaData);
            var deferred = $q.defer();
            if (schemaData=="")

                this.getSchemaData().then(function(){
                    for(var i=0;i<schemaData.length;i++)
                    {
                        var schemaObj=schemaData[i];
                        if(schemaObj.page==page)
                        {
                            deferred.resolve(schemaObj);
                        }
                    }
                })
            else
            for(var i=0;i<schemaData.length;i++)
            {
                var schemaObj=schemaData[i];
                if(schemaObj.page==page)
                {
                    deferred.resolve(schemaObj);
                }
            }
            return deferred.promise;
        },

        this.dropboxLogin = function() {
            var redirect_uri=""

            var deferred = $q.defer();
            HttpService.get(BLOX.URL.getDropboxLoginURL()).then(
                function(data) {
                    var redirect_uri=""
                    data = data.body;
                    console.log("DROPBOX SUCCESS");
                    console.log(data);
                    if(data.Result == "Success")
                        redirect_uri = data.RedirectURI;
                    deferred.resolve(redirect_uri);
                },
                function(error) {
                    console.log("Dropbox Login Error");
                }
            );
            return deferred.promise;
        },

        this.importData = function(provider) {

            var deferred = $q.defer();
            if(provider == "Dropbox") {
                HttpService.get(BLOX.URL.getImportDropboxURL()).then(
                    function(data)
                    {
                        if(data.Result == "Success")
                            deferred.resolve(true);
                        else
                            deferred.resolve(false);
                    },
                    function(error)
                    {
                        /* TODO */
                    }
                );
            }
            return deferred.promise;
        },

        this.getDashboardData = function()
        {
            var deferred = $q.defer();
            if(dashBoardData.length > 0)
            {
                deferred.resolve(dashBoardData);
            }
            else
            {
                HttpService.get(BLOX.URL.getDashboardURL()).then(
                    function(data)
                    {
                        if(data.Result == "Success")
                            dashBoardData = data.Bubbles;
                        else if(data.ErrorCode)
                        {
                          $rootScope.$broadcast('errorMsg',{ 'message': data.UserMessage});
                        }
                        deferred.resolve(dashBoardData);
                    },
                    function(error)
                    {
                        var message = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }
                        // messagesBusService.publish('alertEvent',message);
                        deferred.reject(error);
                    }
                );
            }
            return deferred.promise;
        },

        this.getBloxData = function()
        {
            if (dashBoardData=="")
                this.getDashboardData().then(function(){
                    return dashBoardData;
                })
            else
                return dashBoardData;

        }

        /***** Convert Epoch Time to Human Readable for Blox *****/
        this.convertEpochTime = function(bloxData, modifiedValue, prefix) {
            var deferred = $q.defer();

            if(bloxData.length <= 0)
                 deferred.reject({error:'Blox Data is invalid'});

            for(var i = 0; i < bloxData.length; i++) {
                var epochs = [];
                var datevalues = [];
                var index = 0;
                if(!bloxData[i].created)
                {
                  deferred.reject({error:'Blox Data is invalid'})
                }
                epochs.push(new Date(bloxData[i].created * 1000));
                if(modifiedValue) {
                    epochs.push(new Date(bloxData[i].modified * 1000));
                    index = 1;
                }
                for(var n = 0; n < epochs.length; n++) {
                    datevalues.push(
                        {
                            year:       epochs[n].getFullYear(),
                            month:      epochs[n].getMonth()+1,
                            date:       epochs[n].getDate(),
                            hours:      epochs[n].getHours(),
                            minutes:    epochs[n].getMinutes(),
                            seconds:    epochs[n].getSeconds()
                        });
                    /* Keep time to 2 digits */
                    if(datevalues[n].minutes < 10)
                        datevalues[n].minutes = "0" + datevalues[n].minutes;
                    if(datevalues[n].hours < 10)
                        datevalues[n].hours = "0" + datevalues[n].hours;
                }
                if(bloxData[i].created!=undefined && bloxData[i].created.indexOf("at") < 0)
                    bloxData[i].created = prefix + datevalues[index].date + "-" + datevalues[index].month + "-" + datevalues[index].year +
                                            " at " + datevalues[index].hours + ":" + datevalues[index].minutes;
                if(bloxData[i].modified!=undefined && modifiedValue) {
                    if(bloxData[i].modified.indexOf("at") < 0)
                        bloxData[i].modified = prefix + datevalues[0].date + "-" + datevalues[0].month + "-" + datevalues[0].year +
                                            " at " + datevalues[0].hours + ":" + datevalues[0].minutes;;

                }

            }
            deferred.resolve(bloxData);

            return deferred.promise;
        }

        /***** Create a new Blox Card to display *****/
        this.createNewBlox = function(loginId,name)
        {
            var shared=[];
            var readOnly=false;
            var bloxName=name;
            if(loginId==undefined||loginId=="")
            {
                 shared=[]
            }
            else
            {
                 shared.push(loginId);
            }


            if(name!='Untitled Folder')
            {
                bloxName=name;
                readOnly=true;
            }


            var newBlox= {
                "id":"",
                "name":bloxName,
                "description":"Click on Edit icon to Edit",
                "icon":"",
                "created": "",
                "modified": "",
                "readOnly":false,
                "notifications": [],
                "newone":true,
                "shared":shared
            }

            this.addBloxToView(newBlox);
            var addBloxResult={
                'newBlox':newBlox,
                'dashBoardData':dashBoardData
            }
            return addBloxResult;
        }
            /***** Logout of blox *****/
            this.logout = function(blox)
            {
                var deferred = $q.defer();
                var config ={
                    method:'POST',
                    url:BLOX.URL.logout(),
                    data:{

                    }
                }

                HttpService.executeRequest(config).then(
                    function(data) {
                        deferred.resolve(data);
                    },

                    function(error)
                    {
                        var message = { type: 'danger',
                            msg: 'Saving Blox failed. Please try again.' }
                        // messagesBusService.publish('alertEvent',message);
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
            }
        /***** Save changes to blox *****/
        this.saveBlox = function(blox)
        {
            var deferred = $q.defer();
            var config ={
                method:'POST',
                url:BLOX.URL.getDashboardURL(),
                data:{
                    name:blox.name,
                    description:blox.description,
                    id:blox.ID
                }
            }

            HttpService.executeRequest(config).then(
                function(data) {
                    deferred.resolve(data);
                },

                function(error)
                {
                    var message = { type: 'danger',
                        msg: 'Saving Blox failed. Please try again.' }
                    // messagesBusService.publish('alertEvent',message);
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }
            /***** Edit changes to blox *****/
            this.editBlox = function(blox)
            {
                var deferred = $q.defer();
                var config ={
                    method:'PUT',
                    url:BLOX.URL.getDashboardURL(),
                    data:{
                        name:blox.name,
                        description:blox.description,
                        id:blox.id
                    }
                }

                HttpService.executeRequest(config).then(
                    function(data) {
                        deferred.resolve(data);
                    },

                    function(error)
                    {
                        var message = { type: 'danger',
                            msg: 'Saving Blox failed. Please try again.' }
                        // messagesBusService.publish('alertEvent',message);
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
            }

        /**** Get Blox by Id *****/
        this.getBloxById = function(bubbleId) {

            var deferred = $q.defer();
            var config ={
                method:'GET',
                url:BLOX.URL.getDashboardURL(),
                headers: {
                    bubbleid: bubbleId
                }
            }

            HttpService.executeRequest(config).then(
                function(data) {
                    if(data.data.Result == "Success")
                        deferred.resolve(data.data);
                    else
                        deferred.reject();
                },

                function(error)
                {
                    var message = { type: 'danger',
                        msg: 'Saving Blox failed. Please try again.' }
                    // messagesBusService.publish('alertEvent',message);
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        /***** Add a new Blox to the view list *****/
        this.addBloxToView= function(blox) {
            var deferred = $q.defer();

            /* Make sure the bubble does not already exist */
            var skip = false;
            for(var n = 0; n < dashBoardData.length; n++) {
                if(dashBoardData[n].ID == blox.ID) {
                    skip = true;
                    break;
                }
            }
            if(!skip) {
                dashBoardData.unshift(blox);
            }
            deferred.resolve(dashBoardData);
            console.log("Added to view");
            console.log(dashBoardData);
            return deferred.promise;
        }

        /***** Delete blox from the view list *****/
        this.deleteBloxFromView = function(bloxId) {
            var deferred = $q.defer();

            for(var i = 0; i < dashBoardData.length; i++) {
                if(dashBoardData[i].ID == bloxId) {
                    dashBoardData.splice(i, 1);
                    break;
                }
            }
            deferred.resolve(dashBoardData);
            return deferred.promise;
        }

        /***** Delete a Blox *****/
        this.deleteBlox = function(bubbleId) {
            var deferred = $q.defer();
            var config = {
                method: 'POST',
                url: BLOX.URL.getDeleteBloxURL(),
                data: {
                    bubbleId: bubbleId
                }
            }

            HttpService.executeRequest(config).then(
                function(response) {
                    if(response.data.Result == "Failure") {
                        /* TODO */
                        console.log(response);
                        console.log("Error Deleting Bubble!");
                    }
                    deferred.resolve(response);
                },

                function(error) {
                    var message = {type: 'danger',
                        msg: 'Unable to delete folder. Please try again'
                    }
                    // messagesBusService.publish('alertEvent', message);
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }


        /***** Delete a File *****/
        this.deleteFile = function(bubbleId, fileId) {
            var deferred = $q.defer();
            var config = {
                method: 'POST',
                url: BLOX.URL.getDeleteFileURL(),
                data: {
                    bubbleId: bubbleId,
                    fileId: fileId
                }
            }

            HttpService.executeRequest(config).then(
                function(response) {
                    if(response.data.Result != "Success") {
                        /* TODO */
                        console.log(response);
                        console.log("Error Deleting File!");
                    }
                    console.log("Deleted File");
                    console.log(response);
                    // messagesBusService.publish('deleteFile', response.data.File);
                      // messagesBusService.publish('deleteFile'+response.data.File.bubbleId, response.data.File);
                    deferred.resolve(response);
                },

                function(error) {
                    var message = {type: 'danger',
                        msg: 'Unable to delete folder. Please try again'
                    }
                    // messagesBusService.publish('alertEvent', message);
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }


        this.getUserByEmail = function(query)
        {
            var deferred = $q.defer();

            var config = {
                method:'POST',
                url :BLOX.URL.geteMailAutocompleteURL(),
                data: { value: query }
            }
            HttpService.executeRequest(config).then(

                function(data)
                {
                    var value=data.data.map(function(tag) {
                        if(tag.length!=0) {
                            return tag;
                        }
                        else return [];
                    });
                    deferred.resolve(value);
                },

                function(error)
                {
                    var message = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }
                    // messagesBusService.publish('alertEvent',message);
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        this.shareApplication = function(blox)
        {
            var deferred = $q.defer();
            var config ={
                method:'POST',
                url:BLOX.URL.getshareApplicationURL(),
                data: {
                    add: blox.users,
                    remove: [],
                    bubbleId: blox.bubbles
                }
            }

            HttpService.executeRequest(config).then(
                function(data)
                {
                    deferred.resolve(data);
                },
                function(error)
                {
                    var message = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }
                    // messagesBusService.publish('alertEvent',message);
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }

        this.findBubbleById = function(id) {
            var deferred = $q.defer();
            if (dashBoardData.length == 0) {
                this.getDashboardData().then(function (data) {
                    dashBoardData = data;
                    for (var i = 0; i < dashBoardData.length; i++) {
                        var dashBoardObj = dashBoardData[i];
                        if (dashBoardObj.ID == id) {
                            deferred.resolve(dashBoardObj);
                            //return dashBoardObj;
                        }
                    }

                })
            }
            else
                for (var i = 0; i < dashBoardData.length; i++) {
                    var dashBoardObj = dashBoardData[i];
                    if (dashBoardObj.ID == id) {
                        deferred.resolve(dashBoardObj);
                        //return dashBoardObj;
                    }
                }

            return deferred.promise;
        }


        /***** Delete a Notification *****/
        this.deleteNotification = function(notificationId) {
            var deferred = $q.defer();
            var config = {
                method: 'POST',
                url: BLOX.URL.getDeleteNotificationURL(),
                data: {
                    notificationId: notificationId
                }
            }

            HttpService.executeRequest(config).then(
                function(response) {
                    if(response.data.Result == "Failure") {
                        /* TODO */
                        deferred.reject(response);
                        // console.log(response);
                        // console.log("Error Deleting Notification!");
                    }

                    console.log("SUCCESSFULLY DELETED NOTIFICATION");
                    deferred.resolve(response.data);
                },

                function(error) {
                    var message = {type: 'danger',
                        msg: 'Unable to delete notification. Please try again'
                    }
                    // messagesBusService.publish('alertEvent', message);
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        }




       this.setNotification = function(notification)
       {
           notifications=notifications.concat(notification);
           //schemaService.getNotificationsByBloxId(null);
           //update each of the listening ui elements

               if(notification.bubbleid!=undefined)
               {}
                  //  messagesBusService.publish('notifications'+notification.bubbleid,notification.notifications);


       }

       this.getFiles = function() {
            console.log("Getting files");
       }

        this.getFilesForBlox = function(bloxId)
        {
            console.log("Getting for blox");

            var deferred = $q.defer();
            var config ={
                method:'GET',
                url:BLOX.URL.getFilesForBlox(),
                headers: { id: bloxId }
            }

            HttpService.executeRequest(config).then(
                function(data)
                {
                    if(data.data.Result == "Success")
                        deferred.resolve(data);
                    else
                        deferred.reject();
                },
                function(error)
                {
                    var message = { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }
                    // messagesBusService.publish('alertEvent',message);
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        },

        /* Retrieve notifications for a particular bubble */
        this.getNotificationsByBloxId = function(bloxId)
        {
            var deferred = $q.defer();
            var currentNotifications = [];
            if(notifications == undefined)
                notifications = [];

            for(var i = 0; i < notifications.length; i++) {
                if(notifications[i].bubbleId == bloxId.toString()) {
                    currentNotifications.unshift(notifications[i]);
                }
            }
            deferred.resolve(currentNotifications);
            return deferred.promise;
        },

        /* Retrieve all notifications for the current user */
        this.getAllNotifications = function()
        {
            var deferred = $q.defer();
            var schemaService=this;

            var config ={
                method:'GET',
                url:BLOX.URL.getNotifications(),
                headers:{
                    type:"all"
                }
            }

            if(notifications&&notifications.length > 0) {
                deferred.resolve({data: {"Result": "Success", "Notifications": notifications}});
                return deferred.promise;
            }

            HttpService.executeRequest(config).then(
                function(response) {
                    notifications = response.data.Notifications;
                    console.log("GET ALL");
                    console.log(response);
                    console.log(notifications);
                    deferred.resolve(response);
                },

                function(error)
                {
                    var message = { type: 'danger', msg: 'Unable to retrieve user\'s notifications. Please try again.' }
                    // messagesBusService.publish('alertEvent',message);
                    deferred.reject(error);
                }
            );

            return deferred.promise;
        }

        this.getNotificationCount =function()
        {
          var notCount = 0;
          if(notificationCountBlox && notificationCountBlox.length>0)
            notCount= notificationCountBlox.length;

            return notCount;

        }

        this.deleteNotification = function(notificationID)
        {
          var deferred = $q.defer();


          var config ={
              method:'DELETE',
              url:BLOX.URL.deleteNotificationsNew(),
              params:{
                  'notificationID':notificationID
              }

          }

          // if(notifications&&notifications.length > 0) {
          //     deferred.resolve({data: {"Result": "Success", "Notifications": notifications}});
          //     return deferred.promise;
          // }

          HttpService.executeRequest(config).then(
              function(response) {
                  notifications = response.data.Notifications;
                  console.log("DELETE Notifications");
                  console.log(response);
                  console.log(notifications);
                  deferred.resolve(response.data);
              },

              function(error)
              {
                  // var message = { type: 'danger', msg: 'Unable to retrieve user\'s notifications. Please try again.' }
                  // messagesBusService.publish('alertEvent',message);
                  deferred.reject(error);
              }
          );

          return deferred.promise;

        }

        this.markNotification = function(notificationList)
        {
          var deferred = $q.defer();


          var config ={
              method:'PUT',
              url:BLOX.URL.putNotificationsNew(),
              data:{
                  'notificationList':notificationList
              },
              headers:{
                  type:"all"
              }
          }

          // if(notifications&&notifications.length > 0) {
          //     deferred.resolve({data: {"Result": "Success", "Notifications": notifications}});
          //     return deferred.promise;
          // }

          HttpService.executeRequest(config).then(
              function(response) {
                  notifications = response.data.Notifications;
                  console.log("PUT Notifications");
                  console.log(response);
                  console.log(notifications);
                  deferred.resolve(response.data);
              },

              function(error)
              {
                  var message = { type: 'danger', msg: 'Unable to retrieve user\'s notifications. Please try again.' }
                  // messagesBusService.publish('alertEvent',message);
                  deferred.reject(error);
              }
          );

          return deferred.promise;

        }

        this.pollNewNotifications = function()
       {
           var deferred = $q.defer();

           /* Keep track of the last time an update was sucessfull */
           //var lastUpdate = new Date().getTime()/1000;
           console.log(dashBoardData);

           var bloxPoller = poller.get(BLOX.URL.getNotificationsNew(), {
               action: 'get',
               catchError: true,
               delay: POLLING_DELAY,
               argumentsArray: function() {
                 console.log(notifications);

        return [
            {
              params: {
                  'Timestamp': lastTimestamp,

              }

            }

        ]
    }
           });

           bloxPoller.promise.then(null, null, function(result)
           {
               console.log(result);
               console.log("Checking");
               if(result && result.data.Result != "Success") {
                   deferred.reject();
                   //return deferred.promise;
               }

               if (result.status === 503) {
                   deferred.reject();
                   poller.stopAll();
               }

               /* Success */
               if (result.status == 200 && result.data.Notifications && result.data.Notifications.length > 0) {
                 lastTimestamp=result.data.Timestamp;
                   //lastUpdate = new Date().getTime()/1000;
                   console.log("Polled Successfull!");
                   console.log(result);


                   //Only add new notifications
                   var newNotifications = [];

                   notificationCountBlox=result.data.Notifications;
                   $rootScope.$broadcast('notificationCount', { 'message': notificationCountBlox.length });

                   for(var i = 0; i < result.data.Notifications.length; i++) {

                       var addNotification = true;
                       for(var n = 0; n < notifications.length; n++) {
                           if(result.data.Notifications[i].ID == notifications[n].ID) {
                               addNotification = false;
                               break;
                           }
                       }
                       if(addNotification)
                           newNotifications.push(result.data.Notifications[i]);
                   }


                   //Handle bubbles first because other notifications rely on them
                   for(var i = 0; i < newNotifications.length; i++) {



                       if(newNotifications[i].category == 'Bubble') {
                           if(newNotifications[i].type == 'post') {
                              //  messagesBusService.publish('newBloxNotification', newNotifications[i]);
                              $rootScope.$broadcast('newBloxNotification', { 'message': newNotifications[i] });
                           }
                           if(newNotifications[i].type == 'delete') {
                               console.log("GOT DELTE");
                              //  messagesBusService.publish('deleteBloxNotification', newNotifications[i]);
                                $rootScope.$broadcast('deleteBloxNotification', { 'message': newNotifications[i] });
                           }
                       }
                   }
                   for(var i = 0; i < newNotifications.length; i++) {
                       if(newNotifications[i].category == 'File') {
                           //Notification completely updates files, so works for add and delete
                          //  messagesBusService.publish('newFileNotification', newNotifications[i]);
                       }
                   }
               }
               /* Failure (data, status, headers, config) */
               else {

                   if(result.status != 200)
                   {
                       /* TODO */
                        deferred.reject();
                       return;
                   }

                   if (result.status === 503) {
                       deferred.reject();
                       poller.stopAll();
                   }
               }
           });

           return deferred.promise;
       }

      this.groupBy = function( array , f )
      {
        var groups = {};
        array.forEach( function( o )
        {
          var group = JSON.stringify( f(o) );
          groups[group] = groups[group] || [];
          groups[group].push( o );
        });
        return Object.keys(groups).map( function( group )
        {
          return groups[group];
        })
      }




    }
]
)
