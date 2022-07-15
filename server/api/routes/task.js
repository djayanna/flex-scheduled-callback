var express = require("express");
var router = express.Router();
const config = require("../config");
const twilio = require("twilio");
const TokenValidator = require("twilio-flex-token-validator").validator;

router.post("/accept-wrapup-task", async (req, res) => {
  let { sid, taskSid, workspaceSid } = req.body;

  try {
      let token = req.header("authorization");

      const validateResult = await TokenValidator(
        token,
        config.twilio.accountSid,
        config.twilio.authToken
      );

    const client = twilio(
        config.twilio.accountSid,
        config.twilio.authToken
      );

    await client.taskrouter
      .workspaces(workspaceSid)
      .tasks(taskSid)
      .reservations(sid)
      .update({ reservationStatus: "accepted" });

    await client.taskrouter.workspaces(workspaceSid).tasks(taskSid).update({
      assignmentStatus: "wrapping",
      reason: "callback ",
    });

    res.send({});
  } catch (error) {
    console.log("Error updating task", error);
  }
});

module.exports = router;
