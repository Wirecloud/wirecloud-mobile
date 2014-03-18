/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

(function () {

    "use strict";

    var eventHandlers = {};
    var methodHandlers = {};
    // TODO: When titanium load, will replace "var id = null" with the correct id value. This line must be unique in this file.
    var id = 69;
    var prefs = null;
    var inputs = {};
    var callCounter = 0;

    var _genericMethodHandler = function _genericMethodHandler(callback, methName, params, options, isAsync) {
        var methodInfo, data;

        console.log('---callback: ' + callback);
        console.log('---methName: ' + methName);
        console.log('---params: ' + params);
        console.log('---options: ' + options);
        console.log('---isAsync: ' + isAsync);
        console.log('---callback s: ' + JSON.stringify(callback));
        console.log('---methName s: ' + JSON.stringify(methName));
        console.log('---params s: ' + JSON.stringify(params));
        console.log('---options s: ' + JSON.stringify(options));

        if (methodHandlers[methName] == null) {
            methodHandlers[methName] = {};
        }

        callCounter = callCounter + 1;
        methodHandlers[methName][callCounter] = callback;

        methodInfo = methName.split('.');

        console.log('----Adding html listener in APIBridge----: ' + methName + '_' + id + '_' + callCounter);
        Ti.App.addEventListener(methName + '_' + id + '_' + callCounter, _sendMethodResult.bind(this, methName, callCounter));

        data = {
        'method': {
            type: methodInfo[1],
            subapi: methodInfo[2],
            name: methodInfo[3],
            eventName: methName
        },
        'params': params,
        'options': options,
        'viewId': id,
        'callId': callCounter
        };


        if (!isAsync) {
            console.log('----Fire Event in APIBridge---- event: "APIMethod". data: ' + JSON.stringify(data));
            Ti.App.fireEvent('APIMethod', data);
        } else {
            console.log('----Fire Event in APIBridge---- event: "APIMethodAsync". data: ' + JSON.stringify(data));
            Ti.App.fireEvent('APIMethodAsync', data);
        }
    };

    var _sendMethodResult = function (methName, callCounter, data) {
        console.log('++++++++++++BRIDGE++++++++++++++++ HTML!!!');
        console.log('llegaron los datos: ' + data.returnedData);
        console.log('estringificados: ' + JSON.stringify(data.returnedData));
        //console.log('parseados?: ' + JSON.parse(data));
        if (methodHandlers[methName] == null || methodHandlers[methName][callCounter] == null) {
            // TODO Error. Callback not found
            console.log('error in _sendMethodResult APIBridge');
        } else {
            // Execute callback
            console.log('invocando callback html...');
            methodHandlers[methName][callCounter](data.returnedData);
        }
    };

    // APIBridge definition
    Object.defineProperty(window, 'API', {value: {
                SW : {
                    Contacts : {
                        /** Get Authorization Property
                          * Condition AUTHORIZATION_UNKNOWN -> RequestAuthorization
                          * @param {function} Callback
                          * @return : AUTHORIZATION_AUTHORIZED or AUTHORIZATION_RESTRICTED */
                        getAuthorization: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.getAuthorization', [], null, true);
                        },
                        /** Get Contact List
                            * @param {function} Callback
                            * @param {Object} {'name': String} optional
                            * @return [contact] */
                        getContactList: function(callback, options) {
                            if (!(options instanceof Object) || options.value == null) {
                                options = null;
                            }
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.getContactList', [], options);
                        },
                         /** Create Contact
                          * @param {function} Callback
                          * @param {Object}
                          * @return {Object} */
                        createContact: function(callback, options) {
                            if (!(options instanceof Object)) {
                                options = null;
                            }
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.createContact', [], options);
                        },
                        /** Save Changes
                          * @param {function} Callback  */
                        saveChanges: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.saveChanges');
                        },
                        /** Revert Changes from last save
                          * @param {function} Callback  */
                        revertChanges: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.revertChanges');
                        },
                        /** Delete Contact
                          * @param {function} Callback
                          * @param {String} Contact Name
                          * @return {Number} */
                        deleteContact: function(callback, contactName) {
                            if (typeof contactName === "string") {
                                _genericMethodHandler.call(this, callback, 'API.SW.Contacts.deleteContact', [contactName]);
                            }
                        },
                    },
                    Calendar : {

                    },
                    FileSystem : {

                    },
                    DataBase : {

                    },
                    Log : {

                    },
                    Map : {

                    },
                    Notification : {
                        /** Create Toast Notification
                         * @param {function} Callback
                         * @param {String} message
                         * @param {Object} options {
                         *          height: {Number}            -default = 100
                         *          opacity: {Number}           -default = 1 [0 .. 1]
                         *          borderColor: {String}       -default = #D3D3D3
                         *          borderWidth: {Number}       -default = 1
                         *          borderRadius: {Number}      -default = 5
                         *          backgroundColor: {String}   -default = #E6E6E6
                         *          fontSize: {Number}          -default = 16
                         *          fontWeight: {String}        -default = normal ['bold', 'normal']
                         *          textColor: {String}         -default = #000000
                         *      }
                         * @return {String} JSON Information of Notification created */
                        createNotification: function (callback, msg, options) {
                            if (typeof msg !== 'string') {
                                // TODO definir formato de errores HTML
                                throw new Error('createNotification ERROR. msg param must be String type');
                            }
                            if (!(options instanceof Object)) {
                                options = null;
                            }
                            _genericMethodHandler.call(this, callback, 'API.SW.Notification.createNotification', [msg], options);
                        },
                    },
                    Social : {

                    },
                },
                HW : {
                    Acceloremeter : {

                    },
                    Battery : {

                    },
                    Camera : {

                    },
                    GeoLocation : {

                    },
                    Gesture : {

                    },
                    Media : {

                            /* VIDEO TODO */
                            /** Opens the photo gallery image picker.
                              * @param {function} Callback
                              * @param {Object} {'name': String} optional
                              * @return {Number} */
                            openPhotoGallery : function openPhotoGallery(callback, options) {
                            if (!(callback instanceof Function)) {
                                return false;
                            }
                            if (!(options instanceof Object)) {
                                options = null;
                            }
                                _genericMethodHandler.call(this, callback, 'API.SW.Media.openPhotoGallery', [], options);
                            },
                            /** Takes a screen shot of the visible UI on the device. This method is
                             *  asynchronous.
                             * @param {screenSotCallback} callback that will receive screenshot image as Blob object */
                            takeScreenshot : function takeScreenshot(callback) {
                                _genericMethodHandler.call(this, callback, 'API.SW.Media.takeScreenshot', [callback], null, true);
                            },
                            /** Takes a screen shot of the visible UI on the device. This method is
                             *  asynchronous.
                             * @param {pattern} [Number[]=[100, 300, 100, 200, 100, 50]] optional vibrate pattern only available for Android.*/
                            vibrate : function vibrate(pattern) {
                                if (Ti.App.isApple || pattern == null || !(pattern instanceof Array)) {
                                    Titanium.Media.vibrate();
                                }
                                // pattern only available for Android
                                Titanium.Media.vibrate(pattern);
                            },
                            // TODO fix comments
                            /** Create new AudioPlayer
                             * @param {audioPlayerOptions} options
                             * @return {Number} audioPlayer ID*/
                            createAudioPlayer : function createAudioPlayer(callback, options) {
                                if (!(options instanceof Object)) {
                                    options = null;
                                }
                                _genericMethodHandler.call(this, callback, 'API.HW.Media.createAudioPlayer', [], options);
                            },
                            /** Set Audio Player URL
                             * @param {Number} playerId, the audio player ID number
                             * @param {String} url, The Audio Player URL */
                            setAudioPlayerURL : function getAudioPlayerURL(callback, playerId, url) {
                                _genericMethodHandler.call(this, callback, 'API.HW.Media.setAudioPlayerURL', [playerId, url], null);
                            },
                            /** Pause Audio Player
                             * @param {Number} playerId, the audio player ID number */
                            pauseAudioPlayer : function pauseAudioPlayer(callback, playerId) {
                                _genericMethodHandler.call(this, callback, 'API.HW.Media.pauseAudioPlayer', [playerId], null);
                            },
                            /** Play Audio Player
                             * @param {Number} playerId, the audio player ID number */
                            playAudioPlayer : function playAudioPlayer(callback, playerId) {
                                _genericMethodHandler.call(this, callback, 'API.HW.Media.playAudioPlayer', [playerId], null);
                            },

                            /** Stop Audio Player
                             * @param {Number} playerId, the audio player ID number */
                            stopAudioPlayer : function stopAudioPlayer(callback, playerId) {
                                _genericMethodHandler.call(this, callback, 'API.HW.Media.stopAudioPlayer', [playerId], null);
                            }
                    },
                    Network : {

                    },
                    System : {
                        /** Get device platform
                          * @param {function} Callback
                          * @param {String} Contact Name
                          * @return : String ('ios', 'android') */
                        getDeviceOs: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getDeviceOs');
                        },
                        /** Get System's OS version.
                          * @param {function} Callback
                          * @return : String */
                        getVersion: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getVersion');
                        },
                        /** Get device's Model.
                          * @param {function} Callback
                          * @return : String */
                        getModel: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getModel');
                        },
                        /** Get System's processor architecture.
                          * @param {function} Callback
                          * @return : String */
                        getArchitecture: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getArchitecture');
                        },
                        /** Get available memory
                          * @param {function} Callback
                          * @return : Int (Bytes)*/
                        getAvailableMemory: function (callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getAvailableMemory');
                        },

                        /** Get short name of the JavaScript runtime in use.
                          * @param {function} Callback
                          * @return : String */
                        getJsRuntime: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getJsRuntime');
                        },

                        /** Get the manufacturer of the device.
                          * @param {function} Callback
                          * @return : String */
                        getManufacturer: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getManufacturer');
                        },

                        /** Get the number of processing cores.
                          * @param {function} Callback
                          * @return : String */
                        getProcessorCount: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getProcessorCount');
                        },

                        /** Get system name
                          * @param {function} Callback
                          * @return : String */
                        getUsername: function(callback) {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getUsername');
                        },

                        /** Get system's default language.
                          * @param {function} Callback
                          * @return : String */
                        getLocale: function() {
                            _genericMethodHandler.call(this, callback, 'API.HW.System.getLocale');
                        },
                    },
                }
            }
    });

    Object.defineProperty(window.API, 'addEventListener', {
        value: function addEventListener(publicEvent, handler) {

            if (eventHandlers[publicEvent] == null) {
                eventHandlers[publicEvent] = [];
            }
            eventHandlers[publicEvent].push(handler);

            // Subscribe this view to publicEvent
            Ti.App.fireEvent('APIEvent', {'action': 'addEventListener', 'event': publicEvent, 'viewId': id});
        }
    });

    Object.preventExtensions(window.API.addEventListener);

    Object.defineProperty(window.API, 'removeEventListener', {
        value: function removeEventListener(publicEvent, handler) {
            var index;

            if (eventHandlers[publicEvent] == null) {
                return false;
            }
            index = eventHandlers[publicEvent].indexOf(handler);
            eventHandlers[publicEvent].slice(index, 1);

            // Unsubscribe this view to publicEvent
            Ti.App.fireEvent('APIEvent', {'action': 'removeEventListener', 'event': publicEvent, 'viewId': id});
        }
    });

    Object.preventExtensions(window.API.removeEventListener);

    Object.defineProperty(window.API, 'eventNotification', {
        value: function eventNotification(publicEvent, data) {
            var i;

            for (i = 0; i < eventHandlers[publicEvent].length; i ++) {
                eventHandlers[publicEvent][i](data);
            }
        }
    });

    Object.preventExtensions(window.API.eventNotification);

}());