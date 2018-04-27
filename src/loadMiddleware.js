import cors from "@koa/cors";
import session from "./middlewares/session";
import bodyParser from "koa-bodyparser";
import koaError from "koa-json-error";
//import logger from "koa-logger";
import passport from "./middlewares/auth";
import logger from "./middlewares/logger";

export default app => {
    app.use(bodyParser());
    app.use(cors({ credentials: true }));
    app.use(session(app));
    app.use(koaError());
    app.use(logger(app));
    let auth = passport(app);
    app.use(auth.initialize());
    app.use(auth.session());
};
