"use strict";

var thymol = require('../lib/engine_thymol.js');

// Some basic tests using NodeUnit. Thymol itself is not tested.
exports.thymolTests = {

  renderPattern: function renderPattern(test) {
    const patternContent = 'Hello, <th:block th:text="${whom}">World</th:block>!';
    const pattern = {
      name: "Test find partials",
      template: patternContent,
      extendedTemplate: patternContent
    };
    test.equal("Hello, universe!", thymol.renderPattern(pattern, {whom: "universe"}));
    test.done();
  },

  /**
   * Return the markup that should be replaced by the partial contents, ignore any surrounding HTML
   */
  findPartials: function (test) {
    const pattern = {
      name: "Test find partials",
      template: 'Ignored <div th:replace="atoms-basic-button">Foo</div> Ignred'
    };
    test.deepEqual(['<div th:replace="atoms-basic-button">Foo</div>'], thymol.findPartials(pattern));
    test.done();
  },

  // Done by thymeleaf using th:style and th:with. This function is too mustachified in Pattern Lab.
  findPartialsWithStyleModifiers: function (test) {
    test.deepEqual([], thymol.findPartialsWithStyleModifiers());
    test.done();
  },

  // Use th:replace and th:include
  findPartialsWithPatternParameters: function (test) {
    test.deepEqual([], thymol.findPartialsWithPatternParameters());
    test.done();
  },

  // not supported with thymol, list_item_hunter is too mustachified.
  findListItems: function (test) {
    test.deepEqual([], thymol.findListItems());
    test.done();
  },
};
