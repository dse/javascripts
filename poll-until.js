/*global setInterval, clearInterval */
function pollUntil(condition, callback, timeout) {
    "use strict";
    if (!condition || !(condition instanceof Function)) {
        throw new TypeError("invalid condition");
    }
    if (!callback || !(callback instanceof Function)) {
        throw new TypeError("invalid callback");
    }
    if (!timeout) {
        timeout = 1000;
    } else if (typeof timeout !== 'number' && !(timeout instanceof Number)) {
        throw new TypeError("invalid timeout");
    }
    timeout = Number(timeout);
    if (condition()) {
        callback();
        return;
    }
    var poll;
    poll = function () {
        if (condition()) {
            clearInterval(poll);
            callback();
        }
    };
    setInterval(poll, timeout);
}
