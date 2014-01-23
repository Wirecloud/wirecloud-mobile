/*
 *     (C) Copyright 2012-2013 Universidad Politécnica de Madrid
 *
 *     This file is part of Wirecloud Platform.
 *
 *     Wirecloud Platform is free software: you can redistribute it and/or
 *     modify it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     Wirecloud is distributed in the hope that it will be useful, but WITHOUT
 *     ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *     FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public
 *     License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with Wirecloud Platform.  If not, see
 *     <http://www.gnu.org/licenses/>.
 *
 */

(function () {

    "use strict";

    var id = null;
    var prefs = null;
    var inputs = {};
    var handlers = [];
    var request = [];
    var requestCallbacks = {};
    var requestCallbacksKey = 0;
    var type;

    // Platform definition
    Object.defineProperty(window, 'MashupPlatform', {value: {}});
    Object.defineProperty(window.MashupPlatform, 'setPlatformInfo', {
        value: function setPlatformInfo(newId, typeP) {
            var i;

            id = newId;
            type = typeP;
            for(i = 0; i < request.length; i++) {
            if(request[i][0]) {
                    Ti.App.fireEvent('makeRequest', {
                        'id': id,
                        'idRequest': request[i][2],
                        'typeView':type,
                        'url': request[i][0],
                        'options': request[i][1]
                    });
                }
            }
            request = [];
            for(i = 0; i < handlers.length; i++) {
                Ti.App.fireEvent('pushEvent', {
                    'id': id,
                    'name': handlers[i][0],
                    'dataEvent': handlers[i][1]
                });
            }
            handlers = [];
            if(prefs !== null){
                Ti.App.fireEvent('getPrefs',{
                    'id': id,
                    'typeView': type
                });
            }
        }
    });

    Object.defineProperty(window.MashupPlatform, 'activateCallback', {
        value: function activateCallback(inputName, data) {
            inputs[inputName](data);
        }
    });

    Object.defineProperty(window.MashupPlatform, 'activateRequestCallback', {
        value: function activateRequestCallback(key, values) {
            if(values === 'Error'){
                requestCallbacks[key].fail(values);
                Ti.API.info('activateRequestCallback id[key]: ' + id + '['+key+'] andResult: failed');
            }
            else {
                requestCallbacks[key].succ(values);
                Ti.API.info('activateRequestCallback id[key]: ' + id + '['+key+'] andResult: success');
            }
            delete requestCallbacks[key];
        }
    });

    Object.defineProperty(window.MashupPlatform, 'activatePreferenceCallback', {
        value: function activatePreferenceCallback(values) {
            prefs(values);
        }
    });

    // Wiring Module
    Object.defineProperty(window.MashupPlatform, 'wiring', {value: {}});
    Object.defineProperty(window.MashupPlatform.wiring, 'registerCallback', {
        value: function registerCallback(inputName, callback) {
            inputs[inputName] = callback;
        }
    });

    Object.defineProperty(window.MashupPlatform.wiring, 'pushEvent', {
        value: function pushEvent(outputName, data, options) {
            if(id === null){
                handlers.push([outputName, data]);
            }
            else {
                Ti.App.fireEvent('pushEvent', {
                'id': id,
                'name': outputName,
                'dataEvent': data
                });
            }
        }
    });

    Object.preventExtensions(window.MashupPlatform.wiring);

    // HTTP Module
    Object.defineProperty(window.MashupPlatform, 'http', {value: {}});
     Object.defineProperty(window.MashupPlatform.http, 'makeRequest', {
         value: function makeRequest(url, options) {
            requestCallbacks[requestCallbacksKey] = {
                succ: options.onSuccess,
                fail: options.onFailure
            };
             if(id === null){
                 request.push([url, options, requestCallbacksKey]);
             }
             else{
                Ti.App.fireEvent('makeRequest', {
                    'id': id,
                    'idRequest': requestCallbacksKey,
                    'typeView':type,
                    'url': url,
                    'options': options
                });
             }
            requestCallbacksKey = requestCallbacksKey + 1;
          }
    });
    Object.preventExtensions(window.MashupPlatform.http);

    // Preferences Module
    Object.defineProperty(window.MashupPlatform, 'prefs', {value: {}});

    Object.defineProperty(window.MashupPlatform.prefs, 'get', {
        value: function get(key) {
            return "";
        }
    });

    Object.defineProperty(window.MashupPlatform.prefs, 'registerCallback', {
        value: function registerCallback(callback) {
            prefs = callback;
        }
    });

    Object.preventExtensions(window.MashupPlatform.prefs);

}());
