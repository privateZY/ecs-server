import Koa from "koa";
import loadMiddleware from "./loadMiddleware";
import loadRoutes from "./routes";
import Database from "./models";
import AliOss from "./AliOss";
import log4js from "koa-log4";

const app = new Koa();

app.isProduction = process.env.NODE_ENV === "production";

app.config = app.isProduction ? require("../config/prodConfig") : require("../config/serverConfig");

log4js.configure(app.isProduction ? require("../log4js.json") : require("../log4js.dev.json"));

app.logger = log4js.getLogger("default");

app.keys = app.config.keys;

app.db = new Database(app.config, app.logger);

app.oss = new AliOss(app);

loadMiddleware(app);

loadRoutes(app);

app.listen(app.config.port, () => {
    app.logger.info("server run on port :" + app.config.port);
});
