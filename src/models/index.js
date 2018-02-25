import fs from "fs";
import path from "path";
import Sequelize from "sequelize";

class Database {
  constructor(config) {
    if (!config) throw new Error("required a valid config file");
    this.sequelize = new Sequelize(
      config.db.databaseName,
      config.db.username,
      config.db.password,
      {
        host: config.db.host,
        dialect: config.db.dialect,
        port: config.db.port,
        pool: config.db.pool
      }
    );

    this.Sequelize = Sequelize;

    this._loadModels(__dirname);

    this.models = this.sequelize.models;

    Object.values(this.models)
      .filter(m => m.relation)
      .forEach(m => m.relation(this.models));

    this.sequelize
      .authenticate()
      .then(() => {
        console.log("成功连接到 数据库!");
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });
  }

  // 	getAllSchemas() {
  // 		let schemas = [];
  // 		Object.values(this.models)
  // 			.forEach(m => schemas.indexOf(m.options.schema) === -1 ? schemas.push(m.options.schema) : null);
  //
  // 		return schemas;
  // 	}

  _loadModels(dir) {
    fs
      .readdirSync(dir)
      .filter(f => f !== "index.js")
      .forEach(
        f =>
          f.indexOf(".") >= 0
            ? this.sequelize.import(path.join(dir, f))
            : this._loadModels(path.join(dir, f))
      );
  }
}

export default Database;
