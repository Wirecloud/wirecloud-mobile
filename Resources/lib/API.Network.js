/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 * Test Configuration Wirecloud Instance:
 * mainURL    : 'http://138.100.12.106:8088/'
 * loginURL   : 'http://138.100.12.106:8088/login'
 * oauthURL   : 'http://138.100.12.106:8088/'
 * tokenURL   : 'http://138.100.12.106:8088/'
 * typeServer : 'wirecloud'
 */

"use strict";

var Network = (function () {

    // Configuration Network
    var _self = {},
    mainURL = 'http://138.100.12.106:8088/',
    loginURL = 'http://138.100.12.106:8088/login',
    oauthURL = 'http://138.100.12.106:8088/',
    tokenURL = 'http://138.100.12.106:8088/',
    typeServer = 'wirecloud',
    tim = 90000;

    /** Private function to connect Wirecloud
     *  @param {Object} data: username, password, cookie
     *  @param {Function} callback */
    var loginWirecloud = function loginWirecloud(data, callback){
        var csrftoken = data.cook.substr(10, 32), boundary,
        sessionid = data.cook.substr(data.cook.indexOf('sessionid')+10, 32),
        client = Ti.Network.createHTTPClient({
            onload: function(e) {
                if(this.responseText.indexOf('csrfmiddlewaretoken') === -1 &&
                   this.responseText.indexOf('CSRF verification failed') === -1){
                    Ti.App.Properties.setString('cookie_csrftoken', csrftoken);
                    Ti.App.Properties.setString('cookie_sessionid', sessionid);
                    callback('Success Credential');
                }
                else{
                    callback('Error Credential');
                }
            },
            onerror: function(e) {
                callback('Error Server');
            },
            timeout: tim
        });
        boundary = Ti.Network.encodeURIComponent('csrfmiddlewaretoken') + '=' + Ti.Network.encodeURIComponent(csrftoken) +
             '&' + Ti.Network.encodeURIComponent('username') + '=' + Ti.Network.encodeURIComponent(data.user) +
             '&' + Ti.Network.encodeURIComponent('password') + '=' + Ti.Network.encodeURIComponent(data.pass);
        client.open("POST", loginURL);
        client.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        client.clearCookies(loginURL);
        client.clearCookies(mainURL);
        client.setRequestHeader("Cookie", "csrftoken=" + csrftoken);
        client.setRequestHeader("Cookie", "sessionid=" + sessionid);
        client.send(boundary);
    };

    /** Private function to connect FiWare
     *  @param {Object} data: username, password, cookie
     *  @param {Function} callback */
    var loginFiWare = function loginFiWare(data, callback){
        var idm_session = data.cook.substr(21, 222), boundary,
        client = Ti.Network.createHTTPClient({
            onload: function(e) {
                if(this.getResponseText().indexOf('Signed in successfully') !== -1){
                    callback('Success Credential');
                }
                else{
                    callback('Error Credential');
                }
            },
            onerror: function(e) {
                if(this.status === 401){
                    callback('Error Credential');
                }
                else{
                    callback('Error Server');
                }
            },
            timeout: tim
        });
        boundary = Ti.Network.encodeURIComponent('authenticity_token') + '=' + Ti.Network.encodeURIComponent(data.csrf) +
             '&' + Ti.Network.encodeURIComponent('user[email]') + '=' + Ti.Network.encodeURIComponent(data.user) +
             '&' + Ti.Network.encodeURIComponent('user[password]') + '=' + Ti.Network.encodeURIComponent(data.pass);
        client.open("POST", loginURL);
        client.setRequestHeader("Accept", 'text/html');
        client.setRequestHeader("Content-Type",'application/x-www-form-urlencoded');
        client.clearCookies(loginURL);
        client.clearCookies(mainURL);
        client.setRequestHeader("Cookie", '_fi-ware-idm_session=' + idm_session);
        client.send(boundary);
    };

    /** Private function to connect AppBase
     *  @param {Object} data: username, password, cookie
     *  @param {Function} callback */
    var loginAppBase = function loginAppBase(data, callback){

    };

    /** Private Function to Request API */
    var requestGETJson = function requestGETJson(path, operation, callback){
        var url = mainURL + path,
        client = Ti.Network.createHTTPClient({
            onload: function(e) {
                callback(this.responseText);
            },
            onerror: function(e) {
                callback('Error '+operation);
            },
            timeout: tim
        });
        client.open("GET", url);
        client.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
        client.clearCookies(mainURL);
        if (typeServer === 'fiware'){
            client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
        }
        else if(typeServer === 'wirecloud'){
            client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
            client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
        }
        else {
            client.setRequestHeader("Cookie", "custom_cookie="+"appbasecookie");
        }
        client.send();
    };

	/** HTTP or HTTPS Basic Login
	 *  @param {String} username
	 *  @param {String} password
	 *  @param {Function} callback */
	_self.login = function login(username, password, callback) {
		var client = Ti.Network.createHTTPClient({
			onload: function(e) {
			    var data = {
			        'user': username,
			        'pass': password,
			        'cook': this.getResponseHeader('Set-Cookie')
			    };
			    if(typeServer === 'wirecloud') {
			        loginWirecloud(data, function(response){
			            callback(response);
                    });
			    }
			    else if(typeServer === 'fiware') {
			        var pos = this.getResponseText().indexOf('name="csrf-token"');
			        data.csrf = this.getResponseText().substr(pos-46, 44);
                    loginFiWare(data, function(response){
                        callback(response);
                    });
			    }
			    else if(typeServer === 'appbase') {
                    loginAppBase(data, function(response){
                        callback(response);
                    });
			    }
			    else {
			        callback('Error Configuration');
			    }
			},
			onerror : function(e) {
				callback('Error Server');
			},
			timeout: tim
		});
		client.open("GET", loginURL);
		client.setRequestHeader("Content-Type", 'text/html');
        client.clearCookies(loginURL);
		client.clearCookies(mainURL);
		client.send();
	};

	/** Get Workspaces (All) Information
	 *  @param {Function} callback */
	_self.getWorkspacesInfo = function getWorkspacesInfo(callback) {
		requestGETJson('api/workspaces', 'getWorkspacesInfo', function(response){
		    callback(response);
		});
	};

    /** Get Workspace Information
     *  @param {Number} id
     *  @param {Function} callback */
    _self.getWorkspaceInfo = function getWorkspaceInfo(id, callback) {
        requestGETJson('api/workspace/'+id, 'getWorkspaceInfo', function(response){
            callback(response);
        });
    };

    /** Get Resources (All) Information
     *  @param {Function} callback */
    _self.getResourcesInfo = function getResourcesInfo(callback) {
        requestGETJson('api/resources', 'getResourceInfo', function(response){
            callback(response);
        });
    };

    /** Get Market (All) Information
     *  @param {Function} callback */
    _self.getMarketsInfo = function getMarketsInfo(callback) {
        requestGETJson('api/markets', 'getMarketsInfo', function(response){
            callback(response);
        });
    };

    /** Search Element (Component | Composition)
     *  @param {Object} options
     *  @param {Function} callback */
    _self.searchElement = function searchElement(options, callback) {
        var url;
        if (options.search_criteria !== null) {
            url = "catalogue/search/simple_or/1/100";
        }
        else {
            url = "catalogue/resources/1/100";
        }
        url = url + "?" + "orderby=" + options.orderby;
        url = url + "&search_criteria=" + options.search_criteria +
              "&scope=" + options.type + "&search_boolean=AND";
        requestGETJson(url, 'searchElement', function(response){
            callback(response);
        });
    };

	return _self;

}());

module.exports = Network;