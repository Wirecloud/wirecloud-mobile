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
    var id = null;
    var prefs = null;
    var inputs = {};

    // APIBridge definition
    Object.defineProperty(window, 'API', {value: {}});
    Object.defineProperty(window.API, 'addEventListener', {
        value: function addEventListener(publicEvent, handler) {

            if (!eventHandlers[publicEvent]) {
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

            if (!eventHandlers[publicEvent]) {
                return false;
            }
            index = eventHandlers[publicEvent].indexOf(handler);
            eventHandlers[publicEvent].slice(index, 1);

            // Unsubscribe this view to publicEvent
            Ti.App.fireEvent('APIEvent', {'action': 'removeEventListener', 'event': publicEvent, 'viewId': id});
        }
    });

    Object.preventExtensions(window.API.removeEventListener);

    Object.defineProperty(window.MashupPlatform, 'eventNotification', {
        value: function eventNotification(publicEvent, data) {
            var i;

            for (i = 0; i < eventHandlers[publicEvent].length; i ++) {
                eventHandlers[publicEvent][i](data);
            }
        }
    });

    Object.preventExtensions(window.API.eventNotification);

}());