import * as React from "react";
import { connect } from "react-redux";
import {
  Actions,
  withTheme,
  Manager,
  SidePanel,
  FlexBox,
} from "@twilio/flex-ui";
import { Button } from "@twilio/flex-ui-core";
import { DatePicker, formatReturnDate } from "@twilio-paste/core/date-picker";
import { TimePicker } from "@twilio-paste/core/time-picker";
import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import { updateScheduledCallback, addScheduledCallback } from "../../helpers";

import {
  TableHead,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Checkbox,
  Select,
} from "@material-ui/core";

import {
  Container,
  StyledTableCell,
  StyledFieldName,
  StyledTextField,
  ButtonsContainer,
} from "./CallbackDetails.styles";

const INITIAL_STATE = {
  worker_sid: "",
  id: "",
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

class CallbackDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleChange = this.handleChange.bind(this);
  }

  handleClose = () => {
    this.setState(INITIAL_STATE);
    //Clear selectedWorker from parent component
    this.props.resetCallback();
    this.closeDialog();
  };

  closeDialog = () => {
    Actions.invokeAction("SetComponentState", {
      name: "CallbackDetails",
      state: { isOpen: false },
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.callback && this.props.callback !== prevProps.callback) {
      const callback = this.props.callback;
      this.setState({
        workerSid: callback.workerSid || "",
        workerName: callback.workerName || "",
        id: callback.id || "",
        firstName: callback.firstName || "",
        lastName: callback.lastName || "",
        phoneNumber: callback.phoneNumber || "",
        date: callback.date || "",
        time: callback.time || "",
        notes: callback.notes || "",
        autoDial: callback.autoDial || false,
        routeToQueue: callback.routeToQueue || false,
        changed: false,
        isPhoneNumberValid: this.checkPhoneNumberIsValid(callback.phone_number),
      });
    }
  }

  handleChange = (e) => {
    console.log("change event ", e.target, e.target.id);
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    //Text Field id needs to match State property
    const id = e.target.id;
    let newState = { changed: true };
    newState[id] = value;
    this.setState(newState);
    console.log(this.state);
  };

  handlePhoneNumberChange = (e) => {
    const isValid = this.checkPhoneNumberIsValid(e.target.value);
    let newState = { changed: true };
    newState["isPhoneNumberValid"] = isValid;
    this.setState(newState);
    this.handleChange(e);
  };

  checkPhoneNumberIsValid = (value) => {
    try {
      const phoneUtil = PhoneNumberUtil.getInstance();
      return phoneUtil.isValidNumberForRegion(
        phoneUtil.parse(value, "US"),
        "US"
      );
    } catch (e) {
      console.error(e);
    }
  };

  saveCallBackDetails = async () => {
    const callback = {
      id: this.state.id,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      date: this.state.date,
      time: this.state.time,
      notes: this.state.notes,
      routeToQueue: this.state.routeToQueue,
      autoDial: this.state.autoDial ,
      workerSid: this.state.workerSid,
      workerName: this.state.workerName,
    };

    if (this.props.isNew) {
      console.log("saving...");
      const newId = await addScheduledCallback(callback);
      const updated = {
        ...callback,
        id: newId[0].Id,
      };

      this.props.addCallback(updated);
    } else {
      const updated = await updateScheduledCallback(callback);
      if (updated) {
        this.props.updateCallback(updated);
      }
    }

    this.closeDialog();
  };

  render() {
    const { isOpen, callback, theme } = this.props;
    const {
      changed,
      firstName,
      lastName,
      phoneNumber,
      date,
      time,
      notes,
      routeToQueue,
      autoDial,
      isPhoneNumberValid,
    } = this.state;
    return (
      <SidePanel
        displayName="CallbackDetailsPanel"
        title={<div>Callback Details</div>}
        isHidden={!isOpen}
        handleCloseClick={this.handleClose}
      >
        <Container vertical>
          <Table>
            <TableBody>
              <TableRow key="firstName">
                <StyledTableCell>
                  <StyledFieldName>First Name</StyledFieldName>
                </StyledTableCell>
                <TableCell>
                  <StyledTextField
                    id="firstName"
                    value={firstName}
                    onChange={this.handleChange}
                  />
                </TableCell>
              </TableRow>
              <TableRow key="lastName">
                <StyledTableCell>
                  <StyledFieldName>Last Name</StyledFieldName>
                </StyledTableCell>
                <TableCell>
                  <StyledTextField
                    id="lastName"
                    value={lastName}
                    onChange={this.handleChange}
                  />
                </TableCell>
              </TableRow>
              <TableRow key="phoneNumber">
                <StyledTableCell>
                  <StyledFieldName>Phone Number</StyledFieldName>
                </StyledTableCell>
                <TableCell>
                  <StyledTextField
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={this.handlePhoneNumberChange}
                    error={!isPhoneNumberValid}
                  />
                </TableCell>
              </TableRow>
              <TableRow key="date">
                <StyledTableCell>
                  <StyledFieldName>Date</StyledFieldName>
                </StyledTableCell>
                <TableCell>
                  <DatePicker
                    id="date"
                    name="s_date"
                    value={date}
                    onChange={this.handleChange}
                    required
                  />
                </TableCell>
              </TableRow>
              <TableRow key="time">
                <StyledTableCell>
                  <StyledFieldName>Time</StyledFieldName>
                </StyledTableCell>
                <TableCell>
                  <TimePicker
                    required
                    id="time"
                    value={time}
                    onChange={this.handleChange}
                  />
                </TableCell>
              </TableRow>
              <TableRow key="notes">
                <StyledTableCell>
                  <StyledFieldName>Notes</StyledFieldName>
                </StyledTableCell>
                <TableCell>
                  {" "}
                  <TextField
                    id="notes"
                    multiline
                    rows={4}
                    value={notes}
                    onChange={this.handleChange}
                    variant="standard"
                  />
                </TableCell>
              </TableRow>

              <TableRow key="autoDial">
                <StyledTableCell>
                  <StyledFieldName>Auto Dial</StyledFieldName>
                </StyledTableCell>
                <TableCell>
                  <Checkbox
                    id="autoDial"
                    checked={autoDial}
                    onChange={this.handleChange}
                  />
                </TableCell>
              </TableRow>
              <TableRow key="queueName">
                <StyledTableCell>
                  <StyledFieldName>
                    Route to Queue (Agent Unvailable){" "}
                  </StyledFieldName>
                </StyledTableCell>
                <TableCell>
                  <Checkbox
                    id="routeToQueue"
                    checked={routeToQueue}
                    onChange={this.handleChange}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <ButtonsContainer>
            <Button
              id="saveButton"
              onClick={this.saveCallBackDetails}
              //themeOverride={theme.CallbackDetails.SaveButton}
              roundCorners={false}
              disabled={!changed}
            >
              SAVE
            </Button>
          </ButtonsContainer>
        </Container>
      </SidePanel>
    );
  }
}
const mapStateToProps = (state) => {
  const componentViewStates = state.flex.view.componentViewStates;
  const dialogState =
    componentViewStates && componentViewStates.CallbackDetails;
  const isOpen = dialogState && dialogState.isOpen;
  const isNew = dialogState && dialogState.isNew;
  return {
    isOpen,
    isNew,
  };
};

export default connect(mapStateToProps)(withTheme(CallbackDetails));
