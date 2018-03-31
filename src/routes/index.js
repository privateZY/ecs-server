import Router from "koa-router";
import user from "./user";
import oss from "./oss";
function loadRoute(route, routes = {}) {
    Object.keys(routes).forEach(method => {
        Object.keys(routes[method]).forEach(path => {
            let logics = routes[method][path];
            route[method].apply(route, Array.isArray(logics) ? [path, ...logics] : [path, logics]);
        });
    });
}

export default app => {
    const router = new Router();

    loadRoute(router, user);
    loadRoute(router, oss);

    app.use(router.routes());
    app.use(router.allowedMethods());
};
