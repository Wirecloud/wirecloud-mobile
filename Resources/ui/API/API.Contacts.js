/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
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
				'date' : _person.getDate(),
				'email' : _person.getEmail(),
				'im' : _person.getInstantMessage(),
				'image' : _person.getImage(),
				'name' : (_person.getMiddleName == '') ? _person.getFirstName() :
				         _person.getFirstName() + " " + _person.getMiddleName(),
				'surname' : _person.getLastName(),
				'nick' : _person.getNickName(),
				'note' : _person.getNote(),
				'phone' : _person.getPhone(),
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
		parameter = _validateContact(parameter);
		Ti.Contacts.createPerson(parameter);
	};

	/** Private Function to validate parameters 
	  * @param {Object} parameter
      * @return : True or False */
	var _validateContact = function _validateContact(parameter){
		
		if(typeof parameter['address'] != 'undefined'){
			if(typeof parameter['address'] != 'Object'){
				parameter['address'] = '[WARN] Key address should be Object';
			}
			else{
				parameter['address'] = _validateMultiAddress(parameter['address']);
			}
		}
		
		if(typeof parameter['birthday'] != 'undefined'){
			if(typeof parameter['birthday'] != 'String'){
				parameter['birthday'] = '[WARN] Key birthday should be String';
			}
			else{
				if(!_validateSingleDate(parameter['birthday'])){
					parameter['birthday'] = '[WARN] Key birthday is not valid date or format';
				}
			}
		}
		
		if(typeof parameter['date'] != 'undefined'){
			if(typeof parameter['date'] != 'Object'){
				parameter['date'] = '[WARN] Key date should be Object';
			}
			else{
				parameter['date'] = _validateMultiDate(parameter['date']);
			}
		}
		
		if(typeof parameter['email'] != 'undefined'){
			if(typeof parameter['email'] != 'Object'){
				parameter['email'] = '[WARN] Key email should be Object';
			}
			else{
				parameter['email'] = _validateMultiValue(parameter['email'], 'email');
			}
		}
		
		if(typeof parameter['im'] != 'undefined'){
			if(typeof parameter['im'] != 'Object'){
				parameter['instantMessage'] = '[WARN] Key im should be Object';
			}
			else{
				parameter['instantMessage'] = _validateMultiIM(parameter['im']);
			}
			delete parameter['im'];
		}
		
		if(typeof parameter['name'] != 'undefined'){
			if(typeof parameter['name'] != 'String'){
				parameter['name'] = '[WARN] Key name should be String';
			}
			else{
				parameter['name'] = _validateName(parameter['name']);
			}
		}
		
		if(typeof parameter['surname'] != 'undefined'){
			if(typeof parameter['surname'] != 'String'){
				parameter['surname'] = '[WARN] Key surname should be String';
			}
		}
		
		if(typeof parameter['nick'] != 'undefined'){
			if(typeof parameter['nick'] != 'String'){
				parameter['nick'] = '[WARN] Key nick should be String';
			}
		}
		
		if(typeof parameter['note'] != 'undefined'){
			if(typeof parameter['note'] != 'String'){
				parameter['note'] = '[WARN] Key note should be String';
			}
		}
		
		if(typeof parameter['organization'] != 'undefined'){
			if(typeof parameter['organization'] != 'String'){
				parameter['organization'] = '[WARN] Key organization should be String';
			}
		}
		
		if(typeof parameter['phone'] != 'undefined'){
			if(typeof parameter['phone'] != 'Object'){
				parameter['phone'] = '[WARN] Key phone should be Object';
			}
			else{
				parameter['phone'] = _validatePhone(parameter['phone']);
			}
		}
		
		if(typeof parameter['website'] != 'undefined'){
			if(typeof parameter['website'] != 'Object'){
				parameter['website'] = '[WARN] Key website should be Object';
			}
			else{
				parameter['website'] = _validateMultiValue(parameter['website']);
			}
		}
		
		return parameter;
	};
	
	/** Private Function to validate single Date 
	  * @param {String} Date format ISO8601
      * @return : True or False */
	var _validateSingleDate = function _validateSingleDate(date){
		var _exprISO8601 = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
		if(date.match(new RegExp(_exprISO8601)) == null){
			return false;
		}
		else{
			return new Date(date).toDateString != 'Invalid Date';
		}
	};
	
	/** Private Function to validate Multi Date 
	  * @param {Object} Multi Date format ISO8601
      * @return : Object */
	var _validateMultiDate = function _validateMultiDate(multiDate){
		for(var i in multiDate){
			if(typeof multiDate[i] != 'Array'){
				multiDate[i] = '[WARN] Key birthday '+i+' should be Array';
			}
			else{
				for(var j = 0; j < multiDate[i].length; j++){
					if(!_validateSingleDate(multiDate[i][j])){
						multiDate[i] = '[WARN] Key birthday '+i+' have not valid date or format';
					}
				}
			}
		}
		return multiDate;
	};
	
	/** Private Function to validate multi value String 
	  * @param {Object} Generic Object with Array String {String} data type
      * @return : Object */
	var _validateMultiValue = function _validateMultiValue(multiValue, type){
		for(var i in multiValue){
			if(typeof multiValue[i] != 'Array'){
				multiValue[i] = '[WARN] Key '+type+' '+i+' should be Array';
			}
			else{
				for(var j = 0; j < multiValue[i].length; j++){
					if(typeof (multiValue[i][j]) != 'String'){
						multiValue[i] = '[WARN] Key '+type+' '+i+' have not valid '+type;
					}
				}
			}
		}
		return multiValue;
	};
	
	/** Private Function to validate Instant Messaging 
	  * @param {Object} Instant Messaging Array and IM
      * @return : Object */
	var _validateMultiIM = function _validateMultiIM(multiIm){
		for(var i in multiIm){
			if(typeof multiIm[i] != 'Array'){
				multiIm[i] = '[WARN] Key Instant Messaging '+i+' should be Array';
			}
			else{
				for(var j = 0; j < multiIm[i].length; j++){
					multiIm[i][j] = _validateSingleIM(multiIm[i][j]);
				}
			}
		}
		return multiIm;
	};
	
	/** Private Function to validate Single Instant Messaging 
	  * @param {Object} Instant Messaging (Service | Username)
      * @return : Same Object or Warning */
	var _validateSingleIM = function _validateSingleIM(singleIm){
		var _services = {'AIM' : '', 'Facebook' : '', 'GaduGadu' : '' , 
		             'GoogleTalk' : '', 'ICQ' : '', 'MSN' : '',
		             'QQ' : '', 'Skype' : '', 'Yahoo' : ''};
		var _keys = {'service' : '', 'username' : ''};
		if(typeof singleIm != 'Object'){
			return '[WARN] Key Instant Messaging '+i+' should be Array';
		}
		else{
			for(var key in singleIm){
				if(!key in _keys){
					return '[WARN] Key Instant Messaging '+key+' is not a valid key';
				}
				else if(key == 'service'){
					if(!singleIm[key] in _services){
						return '[WARN] Key Instant Messaging '+singleIm[key]+' is not a valid service'
					}
				}
				else if(key == 'username'){
					if(typeof singleIm[key] != 'String'){
						return '[WARN] Key Instant Messaging '+singleIm[key]+' is not a valid format of username'
					}
				}
			}
		}
		return singleIm;
	};
	
	/** Private Function to validate Multi Address Object 
	  * @param {Object} Address Object
      * @return : Object */
	var _validateMultiAddress = function _validateMultiAddress(multiAddress){
		for(var i in multiAddress){
			if(typeof multiAddress[i] != 'Array'){
				multiAddress = '[WARN] Key address +'i'+ should be Array';
				return false;
			}
			else{
				multiAddress['address'][i].every(_validateSingleAddress);
			}
		}
		return multiAddress;
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
				element[key] = '[WARN] Key address '+key+' is not a valid key';
			}
		}
		return true;
	};
	
	return _self;
		
})();