import Koa from "koa";
import loadMiddleware from "./loadMiddleware"
import loadRoutes from "./routes";
import config from "../config/base";
const app = new Koa();

app.keys = ['ecs-server'];

loadMiddleware(app);

loadRoutes(app);

app.listen(config.port);