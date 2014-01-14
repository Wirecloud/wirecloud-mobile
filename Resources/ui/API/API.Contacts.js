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
			var _person = _people[i];
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
		if(_validateContact){
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
		var _result = true;
		if(typeof parameter['address'] != 'Object'){
			_result = false;
		}
		else if(typeof parameter['address'] != 'undefined'){
			_result = _validateMultiAddress(parameter['address']);
		}
	};
	
	/** Private Function to validate Multi Address Object 
	  * @param {Object} Address Object
      * @return : True or False */
	var _validateMultiAddress = function _validateMultiAddress(multiAddress){
		for(var i in multiAddress){
			if(typeof multiAddress[i] != 'Array'){
				return false;
			}
			else{
				if(!parameter['address'][i].every(_validateAddress)){
					return false;
				}
			}
		}
		return true;
	};
	
	/** Private Function to validate Single Address Object 
	  * @param {Object} Address Array
      * @return : True or False */
	var _validateSingleAddress = function _validateSingleAddress(element, index, array) {
		for(var i in element){
			if (i == 'CountryCode' && i == 'County' && _device == 'android'){
				return false;
			}
			else{}
		}
	};
	
	return _self;
	
})();