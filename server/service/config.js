const dotenv = require("dotenv");
dotenv.config();

const {
  SQL_SERVER,
  SQL_DATABASE,
  SQL_USER,
  SQL_PASSWORD,
  ACCOUNT_SID,
  AUTH_TOKEN,
  WORKSPACE_SID,
  CALLBACK_WORKFLOW_SID,
} = process.env;

const sqlEncrypt = process.env.SQL_ENCRYPT === "true";

module.exports = {
  sql: {
    server: SQL_SERVER,
    database: SQL_DATABASE,
    user: SQL_USER,
    password: SQL_PASSWORD,
    options: {
      encrypt: sqlEncrypt,
    },
  },
  twilio: {
    accountSid: ACCOUNT_SID,
    authToken: AUTH_TOKEN,
    workspaceSid: WORKSPACE_SID,
    workflowSid: CALLBACK_WORKFLOW_SID,
  }
};
