/*global setTimeout, clearTimeout */
function throttle(fn, delayMs) {
    "use strict";
    var timeout;
    var flag = false;
    function clear() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = null;
        if (flag) {
            fn();
            flag = false;
        }
    }
    function wrapper() {
        if (timeout) {
            flag = true;
        } else {
            fn();
            timeout = setTimeout(clear, delayMs);
        }
    }
    return wrapper;
}
