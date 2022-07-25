var express = require("express");
var router = express.Router();
const twilio = require("twilio");
const config = require("../config");

router.post("/", async (req, res) => {
  try {

    console.log(req.body[0].data);
    // const twilioSignature = req.headers["x-twilio-signature"];
    // const url = "http://f68c-71-121-233-24.ngrok.io/events"; // req.protocol + "://" + req.get("host") + req.originalUrl;
    // console.log("url", url);
    // const params = req.body;

    // const requestIsValid = twilio.validateRequest(
    //   config.twilio.authToken,
    //   twilioSignature,
    //   url,
    //   params
    // );

    // console.log(url, config.twilio.authToken, params, twilioSignature);
    // if (!requestIsValid) {
    //   return res.status(401).send("Unauthorized");
    // }

    const func = eventToFuncMap[req.body[0].type];
    if (func) {
      func(req.body[0]);
    } else {
      console.log("no handler");
    }
    res.status(200).send();
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
});

const processTaskRouterReservationEvent = async (payload) => {

  const data = payload.data.payload;

  let taskAttributes = JSON.stringify(data.task_attributes);

  taskAttributes = JSON.parse(JSON.parse(taskAttributes));
  // console.log(taskAttributes);
  console.log("data...", data);
  if (taskAttributes.type === "callback") {
    const workerSid = data.worker_sid;
    const date = data.task_date_created;
    const callbackId = taskAttributes.callback.id;
    const taskSid = data.task_sid;

    var sql = require("mssql");
    // connect to your database
    sql.connect(config.sql, async function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("Id", sql.UniqueIdentifier, callbackId);
      request.input("TaskSid", sql.NVarChar(50), taskSid);
      request.input("CompletedDateTime", sql.DateTime, date);
      request.input("CompletedBy", sql.NVarChar(50), workerSid);

      // query to the database and get the records
      const rs = await request.query(
        "UPDATE [dbo].[Callback] \
               SET \
                     [TaskSid] = @TaskSid \
                     ,[CompletedBy] = @CompletedBy \
                     ,[CompletedDateTime] = @CompletedDateTime \
                 WHERE  [Id] = @Id "
      );
    });
  } else if (taskAttributes.type === "outbound_callback") {
    const workerSid = data.worker_sid;
    const date = data.task_date_created;
    const callbackId = taskAttributes.callback_id;
    const taskSid = data.task_sid;
    const conferenceSid = taskAttributes.conference.sid

    // type: "outbound_callback", callbackTaskSid: task.sid, callback_id

    var sql = require("mssql");
    // connect to your database
    sql.connect(config.sql, async function (err) {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
      request.input("Id", sql.UniqueIdentifier, callbackId);
      request.input("OutboundTaskSid", sql.NVarChar(50), taskSid);
      request.input("OutboundCallSid", sql.NVarChar(50), conferenceSid);
    //  request.input("CompletedBy", sql.NVarChar(50), workerSid);

      // query to the database and get the records
      const rs = await request.query(
        "UPDATE [dbo].[Callback] \
               SET \
                     [OutboundTaskSid] = @OutboundTaskSid \
                     ,[OutboundCallSid] = @OutboundCallSid \
                 WHERE  [Id] = @Id "
      );
    });
  }
};

const eventToFuncMap = {
  "com.twilio.taskrouter.reservation.accepted":
    processTaskRouterReservationEvent,
};

module.exports = router;
