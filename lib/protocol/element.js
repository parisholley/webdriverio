/**
 * Search for an element on the page, starting from the document root.
 * The located element will be returned as a WebElement JSON object.
 * The table below lists the locator strategies that each server should support.
 * Each locator must return the first matching element located in the DOM.
 *
 * @see  https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element
 *
 * @param {String} selector selector to query the element
 * @returns {String} A WebElement JSON object for the located element.
 *
 * @type protocol
 *
 */

import findStrategy from '../helpers/findElementStrategy'

let element = function (selector) {
    let requestPath = '/session/:sessionId/element'
    let lastPromise = this.lastPromise.inspect()

    if (lastPromise.state === 'fulfilled' && lastPromise.value && lastPromise.value.value && lastPromise.value.value.ELEMENT) {
        if (!selector) {
            return lastPromise.value
        }

        /**
         * format xpath selector (global -> relative)
         */
        if (selector.slice(0, 2) === '//') {
            selector = '.' + selector.slice(1)
        }

        let elem = lastPromise.value.value.ELEMENT
        requestPath = `/session/:sessionId/element/${elem}/element`
    }

    let found = findStrategy(selector)
    return this.requestHandler.create(
        requestPath,
        { using: found.using, value: found.value }
    )
}

export default element
