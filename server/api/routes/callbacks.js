var express = require("express");
var dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
var router = express.Router();
const TokenValidator = require("twilio-flex-token-validator").validator;

const client = require("../data");

const config = require("../config");
const { getCallbacks } = require("../data/queries");

/* GET callback list. */
router.get("/", async function (req, res, next) {
  let token = req.header("authorization");
  try {
    const validateResult = await TokenValidator(
      token,
      config.twilio.accountSid,
      config.twilio.authToken
    );

    const workerSid = validateResult.worker_sid;
    const rs = await (await client()).callbacks.getCallbacks(workerSid);
    const result = getCallBackList(rs.recordset);
    res.send(result);
  } catch (e) {
    console.error(e);
    if (e === "The authorization with Token failed") {
      res.status(401).send(e);
    }
  }
});

router.post("/", async function (req, res, next) {
  let token = req.header("authorization");
  let {
    firstName,
    lastName,
    phoneNumber,
    date,
    time,
    notes,
    autoDial,
    routeToQueue,
    workerSid,
    workerName,
  } = req.body;
  try {
    const validateResult = await TokenValidator(
      token,
      config.twilio.accountSid,
      config.twilio.authToken
    );

    const rs = await (
      await client()
    ).callbacks.addCallback({
      firstName,
      lastName,
      phoneNumber,
      date,
      time,
      notes,
      autoDial,
      routeToQueue,
      workerSid,
      workerName,
    });

    console.log(rs);
    res.send(rs.recordset);
  } catch (e) {
    console.error(e);
    if (e === "The authorization with Token failed") {
      res.status(401).send(e);
    }
  }
});

router.delete("/:id", async function (req, res, next) {
  let token = req.header("authorization");
  let id = req.params.id;
  try {
    const validateResult = await TokenValidator(
      token,
      config.twilio.accountSid,
      config.twilio.authToken
    );

    const rs = await (await client()).callbacks.deleteCallback({ id });
  } catch (error) {
    console.error(e);
    if (e === "The authorization with Token failed") {
      res.status(401).send(e);
    }
  }
});

/* Post callback */
router.post("/:id", async function (req, res, next) {
  let token = req.header("authorization");

  let id = req.params.id;
  let {
    firstName,
    lastName,
    phoneNumber,
    date,
    time,
    notes,
    autoDial,
    routeToQueue,
    workerSid,
    workerName,
  } = req.body;
  try {
    const validateResult = await TokenValidator(
      token,
      config.twilio.accountSid,
      config.twilio.authToken
    );

    const rs = await (
      await client()
    ).callbacks.updateCallback({
      id,
      firstName,
      lastName,
      phoneNumber,
      date,
      time,
      notes,
      autoDial,
      routeToQueue,
      workerSid,
    });
    res.send(getCallBackList(rs.recordset));
  } catch (e) {
    console.error(e);
    if (e === "The authorization with Token failed") {
      res.status(401).send(e);
    }
  }
});

const getCallBackList = (recordset) => {
  let result = [];
  recordset.forEach((callback) => {
    console.log(callback.Date);
    console.log(dayjs(callback.Date).format("YYYY-MM-DD"));

    let data = {
      id: callback.Id,
      firstName: callback.FirstName,
      lastName: callback.LastName,
      phoneNumber: callback.PhoneNumber,
      date: dayjs(callback.Date).format("YYYY-MM-DD"),
      time: dayjs(callback.Date).format("HH:mm"),
      notes: callback.Notes,
      autoDial: callback.AutoDial,
      routeToQueue: callback.RouteToQueue,
      workerSid: callback.WorkerSid,
      workerName: callback.WorkerName,
    };

    result.push(data);
  });

  return result;
};

module.exports = router;
