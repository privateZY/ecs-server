import Koa from "koa";
import loadMiddleware from "./loadMiddleware";
import loadRoutes from "./routes";
import Database from "./models";
const app = new Koa();

app.isProduction = process.env.NODE_ENV === "production";

app.config = app.isProduction
  ? require("../config/prodConfig")
  : require("../config/serverConfig");

app.keys = app.config.keys;

app.db = new Database(app.config);

loadMiddleware(app);

loadRoutes(app);

app.listen(app.config.port, () => {
  console.log("server run on port :" + app.config.port);
});
