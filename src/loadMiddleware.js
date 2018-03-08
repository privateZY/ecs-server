import cors from "@koa/cors";
import session from "./middlewares/session";
import bodyParser from "koa-bodyparser";
// import notFound from "./middlewares/404";
import koaError from "koa-json-error";
import logger from "koa-logger";
import passport from "./middlewares/auth";

export default app => {
  app.use(cors());
  app.use(logger());
  app.use(session(app));
  app.use(bodyParser());
  app.use(koaError());

  let auth = passport(app);
  app.use(auth.initialize());
  app.use(auth.session());
  //    app.use(notFound(app))
};
