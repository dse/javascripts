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
    var noAcceptHeader = Boolean(options && options.noAcceptHeader);
    var crossDomain    = Boolean(options && options.crossDomain);
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', url, false); // third argument false means synchronous
    if (!options.noAcceptHeader) {
        xhr.setRequestHeader('Accept', 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01');
    }
    if (!options.crossDomain) {
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
