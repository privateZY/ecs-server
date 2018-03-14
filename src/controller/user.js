import bcrypt from "bcrypt";

export default {
  async login(ctx, next) {
    if (ctx.isAuthenticated()) {
      ctx.throw(403, "已经登录");
    }

    const { password, username } = ctx.request.body;

    const user = await ctx.app.db.models["User"].findOne({
      where: {
        username: username
      }
    });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        ctx.login({
          id: user.username
        });
        ctx.body = {
          user: user
        };
      } else {
        ctx.throw(400, "密码不正确");
      }
    } else {
      ctx.throw(400, "用户不存在");
    }
  },

  async logout(ctx, next) {
    if (!ctx.isAuthenticated()) ctx.throw(400, "没有登录");
    ctx.logout();
    ctx.body = {
      result: true
    };
  },

  async current(ctx, next) {
    ctx.body = {
      user: ctx.isAuthenticated() ? ctx.state.user : null
    };
  },

  async create(ctx, next) {
    const { password, username, passwordRepeat } = ctx.request.body;
    if (password !== passwordRepeat) {
      ctx.throw(400, "两次密码不一致");
    }
    let hashPwd = null;
    try {
      hashPwd = await bcrypt.hash(password, 10);
    } catch (e) {
      ctx.throw(500);
    }

    // checkUserExist
    try {
      const user = await ctx.app.db.models["User"].findOne({
        where: {
          username: username
        }
      });
      if (user) {
        ctx.throw(400, "用户已存在");
      }
    } catch (e) {
      ctx.throw(400, e);
    }

    try {
      const user = await ctx.app.db.models["User"].create({
        username: username,
        password: hashPwd
      });
      ctx.status = 201;
      ctx.login({
        id: user.username
      });
      ctx.body = {
        user: user
      };
    } catch (e) {
      ctx.throw(400, e);
    }
  },
  async checkExist(ctx) {
    try {
      const user = await ctx.app.db.models["User"].findOne({
        where: {
          username: ctx.query.name
        }
      });

      ctx.body = {
        result: !!user
      };
    } catch (e) {
      ctx.throw(500, e);
    }
  }
};
