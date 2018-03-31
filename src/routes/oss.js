import staticClient, { schema } from "../controller/oss/static";
import validate from "koa2-validation";

export default {
    get: {
        "/statics/files": [validate(schema), staticClient.list]
    }
};
