/**
 * Load a script **synchronously**, for when you don't want callback
 * hell.
 *
 * Similar in concept and implementation to jQuery.getScript().  Runs
 * synchronously, whereas jQuery's runs asynchronously by default.
 *
 * Script must be on same server or permitted by CORS.  In the latter
 * case you must set the `crossDomain` option to `true`.
 */
function loadScriptSync(url, options) {
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', url, /* async */ false);
    if (!(options && options.noAcceptHeader)) {
        xhr.setRequestHeader('Accept', 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01');
    }
    if (!(options && options.crossDomain)) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // not for cross-domain
    }
    xhr.onload = function () {
        if (!(xhr.status === 0 || xhr.status === 200)) {
            return;
        }
        var script = document.createElement('script');
        script.text = xhr.responseText;
        document.head.appendChild(script).parentNode.removeChild(script);
    };
    xhr.send(null);
}

function loadScript(url, options) {
    var script, prop, callback;
    script = document.createElement('script');
    script.src = url;
    for (prop in options) {
        if (options.hasOwnProperty(prop)) {
            script[prop] = options[prop];
        }
    }
    document.head.appendChild(script).parentNode.removeChild(script);
}
