import React, {Component, Fragment} from 'react';
import {CustomInput, FormGroup, Input} from "reactstrap";
import 'rc-slider/assets/index.css';
import {Range} from 'rc-slider';
import moment from 'moment-timezone';

export default class SearchBar extends Component {


  tipFormatter = value => {
    return moment(value).format("YYYY.MM.DD, HH:MM")
  };

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
        <div className="row mt-5">
          <div className="col-md-1"/>
          <div className="col-md-5">
            <h2>From: {this.tipFormatter(props.range.from)}</h2>
          </div>
          <div className="col-md-5">
            <h2>To: {this.tipFormatter(props.range.to)}</h2>
          </div>
          <div className="col-md-1"/>
        </div>
        <div className="row mt-4">
          <div className="col-md-1"/>
          <div className="col-md-10">
            <Range
              min={props.range.min}
              max={props.range.max}
              allowCross={false}
              defaultValue={[0, 0]}
              value={[props.range.from, props.range.to]}
              onChange={props.rangeChanged}/>
          </div>
          <div className="col-md-1"/>
        </div>
      </Fragment> : null}
    </Fragment>
  }
}