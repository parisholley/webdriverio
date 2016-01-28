/**
 *
 * Search for multiple elements on the page, starting from the document root. The located
 * elements will be returned as a WebElement JSON objects. The table below lists the
 * locator strategies that each server should support. Elements should be returned in
 * the order located in the DOM.
 *
 * The array of elements can be retrieved  using the 'response.value' which is a
 * collection of element ID's and can be accessed in the subsequent commands
 * using the '.ELEMENT' method.
 *
 * @param {String} selector selector to query the elements
 * @returns {Object[]} A list of WebElement JSON objects for the located elements.
 *
 * @see  https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/elements
 * @type protocol
 *
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _helpersFindElementStrategy = require('../helpers/findElementStrategy');

var _helpersFindElementStrategy2 = _interopRequireDefault(_helpersFindElementStrategy);

var elements = function elements(selector) {
    var requestPath = '/session/:sessionId/elements';
    var lastPromise = this.lastPromise.inspect();

    if (lastPromise.state === 'fulfilled' && lastPromise.value && lastPromise.value.value && lastPromise.value.value.ELEMENT) {
        if (!selector) {
            lastPromise.value.value = [lastPromise.value.value];
            return lastPromise.value;
        }

        /**
         * format xpath selector (global -> relative)
         */
        if (selector.slice(0, 2) === '//') {
            selector = '.' + selector.slice(1);
        }

        var elem = lastPromise.value.value.ELEMENT;
        requestPath = '/session/:sessionId/element/' + elem + '/elements';
    }

    var found = (0, _helpersFindElementStrategy2['default'])(selector);
    return this.requestHandler.create(requestPath, {
        using: found.using,
        value: found.value
    })['catch'](function (err) {
        if (err.message === 'no such element') {
            return [];
        }

        throw err;
    });
};

exports['default'] = elements;
module.exports = exports['default'];
