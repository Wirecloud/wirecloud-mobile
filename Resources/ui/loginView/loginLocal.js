
//Login Local Component Constructor

function loginLocal(credentials) {
	
	var _fileCredentials = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'credentials');
	
	var _self = {};
	
	_self.saveCredentials = function saveCredentials(credentials){
		
		var _c = convertCredentials(credentials);
		if (!_fileCredentials.exists()) _fileCredentials.write(_c + '\n', false);
		else _fileCredentials.write(_c + '\n', true);
		
	};
	
	_self.checkLoginSaved = function checkLoginSaved(credentials){
		
		if (!_fileCredentials.exists()) return false;
		else{
			var _textFile = _fileCredentials.read().toString().split('\n');
			for(var i in _textFile){
				if(_textFile[i] !== ''){
					var _loginArray = deConvertCredentials(_textFile[i]);
					if(_loginArray[0] === credentials[0] && _loginArray[1] === credentials[1]) return true;
				}
			}
		}
		return false;
		
	};
	
	_self.checkCredentials = function checkCredentials(credentials){
		
		var _c = convertCredentials(credentials);
		if (!_fileCredentials.exists()) return false;
		else{
			var _textFile = _fileCredentials.read().toString().split('\n');
			for(var i in _textFile){
				if(_textFile[i] === _c) return true;
			}
		}
		return false;
		
	};
	
	function convertCredentials(credentials){
		
		// Base64 Encode
		var _j_0 = Ti.Utils.base64encode(JSON.stringify(credentials));
		
		// PassPhrase
		var _pp = Ti.Utils.base64encode("wirecloud_passphrase_security");
		
		// Complex Base64
		_j_0 = Ti.Utils.base64encode(_j_0 + _pp + _j_0);
		
		return _j_0;
	
	};
	
	function deConvertCredentials(credentials){
		
		// Base64 Decode
		var _j_0 = Ti.Utils.base64decode(credentials);
		
		// PassPhrase
		var _pp = Ti.Utils.base64encode("wirecloud_passphrase_security");
		
		// Complex Base64
		_j_0 = Ti.Utils.base64decode(_j_0.split(_pp)[0]);
		
		return JSON.parse(_j_0);
	
	};

	return _self;

}

module.exports = loginLocal; 
