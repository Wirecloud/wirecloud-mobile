/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

/* FYI: http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.Filesystem */
var Filesystem = (function() {

    var CALL_FAILURE = "call failed: ";

    var self = {};

    var getFileDescriptor = function getFileDescriptor(funcName, path) {
        var tiFile = Ti.FileSystem.getFile(path);

        if (!tiFile.exists()) {
            var TiError = require('APIError');
            throw new TiError(funcName + ": File does not exists.");
        }

        return tiFile;
    };

    /** Check if the given path is a regular file.
     * @param {Object} path
     * @return {Boolean} */
    self.isFile = function isFile(path) {
        var fileDescriptor = getFileDescriptor.call(this, "isFile", path);
        return fileDescriptor.isFile();
    };

    /** Check if the given path is a directory.
     * @param {Object} path
     * @return {Boolean} */
    self.isDirectory = function isDirectory(path) {
        var fileDescriptor = getFileDescriptor.call(this, "isDirectory", path);
        return fileDescriptor.isDirectory();
    };

    return self;

}());

module.exports = Filesystem;