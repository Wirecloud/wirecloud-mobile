/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

var Camera = (function() {

    var _device = (Ti.Platform.getOsname() === 'ipad' || 
                   Ti.Platform.getOsname() === 'iphone') ? 'ios' : 'android';
    var _version = parseInt(Ti.Platform.getVersion().split('.')[0], 10);
    
    var _self = {};

    /** Creates and returns an instance of Titanium.Media.VideoPlayer.
     *  @param {Object} parameters : It is a dictionary (optional)
     *  @return Object */
    _self.createVideoPlayer = function createVideoPlayer(videoPlayerDictionary) {
    };
    _self.

    /** Gets the value of the availableCameraMediaTypes property.
     * @return {Object[]} */
    _self.getAvailableCameraMediaTypes = function getAvailableCameraMediaTypes() {
        return Titanium.Media.getAvailableCameraMediaTypes();
    };

    /** Gets the value of the availableCameras property.
     * @return {Object[]} */
    _self.getAvailableCameras = function getAvailableCameras() {
    };

    /** Gets the value of the availablePhotoGalleryMediaTypes property.
     * @return {Object[]} */
    _self.getAvailablePhotoGalleryMediaTypes = function getAvailablePhotoGalleryMediaTypes() {
    };

    /** Gets the value of the availablePhotoMediaTypes property.
     * @return {Object[]} */
    _self.getAvailablePhotoMediaTypes = function getAvailablePhotoMediaTypes() {
    };

    /** Gets the value of the canRecord property.
     * @return {Boolean} */
    _self.getCanRecord = function getCanRecord() {
    };

    /** Gets the value of the isCameraSupported property.
     * @return {Boolean} */
    _self.getIsCameraSupported = function getIsCameraSupported() {
    };

    /** Hides the device camera UI. Must be called after calling showCamera and
     * only when autohide is set to false. This method causes the media capture
     * UI to be hidden. */
    _self.hideCamera = function hideCamera() {
    };

    /** Returns true if the source supports the specified media type. You can
     * query whether a given media type is supported by the device's camera
     * (source == 'camera') or photo library (source == 'photo'). An additional
     * value, photogallery can be used to query the media supported by the
     * device's camera roll or saved image album, which is a subset of the iOS
     * photo library. However, when calling openPhotoGallery on iOS, the entire
     * library is displayed, and there is currently no way to restrict the
     * gallery to show only the camera roll/saved images album.
     * @param {String} source : Media source specified as a string: camera for Camera or photo for Photo Library.
     * @param {String} type : Media type to check, either MEDIA_TYPE_PHOTO or MEDIA_TYPE_VIDEO.
     * @return {Boolean} */
    _self.isMediaTypeSupported = function isMediaTypeSupported() {
    };
_self.
    /** Opens the photo gallery image picker.
     * @param {PhotoGalleryOptionsType} options : Photo gallery options as described in PhotoGalleryOptionsType.
     * @return {Object} */
    _self.openPhotoGallery = function openPhotoGallery() {
      
    };

    /** Displays the given image.
     * @param {PreviewImageOptions} options : Dictionary containing the image
     *      and callback functions.
     * @return {Object} */
    _self.previewImage = function previewImage() {
    };

    /** Saves media to the device's photo gallery / camera roll. This operation
     *  is asynchronous. The caller can supply callbacks to be triggered when
     *  the save operation completes. Media can be passed as either a Blob
     *  object or a File object. If the media argument is not one of these
     *  types, an error is generated. Note that when passing a file (or a blob
     *  created from a file), the file name must have the appropriate extension
     *  for the data--for example, image.jpg or video1.mov work, but video1.tmp
     *  does not. Currently, the .mp4 extension is not supported, but MP4 files
     *  may be imported by saving them with the .mov extension.
     * @param {Titanium.Blob_or_Titanium.Filesystem.File} media :
     *      Media to save to the camera roll or media gallery.
     * @param {Object} callbacks :
     *      Pass a dictionary with the following supported keys: success a
     *      function that will be called when the save succeeds, and error a
     *      function that will be called upon receiving an error.
     * @return {Object} */
    _self.saveToPhotoGallery = function saveToPhotoGallery() {
    };

    /** Sets the value of the availableCameraMediaTypes property.
     * @param {Object[]} : availableCameraMediaTypes: New value for the
     *      property.
     * @return {Object} */
    _self.setAvailableCameraMediaTypes = function setAvailableCameraMediaTypes() {
    };
    
    /** Sets the value of the availablePhotoGalleryMediaTypes property.
     * @param {Object[]} availablePhotoGalleryMediaTypes : New value for the property.
     * @return {Object} */
    _self.setAvailablePhotoGalleryMediaTypes = function setAvailablePhotoGalleryMediaTypes() {
    };

    /** Sets the value of the availablePhotoMediaTypes property.
     * @param {Object[]} availablePhotoMediaTypes
     * @return {Object} */
    _self.setAvailablePhotoMediaTypes = function setAvailablePhotoMediaTypes(availablePhotoMediaTypes) {
    };

    /** Shows the camera. By default, the native camera controls are displayed.
     *  To add your own camera controls, you can add an overlay view by setting
     *  the overlay property on the options argument.
     * @param {Object} callback*/
    _self.showCamera = function showCamera(callback) {
        Titanium.Media.showCamera({
            success: function (e) {
                if (e.mediaType === Titanium.Media.MEDIA_TYPE_PHOTO) {
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

    /** Switches between front and rear-facing cameras. Its parameter is
     * CAMERA_FRONT or CAMERA_REAR.
     * @param {Number} camera : (CAMERA_FRONT | CAMERA_REAR)
     * @return {Object} */
    _self.switchCamera = function switchCamera(camera) {
    };

    /** Uses the device camera to capture a photo.
     * Must be called after calling showCamera and only when autohide is set to false.
     * This method causes the media capture device to capture a photo and call the success callback.
     * @return {Object} */
    _self.takePicture = function takePicture() {
    };

    /** Takes a screen shot of the visible UI on the device. This method is
     *  asynchronous. The screenshot is returned in the callback argument. The
     *  callback argument's media property contains the screenshot image as a
     *  Blob object.
     * @param {Function} callback
     * @return {Object} */
    _self.takeScreenshot = function takeScreenshot(callback) {
    };
    
    return _self;
        
}());

module.exports = Camera;
