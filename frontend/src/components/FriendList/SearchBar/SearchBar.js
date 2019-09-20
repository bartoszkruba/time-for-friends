import React, {Component, Fragment} from 'react';
import {CustomInput, FormGroup, Input} from "reactstrap";
import DateTimePicker from 'react-datetime-picker';

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
          <h4 className="mr-4" style={{display: "inline"}}> Sort By </h4>
          <Input className="mt-2" placeholder="Sorting" type="select" value={props.sorting} name="sorting"
                 onChange={props.formChanged}>
            <option>First Name</option>
            <option>Country</option>
            <option>Current Time</option>
          </Input>
        </div>
        <div className="col-md-5 mt-1">
          <h4 className="mr-4" style={{display: "inline"}}> Time Picker </h4>
          <CustomInput inline checked={props.betweenSwtich} type="switch" id="betweenSwitch" name="betweenSwitch"
                       label={props.betweenSwtichLabel} onChange={props.formChanged}/>
        </div>
        <div className="col-md-1"/>
      </div>
      {props.betweenSwtich ? <Fragment>
        <div className="row mt-4">
          <div className="col-md-1"/>
          <div className="col-md-5 mt-1">
            <h4 className="mr-3" style={{display: "inline"}}>From:</h4>
            <span className="Time mt-4">
          <DateTimePicker
            calendarIcon={null}
            clearIcon={null}
            format="yyyy.MM.dd HH:mm"
            onChange={props.fromChanged}
            value={props.range.from}
          />
          </span>
          </div>
          <div className="col-md-5 mt-1">
            <h4 className="mr-3" style={{display: "inline"}}>To:</h4>
            <span className="Time mt-4">
          <DateTimePicker
            calendarIcon={null}
            clearIcon={null}
            format="yyyy.MM.dd HH:mm"
            onChange={props.toChanged}
            value={props.range.to}
          />
          </span>
          </div>
          <div className="col-md-1"/>
        </div>
      </Fragment> : null}
    </Fragment>
  }
}