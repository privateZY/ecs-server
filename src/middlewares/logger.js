import log4js from "koa-log4";
const DEFAULT_FORMAT =
    ":remote-addr - -" +
    ' ":method :url HTTP/:http-version"' +
    ' "Status :status" "Time: :response-time ms" ":referrer"' +
    ' "Agent: :user-agent"';

/**
 * Adds custom {token, replacement} objects to defaults, overwriting the defaults if any tokens clash
 *
 * @param  {Context} ctx
 * @param  {Array} customTokens [
 *                      {
 *                        token: string-or-regexp,
 *                        replacement: string-or-replace-function,
 *                        content: a replace function with `ctx`
 *                      }
 *                 ]
 * @return {Array}
 */
function assembleTokens(ctx, customTokens) {
    let arrayUniqueTokens = function(array) {
        let a = array.concat();
        for (let i = 0; i < a.length; ++i) {
            for (let j = i + 1; j < a.length; ++j) {
                if (a[i].token === a[j].token) {
                    // not === because token can be regexp object
                    a.splice(j--, 1);
                }
            }
        }
        return a;
    };
    let defaultTokens = [];
    defaultTokens.push({ token: ":url", replacement: ctx.originalUrl });
    defaultTokens.push({ token: ":protocol", replacement: ctx.protocol });
    defaultTokens.push({ token: ":hostname", replacement: ctx.hostname });
    defaultTokens.push({ token: ":method", replacement: ctx.method });
    defaultTokens.push({
        token: ":status",
        replacement: ctx.response.status || ctx.response.__statusCode || ctx.res.statusCode
    });
    defaultTokens.push({ token: ":response-time", replacement: ctx.response.responseTime });
    defaultTokens.push({ token: ":date", replacement: new Date().toUTCString() });
    defaultTokens.push({ token: ":referrer", replacement: ctx.headers.referer || "" });
    defaultTokens.push({
        token: ":http-version",
        replacement: ctx.req.httpVersionMajor + "." + ctx.req.httpVersionMinor
    });
    defaultTokens.push({
        token: ":remote-addr",
        replacement:
            ctx.headers["x-forwarded-for"] ||
            ctx.ip ||
            ctx.ips ||
            (ctx.socket &&
                (ctx.socket.remoteAddress ||
                    (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
    });
    defaultTokens.push({ token: ":user-agent", replacement: ctx.headers["user-agent"] });
    defaultTokens.push({
        token: ":content-length",
        replacement:
            (ctx.response._headers && ctx.response._headers["content-length"]) ||
            (ctx.response.__headers && ctx.response.__headers["Content-Length"]) ||
            ctx.response.length ||
            "-"
    });
    defaultTokens.push({
        token: /:req\[([^\]]+)\]/g,
        replacement: function(_, field) {
            return ctx.headers[field.toLowerCase()];
        }
    });
    defaultTokens.push({
        token: /:res\[([^\]]+)\]/g,
        replacement: function(_, field) {
            return ctx.response._headers
                ? ctx.response._headers[field.toLowerCase()] || ctx.response.__headers[field]
                : ctx.response.__headers && ctx.response.__headers[field];
        }
    });

    customTokens = customTokens.map(function(token) {
        if (token.content && typeof token.content === "function") {
            token.replacement = token.content(ctx);
        }
        return token;
    });

    return arrayUniqueTokens(customTokens.concat(defaultTokens));
}

function format(str, tokens) {
    for (let i = 0; i < tokens.length; i++) {
        str = str.replace(tokens[i].token, tokens[i].replacement);
    }
    return str;
}

const shouldThrow404 = (status, body) => {
    return !status || (status === 404 && body == null);
};

export default app => {
    const logger = log4js.getLogger("http");

    function log(ctx, start, e) {
        ctx.response.responseTime = new Date().getTime() - start;
        let status = e && e.status ? e.status : ctx.status ? ctx.status : 200;

        let log = logger.info;

        if (status >= 300) log = logger.warn;
        if (status >= 400) log = logger.error;
        const str = format(
            DEFAULT_FORMAT,
            assembleTokens(ctx, [{ token: ":status", replacement: status }])
        );
        log.call(logger, str);
    }

    function logError(error) {
        if (error.status) {
            if (error.status >= 500) {
                logger.fatal(error.stack || error);
            } else if (error.status >= 400) {
                logger.error(error.stack || error);
            }
        } else {
            logger.fatal(error.stack || error);
        }
    }

    return async (ctx, next) => {
        let start = new Date().getTime();

        try {
            await next();
            log(ctx, start);
        } catch (e) {
            log(ctx, start, e);
            logError(e);
        }
    };
};
