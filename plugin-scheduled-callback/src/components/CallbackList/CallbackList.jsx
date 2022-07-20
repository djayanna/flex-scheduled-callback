
import React from 'react';
import { Actions, withTheme, IconButton, FlexBox } from '@twilio/flex-ui';
import {formatReturnTime} from '@twilio-paste/core/time-picker'
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';
import {
    Button,
    TableHead,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
    TextField, Typography
  } from "@material-ui/core";

  import  {TableHeaderCell, FilterTextField, StyledDiv}  from './CallbackList.Styles'; 
  import CallbackDetails from '../CallbackDetails/CallbackDetails.Container';
  import {getScheduledCallback, deleteScheduledCallback} from '../../helpers'
  import { Manager } from '@twilio/flex-ui';
  const manager = Manager.getInstance();

  const INITIAL_STATE = {
    selectedCallback: undefined
  };

class CallbackList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedCallback: undefined,
    }
  }

  componentDidMount() {
    this.props.getCallbacks();
  }

  editCallback = (callback) => {
    this.setState({ selectedCallback: callback });
    Actions.invokeAction('SetComponentState', {
      name: 'CallbackDetails',
      state: { isOpen: true, isNew: false }
    });

  }

  deleteCallback = async(callback) => {

   this.props.deleteCallback(callback);

  }

  addNew = () => {

    const worker = manager.store.getState().flex.worker.worker;
    const newCallback = {
      workerSid: worker.sid,
      workerName: worker.name,
      id: undefined,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      date: "",
      time: "",
      notes: "",
      autoDial: false,
      routeToQueue: false,
      changed: false,
      isPhoneNumberValid: false,
    };
    this.setState({ selectedCallback: newCallback });
    Actions.invokeAction('SetComponentState', {
      name: 'CallbackDetails',
      state: { isOpen: true, isNew: true },
    });
  }

  resetCallback = () => {
    this.setState(INITIAL_STATE);
  }
  
    render() {
      
        return (
            <FlexBox vertical padding="space60">
              <FlexBox vertical noGrow> <Typography variant="h5">Callback List</Typography>
<div><Button  size='small' variant="outlined" onClick={this.addNew}> Add New</Button></div></FlexBox>

            <FlexBox horizontal noGrow >
              <FlexBox noGrow>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>
                      First Name
                    </TableHeaderCell>
                    <TableHeaderCell>
                        Last Name
                    </TableHeaderCell>
                    <TableHeaderCell>
                     Phone Number
                    </TableHeaderCell>
                    <TableHeaderCell>
                    Date
                    </TableHeaderCell>
                    <TableHeaderCell>Time</TableHeaderCell>
                    <TableHeaderCell> Action </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { this.props.callbacks?.map((callback) => (
                    <TableRow key={callback.id}>
                      <TableCell><StyledDiv> {callback.firstName} </StyledDiv></TableCell>
                      <TableCell><StyledDiv> {callback.lastName} </StyledDiv></TableCell>
                      <TableCell><StyledDiv>{callback.phoneNumber} </StyledDiv></TableCell>
                      <TableCell><StyledDiv> {callback.date} </StyledDiv></TableCell>
                      <TableCell><StyledDiv> {formatReturnTime(callback.time, 'hh:mm aa')
                      } </StyledDiv></TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            this.editCallback(callback);
                          }}
                        >edit</Button>

                        <Button
                          onClick={() => {
                            this.deleteCallback(callback);
                          }}
                        >delete</Button>
                      </TableCell>
                    </TableRow>))} 
                </TableBody>
              </Table>
              </FlexBox>
              <FlexBox>
              <CallbackDetails key="callback-details" callback={this.state.selectedCallback} resetCallback={this.resetCallback} />
              </FlexBox>
            </FlexBox>
            
          </FlexBox>
        
            );

    }
}

export default CallbackList;
