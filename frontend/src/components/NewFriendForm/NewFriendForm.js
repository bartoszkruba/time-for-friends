import React, {Fragment, PureComponent} from 'react'
import {Redirect} from "react-router-dom";
import {Button, FormGroup, Input, InputGroup, InputGroupAddon, Label} from "reactstrap";
import validator from 'validator';
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
      enteredPhoneNumbers: []
    },
    validation: false,
    emailValidation: false,
    phoneNumberValidation: false
  };

  // load timezones on mount
  async componentDidMount() {
    if (!this.props.loggedIn) {
      return this.setState({redirect: "/login"});
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
            <h1 className="Card-Header">Add New Contact</h1>
          </div>
          <div className="col-md-1"/>
        </div>
        <div className="row mt-4">
          <div className="col-md-1"/>
          <div className="col-md-5">
            <FormGroup>
              <Label>First Name </Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.form.firstName} onChange={this.inputChangeHandler} type="text" name="firstName"
                     placeholder="First Name" onKeyDown={this.keyDownHandler}/>
            </FormGroup>
          </div>
          <div className="col-md-5">
            <FormGroup>
              <Label>Last Name </Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.form.lastName} onChange={this.inputChangeHandler} type="text" name="lastName"
                     placeholder="Last Name" onKeyDown={this.keyDownHandler}/>
            </FormGroup>
          </div>
          <div className="col-md-1"/>
        </div>
        <div className="row mt-3">
          <div className="col-md-1"/>
          <div className="col-md-5">
            <FormGroup>
              <Label>City </Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.form.city} onChange={this.inputChangeHandler} type="text" name="city"
                     placeholder="City" onKeyDown={this.keyDownHandler}/>
            </FormGroup>
          </div>
          <div className="col-md-5">
            <FormGroup>
              <Label>Country </Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.form.country} onChange={this.inputChangeHandler} type="select" name="country"
                     placeholder="Country" onKeyDown={this.keyDownHandler}>
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
              <Label>Timezone</Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.form.timezone} onChange={this.inputChangeHandler} type="select" name="timezone"
                     placeholder="Timezone" onKeyDown={this.keyDownHandler}>
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
            <h4>Emails</h4>
            <InputGroup>
              <Input value={state.form.email} onChange={this.emailChangedHandler} type="email" placeholder="Email"
                     name="email" onKeyDown={this.keyDownOnEmail}/>
              <InputGroupAddon addonType="append">
                <Button disabled={!state.emailValidation} onClick={this.emailEnteredHandler} outline
                        color="info">Add</Button>
              </InputGroupAddon>
            </InputGroup>
            <FormGroup className="mt-3">
              {enteredEmails}
            </FormGroup>
          </div>
          <div className="col-md-5">
            <h4>Phone Numbers</h4>
            <InputGroup>
              <Input value={state.form.phoneNumber} onChange={this.phoneNumberChangedHandler} type="text"
                     placeholder="Phone Number" name="phoneNumber" onKeyDown={this.keyDownOnPhoneNumber}/>
              <InputGroupAddon addonType="append">
                <Button disabled={!state.phoneNumberValidation}
                        onClick={this.phoneNumberEnteredHandler} outline color="info">Add</Button>
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
            <Button onClick={this.submitHandler} disabled={!state.validation} type="button" size="lg" color="info">
              Add Contact
            </Button>
          </div>
          <div className="col-md-1"/>
        </div>
      </div>
    </Fragment>
  }

};