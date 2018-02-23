import Router from "koa-router";
import user from "./user";

function loadRoute(route, routes = {}) {
    Object.keys(routes).forEach(method => {
        Object.keys(routes[method]).forEach(path => {
            route[method](path, routes[method][path])
        })
    })
}


export default (app) => {
    const router = new Router();

    loadRoute(router, user);

    app.use(router.routes());
    app.use(router.allowedMethods());
}

