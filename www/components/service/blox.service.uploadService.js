angular.module('uploadModule', [])
    .service('uploadService', ['$http', '$cordovaCamera', '$stateParams', '$ionicActionSheet', '$cordovaInAppBrowser',
        'schemaService', '$auth', 'ionicToast', '$window', '$timeout', '$ionicPopup', '$ionicPopover',
        '$cordovaFileTransfer', '$upload', '$ionicLoading', '$state',
        function($http, $cordovaCamera, $stateParams, $ionicActionSheet, $cordovaInAppBrowser,
            schemaService, $auth, ionicToast, $window, $timeout, $ionicPopup, $ionicPopover,
            $cordovaFileTransfer, $upload, $ionicLoading, $state) {

            var web = false;
            var loaded = true;
            var blox = null;
            var page = {
                title: "Files"
            };

            function uploadserviceFile(files) {




                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        //console.log("222", file);
                        var newFileName = file.name //file.path.replace(/^.*[\\\/]/, '');
                        var fileObj = {
                            filename: newFileName,
                            localURL: "",

                            bubbleId: bloxId,
                            launchUrl: ""

                        }
                        parentaddFile(fileObj);
                        console.log(files);
                        var options = {
                            fileKey: "file",
                            fileName: newFileName,
                            fields: {
                                id: bloxId
                            },
                            httpMethod: "POST",
                            mimeType: file.type,
                            headers: {
                                id: bloxId
                            },
                            chunkedMode: true,
                            headers: {
                                id: bloxId,
                                "Authorization": "Bearer " + $auth.getToken()
                            }
                        }
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
                        ft.upload(file.localURL, BLOX.URL.getFileUploadURL(), parentWin, parentFail, options);
                        // $ionicLoading.show({
                        //     template: 'Uploading file..<br /><progress max=“100” value=“0” id=“progress_bar_con”> </progress>'
                        // })
                    }
                }
            }

            function defineParam(win, fail, addfile) {
                parentWin = win;
                parentFail = fail;
                parentaddFile = addfile;

                if ($stateParams.blox) {
                    blox = $stateParams.blox
                    bloxId = $stateParams.blox.ID;
                    page.title = $stateParams.blox.name
                } else {
                    bloxId = $stateParams.id;
                    schemaService.findBubbleById(bloxId).then(function(data) {

                        page.title = data.name;
                        blox = data;


                    });
                }
            };

            var parentWin, parentFail, parentaddFile;
            this.fileuploadDialog = function(win, fail, addfile) {
                defineParam(win, fail, addfile);

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
                            choosePhoto();
                        } else if (index === 1) {
                            Uploadfile();
                        } else if (index === 2) {
                            takePhoto();
                        } else {

                        }
                        return true;

                    },

                    destructiveButtonClicked: function() {
                        console.log('DESTRUCT');
                        return true;
                    }
                });
            };


            function takePhoto() {

                if (window.cordova && cordova.platformId === "android") {
                    Androidcamera();
                } else if (window.cordova && cordova.platformId === "ios") {
                    Ioscamera();
                } else if (window.cordova) {} else {
                    //this.uploadWeb(files);

                }
            }

            function Androidcamera() {
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
                    imgURI = "data:image/jpeg;base64," + imageData;
                    var options = {
                        fileKey: "file",
                        //fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                        chunkedMode: false,
                        mimeType: "image/jpg"
                    };

                    filePath = imageData;
                    var uri = filePath;

                    window.FilePath.resolveNativePath(filePath, success, fail, options)
                        //$scope.success(filePath);
                        //  window.FilePath.resolveNativePath(uri, $scope.success, $scope.fail,options)
                }, function(err) {
                    // An error occured. Show a message to the user
                });
            }



            function Ioscamera() {
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
                    success(uri, options)
                        //  $scope.success(filePath);
                        //  window.resolveLocalFileSystemURL("BLOX.URL.getFileUploadURL()", )
                }, function(err) {
                    // An error occured. Show a message to the user
                });
            }

            function Uploadfile() {

                if (window.cordova && cordova.platformId === "android") {
                    uploadAndroid();
                } else if (window.cordova && cordova.platformId === "ios") {
                    uploadIos();
                } else if (window.cordova) {

                } else {
                    //  uploadWeb(files);

                }
            }

            function uploadAndroid() {
                fileChooser.open(function(uri) {
                    //alert(uri);
                    //  var uri = "/uploadService";
                    window.FilePath.resolveNativePath(uri, success, fail);

                });
            }

            function uploadIos() {
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
                            bubbleId: bloxId,
                            launchUrl: ""

                        }


                        //console.log("359", fileObj);
                        files.push(fileObj);
                        uploadserviceFile(files)
                            //alert("You picked this file:  " + path);
                            //$scope.success(path);
                    },
                    function(path) {
                        alert("Error choosing file");
                    }, utis, position);

            }



            function choosePhoto() {

                if (window.cordova && cordova.platformId === "android") {
                    Androidphotos();
                } else if (window.cordova && cordova.platformId === "ios") {
                    Iosphotos();
                } else if (window.cordova) {} else {
                    //uploadWeb(files);

                }
            }

            function Iospcamera() {
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

                this.getPicture(options).then(function(imageData) {
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
                    this.success(uri, options)
                        //  $scope.success(filePath);
                        //  window.resolveLocalFileSystemURL("BLOX.URL.getFileUploadURL()", )
                }, function(err) {
                    // An error occured. Show a message to the user
                });
            }


            function Androidphotos() {
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
                    imgURI = "data:image/jpeg;base64," + imageData;


                    filePath = imageData;
                    var uri = filePath;
                    //  console.log("570", $scope.imgURI);
                    //  console.log("571", filePath);
                    window.FilePath.resolveNativePath(uri, success, fail, options)
                }, function(err) {
                    // An error occured. Show a message to the user
                });
            }

            function fail(e) {
                ionicToast.show('Oops! Something is wrong. Please try again in some time! ', 'bottom', false, 800);

            }

            function success(fileEntry) {

                var files = [];
                window.resolveLocalFileSystemURL(fileEntry,
                    function(entry) {
                        entry.file(
                            function(file) {
                                var files = [];
                                console.log("359", file);
                                files.push(file)
                                uploadserviceFile(files)
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

            function Iosphotos() {
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
                    success(uri)
                        //$scope.success(filePath);
                }, function(err) {
                    // An error occured. Show a message to the user
                });
            }

    /*!!!!!!!!!!.......Editprofiledailog code start here,...!!!!!!!!!!!!!!!!!!!!!!*/

            this.Editprofiledailog = function(win, fail, addfile) {
                defineParam(win, fail, addfile);
            $ionicActionSheet.show({
               titleText: 'Update account photo',
               buttons: [
                 { text: '<i class="icon ion-images"></i> Choose from gallery' },
                 { text: '<i class="icon ion-camera"></i> Use camera'},

               ],

                 buttonClicked: function(index, $ionicPopup) {
                     console.log('BUTTON CLICKED', index);
                     if (index === 0) {
                         choosePhoto();
                     } else if (index === 1) {
                         takePhoto();
                     }  else {

                     }
                     return true;
                 },

               destructiveButtonClicked: function() {
                 console.log('DESTRUCT');
                 return true;
               }
            });
          };


  }
]);
