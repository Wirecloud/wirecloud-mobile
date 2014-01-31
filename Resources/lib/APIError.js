/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var TiError = function TiError (msg) {
    this.name = "TiError";
    this.message = msg;
};

TiError.prototype = new Error();

module.exports = TiError;