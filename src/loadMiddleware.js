import session from "./middlewares/session";
import bodyParser from "koa-bodyparser";
import notFound from "./middlewares/404";
import koaError from "koa-json-error";
import logger from "koa-logger";
import passport from "./middlewares/auth";

export default (app) => {
    app.use(logger());
    app.use(session(app));
    app.use(bodyParser());
    app.use(koaError());
    app.use(passport.initialize());
    app.use(passport.session());
//    app.use(notFound(app))
}