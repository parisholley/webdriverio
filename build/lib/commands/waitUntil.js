/**
 *
 * This wait command is your universal weapon if you want to wait on
 * something. It expects a condition and waits until that condition
 * is fulfilled with an truthy value. A condition can be either a promise
 * or a command that returns a promise.
 *
 * A common example is to wait until a certain element contains a certain
 * text.
 *
 * <example>
    :example.html
    <div id="someText">I am some text</div>
    <script>
      setTimeout(function() {
        $('#someText').html('I am now different');
      }, 1000);
    </script>

    :waitUntil.js
    client.waitUntil(function() {
      return this.getText('#someText').then(function(text) {
        return text === 'I am now different'
      });
    });
 * </example>
 *
 *
 * @param {Function|Promise} condition  condition to wait on
 * @param {Number=}          ms         timeout in ms (default: 500)
 * @param {Number=}          interval   interval between condition checks (default: 250)
 *
 * @uses utility/pause
 * @type utility
 *
 */

'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _utilsErrorHandler = require('../utils/ErrorHandler');

var REJECT_MESSAGE = 'Promise never resolved with an truthy value';

function waitUntilPrivate(condition, timeout, interval, starttime) {
    var _this = this;

    var promise = undefined;

    var now = new Date().getTime();
    var timeLeft = timeout - (now - starttime);
    timeLeft = timeLeft < 0 ? 0 : timeLeft;

    if (!timeLeft) {
        return _Promise.reject(new _utilsErrorHandler.CommandError(REJECT_MESSAGE));
    }

    if (typeof condition === 'function') {
        promise = condition.call(this);
    } else {
        promise = _Promise.resolve(condition);
    }

    return new _Promise(function (resolve, reject) {
        var timeoutId = setTimeout(function () {
            reject(new _utilsErrorHandler.CommandError(REJECT_MESSAGE));
        }, timeLeft);

        promise.then(function (res) {
            clearTimeout(timeoutId);

            if (!res) {
                return resolve(_this.pause(interval).then(waitUntilPrivate.bind(_this, condition, timeout, interval, starttime)));
            }

            resolve(res);
        }, function (err) {
            clearTimeout(timeoutId);
            reject(new _utilsErrorHandler.CommandError('Promise was fulfilled but got rejected with the following reason: ' + err));
        });
    });
}

exports['default'] = function (condition, timeout, interval) {
    /*!
     * ensure that timeout and interval are set properly
     */
    if (typeof timeout !== 'number') {
        timeout = this.options.waitforTimeout;
    }

    if (typeof interval !== 'number') {
        interval = this.options.waitforInterval;
    }

    var starttime = new Date().getTime();
    return waitUntilPrivate.call(this, condition, timeout, interval, starttime);
};

module.exports = exports['default'];
