/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

/* FYI: http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Media*/
var Camera = (function() {

    var device = (Ti.Platform.getOsname() === 'ipad' ||
                   Ti.Platform.getOsname() === 'iphone') ? 'ios' : 'android';
    var version = parseInt(Ti.Platform.getVersion().split('.')[0], 10);

    var CALL_FAILURE = "call failed: ";

    var returnFunctionWithoutParams = function returnFunctionWithoutParams(funcName){
        var result;

        try {
            result = Ti.Media[funcName].apply(Ti.Media[funcName]);
        } catch (e) {
            var TiError = require('APIError');
            throw new TiError(funcName + " " + CALL_FAILURE + e.message);
        }

        return result;
    };

    var returnFunctionWithParams = function returnFunctionWithParams(funcName, params){
        var result;

        var paramsIsArray = params instanceof Array;
        if (!paramsIsArray) {
            throw new TypeError("returnFunction call failed. 'params' is not an Array.");
        }

        try {
            result = Ti.Media[funcName].apply(Ti.Media[funcName], params);
        } catch (e) {
            var TiError = require('APIError');
            throw new TiError(funcName + " " + CALL_FAILURE + e.message);
        }

        return result;
    };

    /** It returns the result of Ti.Media native call.
     *  @param {String} funcName : The function name.
     *  @param {String} params : An array of params.
     *  @return Object : Native result. */
    var returnFunction = function returnFunction(funcName, params){
        var result;
        if (!params) {
            result = returnFunctionWithoutParams(funcName);
        } else {
            result = returnFunctionWithParams(funcName, params);
        }

        return result;
    };

    var process = function process (funcName, params) {
        try {
            if (!params) {
                Ti.Media[funcName].apply(Ti.Media[funcName]);
            } else {
                var paramsIsArray = params instanceof Array;
                if (!paramsIsArray) {
                    throw new TypeError("returnFunction call failed. 'params' is not an Array.");
                }
                Ti.Media[funcName].apply(Ti.Media[funcName], params);
            }
        } catch (e) {
            var TiError = require('APIError');
            throw new TiError(funcName + " " + CALL_FAILURE + e.message);
        }
    };

    var self = {};

    /** Creates and returns an instance of Titanium.Media.VideoPlayer.
     *  @param {Object} parameters : It is a dictionary (optional)
     *  @return Object */
    self.createVideoPlayer = function createVideoPlayer(videoPlayerDictionary) {
        return returnFunction("createVideoPlayer", [videoPlayerDictionary]);
    };

    /** Gets the value of the availableCameraMediaTypes property.
     * @return {Object[]} */
    self.getAvailableCameraMediaTypes = function getAvailableCameraMediaTypes() {
        return returnFunction("getAvailableCameraMediaTypes");
    };

    /** Gets the value of the availableCameras property.
     * @return {Number[]} : CAMERA_FRONT, CAMERA_REAR or both*/
    self.getAvailableCameras = function getAvailableCameras() {
        return returnFunction("getAvailableCameras");
    };

    /** Gets the value of the availablePhotoGalleryMediaTypes property.
     * @return {Object[]} */
    self.getAvailablePhotoGalleryMediaTypes = function getAvailablePhotoGalleryMediaTypes() {
        return returnFunction("getAvailablePhotoGalleryMediaTypes");
    };

    /** Gets the value of the availablePhotoMediaTypes property.
     * @return {Object[]} */
    self.getAvailablePhotoMediaTypes = function getAvailablePhotoMediaTypes() {
        return returnFunction("getAvailablePhotoMediaTypes");
    };

    /** Gets the value of the canRecord property.
     * @return {Boolean} */
    self.getCanRecord = function getCanRecord() {
        return returnFunction("getCanRecord");
    };

    /** Gets the value of the isCameraSupported property.
     * @return {Boolean} */
    self.getIsCameraSupported = function getIsCameraSupported() {
        return returnFunction("getIsCameraSupported");
    };

    /** Hides the device camera UI. Must be called after calling showCamera and
     * only when autohide is set to false. This method causes the media capture
     * UI to be hidden. */
    self.hideCamera = function hideCamera() {
        process("hideCamera");
    };

    /** Returns true if the source supports the specified media type. You can
     * query whether a given media type is supported by the device's camera
     * (source == 'camera') or photo library (source == 'photo'). An additional
     * value, photogallery can be used to query the media supported by the
     * device's camera roll or saved image album, which is a subset of the iOS
     * photo library. However, when calling openPhotoGallery on iOS, the entire
     * library is displayed, and there is currently no way to restrict the
     * gallery to show only the camera roll/saved images album.
     * @param {String} source : Media source specified as a string: camera for
     *      Camera or photo for Photo Library.
     * @param {String} type : Media type to check, either MEDIA_TYPE_PHOTO or
     *      MEDIA_TYPE_VIDEO.
     * @return {Boolean} */
    self.isMediaTypeSupported = function isMediaTypeSupported(source, type) {
        return returnFunction("isMediaTypeSupported", [source, type]);
    };

    /** Opens the photo gallery image picker.
     * @param {PhotoGalleryOptionsType} options : Photo gallery options as
     *      described in PhotoGalleryOptionsType. */
    self.openPhotoGallery = function openPhotoGallery(options) {
        process("openPhotoGallery", [options]);
    };

    /** Displays the given image.
     * @param {PreviewImageOptions} options : Dictionary containing the image
     *      and callback functions. */
    self.previewImage = function previewImage(options) {
        process("previewImage", [options]);
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
    self.saveToPhotoGallery = function saveToPhotoGallery(media, callbacks) {
        process("saveToPhotoGallery", [media, callbacks]);
    };

    /** Sets the value of the availableCameraMediaTypes property.
     * @param {Object[]} : availableCameraMediaTypes: New value for the
     *      property.
     * @return {Object} */
    self.setAvailableCameraMediaTypes = function setAvailableCameraMediaTypes(availableCameraMediaTypes) {
        process("setAvailableCameraMediaTypes", [availableCameraMediaTypes]);
    };
    
    /** Sets the value of the availablePhotoGalleryMediaTypes property.
     * @param {Object[]} availablePhotoGalleryMediaTypes : New value for the property.
     * @return {Object} */
    self.setAvailablePhotoGalleryMediaTypes = function setAvailablePhotoGalleryMediaTypes(availablePhotoGalleryMediaTypes) {
        process("setAvailablePhotoGalleryMediaTypes", [availablePhotoGalleryMediaTypes]);
    };

    /** Sets the value of the availablePhotoMediaTypes property.
     * @param {Object[]} availablePhotoMediaTypes
     * @return {Object} */
    self.setAvailablePhotoMediaTypes = function setAvailablePhotoMediaTypes(availablePhotoMediaTypes) {
        process("setAvailablePhotoMediaTypes", [availablePhotoMediaTypes]);
    };

    /** Shows the camera. By default, the native camera controls are displayed.
     *  To add your own camera controls, you can add an overlay view by setting
     *  the overlay property on the options argument.
     * @param {Object} callback*/
    self.showCamera = function showCamera(callback) {
        Ti.Media.showCamera({
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
            mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
        });
    };

    /** Switches between front and rear-facing cameras. Its parameter is
     * CAMERA_FRONT or CAMERA_REAR.
     * @param {String} camera : ('CAMERA_FRONT' | 'CAMERA_REAR')
     * @return {Object} */
    self.switchCamera = function switchCamera(camera) {
        if (camera === 'CAMERA_FRONT' || camera === 'CAMERA_REAR') {
            Ti.Media.switchcamera(Ti.Media[camera]);
        } else {
            throw new TypeError('switchCamera(camera) has received wrong parameters');
        }
    };

    /** Uses the device camera to capture a photo. Must be called after calling
     * showCamera and only when autohide is set to false. This method causes the
     * media capture device to capture a photo and call the success callback.*/
    self.takePicture = function takePicture() {
        process("takePicture");
    };

    /** Takes a screen shot of the visible UI on the device. This method is
     *  asynchronous. The screenshot is returned in the callback argument. The
     *  callback argument's media property contains the screenshot image as a
     *  Blob object.
     * @param {Function} callback
     * @return {Object} */
    self.takeScreenshot = function takeScreenshot(callback) {
        //TODO
    };

    return self;

}());

module.exports = Camera;
