"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User);
    }
    get age() {
      var today = new Date();
      var birthDate = new Date(this.birthday);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    get formatBirthdayEdit() {
      return new Date(this.birthday).toISOString().split("T")[0];
    }
  }
  Profile.init(
    {
      bio: DataTypes.TEXT,
      profilePicture: DataTypes.STRING,
      isPrivate: DataTypes.BOOLEAN,
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gender: DataTypes.CHAR(1),
      birthday: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isBeforeToday(value) {
            if (value && new Date(value) >= new Date()) {
              throw new Error("Birthday must be before today");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  Profile.beforeCreate((profile) => {
    profile.isPrivate = false;
  });
  return Profile;
};
