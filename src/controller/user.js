export default {
    async login(ctx, next) {
        ctx.body = await new Promise(res => {
            setTimeout(() => {
                res("abc")
            }, 1000);
        })
    },

    async logout(ctx, next) {
        ctx.body = "ok";
    },

    async current(ctx, next) {
        ctx.body = {
            name: "aaa"
        }
    },

    async create(ctx,next){
        ctx.body = {
            message: "ok"
        }
    }
}