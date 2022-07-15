const sql = require("mssql");
const config = require( "../config");

class MSSql {
  async getConnection() {
    try {
      return await sql.connect(config.sql);
    } catch (error) { console.error}
  }
}

module.exports = new MSSql();
