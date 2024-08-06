["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/useragent/platform.js"],"~:js","goog.provide(\"goog.userAgent.platform\");\ngoog.require(\"goog.string\");\ngoog.require(\"goog.userAgent\");\ngoog.userAgent.platform.determineVersion_ = function() {\n  var re;\n  if (goog.userAgent.WINDOWS) {\n    re = /Windows NT ([0-9.]+)/;\n    var match = re.exec(goog.userAgent.getUserAgentString());\n    if (match) {\n      return match[1];\n    } else {\n      return \"0\";\n    }\n  } else if (goog.userAgent.MAC) {\n    re = /1[0|1][_.][0-9_.]+/;\n    match = re.exec(goog.userAgent.getUserAgentString());\n    return match ? match[0].replace(/_/g, \".\") : \"10\";\n  } else if (goog.userAgent.ANDROID) {\n    re = /Android\\s+([^\\);]+)(\\)|;)/;\n    match = re.exec(goog.userAgent.getUserAgentString());\n    return match ? match[1] : \"\";\n  } else if (goog.userAgent.IPHONE || goog.userAgent.IPAD || goog.userAgent.IPOD) {\n    re = /(?:iPhone|CPU)\\s+OS\\s+(\\S+)/;\n    match = re.exec(goog.userAgent.getUserAgentString());\n    return match ? match[1].replace(/_/g, \".\") : \"\";\n  }\n  return \"\";\n};\ngoog.userAgent.platform.VERSION = goog.userAgent.platform.determineVersion_();\ngoog.userAgent.platform.isVersion = function(version) {\n  return goog.string.compareVersions(goog.userAgent.platform.VERSION, version) >= 0;\n};\n","~:source","/**\n * @license\n * Copyright The Closure Library Authors.\n * SPDX-License-Identifier: Apache-2.0\n */\n\n/**\n * @fileoverview Utilities for getting details about the user's platform.\n */\n\ngoog.provide('goog.userAgent.platform');\n\ngoog.require('goog.string');\ngoog.require('goog.userAgent');\n\n\n/**\n * Detects the version of the OS/platform the browser is running in. Not\n * supported for Linux, where an empty string is returned.\n *\n * @private\n * @return {string} The platform version.\n */\ngoog.userAgent.platform.determineVersion_ = function() {\n  'use strict';\n  var re;\n  if (goog.userAgent.WINDOWS) {\n    re = /Windows NT ([0-9.]+)/;\n    var match = re.exec(goog.userAgent.getUserAgentString());\n    if (match) {\n      return match[1];\n    } else {\n      return '0';\n    }\n  } else if (goog.userAgent.MAC) {\n    re = /1[0|1][_.][0-9_.]+/;\n    var match = re.exec(goog.userAgent.getUserAgentString());\n    // Note: some old versions of Camino do not report an OSX version.\n    // Default to 10.\n    return match ? match[0].replace(/_/g, '.') : '10';\n  } else if (goog.userAgent.ANDROID) {\n    re = /Android\\s+([^\\);]+)(\\)|;)/;\n    var match = re.exec(goog.userAgent.getUserAgentString());\n    return match ? match[1] : '';\n  } else if (\n      goog.userAgent.IPHONE || goog.userAgent.IPAD || goog.userAgent.IPOD) {\n    re = /(?:iPhone|CPU)\\s+OS\\s+(\\S+)/;\n    var match = re.exec(goog.userAgent.getUserAgentString());\n    // Report the version as x.y.z and not x_y_z\n    return match ? match[1].replace(/_/g, '.') : '';\n  }\n\n  return '';\n};\n\n\n/**\n * The version of the platform. We don't determine the version of Linux.\n * For Windows, we only look at the NT version. Non-NT-based versions\n * (e.g. 95, 98, etc.) are given version 0.0.\n * @type {string}\n */\ngoog.userAgent.platform.VERSION = goog.userAgent.platform.determineVersion_();\n\n\n/**\n * Whether the user agent platform version is higher or the same as the given\n * version.\n *\n * @param {string|number} version The version to check.\n * @return {boolean} Whether the user agent platform version is higher or the\n *     same as the given version.\n */\ngoog.userAgent.platform.isVersion = function(version) {\n  'use strict';\n  return goog.string.compareVersions(\n             goog.userAgent.platform.VERSION, version) >= 0;\n};\n","~:compiled-at",1722915042680,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.useragent.platform.js\",\n\"lineCount\":33,\n\"mappings\":\"AAUAA,IAAKC,CAAAA,OAAL,CAAa,yBAAb,CAAA;AAEAD,IAAKE,CAAAA,OAAL,CAAa,aAAb,CAAA;AACAF,IAAKE,CAAAA,OAAL,CAAa,gBAAb,CAAA;AAUAF,IAAKG,CAAAA,SAAUC,CAAAA,QAASC,CAAAA,iBAAxB,GAA4CC,QAAQ,EAAG;AAErD,MAAIC,EAAJ;AACA,MAAIP,IAAKG,CAAAA,SAAUK,CAAAA,OAAnB,CAA4B;AAC1BD,MAAA,GAAK,sBAAL;AACA,QAAIE,QAAQF,EAAGG,CAAAA,IAAH,CAAQV,IAAKG,CAAAA,SAAUQ,CAAAA,kBAAf,EAAR,CAAZ;AACA,QAAIF,KAAJ;AACE,aAAOA,KAAA,CAAM,CAAN,CAAP;AADF;AAGE,aAAO,GAAP;AAHF;AAH0B,GAA5B,KAQO,KAAIT,IAAKG,CAAAA,SAAUS,CAAAA,GAAnB,CAAwB;AAC7BL,MAAA,GAAK,oBAAL;AACIE,SAAJ,GAAYF,EAAGG,CAAAA,IAAH,CAAQV,IAAKG,CAAAA,SAAUQ,CAAAA,kBAAf,EAAR,CAAZ;AAGA,WAAOF,KAAA,GAAQA,KAAA,CAAM,CAAN,CAASI,CAAAA,OAAT,CAAiB,IAAjB,EAAuB,GAAvB,CAAR,GAAsC,IAA7C;AAL6B,GAAxB,KAMA,KAAIb,IAAKG,CAAAA,SAAUW,CAAAA,OAAnB,CAA4B;AACjCP,MAAA,GAAK,2BAAL;AACIE,SAAJ,GAAYF,EAAGG,CAAAA,IAAH,CAAQV,IAAKG,CAAAA,SAAUQ,CAAAA,kBAAf,EAAR,CAAZ;AACA,WAAOF,KAAA,GAAQA,KAAA,CAAM,CAAN,CAAR,GAAmB,EAA1B;AAHiC,GAA5B,KAIA,KACHT,IAAKG,CAAAA,SAAUY,CAAAA,MADZ,IACsBf,IAAKG,CAAAA,SAAUa,CAAAA,IADrC,IAC6ChB,IAAKG,CAAAA,SAAUc,CAAAA,IAD5D,CACkE;AACvEV,MAAA,GAAK,6BAAL;AACIE,SAAJ,GAAYF,EAAGG,CAAAA,IAAH,CAAQV,IAAKG,CAAAA,SAAUQ,CAAAA,kBAAf,EAAR,CAAZ;AAEA,WAAOF,KAAA,GAAQA,KAAA,CAAM,CAAN,CAASI,CAAAA,OAAT,CAAiB,IAAjB,EAAuB,GAAvB,CAAR,GAAsC,EAA7C;AAJuE;AAOzE,SAAO,EAAP;AA7BqD,CAAvD;AAuCAb,IAAKG,CAAAA,SAAUC,CAAAA,QAASc,CAAAA,OAAxB,GAAkClB,IAAKG,CAAAA,SAAUC,CAAAA,QAASC,CAAAA,iBAAxB,EAAlC;AAWAL,IAAKG,CAAAA,SAAUC,CAAAA,QAASe,CAAAA,SAAxB,GAAoCC,QAAQ,CAACC,OAAD,CAAU;AAEpD,SAAOrB,IAAKsB,CAAAA,MAAOC,CAAAA,eAAZ,CACIvB,IAAKG,CAAAA,SAAUC,CAAAA,QAASc,CAAAA,OAD5B,EACqCG,OADrC,CAAP,IACwD,CADxD;AAFoD,CAAtD;;\",\n\"sources\":[\"goog/useragent/platform.js\"],\n\"sourcesContent\":[\"/**\\n * @license\\n * Copyright The Closure Library Authors.\\n * SPDX-License-Identifier: Apache-2.0\\n */\\n\\n/**\\n * @fileoverview Utilities for getting details about the user's platform.\\n */\\n\\ngoog.provide('goog.userAgent.platform');\\n\\ngoog.require('goog.string');\\ngoog.require('goog.userAgent');\\n\\n\\n/**\\n * Detects the version of the OS/platform the browser is running in. Not\\n * supported for Linux, where an empty string is returned.\\n *\\n * @private\\n * @return {string} The platform version.\\n */\\ngoog.userAgent.platform.determineVersion_ = function() {\\n  'use strict';\\n  var re;\\n  if (goog.userAgent.WINDOWS) {\\n    re = /Windows NT ([0-9.]+)/;\\n    var match = re.exec(goog.userAgent.getUserAgentString());\\n    if (match) {\\n      return match[1];\\n    } else {\\n      return '0';\\n    }\\n  } else if (goog.userAgent.MAC) {\\n    re = /1[0|1][_.][0-9_.]+/;\\n    var match = re.exec(goog.userAgent.getUserAgentString());\\n    // Note: some old versions of Camino do not report an OSX version.\\n    // Default to 10.\\n    return match ? match[0].replace(/_/g, '.') : '10';\\n  } else if (goog.userAgent.ANDROID) {\\n    re = /Android\\\\s+([^\\\\);]+)(\\\\)|;)/;\\n    var match = re.exec(goog.userAgent.getUserAgentString());\\n    return match ? match[1] : '';\\n  } else if (\\n      goog.userAgent.IPHONE || goog.userAgent.IPAD || goog.userAgent.IPOD) {\\n    re = /(?:iPhone|CPU)\\\\s+OS\\\\s+(\\\\S+)/;\\n    var match = re.exec(goog.userAgent.getUserAgentString());\\n    // Report the version as x.y.z and not x_y_z\\n    return match ? match[1].replace(/_/g, '.') : '';\\n  }\\n\\n  return '';\\n};\\n\\n\\n/**\\n * The version of the platform. We don't determine the version of Linux.\\n * For Windows, we only look at the NT version. Non-NT-based versions\\n * (e.g. 95, 98, etc.) are given version 0.0.\\n * @type {string}\\n */\\ngoog.userAgent.platform.VERSION = goog.userAgent.platform.determineVersion_();\\n\\n\\n/**\\n * Whether the user agent platform version is higher or the same as the given\\n * version.\\n *\\n * @param {string|number} version The version to check.\\n * @return {boolean} Whether the user agent platform version is higher or the\\n *     same as the given version.\\n */\\ngoog.userAgent.platform.isVersion = function(version) {\\n  'use strict';\\n  return goog.string.compareVersions(\\n             goog.userAgent.platform.VERSION, version) >= 0;\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"userAgent\",\"platform\",\"determineVersion_\",\"goog.userAgent.platform.determineVersion_\",\"re\",\"WINDOWS\",\"match\",\"exec\",\"getUserAgentString\",\"MAC\",\"replace\",\"ANDROID\",\"IPHONE\",\"IPAD\",\"IPOD\",\"VERSION\",\"isVersion\",\"goog.userAgent.platform.isVersion\",\"version\",\"string\",\"compareVersions\"]\n}\n"]