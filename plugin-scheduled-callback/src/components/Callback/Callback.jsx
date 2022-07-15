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
        >
           Call ( {props.task.attributes.callback.phoneNumber} )
        </Button> }
        <p>&nbsp;</p>
      </span>
  );
};

export default Callback;