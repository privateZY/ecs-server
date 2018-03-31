import bcrypt from "bcrypt";

export default async function(db) {
    const { models, sequelize } = db;

    if (models["User"]) {
        const pwd = await bcrypt.hash("1", 10);
        await models["User"].bulkCreate([
            {
                username: "test",
                password: pwd,
                pin: pwd
            }
        ]);
    }
    process.exit();
}
