"use strict";

const fs = require("fs").promises;
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile("./data/user.json", "utf8")).map(
      (el) => {
        delete el.id;
        const salt = bcrypt.genSaltSync(10);
        el.password = bcrypt.hashSync(el.password, salt);
        el.createdAt = el.updatedAt = new Date();
        return el;
      }
    );

    await queryInterface.bulkInsert("Users", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
