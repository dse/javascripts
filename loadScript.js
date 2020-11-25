/**
 * Load a script conventionally.
 */
function loadScript(url, options) {
    var script, prop;
    script = document.createElement('script');
    script.src = url;
    if (options) {
        for (prop in options) {
            if (options.hasOwnProperty(prop)) {
                script[prop] = options[prop];
            }
        }
    }
    document.head.appendChild(script).parentNode.removeChild(script);
}

/**
 * Script must be on same domain or permitted by CORS.
 */
function loadScriptSync(url, options) {
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', url, Boolean(options && options.async));
    if (!(options && options.noAcceptHeader)) {
        xhr.setRequestHeader('Accept', 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01');
    }
    if (!(options && options.crossDomain)) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // not for cross-domain
    }
    var callback = options && options.onload;
    xhr.onload = function () {
        if (!(xhr.status === 0 || xhr.status === 200)) {
            return;
        }
        var script = document.createElement('script');
        script.text = xhr.responseText;
        document.head.appendChild(script).parentNode.removeChild(script);
        if (callback) {
            callback();
        }
    };
    xhr.send(null);
}
