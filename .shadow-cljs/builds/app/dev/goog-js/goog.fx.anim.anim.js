["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/fx/anim/anim.js"],"~:js","goog.provide(\"goog.fx.anim\");\ngoog.provide(\"goog.fx.anim.Animated\");\ngoog.require(\"goog.async.AnimationDelay\");\ngoog.require(\"goog.async.Delay\");\ngoog.require(\"goog.dispose\");\ngoog.require(\"goog.object\");\ngoog.fx.anim.Animated = function() {\n};\ngoog.fx.anim.Animated.prototype.onAnimationFrame;\ngoog.fx.anim.TIMEOUT = goog.async.AnimationDelay.TIMEOUT;\ngoog.fx.anim.activeAnimations_ = {};\ngoog.fx.anim.animationWindow_ = null;\ngoog.fx.anim.animationDelay_ = null;\ngoog.fx.anim.registerAnimation = function(animation) {\n  var uid = goog.getUid(animation);\n  if (!(uid in goog.fx.anim.activeAnimations_)) {\n    goog.fx.anim.activeAnimations_[uid] = animation;\n  }\n  goog.fx.anim.requestAnimationFrame_();\n};\ngoog.fx.anim.unregisterAnimation = function(animation) {\n  var uid = goog.getUid(animation);\n  delete goog.fx.anim.activeAnimations_[uid];\n  if (goog.object.isEmpty(goog.fx.anim.activeAnimations_)) {\n    goog.fx.anim.cancelAnimationFrame_();\n  }\n};\ngoog.fx.anim.tearDown = function() {\n  goog.fx.anim.animationWindow_ = null;\n  goog.dispose(goog.fx.anim.animationDelay_);\n  goog.fx.anim.animationDelay_ = null;\n  goog.fx.anim.activeAnimations_ = {};\n};\ngoog.fx.anim.setAnimationWindow = function(animationWindow) {\n  var hasTimer = goog.fx.anim.animationDelay_ && goog.fx.anim.animationDelay_.isActive();\n  goog.dispose(goog.fx.anim.animationDelay_);\n  goog.fx.anim.animationDelay_ = null;\n  goog.fx.anim.animationWindow_ = animationWindow;\n  if (hasTimer) {\n    goog.fx.anim.requestAnimationFrame_();\n  }\n};\ngoog.fx.anim.requestAnimationFrame_ = function() {\n  if (!goog.fx.anim.animationDelay_) {\n    if (goog.fx.anim.animationWindow_) {\n      goog.fx.anim.animationDelay_ = new goog.async.AnimationDelay(function(now) {\n        goog.fx.anim.cycleAnimations_(now);\n      }, goog.fx.anim.animationWindow_);\n    } else {\n      goog.fx.anim.animationDelay_ = new goog.async.Delay(function() {\n        goog.fx.anim.cycleAnimations_(goog.now());\n      }, goog.fx.anim.TIMEOUT);\n    }\n  }\n  var delay = goog.fx.anim.animationDelay_;\n  if (!delay.isActive()) {\n    delay.start();\n  }\n};\ngoog.fx.anim.cancelAnimationFrame_ = function() {\n  if (goog.fx.anim.animationDelay_) {\n    goog.fx.anim.animationDelay_.stop();\n  }\n};\ngoog.fx.anim.cycleAnimations_ = function(now) {\n  goog.object.forEach(goog.fx.anim.activeAnimations_, function(anim) {\n    anim.onAnimationFrame(now);\n  });\n  if (!goog.object.isEmpty(goog.fx.anim.activeAnimations_)) {\n    goog.fx.anim.requestAnimationFrame_();\n  }\n};\n","~:source","/**\n * @license\n * Copyright The Closure Library Authors.\n * SPDX-License-Identifier: Apache-2.0\n */\n\n/**\n * @fileoverview Basic animation controls.\n */\ngoog.provide('goog.fx.anim');\ngoog.provide('goog.fx.anim.Animated');\n\ngoog.require('goog.async.AnimationDelay');\ngoog.require('goog.async.Delay');\ngoog.require('goog.dispose');\ngoog.require('goog.object');\n\n\n\n/**\n * An interface for programatically animated objects. I.e. rendered in\n * javascript frame by frame.\n *\n * @interface\n */\ngoog.fx.anim.Animated = function() {};\n\n\n/**\n * Function called when a frame is requested for the animation.\n *\n * @param {number} now Current time in milliseconds.\n */\ngoog.fx.anim.Animated.prototype.onAnimationFrame;\n\n\n/**\n * Default wait timeout for animations (in milliseconds).  Only used for timed\n * animation, which uses a timer (setTimeout) to schedule animation.\n *\n * @type {number}\n * @const\n */\ngoog.fx.anim.TIMEOUT = goog.async.AnimationDelay.TIMEOUT;\n\n\n/**\n * A map of animations which should be cycled on the global timer.\n *\n * @type {!Object<number, goog.fx.anim.Animated>}\n * @private\n */\ngoog.fx.anim.activeAnimations_ = {};\n\n\n/**\n * An optional animation window.\n * @type {?Window}\n * @private\n */\ngoog.fx.anim.animationWindow_ = null;\n\n\n/**\n * An interval ID for the global timer or event handler uid.\n * @type {?goog.async.Delay|?goog.async.AnimationDelay}\n * @private\n */\ngoog.fx.anim.animationDelay_ = null;\n\n\n/**\n * Registers an animation to be cycled on the global timer.\n * @param {goog.fx.anim.Animated} animation The animation to register.\n */\ngoog.fx.anim.registerAnimation = function(animation) {\n  'use strict';\n  var uid = goog.getUid(animation);\n  if (!(uid in goog.fx.anim.activeAnimations_)) {\n    goog.fx.anim.activeAnimations_[uid] = animation;\n  }\n\n  // If the timer is not already started, start it now.\n  goog.fx.anim.requestAnimationFrame_();\n};\n\n\n/**\n * Removes an animation from the list of animations which are cycled on the\n * global timer.\n * @param {goog.fx.anim.Animated} animation The animation to unregister.\n */\ngoog.fx.anim.unregisterAnimation = function(animation) {\n  'use strict';\n  var uid = goog.getUid(animation);\n  delete goog.fx.anim.activeAnimations_[uid];\n\n  // If a timer is running and we no longer have any active timers we stop the\n  // timers.\n  if (goog.object.isEmpty(goog.fx.anim.activeAnimations_)) {\n    goog.fx.anim.cancelAnimationFrame_();\n  }\n};\n\n\n/**\n * Tears down this module. Useful for testing.\n */\n// TODO(nicksantos): Wow, this api is pretty broken. This should be fixed.\ngoog.fx.anim.tearDown = function() {\n  'use strict';\n  goog.fx.anim.animationWindow_ = null;\n  goog.dispose(goog.fx.anim.animationDelay_);\n  goog.fx.anim.animationDelay_ = null;\n  goog.fx.anim.activeAnimations_ = {};\n};\n\n\n/**\n * Registers an animation window. This allows usage of the timing control API\n * for animations. Note that this window must be visible, as non-visible\n * windows can potentially stop animating. This window does not necessarily\n * need to be the window inside which animation occurs, but must remain visible.\n * See: https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame.\n *\n * @param {Window} animationWindow The window in which to animate elements.\n */\ngoog.fx.anim.setAnimationWindow = function(animationWindow) {\n  'use strict';\n  // If a timer is currently running, reset it and restart with new functions\n  // after a timeout. This is to avoid mismatching timer UIDs if we change the\n  // animation window during a running animation.\n  //\n  // In practice this cannot happen before some animation window and timer\n  // control functions has already been set.\n  var hasTimer =\n      goog.fx.anim.animationDelay_ && goog.fx.anim.animationDelay_.isActive();\n\n  goog.dispose(goog.fx.anim.animationDelay_);\n  goog.fx.anim.animationDelay_ = null;\n  goog.fx.anim.animationWindow_ = animationWindow;\n\n  // If the timer was running, start it again.\n  if (hasTimer) {\n    goog.fx.anim.requestAnimationFrame_();\n  }\n};\n\n\n/**\n * Requests an animation frame based on the requestAnimationFrame and\n * cancelRequestAnimationFrame function pair.\n * @private\n */\ngoog.fx.anim.requestAnimationFrame_ = function() {\n  'use strict';\n  if (!goog.fx.anim.animationDelay_) {\n    // We cannot guarantee that the global window will be one that fires\n    // requestAnimationFrame events (consider off-screen chrome extension\n    // windows). Default to use goog.async.Delay, unless\n    // the client has explicitly set an animation window.\n    if (goog.fx.anim.animationWindow_) {\n      // requestAnimationFrame will call cycleAnimations_ with the current\n      // time in ms, as returned from goog.now().\n      goog.fx.anim.animationDelay_ =\n          new goog.async.AnimationDelay(function(now) {\n            'use strict';\n            goog.fx.anim.cycleAnimations_(now);\n          }, goog.fx.anim.animationWindow_);\n    } else {\n      goog.fx.anim.animationDelay_ = new goog.async.Delay(function() {\n        'use strict';\n        goog.fx.anim.cycleAnimations_(goog.now());\n      }, goog.fx.anim.TIMEOUT);\n    }\n  }\n\n  var delay = goog.fx.anim.animationDelay_;\n  if (!delay.isActive()) {\n    delay.start();\n  }\n};\n\n\n/**\n * Cancels an animation frame created by requestAnimationFrame_().\n * @private\n */\ngoog.fx.anim.cancelAnimationFrame_ = function() {\n  'use strict';\n  if (goog.fx.anim.animationDelay_) {\n    goog.fx.anim.animationDelay_.stop();\n  }\n};\n\n\n/**\n * Cycles through all registered animations.\n * @param {number} now Current time in milliseconds.\n * @private\n */\ngoog.fx.anim.cycleAnimations_ = function(now) {\n  'use strict';\n  goog.object.forEach(goog.fx.anim.activeAnimations_, function(anim) {\n    'use strict';\n    anim.onAnimationFrame(now);\n  });\n\n  if (!goog.object.isEmpty(goog.fx.anim.activeAnimations_)) {\n    goog.fx.anim.requestAnimationFrame_();\n  }\n};\n","~:compiled-at",1722915042678,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.fx.anim.anim.js\",\n\"lineCount\":73,\n\"mappings\":\"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\",\n\"sources\":[\"goog/fx/anim/anim.js\"],\n\"sourcesContent\":[\"/**\\n * @license\\n * Copyright The Closure Library Authors.\\n * SPDX-License-Identifier: Apache-2.0\\n */\\n\\n/**\\n * @fileoverview Basic animation controls.\\n */\\ngoog.provide('goog.fx.anim');\\ngoog.provide('goog.fx.anim.Animated');\\n\\ngoog.require('goog.async.AnimationDelay');\\ngoog.require('goog.async.Delay');\\ngoog.require('goog.dispose');\\ngoog.require('goog.object');\\n\\n\\n\\n/**\\n * An interface for programatically animated objects. I.e. rendered in\\n * javascript frame by frame.\\n *\\n * @interface\\n */\\ngoog.fx.anim.Animated = function() {};\\n\\n\\n/**\\n * Function called when a frame is requested for the animation.\\n *\\n * @param {number} now Current time in milliseconds.\\n */\\ngoog.fx.anim.Animated.prototype.onAnimationFrame;\\n\\n\\n/**\\n * Default wait timeout for animations (in milliseconds).  Only used for timed\\n * animation, which uses a timer (setTimeout) to schedule animation.\\n *\\n * @type {number}\\n * @const\\n */\\ngoog.fx.anim.TIMEOUT = goog.async.AnimationDelay.TIMEOUT;\\n\\n\\n/**\\n * A map of animations which should be cycled on the global timer.\\n *\\n * @type {!Object<number, goog.fx.anim.Animated>}\\n * @private\\n */\\ngoog.fx.anim.activeAnimations_ = {};\\n\\n\\n/**\\n * An optional animation window.\\n * @type {?Window}\\n * @private\\n */\\ngoog.fx.anim.animationWindow_ = null;\\n\\n\\n/**\\n * An interval ID for the global timer or event handler uid.\\n * @type {?goog.async.Delay|?goog.async.AnimationDelay}\\n * @private\\n */\\ngoog.fx.anim.animationDelay_ = null;\\n\\n\\n/**\\n * Registers an animation to be cycled on the global timer.\\n * @param {goog.fx.anim.Animated} animation The animation to register.\\n */\\ngoog.fx.anim.registerAnimation = function(animation) {\\n  'use strict';\\n  var uid = goog.getUid(animation);\\n  if (!(uid in goog.fx.anim.activeAnimations_)) {\\n    goog.fx.anim.activeAnimations_[uid] = animation;\\n  }\\n\\n  // If the timer is not already started, start it now.\\n  goog.fx.anim.requestAnimationFrame_();\\n};\\n\\n\\n/**\\n * Removes an animation from the list of animations which are cycled on the\\n * global timer.\\n * @param {goog.fx.anim.Animated} animation The animation to unregister.\\n */\\ngoog.fx.anim.unregisterAnimation = function(animation) {\\n  'use strict';\\n  var uid = goog.getUid(animation);\\n  delete goog.fx.anim.activeAnimations_[uid];\\n\\n  // If a timer is running and we no longer have any active timers we stop the\\n  // timers.\\n  if (goog.object.isEmpty(goog.fx.anim.activeAnimations_)) {\\n    goog.fx.anim.cancelAnimationFrame_();\\n  }\\n};\\n\\n\\n/**\\n * Tears down this module. Useful for testing.\\n */\\n// TODO(nicksantos): Wow, this api is pretty broken. This should be fixed.\\ngoog.fx.anim.tearDown = function() {\\n  'use strict';\\n  goog.fx.anim.animationWindow_ = null;\\n  goog.dispose(goog.fx.anim.animationDelay_);\\n  goog.fx.anim.animationDelay_ = null;\\n  goog.fx.anim.activeAnimations_ = {};\\n};\\n\\n\\n/**\\n * Registers an animation window. This allows usage of the timing control API\\n * for animations. Note that this window must be visible, as non-visible\\n * windows can potentially stop animating. This window does not necessarily\\n * need to be the window inside which animation occurs, but must remain visible.\\n * See: https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame.\\n *\\n * @param {Window} animationWindow The window in which to animate elements.\\n */\\ngoog.fx.anim.setAnimationWindow = function(animationWindow) {\\n  'use strict';\\n  // If a timer is currently running, reset it and restart with new functions\\n  // after a timeout. This is to avoid mismatching timer UIDs if we change the\\n  // animation window during a running animation.\\n  //\\n  // In practice this cannot happen before some animation window and timer\\n  // control functions has already been set.\\n  var hasTimer =\\n      goog.fx.anim.animationDelay_ && goog.fx.anim.animationDelay_.isActive();\\n\\n  goog.dispose(goog.fx.anim.animationDelay_);\\n  goog.fx.anim.animationDelay_ = null;\\n  goog.fx.anim.animationWindow_ = animationWindow;\\n\\n  // If the timer was running, start it again.\\n  if (hasTimer) {\\n    goog.fx.anim.requestAnimationFrame_();\\n  }\\n};\\n\\n\\n/**\\n * Requests an animation frame based on the requestAnimationFrame and\\n * cancelRequestAnimationFrame function pair.\\n * @private\\n */\\ngoog.fx.anim.requestAnimationFrame_ = function() {\\n  'use strict';\\n  if (!goog.fx.anim.animationDelay_) {\\n    // We cannot guarantee that the global window will be one that fires\\n    // requestAnimationFrame events (consider off-screen chrome extension\\n    // windows). Default to use goog.async.Delay, unless\\n    // the client has explicitly set an animation window.\\n    if (goog.fx.anim.animationWindow_) {\\n      // requestAnimationFrame will call cycleAnimations_ with the current\\n      // time in ms, as returned from goog.now().\\n      goog.fx.anim.animationDelay_ =\\n          new goog.async.AnimationDelay(function(now) {\\n            'use strict';\\n            goog.fx.anim.cycleAnimations_(now);\\n          }, goog.fx.anim.animationWindow_);\\n    } else {\\n      goog.fx.anim.animationDelay_ = new goog.async.Delay(function() {\\n        'use strict';\\n        goog.fx.anim.cycleAnimations_(goog.now());\\n      }, goog.fx.anim.TIMEOUT);\\n    }\\n  }\\n\\n  var delay = goog.fx.anim.animationDelay_;\\n  if (!delay.isActive()) {\\n    delay.start();\\n  }\\n};\\n\\n\\n/**\\n * Cancels an animation frame created by requestAnimationFrame_().\\n * @private\\n */\\ngoog.fx.anim.cancelAnimationFrame_ = function() {\\n  'use strict';\\n  if (goog.fx.anim.animationDelay_) {\\n    goog.fx.anim.animationDelay_.stop();\\n  }\\n};\\n\\n\\n/**\\n * Cycles through all registered animations.\\n * @param {number} now Current time in milliseconds.\\n * @private\\n */\\ngoog.fx.anim.cycleAnimations_ = function(now) {\\n  'use strict';\\n  goog.object.forEach(goog.fx.anim.activeAnimations_, function(anim) {\\n    'use strict';\\n    anim.onAnimationFrame(now);\\n  });\\n\\n  if (!goog.object.isEmpty(goog.fx.anim.activeAnimations_)) {\\n    goog.fx.anim.requestAnimationFrame_();\\n  }\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"fx\",\"anim\",\"Animated\",\"goog.fx.anim.Animated\",\"prototype\",\"onAnimationFrame\",\"TIMEOUT\",\"async\",\"AnimationDelay\",\"activeAnimations_\",\"animationWindow_\",\"animationDelay_\",\"registerAnimation\",\"goog.fx.anim.registerAnimation\",\"animation\",\"uid\",\"getUid\",\"requestAnimationFrame_\",\"unregisterAnimation\",\"goog.fx.anim.unregisterAnimation\",\"object\",\"isEmpty\",\"cancelAnimationFrame_\",\"tearDown\",\"goog.fx.anim.tearDown\",\"dispose\",\"setAnimationWindow\",\"goog.fx.anim.setAnimationWindow\",\"animationWindow\",\"hasTimer\",\"isActive\",\"goog.fx.anim.requestAnimationFrame_\",\"now\",\"cycleAnimations_\",\"Delay\",\"delay\",\"start\",\"goog.fx.anim.cancelAnimationFrame_\",\"stop\",\"goog.fx.anim.cycleAnimations_\",\"forEach\"]\n}\n"]