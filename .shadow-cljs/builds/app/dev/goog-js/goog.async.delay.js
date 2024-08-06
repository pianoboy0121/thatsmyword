["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/async/delay.js"],"~:js","goog.provide(\"goog.async.Delay\");\ngoog.require(\"goog.Disposable\");\ngoog.require(\"goog.Timer\");\ngoog.async.Delay = function(listener, opt_interval, opt_handler) {\n  goog.async.Delay.base(this, \"constructor\");\n  this.listener_ = listener;\n  this.interval_ = opt_interval || 0;\n  this.handler_ = opt_handler;\n  this.callback_ = goog.bind(this.doAction_, this);\n};\ngoog.inherits(goog.async.Delay, goog.Disposable);\ngoog.async.Delay.prototype.id_ = 0;\ngoog.async.Delay.prototype.disposeInternal = function() {\n  goog.async.Delay.base(this, \"disposeInternal\");\n  this.stop();\n  delete this.listener_;\n  delete this.handler_;\n};\ngoog.async.Delay.prototype.start = function(opt_interval) {\n  this.stop();\n  this.id_ = goog.Timer.callOnce(this.callback_, opt_interval !== undefined ? opt_interval : this.interval_);\n};\ngoog.async.Delay.prototype.startIfNotActive = function(opt_interval) {\n  if (!this.isActive()) {\n    this.start(opt_interval);\n  }\n};\ngoog.async.Delay.prototype.stop = function() {\n  if (this.isActive()) {\n    goog.Timer.clear(this.id_);\n  }\n  this.id_ = 0;\n};\ngoog.async.Delay.prototype.fire = function() {\n  this.stop();\n  this.doAction_();\n};\ngoog.async.Delay.prototype.fireIfActive = function() {\n  if (this.isActive()) {\n    this.fire();\n  }\n};\ngoog.async.Delay.prototype.isActive = function() {\n  return this.id_ != 0;\n};\ngoog.async.Delay.prototype.doAction_ = function() {\n  this.id_ = 0;\n  if (this.listener_) {\n    this.listener_.call(this.handler_);\n  }\n};\n","~:source","/**\n * @license\n * Copyright The Closure Library Authors.\n * SPDX-License-Identifier: Apache-2.0\n */\n\n/**\n * @fileoverview Defines a class useful for handling functions that must be\n * invoked after a delay, especially when that delay is frequently restarted.\n * Examples include delaying before displaying a tooltip, menu hysteresis,\n * idle timers, etc.\n * @see ../demos/timers.html\n */\n\n\ngoog.provide('goog.async.Delay');\n\ngoog.require('goog.Disposable');\ngoog.require('goog.Timer');\n\n\n\n/**\n * A Delay object invokes the associated function after a specified delay. The\n * interval duration can be specified once in the constructor, or can be defined\n * each time the delay is started. Calling start on an active delay will reset\n * the timer.\n *\n * @param {function(this:THIS)} listener Function to call when the\n *     delay completes.\n * @param {number=} opt_interval The default length of the invocation delay (in\n *     milliseconds).\n * @param {THIS=} opt_handler The object scope to invoke the function in.\n * @template THIS\n * @constructor\n * @struct\n * @extends {goog.Disposable}\n * @final\n */\ngoog.async.Delay = function(listener, opt_interval, opt_handler) {\n  'use strict';\n  goog.async.Delay.base(this, 'constructor');\n\n  /**\n   * The function that will be invoked after a delay.\n   * @private {function(this:THIS)}\n   */\n  this.listener_ = listener;\n\n  /**\n   * The default amount of time to delay before invoking the callback.\n   * @type {number}\n   * @private\n   */\n  this.interval_ = opt_interval || 0;\n\n  /**\n   * The object context to invoke the callback in.\n   * @type {Object|undefined}\n   * @private\n   */\n  this.handler_ = opt_handler;\n\n\n  /**\n   * Cached callback function invoked when the delay finishes.\n   * @type {Function}\n   * @private\n   */\n  this.callback_ = goog.bind(this.doAction_, this);\n};\ngoog.inherits(goog.async.Delay, goog.Disposable);\n\n\n/**\n * Identifier of the active delay timeout, or 0 when inactive.\n * @type {number}\n * @private\n */\ngoog.async.Delay.prototype.id_ = 0;\n\n\n/**\n * Disposes of the object, cancelling the timeout if it is still outstanding and\n * removing all object references.\n * @override\n * @protected\n */\ngoog.async.Delay.prototype.disposeInternal = function() {\n  'use strict';\n  goog.async.Delay.base(this, 'disposeInternal');\n  this.stop();\n  delete this.listener_;\n  delete this.handler_;\n};\n\n\n/**\n * Starts the delay timer. The provided listener function will be called after\n * the specified interval. Calling start on an active timer will reset the\n * delay interval.\n * @param {number=} opt_interval If specified, overrides the object's default\n *     interval with this one (in milliseconds).\n */\ngoog.async.Delay.prototype.start = function(opt_interval) {\n  'use strict';\n  this.stop();\n  this.id_ = goog.Timer.callOnce(\n      this.callback_,\n      opt_interval !== undefined ? opt_interval : this.interval_);\n};\n\n\n/**\n * Starts the delay timer if it's not already active.\n * @param {number=} opt_interval If specified and the timer is not already\n *     active, overrides the object's default interval with this one (in\n *     milliseconds).\n */\ngoog.async.Delay.prototype.startIfNotActive = function(opt_interval) {\n  'use strict';\n  if (!this.isActive()) {\n    this.start(opt_interval);\n  }\n};\n\n\n/**\n * Stops the delay timer if it is active. No action is taken if the timer is not\n * in use.\n */\ngoog.async.Delay.prototype.stop = function() {\n  'use strict';\n  if (this.isActive()) {\n    goog.Timer.clear(this.id_);\n  }\n  this.id_ = 0;\n};\n\n\n/**\n * Fires delay's action even if timer has already gone off or has not been\n * started yet; guarantees action firing. Stops the delay timer.\n */\ngoog.async.Delay.prototype.fire = function() {\n  'use strict';\n  this.stop();\n  this.doAction_();\n};\n\n\n/**\n * Fires delay's action only if timer is currently active. Stops the delay\n * timer.\n */\ngoog.async.Delay.prototype.fireIfActive = function() {\n  'use strict';\n  if (this.isActive()) {\n    this.fire();\n  }\n};\n\n\n/**\n * @return {boolean} True if the delay is currently active, false otherwise.\n */\ngoog.async.Delay.prototype.isActive = function() {\n  'use strict';\n  return this.id_ != 0;\n};\n\n\n/**\n * Invokes the callback function after the delay successfully completes.\n * @private\n */\ngoog.async.Delay.prototype.doAction_ = function() {\n  'use strict';\n  this.id_ = 0;\n  if (this.listener_) {\n    this.listener_.call(this.handler_);\n  }\n};\n","~:compiled-at",1722915042677,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.async.delay.js\",\n\"lineCount\":52,\n\"mappings\":\"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\",\n\"sources\":[\"goog/async/delay.js\"],\n\"sourcesContent\":[\"/**\\n * @license\\n * Copyright The Closure Library Authors.\\n * SPDX-License-Identifier: Apache-2.0\\n */\\n\\n/**\\n * @fileoverview Defines a class useful for handling functions that must be\\n * invoked after a delay, especially when that delay is frequently restarted.\\n * Examples include delaying before displaying a tooltip, menu hysteresis,\\n * idle timers, etc.\\n * @see ../demos/timers.html\\n */\\n\\n\\ngoog.provide('goog.async.Delay');\\n\\ngoog.require('goog.Disposable');\\ngoog.require('goog.Timer');\\n\\n\\n\\n/**\\n * A Delay object invokes the associated function after a specified delay. The\\n * interval duration can be specified once in the constructor, or can be defined\\n * each time the delay is started. Calling start on an active delay will reset\\n * the timer.\\n *\\n * @param {function(this:THIS)} listener Function to call when the\\n *     delay completes.\\n * @param {number=} opt_interval The default length of the invocation delay (in\\n *     milliseconds).\\n * @param {THIS=} opt_handler The object scope to invoke the function in.\\n * @template THIS\\n * @constructor\\n * @struct\\n * @extends {goog.Disposable}\\n * @final\\n */\\ngoog.async.Delay = function(listener, opt_interval, opt_handler) {\\n  'use strict';\\n  goog.async.Delay.base(this, 'constructor');\\n\\n  /**\\n   * The function that will be invoked after a delay.\\n   * @private {function(this:THIS)}\\n   */\\n  this.listener_ = listener;\\n\\n  /**\\n   * The default amount of time to delay before invoking the callback.\\n   * @type {number}\\n   * @private\\n   */\\n  this.interval_ = opt_interval || 0;\\n\\n  /**\\n   * The object context to invoke the callback in.\\n   * @type {Object|undefined}\\n   * @private\\n   */\\n  this.handler_ = opt_handler;\\n\\n\\n  /**\\n   * Cached callback function invoked when the delay finishes.\\n   * @type {Function}\\n   * @private\\n   */\\n  this.callback_ = goog.bind(this.doAction_, this);\\n};\\ngoog.inherits(goog.async.Delay, goog.Disposable);\\n\\n\\n/**\\n * Identifier of the active delay timeout, or 0 when inactive.\\n * @type {number}\\n * @private\\n */\\ngoog.async.Delay.prototype.id_ = 0;\\n\\n\\n/**\\n * Disposes of the object, cancelling the timeout if it is still outstanding and\\n * removing all object references.\\n * @override\\n * @protected\\n */\\ngoog.async.Delay.prototype.disposeInternal = function() {\\n  'use strict';\\n  goog.async.Delay.base(this, 'disposeInternal');\\n  this.stop();\\n  delete this.listener_;\\n  delete this.handler_;\\n};\\n\\n\\n/**\\n * Starts the delay timer. The provided listener function will be called after\\n * the specified interval. Calling start on an active timer will reset the\\n * delay interval.\\n * @param {number=} opt_interval If specified, overrides the object's default\\n *     interval with this one (in milliseconds).\\n */\\ngoog.async.Delay.prototype.start = function(opt_interval) {\\n  'use strict';\\n  this.stop();\\n  this.id_ = goog.Timer.callOnce(\\n      this.callback_,\\n      opt_interval !== undefined ? opt_interval : this.interval_);\\n};\\n\\n\\n/**\\n * Starts the delay timer if it's not already active.\\n * @param {number=} opt_interval If specified and the timer is not already\\n *     active, overrides the object's default interval with this one (in\\n *     milliseconds).\\n */\\ngoog.async.Delay.prototype.startIfNotActive = function(opt_interval) {\\n  'use strict';\\n  if (!this.isActive()) {\\n    this.start(opt_interval);\\n  }\\n};\\n\\n\\n/**\\n * Stops the delay timer if it is active. No action is taken if the timer is not\\n * in use.\\n */\\ngoog.async.Delay.prototype.stop = function() {\\n  'use strict';\\n  if (this.isActive()) {\\n    goog.Timer.clear(this.id_);\\n  }\\n  this.id_ = 0;\\n};\\n\\n\\n/**\\n * Fires delay's action even if timer has already gone off or has not been\\n * started yet; guarantees action firing. Stops the delay timer.\\n */\\ngoog.async.Delay.prototype.fire = function() {\\n  'use strict';\\n  this.stop();\\n  this.doAction_();\\n};\\n\\n\\n/**\\n * Fires delay's action only if timer is currently active. Stops the delay\\n * timer.\\n */\\ngoog.async.Delay.prototype.fireIfActive = function() {\\n  'use strict';\\n  if (this.isActive()) {\\n    this.fire();\\n  }\\n};\\n\\n\\n/**\\n * @return {boolean} True if the delay is currently active, false otherwise.\\n */\\ngoog.async.Delay.prototype.isActive = function() {\\n  'use strict';\\n  return this.id_ != 0;\\n};\\n\\n\\n/**\\n * Invokes the callback function after the delay successfully completes.\\n * @private\\n */\\ngoog.async.Delay.prototype.doAction_ = function() {\\n  'use strict';\\n  this.id_ = 0;\\n  if (this.listener_) {\\n    this.listener_.call(this.handler_);\\n  }\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"async\",\"Delay\",\"goog.async.Delay\",\"listener\",\"opt_interval\",\"opt_handler\",\"base\",\"listener_\",\"interval_\",\"handler_\",\"callback_\",\"bind\",\"doAction_\",\"inherits\",\"Disposable\",\"prototype\",\"id_\",\"disposeInternal\",\"goog.async.Delay.prototype.disposeInternal\",\"stop\",\"start\",\"goog.async.Delay.prototype.start\",\"Timer\",\"callOnce\",\"undefined\",\"startIfNotActive\",\"goog.async.Delay.prototype.startIfNotActive\",\"isActive\",\"goog.async.Delay.prototype.stop\",\"clear\",\"fire\",\"goog.async.Delay.prototype.fire\",\"fireIfActive\",\"goog.async.Delay.prototype.fireIfActive\",\"goog.async.Delay.prototype.isActive\",\"goog.async.Delay.prototype.doAction_\",\"call\"]\n}\n"]