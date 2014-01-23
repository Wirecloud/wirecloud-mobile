/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
'use strict';

var API = (function() {
    var _self;

    _self = {
        SW : {
            Contacts : require('API.Contacts'),
            Calendar : '',
            FileSystem : '',
            DataBase : '',
            Log : '',
            Map : '',
            Notification : '',
            Social : ''
        },
        HW : {
            Acceloremeter : require('API.Accelerometer'),
            Battery : require('API.Battery'),
            Camera : '',
            GeoLocation : '',
            Gesture : '',
            Media : '',
            Network : '',
            System : require('API.System')
        }
    };

    _self.events = {
        activeHandlers: {},
        availableEvents: {}
    };

    var _initEvents = function _initEvents() {
        var key, eventId, publicName, eventData;
        /* TODO new class eventData
         * API.Example.events = {
         *      'publicEventName': {
         *          event: 'titaniumeventname',
         *          listener: Ti.thePathToMethod.addEventListener
         *      }
         * };
         */
        for (key in _self.SW) {
            if (_self.SW[key].events) {
                for (eventId in _self.SW[key].events) {
                    publicName = enventId;
                    eventData = _self.SW[key].events[eventId];
                    _self.events.availableEvents[publicName] = eventData;
                }
            }
        }
        for (key in _self.HW) {
            if (_self.HW[key].events) {
                for (eventId in _self.HW[key].events) {
                    publicName = enventId;
                    eventData = _self.HW[key].events[eventId];
                    _self.events.availableEvents[publicName] = eventData;
                }
            }
        }
    };

    /** Transport to html a internal event
     * @param: {eventName} the name of the Titanium event.
     * @param: {data} event data.
     * @return : Bool true if success or false if error*/
    var _fireHTMLEvents = function _fireHTMLEvents(eventName, data) {
        var key, viewId;
        if (_self.events.activeHandlers[eventName]) {
            for (key in _self.events.activeHandlers[eventName].views) {
                viewId = _self.events.activeHandlers[eventName].views[key];
                // This event will be received by all listeners API.Commons
                Ti.App.fireEvent(eventName, data);
            }
            return true;
        } else {
            return false;
        }
    };

    /** AddEventListener from a HTML view (througth APICommons.js TODO)
     * @param: {publicEvent} the public html name for the event.
     * @param: {viewId} the id of the interested html view.
     * @return : Bool true if success or false if error*/
    _self.events.addEventListener = function addEventListener(publicEvent, viewId) {
        var eventData, eventHandler;

        eventData = _self.events.availableEvents[publicEvent];
        if (!eventData) {
            // Public event doesn't exist
            return false;
        }
        if (_self.events.activeHandlers[publicEvent]) {
            // Main listener active yet
            _self.events.activeHandlers[publicEvent].nlisteners += 1;
            if (!_self.events.activeHandlers[publicEvent].views[viewId]) {
                _self.events.activeHandlers[publicEvent].views[viewId] = 0;
            }
            _self.events.activeHandlers[publicEvent].views[viewId] += 1 ;
        } else {
            // Create new handler
            eventHandler = function(theEvent, e) {
                _fireHTMLEvents.call(_self, theEvent, {
                        'level': e.level,
                        'state': e.state,
                        'type': e.type
                    }
                );
            }.bind(_self, publicEvent);

            // Inicialize handler for this event
            _self.events.availableEvents[publicEvent].listener.addEventListener(_self.events.availableEvents[publicEvent].event, eventHandler);
            _self.events.activeHandlers[publicEvent].handler = eventHandler;
            _self.events.activeHandlers[publicEvent].nlisteners = 1;
            _self.events.activeHandlers[publicEvent].views = {};
            _self.events.activeHandlers[publicEvent].views[viewId] = 1;
        }
    };

    /** RemoveEventListener from a HTML view (througth APICommons.js TODO)
     * @param: {publicEvent} the public html name for the event.
     * @param: {viewId} the id of the interested html view.
     * @return : Bool true if success or false if error*/
    _self.events.RemoveEventListener = function RemoveEventListener(publicEvent, viewId) {
        var eventData, eventHandler;

        eventData = _self.events.availableEvents[publicEvent];
        if (!eventData || !_self.events.activeHandlers[publicEvent]) {
            // Public event doesn't exist
            return false;
        }

        _self.events.activeHandlers[publicEvent].nlisteners -= 1;
        _self.events.activeHandlers[publicEvent].views[viewId] -= 1 ;
        _self.events.availableEvents[publicEvent].listener.removeEventListener(_self.events.availableEvents[publicEvent].event, _self.events.activeHandlers[publicEvent].handler);
    };

    /** Handler for the events from a HTML view througth APICommons.js
     * @param: {data} data = {
     *     'action': 'addEventListener'/'removeEventListener',
     *     'viewId': viewId
     * }
     **/
    _self.events.APIEventHandler = function APIEventHandler(data) {
        var dataParsed;

        dataParsed = JSON.parse(data);

        if (dataParsed.action == 'addEventListener') {
            _self.events.addEventListener(dataParsed.event, dataParsed.viewId);
        } else if (dataParsed.action == 'removeEventListener') {
            _self.events.removeEventListener(dataParsed.event, dataParsed.viewId);
        }
    };

    /** Handler for the API methods invocations from a HTML view througth APICommons.js
     * @param: {data} data = {
     *     'method': 'API.Example.getBlabla',
     *     'params': [param],
     *     'eventName': eventName
     * }
     **/
    _self.events.APIMethodHandler = function APIMethodHandler(data) {
        var result, dataParsed;

        dataParsed = JSON.parse(data);

        if (dataParsed.method && !dataParsed.params) {
            result = dataParsed.method();
        } else if (dataParsed.method && dataParsed.params) {
            result = dataParsed.method(dataParsed.params);
        } else {
            // Error. Method doesn't exist
            result = "Error. Unknown API method";
        }
        Ti.App.fireEvent(dataParsed.eventName, result);
    };

    _self.init = function init() {
        _initEvents(_self);
        Ti.App.addEventListener('APIEvent', _self.events.APIEventHandler);
        Ti.App.addEventListener('APIMethod', _self.events.APIMethodHandler);
    };


    _self.Init();
    return _self;

}());

module.exports = API;