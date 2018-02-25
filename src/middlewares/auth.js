import passport from "koa-passport";

export default app => {
  const getUser = id => {
    const User = app.db.models["User"];

    return User.findOne({
      where: {
        username: id
      }
    });
  };

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUser(id);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  });

  return passport;
};
