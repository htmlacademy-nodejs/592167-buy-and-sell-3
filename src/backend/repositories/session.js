'use strict';

const {sequelize} = require(`../db/db-connect`);

const checkLogin = async (userName) => {
  const sql = `select data
               from "Session"
               where data like '%${userName}%';`;
  const type = sequelize.QueryTypes.SELECT;

  return await sequelize.query(sql, {type});
};

module.exports = {
  checkLogin,
};
