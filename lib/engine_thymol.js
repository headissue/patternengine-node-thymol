/*
 * thymol pattern engine for patternlab-node
 *
 * Maximilian Richt / headissue GmbH
 * Licensed under the MIT license.
 */

/*
 * ENGINE SUPPORT LEVEL:
 *
 * Full. Partial calls and lineage hunting are supported. Thymol does not support
 * the mustache-specific syntax extensions, style modifiers and pattern
 * parameters, because their use cases are addressed by the core Thymol feature
 * set.
 * Thymeleafs th:include is also not possible, use th:replace instead
 */

"use strict";

const domino = require('domino');
const jQuery = require("jquery");

const engine_thymol = (function () {
  global.thymol = {};

  const thymol = require('thymol-node').thymol;

  const resetGlobals = function () {
    global.thPrefix = undefined;
    global.thDataPrefix = undefined;
    global.thAllowNullText = undefined;
    global.thPrecision = undefined;
    global.thProtocol = undefined;
    global.thLocale = undefined;
    global.thPrecedence = undefined;
    global.thMessagePath = undefined;
    global.thResourcePath = undefined;
    global.thMessagesBaseName = undefined;
    global.thRelativeRootPath = undefined;
    global.thExtendedMapping = undefined;
    global.thLocalMessages = undefined;
    global.thDisableMessages = undefined;
    global.thTemplateSuffix = undefined;

    global.thRoot = undefined;
    global.thPath = undefined;
    global.thVars = undefined;
    global.thMessages = undefined;
    global.thMappings = undefined;
    global.thDisable = undefined;
    global.thDebug = undefined;
  };

  const setDefaults = function () {
    thymol.thScriptPath = "";
    thymol.thDebug = true; // calls alert() if something bad happens
    thymol.thDefaultPrefix = "th";
    thymol.thDefaultDataPrefix = "data";
    thymol.thDefaultPrecision = 10;
    thymol.thDefaultProtocol = "file://";
    thymol.thDefaultLocale = "en";
    thymol.thDefaultPrecedence = 20000;
    thymol.thDefaultMessagePath = "";
    thymol.thDefaultResourcePath = "";
    thymol.thDefaultMessagesBaseName = "Messages";
    thymol.thDefaultRelativeRootPath = "";
    thymol.thDefaultExtendedMapping = false;
    thymol.thDefaultDisableMessages = false;
    thymol.thDefaultTemplateSuffix = ".html";
  };

  // initialize thymol
  setDefaults();
  thymol.thWindow = domino.createWindow("<html></html>");
  global.$ = jQuery(thymol.thWindow);
  thymol.jqSetup(global.$);
  thymol.setup();

  // patch thymol to support schema.org:
  thymol.appendToAttrList(thymol.processSpecAttrMod, 1e3, ["itemprop", "itemtype"]);
  thymol.appendToAttrList(thymol.processFixedValBoolAttr, 1e3, ["itemscope"]);

  const renderThymeleaf = function (content, vars, messages) {
    const win = domino.createWindow(content);
    thymol.thDocument = win.document;
    thymol.thWindow = win;
    setDefaults();
    thymol.thDataThymolLoading = false;

    global.$ = jQuery(thymol.thWindow);
    thymol.jqSetup(global.$);

    // add a fake window.top, thymol stores things in there
    thymol.thTop = {
      name: ""
    };

    resetGlobals();
    thymol.reset();

    // must be global
    global.thVars = vars;
    global.thMessages = messages;
    global.thDebug = true;

    const result = {
      error: null
    };

    // add an faked alert to get messages from thymols debugging mode
    const alert = function (arg) {
      console.log(arg);
      result.error = "" + arg.name + ": " + arg.message;
    };

    thymol.thWindow.alert = alert;

    const resultDocument = thymol.execute(thymol.thDocument);

    result.rendered = resultDocument.documentElement.outerHTML;
    result.rendered = result.rendered.replace('<html><head></head><body>', '').replace('</body></html>', '');
    return result;
  };

  const convertDataToThymol = function (data) {
    const result = [];
    Object.keys(data).forEach(function (k) {
      if (k === 'link') {
        return;
      }
      const value = data[k];
      result.push([k, value]);
    });
    return result;
  };

  return {
    engine: {}, // don't add thymol here, it gets serialized
    engineName: 'thymol',
    engineFileExtension: '.html',

    //Important! Needed for compilation. Can't resolve paths otherwise.
    expandPartials: true,

    // regexes, stored here so they're only compiled once
    findPartialsRE: /<(\S+)[^>]*th:replace=["'](.+)["'][^>]*>.*?<\/\1>/g,
    findPartialKeyRE: /th:replace=["'](.+)["']/,


    // render it
    renderPattern: function renderPattern(pattern, data) {
      const thyData = convertDataToThymol(data);

      const result = renderThymeleaf(pattern.extendedTemplate, thyData);

      if (!!result.error) {
        throw `${pattern.name}: ${result.error}`;
      }
      return result.rendered;
    },

    // find and return any <tag th:replace="template-name"></tag> within pattern
    findPartials: function findPartials(pattern) {
      return pattern.template.match(this.findPartialsRE);
    },

    // Done by thymeleaf using th:style and th:with. This function is too mustachified in Pattern Lab.
    findPartialsWithStyleModifiers: function () {
      return [];
    },

    // Use th:replace and th:include
    findPartialsWithPatternParameters: function () {
      return [];
    },

    // not supported with thymol, list_item_hunter is too mustachified.
    findListItems: function (/*pattern*/) {
      return [];
    },

    // given a pattern, and a partial string, tease out the "pattern key" and
    // return it.
    findPartial: function (partialString) {
      return partialString.match(this.findPartialKeyRE)[1];
    }
  };
})();

module.exports = engine_thymol;
