export default (sequzlize, DataTypes) => {
  const User = sequzlize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING
    }
  });

  User.relation = function(models) {
    // 		User.belongsTo(models['Silo']);
    // 		User.belongsTo(models['Role']);
    // 		User.belongsToMany(models['Module'], {through: 'UserModule'})
  };

  return User;
};
