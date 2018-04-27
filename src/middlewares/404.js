export default app =>
    async function pageNotFound(ctx, next) {
        // we need to explicitly set 404 here
        // so that koa doesn't assign 200 on body=
        ctx.status = 404;

        try {
            await next();
            if (ctx.status === 404) {
                // do somthing here
            }
        } catch (err) {
            // handle error
        }

        switch (ctx.accepts("html", "json")) {
            case "html":
                ctx.type = "html";
                ctx.body = "<p>Page Not Found</p>";
                break;
            case "json":
                ctx.body = {
                    message: "Page Not Found"
                };
                break;
            default:
                ctx.type = "text";
                ctx.body = "Page Not Found";
        }
    };
