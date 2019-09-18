import React, {Component, Fragment} from 'react';
import {CustomInput, FormGroup, Input} from "reactstrap";
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'


export default class SearchBar extends Component {

  render() {
    const props = this.props;

    return <Fragment>
      <div className="row mt-4">
        <div className="col-md-1"/>
        <div className="col-md-5">
          <FormGroup>
            <Input onChange={props.formChanged} value={props.firstName} type="text" name="firstName"
                   placeholder="First Name"/>
          </FormGroup>
        </div>
        <div className="col-md-5">
          <FormGroup>
            <Input onChange={props.formChanged} value={props.lastName} type="text" name="lastName"
                   placeholder="Last Name"/>
          </FormGroup>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row mt-3">
        <div className="col-md-1"/>
        <div className="col-md-5 mt-1">
          <h4 className="mr-4" style={{display: "inline"}}> Sorting </h4>
          <CustomInput inline checked={props.sortingSwitch} type="switch" id="sortingSwitch" name="sortingSwitch"
                       onChange={props.sortingChanged} label={props.sortingSwitchLabel}/>
        </div>
        <div className="col-md-5 mt-1">
          <h4 className="mr-4" style={{display: "inline"}}> Time Picker </h4>
          <CustomInput inline checked={props.betweenSwtich} type="switch" id="betweenSwitch" name="betweenSwitch"
                       label={props.betweenSwtichLabel} onChange={props.formChanged}/>
        </div>
        <div className="col-md-1"/>
      </div>
      {props.betweenSwtich ?
        <div className="row mt-3">
          <div className="col-md-1"/>
          <div className="col-md-10">
          <span className="Time mt-4" style={{display: "block"}}>
          <DateTimeRangePicker
            disableClock={true}
            calendarIcon={null}
            clearIcon={null}
            format="yyyy.MM.dd | HH:mm"
            onChange={props.rangeChanged}
            value={props.range}
          />
          </span>
          </div>
          <div className="col-md-1"/>
        </div> : null}
    </Fragment>
  }
}