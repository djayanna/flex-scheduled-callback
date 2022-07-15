import React from "react";
import { VERSION, View } from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import reducers, { namespace } from "./states";
import * as listeners from "./listeners";
import CallbackComponent from "./components/Callback/Callback";
import CallbackList from "./components/CallbackList/CallbackList.Container";
import CallbackSchedulerLink from "./components/CallbackList/CallbackSchedulerLink";
const PLUGIN_NAME = "CallbackPlugin";

export default class CallbackPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);

    // Registering action listeners
    this.registerListeners(manager);

    flex.SideNav.Content.add(
      <CallbackSchedulerLink key="callback-scheduler-sidenav-button" />,
      { sortOrder: 2 }
    );

    flex.ViewCollection.Content.add(
      <View name="callback-scheduler-view" key="callback-scheduler-view">
        <CallbackList key="callback-scheduler" />
      </View>
    );

    flex.TaskInfoPanel.Content.replace(
      <CallbackComponent key="task-info-callback" manager={manager} />,
      {
        sortOrder: -1,
        if: (props) => props.task.attributes.callback,
      }
    );

    flex.TaskCanvasTabs.Content.remove("call", {
      if: (props) => props.task.attributes.callback,
    });

    flex.TaskCanvasTabs.Content.remove("incoming", {
      if: (props) => props.task.attributes.callback,
    });

    flex.Actions.replaceAction("AcceptTask", async (payload, original) => {
      if (payload.task.attributes.callback) {
        // no op
      } else {
        original(payload);
      }
    });
  }

  /**
   * Registers the listeners
   *
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  registerListeners(manager) {
    listeners.reservationCreatedListener(manager);
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
      );
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
