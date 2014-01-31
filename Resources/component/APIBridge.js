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

    var _genericMethodHandler = function _genericMethodHandler(callback, methName, options, isAsync) {
        var methodInfo, data;

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
        'params': options,
        'viewId': id,
        'callId': callCounter
        };


        if (!isAsync) {
            console.log('----Fire Event in APIBridge---- event: "APIMethod". data: ' + data);
            Ti.App.fireEvent('APIMethod', data);
        } else {
            console.log('----Fire Event in APIBridge---- event: "APIMethodAsync". data: ' + data);
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
                          * @return : AUTHORIZATION_AUTHORIZED or AUTHORIZATION_RESTRICTED */
                        getAuthorization: function(callback, param) {
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.getAuthorization');
                        },
                        /** Get Contact List
                            * @param {'name': String} optional */
                        getContactList: function(callback, options) {
                            if (!(options instanceof Object) || options.name == null) {
                                options = null;
                            }
                            _genericMethodHandler.call(this, callback, 'API.SW.Contacts.getContactList', options);
                        },
                         /** Create Contact
                          * @param {Object} parameter
                          * @return {Object} */
                        createContact: function(callback, options) {
                            if (options && options instanceof Object) {
                                _genericMethodHandler.call(this, callback, 'API.SW.Contacts.createContact', options);
                            }
                        },
                        /** Save Changes */
                        saveChanges: function(callback, options) {
                            if (options && options instanceof Object) {
                                _genericMethodHandler.call(this, callback, 'API.SW.Contacts.saveChanges', options);
                            }
                        },
                        /** Revert Changes from last save */
                        revertChanges: function(callback, options) {
                            if (options && options instanceof Object) {
                                _genericMethodHandler.call(this, callback, 'API.SW.Contacts.revertChanges', options);
                            }
                        },
                        /** Delete Contact
                          * @param {String} parameter
                          * @return {Number} */
                        deleteContact: function(callback, options) {
                            if (options && options instanceof Object) {
                                _genericMethodHandler.call(this, callback, 'API.SW.Contacts.deleteContact', options);
                            }
                        },
                    },
                    Calendar : {
                        /*
                            var methName = 'API.SW.Calendar.getAuthorization';

                            if (methodHandlers[methName]) {
                                methodHandlers[methName] = {};
                            }
                            methodHandlers[methName][internalID] = callback;
                            callCounter = callCounter + 1;
                            options.internalID = callCounter;
                            Ti.App.fireEvent('APIMethod', {'method': methName,'params': options, 'id': id});
                        }*/
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

                    },
                    Network : {

                    },
                    System : {

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