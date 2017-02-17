bloxApp.controller('fileController', ['$scope', '$ionicActionSheet', '$ionicPopup', '$ionicPopover',
  '$cordovaCamera', '$cordovaInAppBrowser', '$stateParams',
  'schemaService', 'applicationService', 'uploadService', '$auth', '$window',
  '$timeout', '$cordovaFileTransfer', '$upload', 'ionicToast', '$ionicLoading',
  '$state',
  function($scope, $ionicActionSheet, $ionicPopup, $ionicPopover,
    $cordovaCamera, $cordovaInAppBrowser, $stateParams,
    schemaService, applicationService, uploadService, $auth,
    $window, $timeout, $cordovaFileTransfer, $upload, ionicToast, $ionicLoading,
    $state) {


    $scope.page = {
      title: "Files"
    };
      $scope.web = false;
    $scope.loaded = true;
    $scope.blox = null;
    // $scope.uploading=true;
    console.log($stateParams);
    if ($stateParams.blox) {
      $scope.blox = $stateParams.blox
      $scope.bloxId = $stateParams.blox.ID;
      $scope.page.title = $stateParams.blox.name
    } else {
      $scope.bloxId = $stateParams.id;
      schemaService.findBubbleById($scope.bloxId).then(function(data) {

        $scope.page.title = data.name;
        $scope.blox = data;
      });
    }

    $scope.shareBlox = function() {
      $state.go('app.share', {
        'blox': $scope.blox,
        id: $scope.blox.ID
      })
    }

    $scope.addFile = function(fileObj){
      $scope.fileData.unshift(fileObj);
      $scope.$apply();
    }

    $scope.updateFiles = function() {

      schemaService.getFilesForBlox($scope.bloxId).then(function(data) {
        $scope.loaded = false;
        console.log("Getting Files For Blox Controller");
        console.log(data.data.Files)
        $scope.fileData = data.data.Files;
        $scope.fileDataCopy = angular.copy($scope.fileData);
        schemaService.convertEpochTime($scope.fileData, true, "Uploaded ");
        var appendText = "";
        if ($scope.fileData.length == 0) {
          appendText = '0 Files found.'
        }

        var message = {
          type: 'Success',
          msg: 'Files Loaded. ' + appendText
        }
        //messagesBusService.publish('alertEvent', message);
        //   $scope.$broadcast('loadApplications', message);
      });
    }
    $scope.updateFiles();

    applicationService.getApplicationData().then(function(value) {
      console.log("Getting Applications For Blox Controller" + value);
      /* Set all of the types to application for rendering */
      for (var i = 0; i < value.length; i++) {
        value[i].application = true;
      }
      $scope.appData = value;
      schemaService.convertEpochTime($scope.appData, true, "Created on");
      console.log("App data");
      console.log($scope.appData);
    });

/*
    $scope.showActionsheet = function() {

      $ionicActionSheet.show({
        titleText: 'Add to Blox',
        buttons: [{
            text: '<i class="icon ion-image"></i> Upload photos or videos'
          },
          {
            text: '<input type="file"><i class="icon ion-upload"></i> Upload files'
          },
          {
            text: '<i class="icon ion-camera"></i> Take a photo'
          },


        ],

        buttonClicked: function(index, $ionicPopup) {
          console.log('BUTTON CLICKED', index);
          if (index === 0) {
            $scope.choosePhoto();
          } else if (index === 1) {
            $scope.Uploadfile();
          } else if (index === 2) {
            $scope.takePhoto();
          } else {
            $scope.takePhoto();
          }
          return true;

        },

        destructiveButtonClicked: function() {
          console.log('DESTRUCT');
          return true;
        }
      });
    };
*/

      $scope.showActionsheet = function() {

        uploadService.fileuploadDialog($scope.win, $scope.fail, $scope.addFile);
      };


    if (!window.cordova) {
      $scope.web = true
      $scope.$watch('files', function() {
        $scope.uploadWeb($scope.files);
      });
    }
/*
    $scope.choosePhoto = function() {

      if (window.cordova && cordova.platformId === "android") {
        $scope.Androidphotos();
      } else if (window.cordova && cordova.platformId === "ios") {
        $scope.Iosphotos();
      } else if (window.cordova) {} else {
        $scope.uploadWeb(files);

      }
    }


    $scope.takePhoto = function() {

      if (window.cordova && cordova.platformId === "android") {
        $scope.Androidcamera();
      } else if (window.cordova && cordova.platformId === "ios") {
        $scope.Iospcamera();
      } else if (window.cordova) {} else {
        $scope.uploadWeb(files);

      }
    }


    $scope.Uploadfile = function() {

      if (window.cordova && cordova.platformId === "android") {
        $scope.uploadAndroid();
      } else if (window.cordova && cordova.platformId === "ios") {
        $scope.uploadIos();
      } else if (window.cordova) {

      } else {
        $scope.uploadWeb(files);

      }



    }
    */

    // $scope.$watch('fileData.length', function(newValue, oldValue) {
    //   console.log('change'+newValue);
    //  }, true)

    $scope.win = function(r){
      // $ionicLoading.hide();
      console.log(r);
      var response = null;
      if (r.response) {
        console.log("response.ErrorCode 168", r.response + "");
        response = JSON.parse(r.response);
      }
      //$ionicLoading.hide();
      if (response && response.ErrorCode) {
        $scope.fileData.pop();
        console.log("response.ErrorCode 172", response.ErrorCode);
        ionicToast.show(response.UserMessage, 'bottom', false, 800);
        return;

      }
      if (response == null || (response.Result != undefined && response.Result == "Failure")) {
        $scope.fileData.pop();
        var message = {
          type: 'danger',
          msg: 'Oh snap! Uploading the file failed.'
        }
        console.log("response.ErrorCode 182", response.Result);
        //messagesBusService.publish('alertEvent',message);
        ionicToast.show('Oops! Something is wrong. Please try again in some time! ', 'bottom', false, 800);

        return;
      }
      ionicToast.show('File Uploaded! ', 'bottom', false, 800);


      /* TODO: Do we need this? */
      //if(data.notifications[0].type=="application")
      //    data.notifications[0].application=true
      //else
      //    data.notifications[0].application=false

      console.log("FILE RESPONSE");
      console.log(response.File);
      // $scope.fileData.unshift(response.File);
      $scope.fileData[0] = response.File;
      $scope.fileDataCopy = angular.copy($scope.fileData);
      schemaService.convertEpochTime([response.File], true, "Uploaded ");
    }

    $scope.fail = function(error){
      // $ionicLoading.hide();
      $scope.fileData.pop();
      if (response && response.ErrorCode) {
        ionicToast.show(response.UserMessage, 'bottom', false, 800);
        return

      }
      ionicToast.show('Oops! Something is wrong. Please try again in some time!', 'bottom', false, 800);
      //alert("An error has occurred: Code = " + error.code);
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
    }


/*
    $scope.uploadFiles = function(files) {

      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          //console.log("222", file);
          var newFileName = file.name //file.path.replace(/^.*[\\\/]/, '');
          var fileObj = {
            filename: newFileName,
            localURL: "",

            bubbleId: $scope.bloxId,
            launchUrl: ""

          }

          $scope.fileData.unshift(fileObj);
          $scope.$apply();
          //console.log(files);
          var options = {
            fileKey: "file",
            fileName: newFileName,
            fields: {
              id: $scope.bloxId
            },
            httpMethod: "POST",
            mimeType: file.type,
            headers: {
              id: $scope.bloxId
            },
            chunkedMode: true,
            headers: {
              id: $scope.bloxId,
              "Authorization": "Bearer " + $auth.getToken()
            }

          }
            console.log("file mime type is",options.mimeType);
          var ft = new FileTransfer();
          ft.onprogress = function(progressEvent) {
            // if (progressEvent.lengthComputable) {
            //     //  loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
            //     uploadProgress = parseInt(progressEvent.loaded / progressEvent.total * 100);
            //
            //     // document.getElementById('progress_bar_con').value = uploadProgress;
            //     $timeout(function() {
            //         document.getElementById('progress_bar_con').value = progressPercentage;
            //     }, 500);

            // } else {
            //loadingStatus.increment();
            // document.getElementById("progress_bar_con").value = document.getElementById("progress_bar_con").value + 1;
            // }
            // console.log('progressing')
          };
          ft.upload(file.localURL, BLOX.URL.getFileUploadURL(), win, fail, options);
          // $ionicLoading.show({
          //     template: 'Uploading file..<br /><progress max=“100” value=“0” id=“progress_bar_con”> </progress>'
          // })
        }
      }
    }
*/
    $scope.uploadWeb = function(files) {
      // $scope.uploading=true;
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          file.filename = file.name;
          // $ionicLoading.show({
          //     templateUrl: 'templates/progress.html'
          // })
          $scope.fileData.unshift(file);
          $upload.upload({
            url: BLOX.URL.getFileUploadURL(),
            fields: {
              id: $scope.bloxId
            },
            file: file,
            headers: {
              id: $scope.bloxId
            },
            "Content-Type": file.type != '' ? file.type : 'application/octet-stream',
            sendObjectsAsJsonBlob: true

          }).progress(function(evt) {
            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // $timeout(function() {
            //     document.getElementById('progress_bar_con').value = progressPercentage;
            // }, 500)



          }).success(function(response, status, headers, config) {
            console.log(response);
            //$ionicLoading.hide();
            if (response.ErrorCode) {
              ionicToast.show(response.UserMessage, 'bottom', false, 800);
              return

            }
            if (response.Result != undefined && response.Result == "Failure") {
              // $scope.uploading=false;
              $scope.fileData.pop();
              var message = {
                type: 'danger',
                msg: 'Oh snap! Uploading the file failed.'
              }
              //messagesBusService.publish('alertEvent',message);
              ionicToast.show('Oops! Something is wrong. Please try again in some time! ', 'bottom', false, 800);

              return;
            }


            /* TODO: Do we need this? */
            //if(data.notifications[0].type=="application")
            //    data.notifications[0].application=true
            //else
            //    data.notifications[0].application=false

            console.log("FILE RESPONSE");
            console.log(response.File);
            $scope.fileData[0] = response.File;
            $scope.fileDataCopy = angular.copy($scope.fileData);
            schemaService.convertEpochTime([response.File], true, "Uploaded ");
            ionicToast.show('File Uploaded! ', 'bottom', false, 800);
            //    /* TODO */
            //    //schemaService.setNotification(data);
          }).error(function(reply, status, headers) {
            //console.log(reply);
            $ionicLoading.hide();
            ionicToast.show('Oops! Something is wrong. Please try again in some time! ', 'bottom', false, 800);

          });;
        }
      }
    };
    $scope.fail = function(e) {
      ionicToast.show('Oops! Something is wrong. Please try again in some time! ', 'bottom', false, 800);

    }

/*
    $scope.success = function(fileEntry) {

      var files = [];
      window.resolveLocalFileSystemURL(fileEntry,
        function(entry) {
          entry.file(
            function(file) {
              var files = [];
              console.log("359", file);
              files.push(file)
              $scope.uploadFiles(files);
            },
            function(error) {
              console.log("FileEntry.file error: " + error.code);
              ionicToast.show('Oops! Something is wrong. Please try again in some time! ', 'bottom', false, 800);

            }
          );
        },
        function(error) {
          console.log("resolveLocalFileSystemURL error: " + error.code);
          ionicToast.show('Oops! Something is wrong. Please try again in some time! ', 'bottom', false, 800);

        });
      //  fileEntry.file(function(file) {
      //          var reader = new FileReader();
      //          reader.onloadend = function(e) {
      //          var content = this.result;
      //          console.log(content);
      //      };
      //      reader.readAsText(file); // or the way you want to read it
      //  });
    }


    $scope.uploadAndroid = function() {
      fileChooser.open(function(uri) {
        //alert(uri);
        window.FilePath.resolveNativePath(uri, $scope.success, $scope.fail);

      });
    }
    $scope.uploadIos = function() {
      var utis = ["public.data", "public.audio"];
      var position = {};
      position.x = 100;
      position.y = 100;
      position.width = 10;
      position.height = 10;
      FilePicker.pickFile(
        function(path) {
          var files = [];


          var newFileName = path.replace(/^.*[\\\/]/, '');
          var fileObj = {
            name: newFileName,
            localURL: path,
            type: newFileName.substr(newFileName.lastIndexOf('.') + 1),
            bubbleId: $scope.bloxId,
            launchUrl: ""

          }


          //console.log("359", fileObj);
          files.push(fileObj);
          $scope.uploadFiles(files);
          //alert("You picked this file:  " + path);
          //$scope.success(path);
        },
        function(path) {
          alert("Error choosing file");
        }, utis, position);

    }


  */

    $scope.deleteBlox = function(file) {
      ionicToast.show('Deleting file ' + file.filename, 'bottom', false, 800);
      schemaService.deleteFile($scope.bloxId, file.ID).then(function(data) {
        if (data.data.Result && data.data.Result === 'Failure') {
          ionicToast.show('Oops! Something is wrong. Please try again in some time! ', 'bottom', false, 800);
          return;
        }
        for (var i = 0; i < $scope.fileData.length; i++) {
          if ($scope.fileData[i].ID == file.ID) {
            $scope.fileData.splice(i, 1);
            $scope.fileDataCopy = angular.copy($scope.fileData);
          }
        }
        ionicToast.show('File Deleted ', 'bottom', false, 800);

      })

    }

    $scope.delete = function(file) {
      $scope.data = {}

      // Custom popup
      var myPopup = $ionicPopup.show({
        //template: '<input type = "text" ng-model = "data.model" placeholder="Enter folder name">',
        title: 'Are you sure ?',
        subTitle: '',
        scope: $scope,

        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Delete</b>',

          onTap: function(e) {

            $scope.deleteBlox(file);
          }
        }]
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

      $ionicListDelegate.closeOptionButtons();
    }
    $scope.hide = function() {

      $scope.show1 = false;
      $ionicListDelegate.closeOptionButtons();
    }

/*
    $scope.Androidcamera = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        //  destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        var options = {
          fileKey: "file",
          //fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
          chunkedMode: false,
          mimeType: "image/jpg"
        };


        filePath = imageData;
        var uri = filePath;

        //console.log(filePath);
        var files = [];
        files.push(filePath)

        window.FilePath.resolveNativePath(filePath, $scope.success, $scope.fail, options)
        //$scope.success(filePath);
        //  window.FilePath.resolveNativePath(uri, $scope.success, $scope.fail,options)
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }


    $scope.Iospcamera = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        //destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        var options = {
          fileKey: "file",
          fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
          chunkedMode: false,
          mimeType: "image/jpg"
        };
        filePath = imageData;
        var uri = filePath;


        // $scope.imgURI = "data:image/jpeg;base64," + imageData;
        //console.log(BLOX.URL.getFileUploadURL());
        console.log(filePath);
        var files = [];
        files.push(filePath)
        $scope.success(uri, options)
        //  $scope.success(filePath);
        //  window.resolveLocalFileSystemURL("BLOX.URL.getFileUploadURL()", )
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }





    $scope.Androidphotos = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        //destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        allowEdit: true,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;


        filePath = imageData;
        var uri = filePath;
        //  console.log("570", $scope.imgURI);
        //  console.log("571", filePath);
        window.FilePath.resolveNativePath(uri, $scope.success, $scope.fail, options)
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }


    $scope.Iosphotos = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        //destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        //$scope.imgURI = "data:image/jpeg;base64," + imageData;


        filePath = imageData
        var uri = filePath
        var files = [];
        files.push(filePath)
        $scope.success(uri)
        //$scope.success(filePath);
      }, function(err) {
        // An error occured. Show a message to the user
      });
    }


*/

    $scope.openFiles = function(file) {
      if (!window.cordova) {

        console.log('browser mode');
        var tabWindowId = $window.open('about:blank', '_blank');
         // async
          tabWindowId.location.href =
            BLOX.URL.executeApplicationURL() + '/file/' + file.ID + '/' + $auth.getToken();


      }
      else {


        if (window.cordova && cordova.platformId === "android") {

          //window.inAppBrowserXwalk.open('');
          var options = {
                    toolbarColor: '#DA4436', // Background color of the toolbar in #RRGGBB
                    toolbarHeight: '120',
                    closeButtonText: '< Blox',
                    closeButtonSize: '25',
                    closeButtonColor: '#f9f9f9',
                    openHidden: false
                  };



          var url = BLOX.URL.executeApplicationURL() +
            '/file/' + file.ID + '/' + $auth.getToken();

         var browser = window.inAppBrowserXwalk.open(BLOX.URL.executeApplicationURL() +
            '/file/' + file.ID + '/' + $auth.getToken(),options);

            browser.addEventListener("loadstart", function(url) {
            var url = url;
            var extension = url.substr(url.length - 4);
            //if (extension == '.pdf') {
              var targetPath = cordova.file.externalRootDirectory + file.filename;
              console.log("targetpath"+targetPath);
              var options = {};
              var args = {
                url: url,
                targetPath: targetPath,
                options: options
              };
              browser.close(); // close window or you get exception


                  var fileTransfer = new FileTransfer();
                  var uri = encodeURI(args.url);


                  $ionicLoading.show({

                      content: 'Loading...',
                      animation: 'fade-in',
                      showBackdrop: false,
                      maxWidth: 200,
                      showDelay: 0

                  });
                    ionicToast.show('Downloading File... ', 'bottom', false, 1000);

                fileTransfer.download(
                  uri, // file's uri
                  args.targetPath, // where will be saved
                  function(entry) {
                    console.log("download complete: " + entry.toURL());
                    $ionicLoading.hide();


                  cordova.plugins.fileOpener2.open(
                          entry.toURL(), // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
                          file.contentType,



                        {
                            error : function(e) {
                                $ionicLoading.hide();
                                console.log('757 === Error status: ' + e.status + ' - Error message: ' + e.message);
                            },
                            success : function () {
                                $ionicLoading.hide();
                                console.log('760 === file opened successfully');
                            }
                        }
                    );
                  //  window.open(entry.toURL(), '_blank', 'location=no,closebuttoncaption=Cerrar,toolbar=yes,enableViewportScale=yes');
                  },
                  function(error) {
                      $ionicLoading.hide();
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("upload error code" + error.code);
                  },
                  true,
                  args.options
                );





    });

    /* browser.addEventListener("loadstop", function(url) {
            console.log(url);
          });

          browser.addEventListener("exit", function() {
            console.log("browser closed");
          });*/
        }
      else {
        console.log(BLOX.URL.executeApplicationURL() +
          '/file/' + file.ID + '/' + $auth.getToken());
          //  console.log("file",file);
          // window.open(BLOX.URL.executeApplicationURL() +
          //   '/file/' + file.ID + '/' + $auth.getToken());

          var url = BLOX.URL.executeApplicationURL() +
            '/file/' + file.ID + '/' + $auth.getToken();
          var windowref = window.open(url, '_blank', 'location=no,closebuttoncaption=Cerrar,toolbar=yes,enableViewportScale=yes');

      windowref.addEventListener('loadstart', function(e) {
        var url = e.url;
        var extension = url.substr(url.length - 4);
        //if (extension == '.pdf') {
          var targetPath = cordova.file.documentsDirectory + file.filename;
          console.log("targetpath"+targetPath);
          var options = {};
          var args = {
            url: url,
            targetPath: targetPath,
            options: options
          };
          windowref.close(); // close window or you get exception

              var fileTransfer = new FileTransfer();
              var uri = encodeURI(args.url);


              $ionicLoading.show({

                  content: 'Loading',
                  animation: 'fade-in',
                  showBackdrop: false,
                  maxWidth: 200,
                  showDelay: 0

              });
                ionicToast.show('Downloading File... ', 'bottom', false, 1000);

            fileTransfer.download(
              uri, // file's uri
              args.targetPath, // where will be saved
              function(entry) {
                console.log("download complete: " + entry.toURL());



              cordova.plugins.fileOpener2.open(
                      entry.toURL(), // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
                      file.contentType,



                    {
                        error : function(e) {
                            $ionicLoading.hide();
                            console.log('757 === Error status: ' + e.status + ' - Error message: ' + e.message);
                        },
                        success : function () {
                            $ionicLoading.hide();
                            console.log('760 === file opened successfully');
                        }
                    }
                );
              //  window.open(entry.toURL(), '_blank', 'location=no,closebuttoncaption=Cerrar,toolbar=yes,enableViewportScale=yes');
              },
              function(error) {
                  $ionicLoading.hide();
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
              },
              true,
              args.options
            );

    //  }
    });

        }

      }
    }
/*
    function downloadReceipt(args) {
      var fileTransfer = new FileTransfer();
      var uri = encodeURI(args.url);

      fileTransfer.download(
        uri, // file's uri
        args.targetPath, // where will be saved
        function(entry) {
          console.log("download complete: " + entry.toURL());
          window.open(entry.toURL(), '_blank', 'location=no,closebuttoncaption=Cerrar,toolbar=yes,enableViewportScale=yes');
        },
        function(error) {
          console.log("download error source " + error.source);
          console.log("download error target " + error.target);
          console.log("upload error code" + error.code);
        },
        true,
        args.options
      );
    }
*/


    $scope.openBrowser = function(file) {
      console.log("Button clicked....!!!!");
      var platform;
      onDeviceReady();

      function onDeviceReady() {
        if (window.cordova) {
          // running on device/emulator
          platform = device.platform.toLowerCase();
          if (platform.match(/win/)) {
            console.log("platform");
            platform = "windows";
          } else {


          }
        } else {
          // running in dev mode
          console.log('browser mode');
          var tabWindowId = $window.open(BLOX.URL.executeApplicationURL() +
            '/app/' + file.ID + '/' + $auth.getToken() + '/' + $scope.bloxId);
          //  $timeout(function () { // async
          //      tabWindowId.location.href = BLOX.URL.executeApplicationURL() +
          //      '/app/' + file.ID + '/' + $auth.getToken() + '/' + $scope.bloxId;
          //  }, 500);
          return;
        }


        $('body').addClass(platform);

        console.log(platform);





        // iOS+Android settings
        //$('#cardlist').on("click", function(){

        // cordova.plugins.diagnostic.requestCameraAuthorization(function(status) {
        // console.log("Successfully requested camera authorization: authorization was " + status);
        // if (status === 'GRANTED') {



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

        if (window.cordova && cordova.platformId === "android") {

          //  window.inAppBrowserXwalk.open('');

          //var browser=null;

          var options = {
                    toolbarColor: '#DA4436', // Background color of the toolbar in #RRGGBB
                    toolbarHeight: '120',
                    closeButtonText: '< Blox',
                    closeButtonSize: '25',
                    closeButtonColor: '#f9f9f9',
                    openHidden: false
                  };

          var browser = window.inAppBrowserXwalk.open(BLOX.URL.executeApplicationURL() +
            '/app/' + file.ID + '/' + $auth.getToken() + '/' + $scope.bloxId, options);




          browser.addEventListener("loadstart", function(url) {
            console.log(url);
          });

          browser.addEventListener("loadstop", function(url) {
            console.log(url);
          });

          browser.addEventListener("exit", function() {
            console.log("browser closed");
          });
        } else {
          console.log('trying to open window1');
          // window.open('http://html5demos.com/web-socket','_blank', 'location=yes');
          window.open(BLOX.URL.executeApplicationURL() +
            '/app/' + file.ID + '/' + $auth.getToken() + '/' + $scope.bloxId, '_blank', 'location=yes');

        }

        //  checkState();
        // }

        // }, function(error) {
        //     console.error(error);
        // });
        //});


        //setTimeout(checkState, 500);
      }


      function checkState() {
        console.log("Checking state...");

        // $('#state li').removeClass('on off');




        // Camera
        var onGetCameraAuthorizationStatus;
        cordova.plugins.diagnostic.isCameraAvailable(function(available) {
          console.log("camera is avalable ...!!!!!!!!!!!!!!!!!!", available);
          // $('#state .camera').addClass(available ? 'on' : 'off');
        }, onError);

        if (platform === "android" || platform === "ios") {
          cordova.plugins.diagnostic.isCameraPresent(function(enabled) {
            console.log("camera is present ...!!!!!!!!!!!!!!!!!!", enabled);
            //$('#state .camera-present').addClass(enabled ? 'on' : 'off');
          }, onError);

          cordova.plugins.diagnostic.isCameraAuthorized(function(enabled) {
            //$('#state .camera-authorized').addClass(enabled ? 'on' : 'off');
            console.log("camera is authorization ...!!!!!!!!!!!!!!!!!!", enabled);
          }, onError);

          cordova.plugins.diagnostic.getCameraAuthorizationStatus(function(status) {
            //$('#state .camera-authorization-status').find('.value').text(status.toUpperCase());
            console.log("camera is avalaauthorization status,,,...!!!!!!!!!!!!!!!!!!", status);

            $scope.onGetCameraAuthorizationStatus(status);
          }, onError);
        }









      }

      $scope.onGetCameraAuthorizationStatus = function(status) {
        $('#request-camera').toggle(status != cordova.plugins.diagnostic.permissionStatus.GRANTED && status != cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS);

      }


      function onError(error) {
        console.error("An error occurred: " + error);
      }

      function onResume() {
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


  }
])
