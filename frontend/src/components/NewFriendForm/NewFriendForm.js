import React, {Fragment, PureComponent} from 'react'
import {Redirect} from "react-router-dom";
import {Button, CustomInput, FormGroup, Input, InputGroup, InputGroupAddon, Label} from "reactstrap";
import validator from 'validator';
import 'rc-slider/assets/index.css';
import {Range} from 'rc-slider';
import moment from 'moment-timezone';
import countries from './countries'

import graphqlService from "../../graphql/graphqlService";

export default class NewFriendForm extends PureComponent {

  state = {
    redirect: "",
    countries,
    timezones: [],
    form: {
      firstName: "",
      lastName: "",
      city: "",
      country: "---",
      timezone: "---",
      email: "",
      enteredEmails: [],
      phoneNumber: "",
      enteredPhoneNumbers: [],
      sleepHoursSwitch: false,
      workHoursSwitch: false
    },
    validation: false,
    emailValidation: false,
    phoneNumberValidation: false,
    workHours: {
      fromLabel: "",
      toLabel: "",
      from: 420,
      to: 960,
    }
  };

  // load timezones on mount
  async componentDidMount() {
    if (!this.props.loggedIn) {
      return this.setState({redirect: "/login"});
    }

    // eslint-disable-next-line
    switch (this.props.language) {
      case "se":
        this.setState({workHours: {fromLabel: "07:00", toLabel: "16:00", from: 420, to: 960}});
        break;
      case "us":
        this.setState({workHours: {fromLabel: "07:00 AM", toLabel: "16:00 PM", from: 420, to: 960}});
        break;
    }

    try {
      const response = await graphqlService.timezones();
      const timezones = [...response.data.timezones];
      timezones.unshift({name: "---"});
      const form = {...this.state.form};
      form.timezone = "---";
      form.country = "---";
      await this.setState({timezones, form})
    } catch (e) {
      console.log(e);
      this.showModal();
    }
  }

  emailEnteredHandler = e => {
    const form = {...this.state.form};
    form.email = form.email.trim();
    if (this.state.emailValidation) {
      form.enteredEmails.push(this.state.form.email);
      form.email = "";
      this.setState({form, emailValidation: false})
    }
  };

  removeEmailHandler = email => {
    const form = {...this.state.form};
    form.enteredEmails.splice(form.enteredEmails.indexOf(email), 1);
    this.setState({form});
  };

  phoneNumberEnteredHandler = e => {
    if (this.state.phoneNumberValidation) {
      const form = {...this.state.form};
      form.enteredPhoneNumbers.push(form.phoneNumber);
      form.phoneNumber = "";
      this.setState({form, phoneNumberValidation: false});
    }
  };

  removePhoneNumberHandler = number => {
    const form = {...this.state.form};
    form.enteredPhoneNumbers.splice(form.enteredPhoneNumbers.indexOf(number), 1);
    this.setState({form});
  };

  inputChangeHandler = async e => {
    const form = {...this.state.form};
    form[e.target.name] = e.target.value;
    await this.setState({form});
    this.validateForm();
  };

  switchChangeHandler = e => {
    const form = {...this.state.form};

    if (e.target.name === "workHoursSwitch") {
      form.workHoursSwitch = !form.workHoursSwitch;
    } else if (e.target.name === "sleepHoursSwitch") {
      form.sleepHoursSwitch = !form.sleepHoursSwitch;
    }
    this.setState({form})
  };

  keyDownHandler = e => {
    if (e.key === 'Enter' && this.validation) {
      this.submitHandler()
    }
  };

  keyDownOnEmail = e => {
    if (e.key === 'Enter') {
      this.emailEnteredHandler();
    }
  };

  keyDownOnPhoneNumber = e => {
    if (e.key === 'Enter' && this.state.phoneNumberValidation) {
      this.phoneNumberEnteredHandler();
    }
  };

  emailChangedHandler = e => {
    const form = {...this.state.form};
    const email = e.target.value.trim();
    form.email = email;
    if (validator.isEmail(email) && form.enteredEmails.findIndex(e => e === email) === -1) {
      this.setState({form, emailValidation: true})
    } else {
      this.setState({form, emailValidation: false})
    }
  };

  phoneNumberChangedHandler = e => {
    const form = {...this.state.form};
    const phoneNumber = e.target.value.trim();
    if (phoneNumber !== "" && form.enteredPhoneNumbers.findIndex(p => p === phoneNumber) === -1) {
      form.phoneNumber = phoneNumber;
      this.setState({phoneNumberValidation: true, form});
    } else {
      form.phoneNumber = phoneNumber;
      this.setState({phoneNumberValidation: false, form});
    }
  };

  validateForm = () => {
    const form = {...this.state.form};
    form.firstName = form.firstName.trim();
    form.lastName = form.lastName.trim();
    form.city = form.city.trim();
    if (validator.isEmpty(form.firstName)) return this.setState({validation: false});
    if (validator.isEmpty(form.lastName)) return this.setState({validation: false});
    if (validator.isEmpty(form.city)) return this.setState({validation: false});
    if (form.timezone === "---") return this.setState({validation: false});
    if (form.country === "---") return this.setState({validation: false});

    this.setState({validation: true});
  };

  workHoursChangeHandler = values => {

    const fromHours = ~~((values[0] < 1440 ? values[0] : (values[0] - 1440)) / 60);
    const fromMinutes = values[0] % 60;

    const toHours = ~~((values[1] < 1440 ? values[1] : (values[1] - 1440)) / 60);
    const toMinutes = values[1] % 60;

    let format;

    // eslint-disable-next-line
    switch (this.props.language) {
      case "se":
        format = "HH:mm";
        break;
      case "us":
        format = "hh:mm A";
        break;
    }

    this.setState({
      workHours: {
        from: values[0],
        to: values[1],
        fromLabel: moment.utc().hours(fromHours).minutes(fromMinutes).format(format),
        toLabel: moment.utc().hours(toHours).minutes(toMinutes).format(format)
      }
    });
  };

  submitHandler = async e => {
    const form = {...this.state.form};
    try {
      await graphqlService.addNewFriend({
        ...form,
        emails: form.enteredEmails,
        phoneNumbers: form.enteredPhoneNumbers
      });
      this.props.addedNewFriend()
    } catch (e) {
      console.log(e);
      this.props.showModal();
    }
  };

  render() {
    const state = this.state;

    const redColorStyle = {
      color: "red"
    };

    const text = {};

    // eslint-disable-next-line
    switch (this.props.language) {
      case "se":
        text.header = "Lägg Till Ny Kontakt";
        text.firstNameLabel = "Förnamn";
        text.lastNameLabel = "Efternamn";
        text.cityLabel = "Stad";
        text.countryLabel = "Land";
        text.timezoneLabel = "Tidszon";
        text.addButton = "Lägg Till";
        text.emailsLabel = "E-postaddress";
        text.emailPlaceholder = "E-post";
        text.phoneNumbersLabel = "Telefonnummer";
        text.phoneNumberPlaceholder = "Telefonnummer";
        text.workHours = "Arbetstider";
        text.sleepHours = "Sovtider";
        text.from = "Från";
        text.to = "Till";
        text.addContactButton = "Lägg Till Kontakt";
        text.midnightMark = "00:00";
        text.noonMark = "12:00";
        break;
      case "us":
        text.header = "Add New Contact";
        text.firstNameLabel = "First Name";
        text.lastNameLabel = "Efternamn";
        text.cityLabel = "City";
        text.countryLabel = "Country";
        text.timezoneLabel = "Timezone";
        text.addButton = "Add";
        text.emailsLabel = "Emails";
        text.emailPlaceholder = "Email";
        text.phoneNumbersLabel = "Phone Numbers";
        text.phoneNumberPlaceholder = "Phone Number";
        text.workHours = "Work Hours";
        text.sleepHours = "Sleep Hours";
        text.from = "From";
        text.to = "To";
        text.addContactButton = "Add Contact";
        text.midnightMark = "12:00 AM";
        text.noonMark = "12:00 PM";
        break;
    }

    const enteredEmails = state.form.enteredEmails.map(e => <div key={e}
                                                                 className="mt-1 d-flex justify-content-between new-friend-border p-2">
      <span>{e}</span>
      <span onClick={event => this.removeEmailHandler(e)} className="Delete-Icon" style={{cursor: "pointer"}}><i
        className="fas fa-trash"/></span>
    </div>);

    const enteredPhoneNumbers = state.form.enteredPhoneNumbers.map(p => <div key={p}
                                                                             className="mt-1
                                                                             d-flex justify-content-between
                                                                             new-friend-border p-2">
      <span>{p}</span>
      <span onClick={event => this.removePhoneNumberHandler(p)} className="Delete-Icon"
            style={{cursor: "pointer"}}><i className="fas fa-trash"/></span>
    </div>);
    const countries = state.countries.map(c => <option key={c.name}>{c.name}</option>);
    const timezones = state.timezones.map(t => <option key={t.name}>{t.name}</option>);

    return <Fragment>
      <div className="container Card">
        {state.redirect !== "" ? <Redirect to={state.redirect}/> : null}
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-10">
            <h1 className="Card-Header">{text.header}</h1>
          </div>
          <div className="col-md-1"/>
        </div>
        <div className="row mt-4">
          <div className="col-md-1"/>
          <div className="col-md-5">
            <FormGroup>
              <Label>{text.firstNameLabel}</Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.form.firstName} onChange={this.inputChangeHandler} type="text" name="firstName"
                     placeholder={text.firstNameLabel} onKeyDown={this.keyDownHandler}/>
            </FormGroup>
          </div>
          <div className="col-md-5">
            <FormGroup>
              <Label>{text.lastNameLabel}</Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.form.lastName} onChange={this.inputChangeHandler} type="text" name="lastName"
                     placeholder={text.lastNameLabel} onKeyDown={this.keyDownHandler}/>
            </FormGroup>
          </div>
          <div className="col-md-1"/>
        </div>
        <div className="row mt-3">
          <div className="col-md-1"/>
          <div className="col-md-5">
            <FormGroup>
              <Label>{text.cityLabel}</Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.form.city} onChange={this.inputChangeHandler} type="text" name="city"
                     placeholder={text.cityLabel} onKeyDown={this.keyDownHandler}/>
            </FormGroup>
          </div>
          <div className="col-md-5">
            <FormGroup>
              <Label>{text.countryLabel}</Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.form.country} onChange={this.inputChangeHandler} type="select" name="country"
                     placeholder={text.countryLabel} onKeyDown={this.keyDownHandler}>
                {countries}
              </Input>
            </FormGroup>
          </div>
          <div className="col-md-1"/>
        </div>
        <div className="row mt-3">
          <div className="col-md-1"/>
          <div className="col-md-5">
            <FormGroup>
              <Label>{text.timezoneLabel}</Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.form.timezone} onChange={this.inputChangeHandler} type="select" name="timezone"
                     onKeyDown={this.keyDownHandler}>
                {timezones}
              </Input>
            </FormGroup>
          </div>
          <div className="col-md-6"/>
        </div>
      </div>
      <div className="container Tile">

        <div className="row mt-1">
          <div className="col-md-1"/>
          <div className="col-md-5">
            <h4>{text.emailsLabel}</h4>
            <InputGroup>
              <Input value={state.form.email} onChange={this.emailChangedHandler} type="email"
                     placeholder={text.emailPlaceholder}
                     name="email" onKeyDown={this.keyDownOnEmail}/>
              <InputGroupAddon addonType="append">
                <Button disabled={!state.emailValidation} onClick={this.emailEnteredHandler} outline
                        color="info">{text.addButton}</Button>
              </InputGroupAddon>
            </InputGroup>
            <FormGroup className="mt-3">
              {enteredEmails}
            </FormGroup>
          </div>
          <div className="col-md-5">
            <h4>{text.phoneNumbersLabel}</h4>
            <InputGroup>
              <Input value={state.form.phoneNumber} onChange={this.phoneNumberChangedHandler} type="text"
                     placeholder={text.phoneNumberPlaceholder} name="phoneNumber"
                     onKeyDown={this.keyDownOnPhoneNumber}/>
              <InputGroupAddon addonType="append">
                <Button disabled={!state.phoneNumberValidation}
                        onClick={this.phoneNumberEnteredHandler} outline color="info">{text.addButton}</Button>
              </InputGroupAddon>
            </InputGroup>
            <FormGroup className="mt-3">
              {enteredPhoneNumbers}
            </FormGroup>
          </div>
          <div className="col-md-1"/>
        </div>
        <div className="row mt-4">
          <div className="col-md-1"/>
          <div className="col-md-10">
            <h2 className="mr-3" style={{display: "inline"}}>{text.workHours}</h2>
            <CustomInput checked={state.form.workHoursSwitch} inline type="switch" name="workHoursSwitch"
                         id="workHoursSwitch"
                         onChange={this.switchChangeHandler}/>
          </div>
          <div className="col-md-1"/>
        </div>
        {
          state.form.workHoursSwitch ? <Fragment>
            <div className="row mt-3">
              <div className="col-md-1"/>
              <div className="col-md-5 mt-1">
                <h3>{text.from}: {state.workHours.fromLabel}</h3>
              </div>
              <div className="col-md-5 mt-1">
                <h3>{text.to}: {state.workHours.toLabel}</h3>
              </div>
              <div className="col-md-1"/>
            </div>
            <div className="row mt-3">
              <div className="col-md-1"/>
              <div className="col-md-10">

              </div>
              <div className="col-md-1"/>
            </div>
            <div className="row mt-1">
              <div className="col-md-1"/>
              <div className="col-md-10">
                <Range
                  marks={{
                    0: text.midnightMark,
                    1440: text.midnightMark,
                    2880: text.midnightMark,
                    720: text.noonMark,
                    2169: text.noonMark
                  }}
                  step={30}
                  min={0}
                  max={2880}
                  allowCross={false}
                  defaultValue={[480, 960]}
                  value={[state.workHours.from, state.workHours.to]}
                  onChange={this.workHoursChangeHandler}/>
              </div>
              <div className="col-md-1"/>
            </div>
          </Fragment> : null
        }
        <div className="row mt-4">
          <div className="col-md-1"/>
          <div className="col-md-10">
            <h2 className="mr-3" style={{display: "inline"}}>{text.sleepHours}</h2>
            <CustomInput checked={state.form.sleepHoursSwitch} inline type="switch" name="sleepHoursSwitch"
                         id="sleepHoursSwitch" onChange={this.switchChangeHandler}/>
          </div>
          <div className="col-md-1"/>
        </div>
        {
          state.form.sleepHoursSwitch ? <Fragment>
            <div className="row mt-3">
              <div className="col-md-1"/>
              <div className="col-md-5 mt-1">
                <h3>{text.from}: </h3>
              </div>
              <div className="col-md-5 mt-1">
                <h3>{text.to}: </h3>
              </div>
              <div className="col-md-1"/>
            </div>
            <div className="row mt-3">
              <div className="col-md-1"/>
              <div className="col-md-10">

              </div>
              <div className="col-md-1"/>
            </div>
          </Fragment> : null
        }
        <div className="row mt-4">
          <div className="col-md-1"/>
          <div className="col-md-10">
            <Button onClick={this.submitHandler} disabled={!state.validation} type="button" size="lg" color="info">
              {text.addContactButton}
            </Button>
          </div>
          <div className="col-md-1"/>
        </div>
      </div>
    </Fragment>
  }

};