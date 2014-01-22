/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 *   getAuthorization
 *      Request authorization if permission is AUTHORIZATION_UNKNOWN
 *      Return [AUTHORIZATION_AUTHORIZED | AUTHORIZATION_RESTRICTED]
 *
 *   getContactList
 *      Optional Search with parameter (name, middlename, lastname or combination)
 *      Return Contact Array
 *
 *   createContact
 *      Parameters of Contact
 *         address:  {Object}
 *                   keys = home, work or other
 *                   values = {Object Array}
 *                           keys = CountryCode, Street, City, County, State, Country, ZIP
 *                           values = {String}
 *         birthday: {String} Date Format ISO8601 (2013-09-23T22:03:46.000+0000)
 *         date:     {Object}
 *                   keys = anniversary or other
 *                   values = {String Array} Date Format ISO8601
 *         email:    {Object}
 *                   keys = home, work or other
 *                   values = {String Array}
 *         im:       {Object}
 *                   keys = home, work or other
 *                   values = {Object Array}
 *                           keys = service, username
 *                           - service = AIM, Facebook, GaduGadu, GoogleTalk, ICQ, MSN, QQ, Skype or Yahoo
 *                           - username = {String}
 *         image:    {String} Base64 Representation of Ti.Blob
 *         name:     {String} Concatenation of firstname and middlename
 *         surname:  {String} Representation of lastname
 *         nick:     {String} Representation of nickname
 *         note:     {String}
 *         phone:    {Object}
 *                   keys = home, work, other, mobile, pager, workFax, homeFax or main
 *                   values = {String}
 *         organization = {String}
 *         website:  {Object}
 *                   keys = homepage, home, work or other
 *                   values = {String Array}
 *      Return Contact Object
 *
 *   deleteContact
 *      Search with parameter (name, middlename, lastname or combination)
 *      Return status code [0 = Success, 1 = Not Found, 2 = Multiple Contacts Found]
 *
 *   saveChanges
 *
 *   revertChanges
 *
 */

"use strict";

var Contacts = function() {

    var _device = (Ti.Platform.getOsname() === 'ipad' ||
                   Ti.Platform.getOsname() === 'iphone') ? 'ios' : 'android',
    _version = parseInt(Ti.Platform.getVersion().split('.')[0], 10),
    _self = {};

    /** Get Authorization Property
      * Condition AUTHORIZATION_UNKNOWN -> RequestAuthorization
      * @return : AUTHORIZATION_AUTHORIZED or AUTHORIZATION_RESTRICTED */
    _self.getAuthorization = function() {
        var auth = Ti.Contacts.getContactsAuthorization();
        if(auth === Ti.Contacts.AUTHORIZATION_UNKNOWN){
            Ti.Contacts.requestAuthorization(function (){
                return 'AUTHORIZATION_AUTHORIZED';
            });
        }
        auth = (auth === Ti.Contacts.AUTHORIZATION_AUTHORIZED) ?
                 'AUTHORIZATION_AUTHORIZED' : 'AUTHORIZATION_RESTRICTED';
        return auth;
    };

    /** Get Contact List
     *  @param : {String} optional parameter */
    _self.getContactList = function(parameter) {
        var list = [], i, person,
        people = (parameter) ? Ti.Contacts.getPeopleWithName(parameter) : Ti.Contacts.getAllPeople();
        for(i = 0; i < people.length; i++){
            person = people[i];
            list.push({
                'address' : person.getAddress(),
                'birthday' : person.getBirthday(),
                'date' : person.getDate(),
                'email' : person.getEmail(),
                'im' : person.getInstantMessage(),
                'image' : Ti.Utils.base64encode(person.getImage().read()).toString(),
                'name' : (person.getMiddleName === '') ? person.getFirstName() :
                         person.getFirstName() + " " + person.getMiddleName(),
                'surname' : person.getLastName(),
                'nick' : person.getNickName(),
                'note' : person.getNote(),
                'phone' : person.getPhone(),
                'organization' : person.getOrganization(),
                'website' : person.getUrl()
            });
        }
        return list;
    };

    /** Private Function to validate Name
      * @param {String} Name with/without MiddleName
      * @return : Object ['firstname', 'middlename'] */
    var _validateName = function _validateName(name) {
        var firstname = name, middlename = '', param, i;
        if(name.indexOf(' ') > 0) {
            param = name.split(' ');
            firstname = param[0];
            for(i = 1; i < param.length; i++){
                middlename = middlename + ' ' + param[i];
            }
        }
        return {
            'firstname' : firstname,
            'middlename' : middlename
        };
    };

    /** Private Function to validate single Date
      * @param {String} Date format ISO8601
      * @return : True or False */
    var _validateSingleDate = function _validateSingleDate(date){
        var _exprISO8601 = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?", result;
        if(date.match(new RegExp(_exprISO8601)) === null){
            result = false;
        }
        else{
            result = new Date(date).toDateString !== 'Invalid Date';
        }
        return result;
    };

    /** Private Function to validate Multi Date
      * @param {Object} Multi Date format ISO8601
      * @return : Object */
    var _validateMultiDate = function _validateMultiDate(multiDate) {
        var keys = {'anniversary' : '', 'other' : ''}, key, i;
        for(key in multiDate){
            if(!keys.hasOwnProperty(key)){
                multiDate.key = '[WARN] Key birthday '+key+' is not a valid key';
                multiDate.validate = false;
            }
            else if(Array.isArray(multiDate.key) !== false){
                multiDate.key = '[WARN] Key birthday '+key+' should be Array';
                multiDate.validate = false;
            }
            else{
                for(i = 0; i < multiDate.key.length; i++){
                    if(!_validateSingleDate(multiDate.key[i])){
                        multiDate.key = '[WARN] Key birthday '+key+' have not valid date or format';
                        multiDate.validate = false;
                        break;
                    }
                }
            }
        }
        return multiDate;
    };

    /** Private Function to validate multi value String
      * @param {Object} Generic Object with Array String {String} data type
      * @return : Object */
    var _validateMultiValue = function _validateMultiValue(multiValue, type) {
        var keys = {'home' : '', 'work' : '', 'other' : ''}, key, i;
        if(type === 'website'){
            keys.homepage = '';
        }
        else if(type === 'phone'){
            keys = {'home' : '', 'work' : '', 'other' : '' ,
            'mobile' : '', 'pager' : '', 'workFax' : '',
            'homeFax' : '', 'main' : ''};
            if(_device === 'ios'){
                keys.iphone = '';
            }
        }
        for(key in multiValue){
            if(!keys.hasOwnProperty(key)){
                multiValue.key = '[WARN] Key '+type+' '+key+' is not a valid key';
                multiValue.validate = false;
            }
            else if(Array.isArray(multiValue.key) !== false){
                multiValue.key = '[WARN] Key '+type+' '+key+' should be Array';
                multiValue.validate = false;
            }
            else{
                for(i = 0; i < multiValue.key.length; i++){
                    if(typeof (multiValue.key[i]) !== 'string'){
                        multiValue.key = '[WARN] Key '+type+' '+key+' have not valid '+type;
                        multiValue.validate = false;
                        break;
                    }
                }
            }
        }
        return multiValue;
    };

    /** Private Function to validate Single Instant Messaging
      * @param {Object} Instant Messaging (Service | Username)
      * @return : Same Object or Warning */
    var _validateSingleIM = function _validateSingleIM(singleIm){
        var services = {'AIM' : '', 'Facebook' : '', 'GaduGadu' : '' ,
                     'GoogleTalk' : '', 'ICQ' : '', 'MSN' : '',
                     'QQ' : '', 'Skype' : '', 'Yahoo' : ''}, key,
        keys = {'service' : '', 'username' : ''};
        for(key in singleIm){
            if(!keys.hasOwnProperty(key)){
                singleIm.key = '[WARN] Key Instant Messaging '+key+' is not a valid key';
                singleIm.validate = false;
            }
            else if(key === 'service'){
                if(!services.hasOwnProperty(singleIm.key)){
                    singleIm.key = '[WARN] Key Instant Messaging '+singleIm.key+' is not a valid service';
                    singleIm.validate = false;
                }
            }
            else if(key === 'username'){
                if(typeof singleIm.key !== 'string'){
                    singleIm.key = '[WARN] Key Instant Messaging '+singleIm.key+' is not a valid format of username';
                    singleIm.validate = false;
                }
            }
        }
        return singleIm;
    };

    /** Private Function to validate Instant Messaging
      * @param {Object} Instant Messaging Array and IM
      * @return : Object */
    var _validateMultiIM = function _validateMultiIM(multiIm) {
        var keys = {'home' : '', 'work' : '', 'other' : ''}, key, i;
        for(key in multiIm){
            if(!keys.hasOwnProperty(key)){
                multiIm.key = '[WARN] Key Instant Messaging '+key+' is not a valid key';
                multiIm.validate = false;
            }
            else if(Array.isArray(multiIm.key) !== false){
                multiIm.key = '[WARN] Key Instant Messaging '+key+' should be Array';
                multiIm.validate = false;
            }
            else{
                for(i = 0; i < multiIm.key.length; i++){
                    if(typeof multiIm.key[i] !== 'object'){
                        multiIm.key[i] = '[WARN] Key Instant Messaging '+key+' should be Object';
                    }
                    else{
                        multiIm.key[i] = _validateSingleIM(multiIm.key[i]);
                        if(multiIm.key[i].hasOwnProperty('validate')){
                            delete multiIm.key[i].validate;
                            multiIm.validate = false;
                        }
                    }
                }
            }
        }
        return multiIm;
    };

    /** Private Function to validate Single Address Object
      * @param {Array} Address Array, {Object} Address Element
      * @return : True or False */
    var _validateSingleAddress = function _validateSingleAddress(element, index, array) {
        var keys = {'Street' : '', 'City' : '', 'State' : '' , 'Country' : '', 'ZIP' : ''}, key;
        if (_device === 'android'){
            keys.CountryCode = '';
            keys.County = '';
        }
        for(key in element){
            if(!keys.hasOwnProperty(key)){
                element.key = '[WARN] Key address '+key+' is not a valid key';
                element.validate = false;
            }
        }
        return true;
    };

    /** Private Function to validate Multi Address Object
      * @param {Object} Address Object
      * @return : Object */
    var _validateMultiAddress = function _validateMultiAddress(multiAddress) {
        var key;
        for(key in multiAddress){
            if(Array.isArray(multiAddress.key) !== false){
                multiAddress.key = '[WARN] Key address '+key+' should be Array';
                multiAddress.validate = false;
            }
            else{
                multiAddress.address.key.every(_validateSingleAddress);
            }
        }
        return multiAddress;
    };

    /** Private Function to validate parameters
      * @param {Object} parameter
      * @return : Contact Object with validate property */
    var validateContact = function validateContact(parameter) {
        var keys = {'address' : '', 'birthday' : '', 'date' : '',
        'email' : '' , 'im': '', 'image' : '', 'name' : '',
        'surname' : '', 'nick' : '', 'note' : '', 'phone' : '',
        'organization' : '', 'website' : ''}, key;
        for(key in parameter){
            if(!keys.hasOwnProperty(key)){
                parameter.key = '[WARN] Key '+key+' is not valid';
                parameter.validate = false;
            }
            else if((key === 'address' || key === 'date' || key === 'date' ||
            key === 'email' || key === 'im' || key === 'phone' ||
            key === 'website') && typeof key !== 'object'){
                parameter.key = '[WARN] Key '+key+' should be Object';
                parameter.validate = false;
            }
            else if((key === 'birthdate' || key === 'image' || key === 'name' ||
            key === 'surname' || key === 'nick' || key === 'note' ||
            key === 'organization') && typeof key !== 'string'){
                parameter.key = '[WARN] Key '+key+' should be String';
                parameter.validate = false;
            }
            else if(key === 'address'){
                parameter.address = _validateMultiAddress(parameter.address);
                if(parameter.address.validate === false){
                    delete parameter.address.validate;
                    parameter.validate = false;
                }
            }
            else if(key === 'birthday'){
                if(!_validateSingleDate(parameter.birthday)){
                    parameter.birthday = '[WARN] Key birthday is not valid date or format';
                    parameter.validate = false;
                }
            }
            else if(key === 'date'){
                parameter.date = _validateMultiDate(parameter.date);
                if(parameter.date.validate === false){
                    delete parameter.date.validate;
                    parameter.validate = false;
                }
            }
            else if(key === 'email'){
                parameter.email = _validateMultiValue(parameter.email, 'email');
                if(parameter.email.validate === false){
                    delete parameter.email.validate;
                    parameter.validate = false;
                }
            }
            else if(key === 'im'){
                parameter.instantMessage = _validateMultiIM(parameter.im);
                if(parameter.instantMessage.validate === false){
                    delete parameter.instantMessage.validate;
                    parameter.validate = false;
                }
                delete parameter.im;
            }
            else if(key === 'image'){
                parameter.image = Ti.Utils.base64decode(parameter.image);
            }
            else if(key === 'name'){
                var _objectName = _validateName(parameter.name);
                parameter.firstname = _objectName.firstname;
                parameter.middlename = _objectName.middlename;
                delete parameter.name;
            }
            else if(key === 'surname'){
                parameter.lastname = parameter.surname;
                delete parameter.surname;
            }
            else if(key === 'nick'){
                parameter.nickname = parameter.nick;
                delete parameter.nick;
            }
            else if(key === 'phone'){
                parameter.phone = _validateMultiValue(parameter.phone, 'phone');
                if(parameter.phone.validate === false){
                    delete parameter.phone.validate;
                    parameter.validate = false;
                }
            }
            else if(key === 'website'){
                parameter.url = _validateMultiValue(parameter.website, 'website');
                if(parameter.url.validate === false){
                    delete parameter.url.validate;
                    parameter.validate = false;
                }
                delete parameter.website;
            }
        }
        return parameter;
    };

    /** Create Contact
      *  @param: {Object} parameter with contact info
      *  @return : Object Contact */
    _self.createContact = function(parameter) {
        parameter = validateContact(parameter);
        if(parameter.validate !== false){
            delete parameter.validate;
            Ti.Contacts.createPerson(parameter);
        }
        return parameter;
    };

    /** Save Changes */
    _self.saveChanges = function() {
        Ti.Contacts.save();
    };

    /** Revert Changes from last save */
    _self.revertChanges = function() {
        Ti.Contacts.revert();
    };

    /** Delete Contact
     *  @param: {String} Name, MiddleName, LastName or a combination
     *  @return: 0 (Success) , 1 (Not found) , 2 (Multiple Contact) */
    _self.deleteContact = function(parameter) {
        var list = _self.getContactList(parameter);
        var result;
        if(list.length === 0){
            result = 1;
        }
        else if(list.length === 1){
            Ti.Contacts.removePerson(list[0]);
            result = 0;
        }
        else{
            result = list.length;
        }
        return result;
    };

    return _self;

}();

module.exports = Contacts;