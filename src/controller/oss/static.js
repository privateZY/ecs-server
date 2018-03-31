import co from "co";
import Joi from "joi";

export const schema = {
    query: {
        prefix: Joi.string().default(""),
        delimiter: Joi.string().default("/")
    }
};

export default {
    async list(ctx) {
        // 		const ctx.params

        console.log(ctx.query);

        const res = await co(function* sss() {
            const result = yield ctx.app.oss.publicStore.list({
                prefix: "",
                delimiter: "/"
            });
            return Promise.resolve(result);
        });

        ctx.body = {
            objects: res.objects,
            prefixes: res.prefixes
        };
    },

    async create() {}
};
