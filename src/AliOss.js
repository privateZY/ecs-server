import OSS from "ali-oss";
import co from "co";
export default class AliOss {
    constructor(app) {
        this.publicStore = new OSS(app.config.oss.public);
    }

    async checkFiles() {
        const _this = this;
        const res = await co(function* sss() {
            const result = yield _this.publicStore.list({
                prefix: undefined,
                delimiter: "/"
            });

            return Promise.resolve(result);
        });

        console.log(res);
    }
}
