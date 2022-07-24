
import * as util from "../helpers";
import {autoAcceptReservation} from '../config'

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
          util.startOutboundCall(number, task);
        }
      });

      reservation.addListener("accepted", async (res) => {
        res.wrap();
      });

      if(autoAcceptReservation()) {
        reservation.accept();
       }

    }
  });
}
