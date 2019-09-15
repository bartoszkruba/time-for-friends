import React, {Component, Fragment} from 'react';
import {FormGroup, Input} from "reactstrap";
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'


export default class SearchBar extends Component {

  render() {
    const props = this.props;

    return <Fragment>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-4">
          <FormGroup>
            <Input onChange={props.formChanged} value={props.firstName} type="text" name="firstName"
                   placeholder="First Name"/>
          </FormGroup>
        </div>
        <div className="col-md-4">
          <FormGroup>
            <Input onChange={props.formChanged} value={props.lastName} type="text" name="lastName"
                   placeholder="Last Name"/>
          </FormGroup>
        </div>
        <div className="col-md-3"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <Input value={props.betweenSwitch} onChange={props.formChanged} type="checkbox"/>
          <h3 className="mr-4" style={{display: "inline"}}> Time Between: </h3>
          <span style={{backgroundColor: "white", color: "black", innerHeight: "100%"}}>
          <DateTimeRangePicker
            onChange={props.rangeChanged}
            value={props.range}
          />
          </span>
        </div>
        <div className="col-md-3"/>
      </div>
    </Fragment>
  }
}