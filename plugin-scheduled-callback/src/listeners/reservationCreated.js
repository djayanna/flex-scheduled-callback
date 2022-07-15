import * as Flex from '@twilio/flex-ui';

import * as util from "../helpers";
//import {acceptCallbackTask} from "./helpers"

export default function reservationCreated(manager) {
    manager.workerClient.on('reservationCreated', (reservation) => {

        // check it is a callback task. register for beforeAccept event

        console.log("reservation object", reservation);

        console.log("callback", reservation.task.attributes.callback);

        let callback = reservation.task.attributes.callback;


     if(callback) {
      // Register listener for reservation wrap up event

      //console.log("autodial");

    //   reservation.on('beforeAcceptTask', async () => {
    //     console.log(`Callback - beforeAcceptTask `);

    //     // autocomplete task

    //     // start outbound call 

    //   });
 // todo:
  //  util.acceptCallbackTask(manager, );

    reservation.addListener('wrapup', async (payload, abort) => {
        const { task } = payload;
        if (task.attributes.callback && task.attributes.callback?.autoDial) {
          const number = task.attributes.callback.phoneNumber;
          const callback_id = task.attributes.callback.id;
           util.startOutboundCall(number, { type: "outbound_callback", callbackTaskSid: task.sid, callback_id });
           // Flex.Actions.invokeAction("StartOutboundCall", { destination: number, taskAttributes: { type: "outbound_callback", callbackTaskSid: task.sid, callback_id }});
        }
      });


    let taskAttributes = {
      workspaceSid: 'WS36c83272d50eeb1681e5e6a8fdea7560', //payload.task.workspaceSid,
      taskSid: reservation.task.sid,
      sid: reservation.sid,
    };

    // accept and complete reservation
    util.acceptCallbackTask(taskAttributes);

  }
    });
  }