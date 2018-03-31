import user from "../controller/user";

export default {
    get: {
        "/user/current": user.current,
        "/user/logout": user.logout,
        "/user/exist": user.checkExist
    },
    post: {
        "/user/login": user.login,
        "/user": user.create,
        "/user/pin": user.loginPin
    }
};
