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

/*
	 @title: getWirecloud (Function)
	 *  @param: csrftoken, sessionid, callback_function
	 *  @usage: get Information Wirecloud Account
	function getWirecloud(callback_function) {
		getWorkspaces(function(wValues) {
			var _error = false, i;
			for (i = 0; i < wValues.length; i++) {
				if (wValues[i] == "Error") {
					_error = true;
					callback_function("Error");
					break;
				}
			}
			if (!_error) {
				getResources(function(rValues) {
					if (rValues == "Error")
						callback_function("Error");
					else {
						wValues.push(rValues);
						callback_function(wValues);
					}
				});
			}
		});
	};

	 @title: getWorkspaces (Function)
	 *  @param: csrftoken, sessionid, callback_function
	 *  @usage: create HTTP client for Wirecloud API
	function getWorkspaces(callback_function) {
		var url = _mainUrl + "api/workspaces";
		var response;
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				response = this.responseText;
				getWorkspacesData(JSON.parse(response)[0].id, function(e) {
					callback_function([response, e]);
				});
			},
			onerror : function(e) {
				response = "Error";
				callback_function([response, ""]);
			},
			_timeout : _tim
		});
		client.open("GET", url);
		client.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
		client.clearCookies(_mainUrl);
		if (Ti.App.Properties.getString('cookie_oilsid')) {
			client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
		} else {
			client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
			client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
		}
		client.send();
	};

	 @title: getResources (Function)
	 *  @param: csrftoken, sessionid, callback_function
	 *  @usage: create HTTP client for Wirecloud API
	function getResources(callback_function) {
		var url = _mainUrl + "api/resources";
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				callback_function(this.responseText);
			},
			onerror : function(e) {
				callback_function("Error");
			},
			_timeout : _tim
		});
		client.open("GET", url);
		client.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
		client.clearCookies(_mainUrl);
		if (Ti.App.Properties.getString('cookie_oilsid')) {
			client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
		} else {
			client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
			client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
		}
		client.send();
	};

	 @title: getWorkspacesData (Function)
	 *  @param: numberWorkspace, callback_function
	 *  @usage: create HTTP client for Wirecloud API
	function getWorkspacesData(numberWorkspace, callback_function) {
		var url = _mainUrl + "api/workspace/" + numberWorkspace;
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				callback_function(this.responseText);
			},
			onerror : function(e) {
				callback_function("Error");
			},
			_timeout : _tim
		});
		client.open("GET", url);
		client.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
		client.clearCookies(_mainUrl);
		if (Ti.App.Properties.getString('cookie_oilsid')) {
			client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
		} else {
			client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
			client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
		}
		client.send();
	};

	 @title: deleteWorkspaceTab (Function)
	 *  @param: workspace id, tab id, callback_function
	 *  @usage: create HTTP client for Wirecloud API
	function deleteWorkspaceTab(workspace, id, callback_function) {
		var url = _mainUrl + "api/workspace/" + workspace + '/tab/' + id;
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				callback_function(this.responseText);
			},
			onerror : function(e) {
				callback_function("Error");
			},
			_timeout : _tim
		});
		client.open("DELETE", url);
		client.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
		client.clearCookies(_mainUrl);
		if (Ti.App.Properties.getString('cookie_oilsid')) {
			client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
		} else {
			client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
			client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
		}
		client.send();
	};

	 @title: getMarketPlaces (Function)
	 *  @param: csrftoken, sessionid, callback_function
	 *  @usage: create HTTP client for Wirecloud API
	function getMarketPlaces(callback_function) {
		var url = _mainUrl + "api/markets";
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				callback_function(this.responseText);
			},
			onerror : function(e) {
				callback_function("Error");
			},
			_timeout : _tim
		});
		client.open("GET", url);
		client.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
		client.clearCookies(_mainUrl);
		if (Ti.App.Properties.getString('cookie_oilsid')) {
			client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
		} else {
			client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
			client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
		}
		client.send();
	};

	 @title: getMarketPlaces (Function)
	 *  @param: csrftoken, sessionid, callback_function
	 *  @usage: create HTTP client for Wirecloud API
	function getWidgetsMarket(options, callback_function) {
		var url;
		var arguments = "?" + "orderby=" + options.orderby;
		if (options.search_criteria !== null) {
			url = _mainUrl + "catalogue/search/simple_or/1/100";
			arguments = arguments + "&search_criteria=" + options.search_criteria + "&scope=mashup&search_boolean=AND";
		} else {
			url = _mainUrl + "catalogue/resources/1/100";
			arguments = arguments + "&search_criteria=&scope=mashup&search_boolean=AND";
		}
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				callback_function(this.responseText);
			},
			onerror : function(e) {
				callback_function("Error");
			},
			_timeout : _tim
		});
		client.open("GET", url + arguments);
		client.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
		client.clearCookies(_mainUrl);
		if (Ti.App.Properties.getString('cookie_oilsid')) {
			client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
		} else {
			client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
			client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
		}
		client.send();
	};

	 @title: putWorkspaceMashup (Function)
	 *  @param: csrftoken, sessionid, mashupData, callback_function
	 *  @usage: create HTTP client for Wirecloud API
	function putWorkspaceMashup(mashupData, callback_function) {
		var url = _mainUrl + "api/workspaces";
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				callback_function(this.responseText);
			},
			onerror : function(e) {
				callback_function("Error");
			},
			_timeout : _tim
		});
		var param = {
			mashup : mashupData.vendor + "/" + mashupData.name + "/" + mashupData.versions[0].version,
			dry_run : false
		};
		client.open("POST", url);
		client.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
		client.clearCookies(_mainUrl);
		if (Ti.App.Properties.getString('cookie_oilsid')) {
			client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
		} else {
			client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
			client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
		}
		client.send(JSON.stringify(param));
	};

	 @title: getRouteWidgetMap (Function)
	 *  @param: pointOrigin, pointDestiny, mode, callback_function
	 *  @usage: create HTTP client for Create Route
	function getRouteWidgetMap(pointOrigin, pointDestiny, mode, callback_function) {
		var url = "http://maps.googleapis.com/maps/api/directions/json?origin=" + pointOrigin.lat + "," + pointOrigin.lng + "&destination=" + pointDestiny.lat + "," + pointDestiny.lng + "&sensor=false&optimize=true&mode=" + mode + "&language=" + Ti.Locale.currentLanguage;
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				callback_function(this.responseText);
			},
			onerror : function(e) {
				callback_function("Error");
			},
			_timeout : _tim
		});
		client.open("GET", url);
		client.send();
	};

	 @title: makeExternRequest (Function)
	 *  @param: data (options make request + url), callback_function
	 *  @usage: create request to external server
	function makeExternRequest(data, callback_function) {
		var url = data.url;
		var opt = data.options;
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				callback_function(this);
			},
			onerror : function(e) {
				callback_function(this);
			},
			_timeout : tim
		});
		client.open(opt.method, url);
		var enc = (!opt.encoding) ? "charset=UTF-8" : "charset=" + opt.encoding;
		if (!opt.contentType)
			client.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded; ' + enc);
		else
			client.setRequestHeader("Content-Type", opt.contentType + "; " + enc);
		client.clearCookies(url);
		if (opt.requestHeaders) {
		    var i;
			for (i in opt.requestHeaders) {
				client.setRequestHeader(i, opt.requestHeaders[i]);
			}
		}

		// postBody, context and forceProxy not implemented
		if (opt.parameters) {
			client.send(JSON.stringify(opt.parameters));
		} else
			client.send();
	};

	 @title: checkListResource (Function)
	 *  @param: data (widgets and operators uri), callback_function
	 *  @usage: create requests to wirecloud file system
	function checkListResource(data, callback_function) {
		var _error = {};
		_error.value = false;
		var _resources = {}, i, j;
		for(i in data) {
			_resources[i] = checkResource(data[i], i, function(result) {
				_error = result;
				if (_error.value == true) {
					if (Ti.Network.online) _error.id = "error_inet";
					for(j in _resources) {
						_resources[j].abort();
						delete _resources[j];
					}
				}
				else delete _resources[result.id];
				if (Object.keys(_resources).length === 0) callback_function(_error);
			});
		}

		 @title: checkResource (Function)
		 *  @param: uri (Vendor/name/version), connection id, callback
		 *  @usage: check exist config.xml of widget/operator
		function checkResource(uri, id, callback) {
			var url = _mainUrl + 'showcase/media/' + uri + '/config.xml';
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {
					Ti.API.info("Result [get xml] of " + uri + ": Success");
					callback({
						'id' : id,
						'value' : false,
						'uri' : uri
					});
				},
				onerror : function(e) {
					Ti.API.info("Result [get xml] of " + uri + ": Error");
					callback({
						'id' : id,
						'value' : true,
						'uri' : uri
					});
				},
				_timeout : _tim
			});
			client.open("GET", url);
			client.clearCookies(_mainUrl);
			if (Ti.App.Properties.getString('cookie_oilsid')) {
				client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
			} else {
				client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
				client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
			}
			client.send();
			return client;
		};
	};

	 @title: downloadListResource (Function)
	 *  @param: data (widgets and operators uri), number of widgets, callback_function
	 *  @usage: create requests to download wirecloud files
	function downloadListResource(data, barrier, callback_function) {
		var _error = {};
		_error.value = false;
		_error.files = {};
		var _resources = {}, i, j;
		for (i = 0; i < data.length; i++) {
			var flag = false;
			if (i < barrier) flag = true;
			_resources[i] = downloadResources(data[i], i, flag, function(result) {
				_error.value = result.value;
				if (_error.value == true && Ti.Network.online) {
					_error.uri = "error_inet";
					for(j in _resources) {
						_resources[j].abort();
						delete _resources[j];
					}
				}
				else {
					if(result.flag == false) _error.files[result.uri] = JSON.stringify(result.files);
					delete _resources[result.id];
				}
				if (Object.keys(_resources).length === 0) callback_function(_error);
			});
		}

		 @title: downloadResources (Function)
		 *  @param: widgets uri, id, type [operator|widget] and callback_function
		 *  @usage: download index.html and files
		 function downloadResources(uri, id, flag, callback) {
			 var urlResource = _mainUrl + 'api/resource/' + uri + '/description?include_wgt_files=true';
			 var client = Ti.Network.createHTTPClient({
				 onload : function(e) {
					var _type = (flag) ? 'widgets/' : 'operators/';
					var _files = JSON.parse(this.responseText);
					_files = _files.wgt_files;
					var _path = uri.split('/');
					var _pathUse = '', k, j;
					for (k in _path) {
						_pathUse = _pathUse + _path[k];
						if (!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, _type + _pathUse).exists())
							Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, _type + _pathUse).createDirectory();
						_pathUse = _pathUse + '/';
					}
					if(flag){
						var _extension = JSON.parse(this.responseText);
						_extension = _extension.code_url;
						_extension = _extension.substr(_extension.lastIndexOf('/')+1, _extension.length-1);
                        Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'widgets/' + uri + '/TIWebView').write(_extension, false);
						_extension = null;
					}
					_path = null;
					_pathUse = null;
					Ti.API.info("Result [get files] of " + uri + ": Success");
					var _error = {};
					var _filesResource = {};
					for (k in _files) {
						_filesResource[k] = downloadFile(_type, uri, _files[k], k, function(result) {
							_error.value = result.value;
							if (_error.value == true) {
								if (Ti.Network.online) _error.uri = "error_inet";
								else _error.uri = result.uri;
								for(j in _filesResource) {
									_filesResource[j].abort();
									delete _filesResource[j];
								}
							}
							else delete _filesResource[result.id];
							if (Object.keys(_filesResource).length === 0) {
								if(flag || _error.value == true) callback({'id' : id, 'value' : 0, 'uri' : uri, 'flag' : flag });
								else callback({'id' : id, 'files' : _files, 'value' : 0, 'uri' : uri, 'flag' : flag });
							}
						});
					}
				},
				onerror : function(e) {
					Ti.API.info("Result [get files] of " + uri + ": Error");
					callback({'id' : id, 'value' : 1, 'uri' : uri });
				},
				_timeout : _tim
			});
			client.open("GET", urlResource);
			client.clearCookies(_mainUrl);
			if (Ti.App.Properties.getString('cookie_oilsid')) {
				client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
			} else {
				client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
				client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
			}
			client.send();
			return client;
		};

		 @title: downloadFile (Function)
		 *  @param: url and type [operator|widget], id and callback_function
		 *  @usage: download any type file from wirecloud instance
		function downloadFile(folderType, uri, file, id, callback) {
			var url = _mainUrl + 'showcase/media/' + uri + '/' + file;
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {
					var _path = file.split('/');
					var _pathUse = '', k;
					for (k = 0; k < _path.length - 1; k++) {
						_pathUse = _pathUse + _path[k];
						if (!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, folderType + uri + '/' + _pathUse).exists())
							Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, folderType + uri + '/' + _pathUse).createDirectory();
						_pathUse = _pathUse + '/';
					}
					Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, folderType + uri + '/' + file).write(this.responseText, false);
					Ti.API.info("Result of " + url + ": Success");
					callback({
						'id' : id,
						'value' : false,
						'uri' : uri + '/' + file
					});
				},
				onerror : function(e) {
					Ti.API.info("Result of " + url + ": Error");
					callback({
						'id' : id,
						'value' : true,
						'uri' : uri + '/' + file
					});
				},
				_timeout : _tim
			});
			client.open("GET", url);
			client.clearCookies(_mainUrl);
			if (Ti.App.Properties.getString('cookie_oilsid')) {
				client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
			} else {
				client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
				client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
			}
			client.send();
			return client;
		};

	};*/

	return _self;

}());

module.exports = Network;