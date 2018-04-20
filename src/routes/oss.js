import staticClient, {
    schema,
    setMetaSchema,
    getMetaSchema,
    fileSchema,
    changeFileSchema
} from "../controller/oss/static";
import validate from "koa2-validation";

export default {
    get: {
        "/statics/files": [validate(schema), staticClient.list],
        "/statics/signature": staticClient.uploadSignature,
        "/statics/files/meta": [validate(getMetaSchema), staticClient.getMeta]
    },
    put: {
        "/statics/files/meta": [validate(setMetaSchema), staticClient.setMeta]
    },
    delete: {
        "/statics/files": [validate(fileSchema), staticClient.removeFile]
    },
    patch: {
        "/statics/files": [validate(changeFileSchema), staticClient.changeFileName]
    }
};
