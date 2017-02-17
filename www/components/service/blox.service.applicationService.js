
angular.module('serviceModule').
    service('applicationService',['HttpService','$q','guid','$timeout'
        ,function(HttpService,$q,guid,$timeout){

            var applicationData="";

            this.getApplicationData = function()
            {

                var deferred = $q.defer();
                if(applicationData!="")
                {
                    deferred.resolve(applicationData);
                }
                else
                {
                    HttpService.get(BLOX.URL.getApplicationURL()).then(
                        function(data)
                        {
                            applicationData=data;
                            deferred.resolve(applicationData);
                        },
                        function(error)
                        {
                            deferred.reject(error);
                        }
                    );
                }
                return deferred.promise;
                },

            this.getAppData= function()
            {
                if (applicationData=="")
                    this.getApplicationData().then(function(){
                        return applicationData;
                    })
                else
                    return applicationData;
            }

            this.addNewApplication = function()
            {
                var newApplication= {
                    "id":"",
                    "name":"Untitled App",
                    "description":"Click on Edit icon to Edit",
                    "icon":"",
                    "created":new Date(),
                    "modified":new Date(),
                    "readOnly":false


                }

                applicationData.unshift(newApplication);
                return applicationData;

            },

            this.saveApplication = function(blox)
            {
                var deferred = $q.defer();
                /*

                 method: config.method,
                 url: config.url,
                 //transformRequest: transformRequestAsFormPost,
                 data: config.data,
                 headers:config.headers
                 */

                var config ={

                    method:'POST',
                    url:BLOX.URL.getApplicationURL(),
                    data:{
                        name:blox.name,
                        description:blox.description,
                        id:blox.id
                    }

                }

                HttpService.executeRequest(config).then(
                    function(data)
                    {
//                            schemaData=data;
                        deferred.resolve(data);
//                            messagesBusService.publish('schemaUpdate', { msg: schemaData });

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

            this.getNewApplications = function()
            {
//                var myPoller = poller.get('api/test/123', {
//                    action: 'GET',
//                    delay: 10000,
//                    argumentsArray: [
//                        {
//                            params: {
//                                param1: 1,
//                                param2: 2
//                            },
//                            headers: {
//                                header1: 1
//                            }
//                        }
//                    ]
//                });
//
//                myPoller.promise.then(null, null, callback);
            }






        }
    ]
)
