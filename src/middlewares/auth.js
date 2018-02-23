import passport from "koa-passport";
import LocalStrategy from "passport-local";
import config from "../../config/base";

const users = [{
    id: 1,
    name: "aaa",
    password: "123456"
}, {
    id: 2,
    name: "bbb",
    password: "123456"
}];

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        let u = users.find(u => u.id === id);
        u ? resolve(u) : reject()
    })
};

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUser(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(new LocalStrategy(function (username, password, done) {
    let u = users.find(u => u.name === username && u.password === password);
    if (u) {
        done(null, u)
    } else {
        done(null, false)
    }
}));
export default passport;