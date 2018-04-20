import Joi from "joi";
import crypto from "crypto";
import uuidv4 from "uuid/v4";

export const schema = {
    query: {
        prefix: Joi.string().default(""),
        delimiter: Joi.string().default("/")
    }
};

export const fileSchema = {
    query: {
        key: Joi.string().required()
    }
};

export const changeFileSchema = {
    body: {
        key: Joi.string().required(),
        newKey: Joi.string().required(),
        keepSource: Joi.boolean().default(true)
    }
};

export const getMetaSchema = {
    query: {
        key: Joi.string().required()
    }
};

export const setMetaSchema = {
    body: {
        key: Joi.string().required(),
        name: Joi.string().required()
    }
};

export default {
    async list(ctx) {
        const res = await ctx.app.oss.publicStore.list({
            prefix: ctx.query.prefix,
            delimiter: ctx.query.delimiter
        });

        ctx.body = {
            objects: res.objects,
            prefixes: res.prefixes
        };
    },

    async create() {},

    async uploadSignature(ctx) {
        const publicOssConfig = ctx.app.oss.getPublicConfig();

        const current = new Date().getTime(),
            //30 分钟的有效时间
            expires = current + 1000 * 60 * 30,
            policy = {
                expiration: new Date(expires).toISOString(),
                conditions: [["content-length-range", 0, 1048576000]]
            },
            // policy base64编码
            policyBase64 = new Buffer(JSON.stringify(policy)).toString("base64"),
            // sha1 加密, 秘钥 为 AliOssConfig.accessKeySecret, 加密 policyBase64 以base64输出
            signature = crypto
                .createHmac("sha1", publicOssConfig.accessKeySecret)
                .update(policyBase64)
                .digest("base64");

        ctx.body = {
            accessid: publicOssConfig.accessKeyId,
            host:
                "http://" + publicOssConfig.bucket + "." + publicOssConfig.region + ".aliyuncs.com",
            policy: policyBase64,
            signature: signature,
            expire: expires,
            name: uuidv4()
        };
    },

    async getMeta(ctx) {
        const publicStore = ctx.app.oss.publicStore;

        const { key } = ctx.query;

        try {
            ctx.body = await publicStore.head(key);
        } catch (e) {
            ctx.throw(e.status, e);
        }
    },

    async removeFile(ctx) {
        const publicStore = ctx.app.oss.publicStore;

        const { key } = ctx.query;

        try {
            await publicStore.delete(key);
            ctx.body = {
                success: true
            };
        } catch (e) {
            ctx.throw(e);
        }
    },

    async changeFileName(ctx) {
        const publicStore = ctx.app.oss.publicStore;

        const { key, newKey, keepSource } = ctx.request.body;

        try {
            await publicStore.head(key);

            try {
                await publicStore.head(newKey);
            } catch (e) {
                if (e.status === 404) {
                    try {
                        await publicStore.copy(newKey, key);

                        if (!keepSource) {
                            await publicStore.delete(key);
                        }
                        return (ctx.body = {
                            success: true
                        });
                    } catch (e) {
                        ctx.throw(e);
                    }
                }
            }
            ctx.throw(400, `newKey : ${newKey} already exist`);
        } catch (e) {
            ctx.throw(e);
        }
    },

    async setMeta(ctx) {
        const publicStore = ctx.app.oss.publicStore;

        const { key, name } = ctx.request.body;

        try {
            await publicStore.putMeta(key, {
                name: encodeURIComponent(name)
            });

            ctx.body = {
                success: true,
                info: await publicStore.head(key)
            };
        } catch (e) {
            ctx.body = {
                success: false
            };
        }
    }
};
