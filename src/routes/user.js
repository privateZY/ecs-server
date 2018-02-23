import user from "../controller/user";

export default {
    get:{
        "/user/current": user.current,
        "/user/logout":  user.logout
    },
    post: {
        "/user/login": user.login,
        "/user": user.create
    },
}