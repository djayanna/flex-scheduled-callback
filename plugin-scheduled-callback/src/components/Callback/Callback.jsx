import React from 'react';
import {  Button } from '@twilio/flex-ui';
import * as util from "../../helpers";

const styles = {
    itemWrapper: {
      width: '100%'
    },
    itemBold: { fontWeight: 'bold' },
    item: {
      width: 100
    },
    itemDetail: {
      textAlign: 'right',
      float: 'right',
      marginRight: '5px',
      marginTop: '3px'
    },
    cbButton: {
      width: '100%',
      marginBottom: '5px',
      fontSize: '10pt'
    },
    textCenter: {
      textAlign: 'center',
      color: 'blue'
    },
    info: { position: 'relative', top: '3px' }
  };

const Callback = (props) => {
  return (
      <span className='Twilio'>
        <h1>Contact CallBack Request</h1>
        <h4 style={styles.itemBold}>Callback Details</h4>
        <ul>
        <li>
            <div style={styles.itemWrapper}>
              <span style={styles.item}>Contact Name:</span>
              <span style={styles.itemDetail}>
                {`${props.task.attributes.callback.firstName} ${props.task.attributes.callback.lastName}` }
              </span>
            </div>
          </li>
          <li>&nbsp;</li>
          <li>
            <div style={styles.itemWrapper}>
              <span style={styles.item}>Contact Phone:</span>
              <span style={styles.itemDetail}>
                {props.task.attributes.callback.phoneNumber}
              </span>
            </div>
          </li>
          <li>&nbsp;</li>
          <li>
            <div style={styles.itemWrapper}>
              <span style={styles.item}>Notes:</span>
              <span style={styles.itemDetail}>
                {props.task.attributes.callback.notes}
              </span>
            </div>
          </li>
          <li>&nbsp;</li>
          </ul>
          { props.task.attributes.callback.autoDial === false && 
        <Button
          style={styles.cbButton}
          variant='contained'
          color='primary'
          onClick={e => util.startOutboundCall(props.task.attributes.callback.phoneNumber, { type: "outbound_callback", callbackTaskSid: props.task.sid, callback_id: props.task.attributes.callback.id })}
        //   disabled={
        //       "ui_plugin" in props.task.attributes &&
        //       "cbCallButtonAccessibility" in props.task.attributes.ui_plugin &&
        //       props.task.attributes?.autoLaunchCallback != "1" &&
        //       (
        //         !("FlexCallType" in props.task.attributes) ||
        //         props.task.attributes?.FlexCallType !== "callback"
        //       )
        //     ?
        //       this.props.task.attributes.ui_plugin.cbCallButtonAccessibility
        //     :
        //       true
        //   }
        >
           Call ( {props.task.attributes.callback.phoneNumber} )
        </Button> }
        {/* Keeping this here in case requeue functionality is desired in the future

        <p style={styles.textCenter}>Not answering? Requeue to try later.</p>
        <Button
          style={styles.cbButton}
          variant='outlined'
          color='primary'
          onClick={e => this.startTransfer()}
          disabled={count < 3 ? false : true}
        >
          Requeue Callback ( {this.props.task.attributes.placeCallRetry} of 3 )
        </Button> */}
        <p>&nbsp;</p>
      </span>
    // </CustomTaskListComponentStyles>
  );
};

export default Callback;