import Koa from "koa";
import session from "koa-session";

const app = new Koa();

app.keys = ['some secret hurr'];

const CONFIG = {
	key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
	/** (number || 'session') maxAge in ms (default is 1 days) */
	/** 'session' will result in a cookie that expires when session/browser is closed */
	/** Warning: If a session cookie is stolen, this cookie will never expire */
	maxAge: 86400000,
	overwrite: true,
	/** (boolean) can overwrite or not (default true) */
	httpOnly: true,
	/** (boolean) httpOnly or not (default true) */
	signed: true,
	/** (boolean) signed or not (default true) */
	rolling: false,
	/** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
	renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));
// or if you prefer all default config, just use => app.use(session(app));

app.use(ctx => {
	// ignore favicon
	if (ctx.path === '/favicon.ico') return;
	
	let n = ctx.session.views || 0;
	ctx.session.views = ++n;
	ctx.body = n + ' views';
});

app.use(async function pageNotFound(ctx) {
	// we need to explicitly set 404 here
	// so that koa doesn't assign 200 on body=
	ctx.status = 404;
	
	switch (ctx.accepts('html', 'json')) {
		case 'html':
			ctx.type = 'html';
			ctx.body = '<p>Page Not Found</p>';
			break;
		case 'json':
			ctx.body = {
				message: 'Page Not Found'
			};
			break;
		default:
			ctx.type = 'text';
			ctx.body = 'Page Not Found';
	}
});

// response
app.use(ctx => {
	ctx.body = 'Hello Koa';
});

app.listen(3000);