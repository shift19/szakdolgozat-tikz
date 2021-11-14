'use strict';

//======================================================================================================================

const Cookie = {
    get: name => {
        let c = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1];
        if (c) return decodeURIComponent(c);
    },

    set: (name, value, opts = {path: "/", days: 1}) => {
        if (opts.days) {
            opts['max-age'] = opts.days * 60 * 60 * 24;
            delete opts.days;
        }
        opts = Object.entries(opts).reduce(
            (o, [k, v]) => `${o}; ${k}=${v}`, ''
        );
        document.cookie = name + '=' + encodeURIComponent(value) + opts;
    },

    delete: (name, opts = {path: "/"}) => Cookie.set(name, '', {'max-age': -1, ...opts})
}

//======================================================================================================================

export {
    Cookie
}
