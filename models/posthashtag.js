"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostHashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PostHashtag.init(
    {
      PostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      HashtagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Hashtag is required",
          },
          notEmpty: {
            msg: "Hashtag is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "PostHashtag",
    }
  );
  return PostHashtag;
};
