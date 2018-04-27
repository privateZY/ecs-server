import bcrypt from "bcrypt";

export default async function(db) {
    const { models, sequelize } = db;

    if (models["User"]) {
        const pwd = await bcrypt.hash("js8zq596", 10);
        const pin = await bcrypt.hash("596332", 10);
        await models["User"].bulkCreate([
            {
                username: "js8zq332",
                password: pwd,
                pin: pin
            }
        ]);
    }

    process.exit();
}
