/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

(function() {
	
	var _device = (Ti.Platform.getOsname() == 'ipad' || 
		           Ti.Platform.getOsname() == 'iphone') ? 'ios' : 'android';
	var _version = parseInt(Ti.Platform.getVersion().split('.')[0]);
	
	var _self = {};
	
	/** Get Authorization Property
	  * Condition AUTHORIZATION_UNKNOWN -> RequestAuthorization
	  * @return : AUTHORIZATION_AUTHORIZED or AUTHORIZATION_RESTRICTED */
	_self.getAuthorization = function(){
		var _auth = Ti.Contacts.getContactsAuthorization();
		if(_auth == Ti.Contacts.AUTHORIZATION_UNKNOWN){
			Ti.Contacts.requestAuthorization(function (){
				return 'AUTHORIZATION_AUTHORIZED';
			});
		}
		_auth = (_auth == Ti.Contacts.AUTHORIZATION_AUTHORIZED) ?
		         'AUTHORIZATION_AUTHORIZED' : 'AUTHORIZATION_RESTRICTED';
		return _auth;
	};
	
	/** Get Contact List 
	 *  @param : {String} optional parameter */
	_self.getContactList = function(parameter){
		var _list = new Array();
		var _people = (parameter) ? Ti.Contacts.getPeopleWithName(parameter) : Ti.Contacts.getAllPeople();
		var _i;
		for(_i = 0; _i < _people.length; _i++){
			var _person = _people[_i];
			_list.push({
				'address' : _person.getAddress(),
				'birthday' : _person.getBirthday(),
				'dates' : _person.getDate(),
				'emails' : _person.getEmail(),
				'im' : _person.getInstantMessage(),
				'image' : _person.getImage(),
				'name' : (_person.getMiddleName == '') ? _person.getFirstName() :
				         _person.getFirstName() + " " + _person.getMiddleName(),
				'surname' : _person.getLastName(),
				'nick' : _person.getNickName(),
				'notes' : _person.getNote(),
				'phones' : _person.getPhone(),
				'organization' : _person.getOrganization(),
				'websites' : _person.getUrl() 
			});
		}
		return _list;
	};
	
	/** Create Contact
	  *  @param : {Object} parameter 
	  *  @return: True or False */
	_self.createContact = function(parameter){
		if(_validateContact(parameter)){
			Ti.Contacts.createPerson(parameter);	
		}
		else{
			return false;
		}
	};

	/** Private Function to validate parameters 
	  * @param {Object} parameter
      * @return : True or False */
	var _validateContact = function _validateContact(parameter){
		if(typeof parameter['address'] != 'Object'){
			Ti.API.error('[Ti.API.Contact] Key Address should be Object');
			return false;
		}
		else if(typeof parameter['address'] != 'undefined'){
			if(!_validateMultiAddress(parameter['address'])){
				return false;
			}
		}
		if(_result && typeof parameter['birthday'] != 'String'){
			Ti.API.error('[Ti.API.Contact] Key Birthday should be String');
			return false;
		}
		else if(typeof parameter['birthday'] != 'undefined'){
			if(!_validateBirthday(['birthday'])){
				return false;
			}
		}
		return true;
	};
	
	/** Private Function to validate Birthday 
	  * @param {String} Birthday format ISO8601
      * @return : True or False */
	var _validateBirthday = function _validateBirthday(birthday){
		var _exprISO8601 = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
		return birthday.match(new RegExp(_exprISO8601)) != null;
	};
	
	/** Private Function to validate Multi Address Object 
	  * @param {Object} Address Object
      * @return : True or False */
	var _validateMultiAddress = function _validateMultiAddress(multiAddress){
		for(var i in multiAddress){
			if(typeof multiAddress[i] != 'Array'){
				Ti.API.error('[Ti.API.Contact] Key Address ('+i+') should be Array');
				return false;
			}
			else{
				parameter['address'][i].every(_validateSingleAddress);
			}
		}
		return true;
	};
	
	/** Private Function to validate Single Address Object 
	  * @param {Array} Address Array, {Object} Address Element
      * @return : True or False */
	var _validateSingleAddress = function _validateSingleAddress(element, index, array) {
		var _keys = {'Street' : '', 'City' : '', 'State' : '' , 'Country' : '', 'ZIP' : ''};
		if (_device == 'android'){
			_keys.CountryCode = '';
			_keys.County = '';
		}
		for(var key in element){
			if(!key in _keys){
				Ti.API.warn('[Ti.API.Contact] Key deleted. It is not compatible with createConcat function: '+ key);
				delete element[key];
			}
		}
		return true;
	};
	
	return _self;
	
})();