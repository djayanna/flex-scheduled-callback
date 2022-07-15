
import * as util from "../helpers";

export default function reservationCreated(manager) {
  manager.workerClient.on("reservationCreated", (reservation) => {

    console.log("reservationCreated handler");
    let callback = reservation.task.attributes.callback;

    if (callback) {
      reservation.addListener("wrapup", async (payload, abort) => {
        console.log("wrapup handler");
        const { task } = payload;
        if (task.attributes.callback && task.attributes.callback?.autoDial) {
          const number = task.attributes.callback.phoneNumber;
          const callback_id = task.attributes.callback.id;
          util.startOutboundCall(number, {
            type: "outbound_callback",
            callbackTaskSid: task.sid,
            callback_id,
          });
        }
      });

      const { FLEX_APP_WORKSPACE } = process.env;
      let taskAttributes = {
        workspaceSid: FLEX_APP_WORKSPACE,
        taskSid: reservation.task.sid,
        sid: reservation.sid,
      };

      // accept and complete reservation
      util.acceptCallbackTask(taskAttributes);
    }
  });
}
