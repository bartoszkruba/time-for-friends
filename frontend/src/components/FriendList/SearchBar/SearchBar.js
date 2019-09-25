import React, {Component, Fragment} from 'react';
import {CustomInput, FormGroup, Input} from "reactstrap";
import 'rc-slider/assets/index.css';
import {Range} from 'rc-slider';
import moment from 'moment-timezone';

export default class SearchBar extends Component {

  formatTime = value => {
    let format;

    // eslint-disable-next-line
    switch (this.props.language) {
      case "se":
        format = "DD.MM.YYYY, HH:mm";
        break;
      case "us":
        format = "MM.DD.YYYY, hh:mm A";
        break;
    }
    return moment(value).format(format);
  };

  render() {
    const props = this.props;

    const text = {};

    // eslint-disable-next-line
    switch (this.props.language) {
      case "se":
        text.header = "Filtrera Dina Kontakter";
        text.firstNamePlaceholder = "Förnamn";
        text.lastNamePlaceHolder = "Efternamn";
        text.sortBy = "Sortera Efter";
        text.timePicker = "Tidväljare";
        text.optionFirstName = "Förnamn";
        text.optionLastName = "Efternamn";
        text.optionCountry = "Land";
        text.optionCurrentTime = "Nuvarande Tid";
        text.betweenSwitchFrom = "Från:";
        text.betweenSwitchTo = "Till:";
        text.analogClock = "Analog Klocka";
        break;
      case "us":
        text.firstNamePlaceholder = "First Name";
        text.lastNamePlaceHolder = "Last Name";
        text.sortBy = "Sort By";
        text.timePicker = "Time Picker";
        text.optionFirstName = "First Name";
        text.optionLastName = "Last Name";
        text.optionCountry = "Country";
        text.optionCurrentTime = "Current Time";
        text.betweenSwitchFrom = "From";
        text.betweenSwitchTo = "To";
        text.analogClock = "Analog Clock";
        break;
    }

    return <Fragment>
      <div className="row mt-4">
        <div className="col-md-1"/>
        <div className="col-md-5">
          <FormGroup>
            <Input onChange={props.formChanged} value={props.firstName} type="text" name="firstName"
                   placeholder={text.firstNamePlaceholder}/>
          </FormGroup>
        </div>
        <div className="col-md-5">
          <FormGroup>
            <Input onChange={props.formChanged} value={props.lastName} type="text" name="lastName"
                   placeholder={text.lastNamePlaceHolder}/>
          </FormGroup>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-5 mt-4">
          <h4 className="mr-4" style={{display: "inline"}}>{text.sortBy}</h4>
          <Input className="mt-2" type="select" value={props.sorting} name="sorting"
                 onChange={props.formChanged}>
            <option>{text.optionFirstName}</option>
            <option>{text.optionLastName}</option>
            <option>{text.optionCountry}</option>
            <option>{text.optionCurrentTime}</option>
          </Input>
        </div>
        <div className="col-md-5 mt-4">
          <h4 className="mr-4" style={{display: "inline"}}>{text.analogClock}</h4>
          <CustomInput inline checked={props.analogClockSwitch} type="switch" id="analogClockSwitch"
                       name="analogClockSwitch" onChange={props.formChanged}/>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row mt-4">
        <div className="col-md-1"/>
        <div className="col-md-10 mt-1">
          <h4 className="mr-4" style={{display: "inline"}}>{text.timePicker}</h4>
          <CustomInput inline checked={props.betweenSwtich} type="switch" id="betweenSwitch" name="betweenSwitch"
                       onChange={props.formChanged}/>
        </div>
        <div className="col-md-1"/>
      </div>
      {props.betweenSwtich ? <Fragment>
        <div className="row mt-4">
          <div className="col-md-1"/>
          <div className="col-md-5 mt-1">
            <h3>{text.betweenSwitchFrom} {this.formatTime(props.range.from)}</h3>
          </div>
          <div className="col-md-5 mt-1">
            <h3>{text.betweenSwitchTo} {this.formatTime(props.range.to)}</h3>
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