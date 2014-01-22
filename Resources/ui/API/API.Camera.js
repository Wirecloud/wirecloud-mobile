/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

(function() {

    "use strict";

    var _device = (Ti.Platform.getOsname() === 'ipad' || 
                   Ti.Platform.getOsname() === 'iphone') ? 'ios' : 'android';
    var _version = parseInt(Ti.Platform.getVersion().split('.')[0], 10);
    
    var _self = {};
/**
     *  createVideoPlayer( [Dictionary<Titanium.Media.VideoPlayer> parameters] ) : Titanium.Media.VideoPlayer
     *      Creates and returns an instance of Titanium.Media.VideoPlayer.
     *  Parameters
     *      parameters : Dictionary<Titanium.Media.VideoPlayer> (optional)
     *      Properties to set on a new object, including any defined by Titanium.Media.VideoPlayer except those marked not-creation or read-only.
     *  Returns
     *      Titanium.Media.VideoPlayer
     **/
    _self.createVideoPlayer = function createVideoPlayer(videoPlayerDictionary) {
    };

    /**
     *  getAvailableCameraMediaTypes( ) : Object[]
     *      Gets the value of the availableCameraMediaTypes property.
     *  Returns
     *      Object[]
     **/
    _self.getAvailableCameraMediaTypes = function getAvailableCameraMediaTypes() {
    };

    /**
     *  getAvailableCameras( ) : Number[]
     *      Gets the value of the availableCameras property.
     *  Returns
     *      Number[]
     */
    _self.getAvailableCameras = function getAvailableCameras() {
    };

    /**
     *  getAvailablePhotoGalleryMediaTypes( ) : Object[]
     *      Gets the value of the availablePhotoGalleryMediaTypes property.
     *  Returns
     *      Object[]
     */
    _self.getAvailablePhotoGalleryMediaTypes = function getAvailablePhotoGalleryMediaTypes() {
    };

    /**
     *  getAvailablePhotoMediaTypes( ) : Object[]
     *      Gets the value of the availablePhotoMediaTypes property.
     *  Returns
     *      Object[]
     */
    _self.getAvailablePhotoMediaTypes = function getAvailablePhotoMediaTypes() {
    };

    /**
     *  getAvailablePhotoMediaTypes( ) : Boolean
     *      Gets the value of the canRecord property.
     *  Returns
     *      Boolean
     */
    _self.getCanRecord = function getCanRecord() {
    };

    /**
     *  getIsCameraSupported() : Boolean
     *      Gets the value of the isCameraSupported property.
     *  Returns
     *      Boolean
     */
    _self.getIsCameraSupported = function getIsCameraSupported() {
    };

    /**
     *  hideCamera()
     *      Hides the device camera UI.
     *      Must be called after calling showCamera and only when autohide is set to false. This method causes the media capture UI to be hidden.
     */
    _self.hideCamera = function hideCamera() {
    };
    
    /**
     *  isMediaTypeSupported():( String source, String type ) : Boolean
     *      Returns true if the source supports the specified media type.
     *      You can query whether a given media type is supported by the device's camera (source == 'camera') or photo library (source == 'photo').
     *      An additional value, photogallery can be used to query the media supported by the device's camera roll or saved image album, which is
     *      a subset of the iOS photo library. However, when calling openPhotoGallery on iOS, the entire library is displayed, and
     *      there is currently no way to restrict the gallery to show only the camera roll/saved images album.
     *  Parameters
     *      source : String
     *          Media source specified as a string: camera for Camera or photo for Photo Library.
     *      type : String
     *          Media type to check, either MEDIA_TYPE_PHOTO or MEDIA_TYPE_VIDEO.
     *  Returns
     *      Boolean
     */
    _self.isMediaTypeSupported = function isMediaTypeSupported() {
    };

    /**
     *  openPhotoGallery():( String source, String type ) : Boolean
     *      Opens the photo gallery image picker.
     *      To use this method on Tizen, you must include the following privileges in the tiapp.xml file of your Titanium application:
     *      http://tizen.org/privilege/application.launch
     *      http://tizen.org/privilege/filesystem.read
     *  Parameters
     *      options : PhotoGalleryOptionsType
     *          Photo gallery options as described in PhotoGalleryOptionsType.
     *  Returns
     *      void
     */
    _self.openPhotoGallery = function openPhotoGallery() {
      
    };

    /**
     *  previewImage(Dictionary<PreviewImageOptions> options)
     *      Displays the given image.
     *  Parameters
     *      options : Dictionary<PreviewImageOptions>
     *          Dictionary containing the image and callback functions. 
     *  Returns
     *      void
     */
    _self.previewImage = function previewImage() {
    };

    /**
     *  saveToPhotoGallery( Titanium.Blob/Titanium.Filesystem.File media, Object callbacks)
     *      Saves media to the device's photo gallery / camera roll.
     *      This operation is asynchronous. The caller can supply callbacks to be triggered when the save operation completes.
     *      Media can be passed as either a Blob object or a File object. If the media argument is not one of these types, an error is generated.
     *      Note that when passing a file (or a blob created from a file), the file name must have the appropriate extension for the data--for example,
     *      image.jpg or video1.mov work, but video1.tmp does not. Currently, the .mp4 extension is not supported, but MP4 files may be imported by saving
     *      them with the .mov extension.
     *      To use this method on Tizen, you must include the following privileges in the tiapp.xml file of your Titanium application:
     *      http://tizen.org/privilege/application.launch
     *      http://tizen.org/privilege/filesystem.read
     *      http://tizen.org/privilege/filesystem.write
     *  Parameters
     *      media : Titanium.Blob/Titanium.Filesystem.File
     *          Media to save to the camera roll or media gallery.
     *      callbacks : Object
     *          Pass a dictionary with the following supported keys: success a function that will be called when the save succeeds, and error a function
     *          that will be called upon receiving an error.
     *  Returns
     *      void
     */
    _self.saveToPhotoGallery = function saveToPhotoGallery() {
        
    };

    /**
     *  previewImage(Dictionary<PreviewImageOptions> options)
     *      Sets the value of the availableCameraMediaTypes property.
     *  Parameters
     *      availableCameraMediaTypes : Object[]
     *          New value for the property.
     *  Returns
     *      void
     */
    _self.setAvailableCameraMediaTypes = function setAvailableCameraMediaTypes() {
    };
    
    _self.setAvailablePhotoGalleryMediaTypes = function setAvailablePhotoGalleryMediaTypes() {
    };

    _self.setAvailablePhotoMediaTypes = function setAvailablePhotoMediaTypes() {
    };

    _self.showCamera = function showCamera(callback) {
        Titanium.Media.showCamera({
            success: function (e) {
                if (e.mediaType === Titanium.Media.MEDIA_TYPE_PHOTO) {
                    // Ti.App.fireEvent("receive:API.SW.Camera.showCamera", e.media);
                    callback({
                        status: "SUCCESS",
                        data: e.media
                    });
                }
            },
            error: function (e) {
                callback({
                    status: "ERROR"
                });
            },
            cancel: function (e) {
                callback({
                    status: "CANCEL"
                });
            },
            allowEditing: false,
            autoHide: false,
            saveToPhotoGallery: true,
            mediaTypes: [Titanium.Media.MEDIA_TYPE_PHOTO]
        });
    };

    _self.switchCamera = function switchCamera() {
        
    };

    _self.takePicture = function takePicture() {
    };

    _self.takeScreenshot = function takeScreenshot() {
    };
    
    return _self;
        
}());