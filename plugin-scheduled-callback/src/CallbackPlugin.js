import React from "react";
import { VERSION, View } from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import reducers, { namespace } from "./states";
import * as listeners from "./listeners";
import CallbackComponent from "./components/Callback/Callback";
import CallbackList from "./components/CallbackList/CallbackList.Container";
import CallbackSchedulerLink from "./components/CallbackList/CallbackSchedulerLink";
const PLUGIN_NAME = "CallbackPlugin";
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import {autoAcceptReservation} from './config'
import * as util from "./helpers";
import { CustomizationProvider } from "@twilio-paste/core/customization";
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';

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
    this.registerListeners(flex, manager);

       // include this in the init method

       flex.setProviders({
        CustomProvider: (RootComponent) => (props) => {
          return (
            <StylesProvider generateClassName={createGenerateClassName({
              productionPrefix: PLUGIN_NAME,
              seed: PLUGIN_NAME
            })}>
                <RootComponent {...props} />
              </StylesProvider>
          );
        },
        PasteThemeProvider: CustomizationProvider
      });

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

    const channelDefinition = flex.DefaultTaskChannels.createDefaultTaskChannel(
      'callback',
      (task) => {
        const { type } = task.attributes;
        return task.taskChannelUniqueName === 'voice' && type === 'callback';
      },
      'CallbackIcon',
      'CallbackIcon',
      'palegreen',
    );
  
    const { templates } = channelDefinition;
    const CallbackChannel = {
      ...channelDefinition,
      templates: {
        ...templates,
        TaskListItem: {
          ...templates?.TaskListItem,
          firstLine: (task) => `${task.queueName}: ${task.attributes.callback.name}`
        },
        TaskCanvasHeader: {
          ...templates?.TaskCanvasHeader,
          title: (task) => `${task.queueName}: ${task.attributes.callback.name}`
        },
        // IncomingTaskCanvas: {
        //   ...templates?.IncomingTaskCanvas,
        //   firstLine: (task) => task.queueName
        // }
      },
      icons: {
        active: <PhoneCallbackIcon key="active-callback-icon" />,
        list: <PhoneCallbackIcon key="list-callback-icon" />,
        main: <PhoneCallbackIcon key="main-callback-icon" />,
      }
    }
  
    // Register Channel
    flex.TaskChannels.register(CallbackChannel);
    
  }

  /**
   * Registers the listeners
   *
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  registerListeners(flex, manager) {
    listeners.reservationCreatedListener(manager);

    flex.Actions.addListener("beforeAcceptTask", (payload, abortFunction) => {

      const {task} = payload;

     if (task.attributes.callback) {

      if(!autoAcceptReservation()) {
       
       payload.wrap();
      }

      abortFunction();
    } 
  }); 
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
