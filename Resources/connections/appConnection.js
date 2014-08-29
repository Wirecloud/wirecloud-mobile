(function() {

	var _isApple = (Ti.Platform.osname == 'ipad');
	//var _mainUrl = "https://mashup.lab.fi-ware.eu/";
	//var _mainUrl = "http://138.100.12.106:8088/";
	var _mainUrl = "https://wirecloud.conwet.fi.upm.es/";
	var _tim = 100000;

	/** @title: getWirecloud (Function)
	 *  @param: csrftoken, sessionid, callback_function
	 *  @usage: get Information Wirecloud Account */
	function getWirecloud(callback_function) {
		getWorkspaces(function(wValues) {
			var _error = false;
			for (var i = 0; i < wValues.length; i++) {
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
	}

	/** @title: getWorkspaces (Function)
	 *  @param: csrftoken, sessionid, callback_function
	 *  @usage: create HTTP client for Wirecloud API */
	function getWorkspaces(callback_function) {
		var url = _mainUrl + "api/workspaces";
		var response;
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				response = this.responseText;
				/*getWorkspacesData(JSON.parse(response)[0].id, function(e) {
					callback_function([response, e]);
				});*/
				callback_function(response);
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
		Ti.API.info(Ti.App.Properties.getString('cookie_oilsid'));
		if (Ti.App.Properties.getString('cookie_oilsid')) {
			client.setRequestHeader("Cookie", "oil_sid=" + Ti.App.Properties.getString('cookie_oilsid'));
		} else {
			client.setRequestHeader("Cookie", "csrftoken=" + Ti.App.Properties.getString('cookie_csrftoken'));
			client.setRequestHeader("Cookie", "sessionid=" + Ti.App.Properties.getString('cookie_sessionid'));
		}
		client.send();
	};

	/** @title: getResources (Function)
	 *  @param: csrftoken, sessionid, callback_function
	 *  @usage: create HTTP client for Wirecloud API */
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

	/** @title: getWorkspacesData (Function)
	 *  @param: numberWorkspace, callback_function
	 *  @usage: create HTTP client for Wirecloud API */
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

	/** @title: deleteWorkspaceTab (Function)
	 *  @param: workspace id, tab id, callback_function
	 *  @usage: create HTTP client for Wirecloud API */
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

	/** @title: getMarketPlaces (Function)
	 *  @param: csrftoken, sessionid, callback_function
	 *  @usage: create HTTP client for Wirecloud API */
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
	}

	/** @title: getMarketPlaces (Function)
	 *  @param: csrftoken, sessionid, callback_function
	 *  @usage: create HTTP client for Wirecloud API */
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
	}

	/** @title: putWorkspaceMashup (Function)
	 *  @param: csrftoken, sessionid, mashupData, callback_function
	 *  @usage: create HTTP client for Wirecloud API */
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
	}

	/** @title: getRouteWidgetMap (Function)
	 *  @param: pointOrigin, pointDestiny, mode, callback_function
	 *  @usage: create HTTP client for Create Route */
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
	}

	/** @title: makeExternRequest (Function)
	 *  @param: data (options make request + url), callback_function
	 *  @usage: create request to external server */
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
			_timeout : _tim
		});
		client.open(opt.method, url);
		var enc = (!opt.encoding) ? "charset=UTF-8" : "charset=" + opt.encoding;
		if (!opt.contentType)
			client.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded; ' + enc);
		else
			client.setRequestHeader("Content-Type", opt.contentType + "; " + enc);
		client.clearCookies(url);
		if (opt.requestHeaders) {
			for (var i in opt.requestHeaders) {
				client.setRequestHeader(i, opt.requestHeaders[i]);
			}
		}

		// postBody, context and forceProxy not implemented
		if (opt.parameters) {
			client.send(JSON.stringify(opt.parameters));
		} else
			client.send();
	}

	/** @title: checkListResource (Function)
	 *  @param: data (widgets and operators uri), callback_function
	 *  @usage: create requests to wirecloud file system */
	function checkListResource(data, callback_function) {
		var _error = {};
		_error.value = false;
		var _resources = {};
		for(var i in data) {
			_resources[i] = checkResource(data[i], i, function(result) {
				_error = result;
				if (_error.value == true) {
					if (Ti.Network.online) _error.id = "error_inet";
					for(var j in _resources) {
						_resources[j].abort();
						delete _resources[j];
					}
				}
				else delete _resources[result.id];
				if (Object.keys(_resources).length === 0) callback_function(_error);
			});
		}

		/** @title: checkResource (Function)
		 *  @param: uri (Vendor/name/version), connection id, callback
		 *  @usage: check exist config.xml of widget/operator */
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

	}

	/** @title: downloadListResource (Function)
	 *  @param: data (widgets and operators uri), number of widgets, callback_function
	 *  @usage: create requests to download wirecloud files */
	function downloadListResource(data, barrier, callback_function) {
		var _error = {};
		_error.value = false;
		_error.files = {};
		var _resources = {};
		for (var i = 0; i < data.length; i++) {
			var flag = false;
			if (i < barrier) flag = true;
			_resources[i] = downloadResources(data[i], i, flag, function(result) {
				_error.value = result.value;
				if (_error.value == true && Ti.Network.online) {
					_error.uri = "error_inet";
					for(var j in _resources) {
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

		/** @title: downloadResources (Function)
		 *  @param: widgets uri, id, type [operator|widget] and callback_function
		 *  @usage: download index.html and files */
		function downloadResources(uri, id, flag, callback) {
			var urlResource = _mainUrl + 'api/resource/' + uri + '/description?include_wgt_files=true';
			Ti.API.info("URL a descargar recurso -> " + urlResource);
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {
					var _type = (flag) ? 'widgets/' : 'operators/';
					var _files = JSON.parse(this.responseText);
					_files = _files.wgt_files;
					var _path = uri.split('/');
					var _pathUse = '';
					for (var k in _path) {
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
					for (var k in _files) {
						_filesResource[k] = downloadFile(_type, uri, _files[k], k, function(result) {
							_error.value = result.value;
							if (_error.value == true) {
								if (Ti.Network.online) _error.uri = "error_inet";
								else _error.uri = result.uri;
								for(var j in _filesResource) {
									_filesResource[j].abort();
									delete _filesResource[j];
								}
							}
							else delete _filesResource[result.id];
							if (Object.keys(_filesResource).length === 0) {
								if(flag || _error.value == true){
									callback({'id' : id,
											  'value' : false,
											  'uri' : uri,
											  'flag' : flag,
									});
								}
								else{
									callback({'id' : id,
											  'files' : _files,
										      'value' : false,
											  'uri' : uri,
											  'flag' : flag
									});
								}
							}
						});
					}
				},
				onerror : function(e) {
					Ti.API.info("Result [get files] of " + uri + ": Error");
					callback({
						'id' : id,
						'value' : true,
						'uri' : uri
					});
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

		/** @title: downloadFile (Function)
		 *  @param: url and type [operator|widget], id and callback_function
		 *  @usage: download any type file from wirecloud instance */
		function downloadFile(folderType, uri, file, id, callback) {
			var url = _mainUrl + 'showcase/media/' + uri + '/' + file;
			Ti.API.info("URL a descargar -> " + url);
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {
					var _path = file.split('/');
					var _pathUse = '';
					for (var k = 0; k < _path.length - 1; k++) {
						_pathUse = _pathUse + _path[k];
						if (!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, folderType + uri + '/' + _pathUse).exists())
							Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, folderType + uri + '/' + _pathUse).createDirectory();
						_pathUse = _pathUse + '/';
					}
					Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, folderType + uri + '/' + file).write(this.responseData, false);
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

	};

	// Wirecloud API Fi-WARE
	module.exports.getWirecloud = getWirecloud;
	module.exports.getWorkspaces = getWorkspaces;
	module.exports.getResources = getResources;
	module.exports.deleteWorkspaceTab = deleteWorkspaceTab;
	module.exports.getWorkspacesData = getWorkspacesData;
	module.exports.putWorkspaceMashup = putWorkspaceMashup;

	// MarketPlace API Fi-WARE
	module.exports.getMarketPlaces = getMarketPlaces;
	module.exports.getWidgetsMarket = getWidgetsMarket;

	// Extras Connection
	module.exports.getRouteWidgetMap = getRouteWidgetMap;
	module.exports.makeExternRequest = makeExternRequest;
	module.exports.checkListResource = checkListResource;
	module.exports.downloadListResource = downloadListResource;

})();

