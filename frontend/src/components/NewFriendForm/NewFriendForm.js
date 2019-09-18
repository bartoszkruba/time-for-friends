import React, {PureComponent} from 'react'
import {Redirect} from "react-router-dom";
import {Alert, Button, FormGroup, Input, Label} from "reactstrap";
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
      country: "",
      timezone: "",
      email: "",
      enteredEmails: [],
      phoneNumber: "",
      enteredPhoneNumbers: []
    },
    validation: {
      errorMessage: ""
    }
  };

  // load timezones on mount
  async componentDidMount() {
    if (!this.props.loggedIn) {
      return this.setState({redirect: "/login"});
    }
    try {
      const response = await graphqlService.timezones();
      const form = {...this.state.form};
      form.timezone = response.data.timezones[0].name;
      form.country = this.state.countries[0].name;
      this.setState({timezones: response.data.timezones, form})
    } catch (e) {
      console.log(e);
    }
  }

  emailEnteredHandler = e => {
    const form = {...this.state.form};
    form.email = form.email.trim();
    if (validator.isEmail(form.email) && form.enteredEmails.findIndex(e => e === form.email) === -1) {
      form.enteredEmails.push(this.state.form.email);
      form.email = "";
      this.setState({form})
    }
  };

  removeEmailHandler = email => {
    const form = {...this.state.form};
    form.enteredEmails.splice(form.enteredEmails.indexOf(email), 1);
    this.setState({form});
  };

  phoneNumberEnteredHandler = e => {
    const form = {...this.state.form};
    form.phoneNumber = form.phoneNumber.trim();
    if (form.phoneNumber !== "" && form.enteredPhoneNumbers.findIndex(p => p === form.phoneNumber) === -1) {
      form.enteredPhoneNumbers.push(form.phoneNumber);
      form.phoneNumber = "";
      this.setState({form})
    }
  };

  removePhoneNumberHandler = number => {
    const form = {...this.state.form};
    form.enteredPhoneNumbers.splice(form.enteredPhoneNumbers.indexOf(number), 1);
    this.setState({form});
  };

  inputChangeHandler = e => {
    const form = {...this.state.form};
    form[e.target.name] = e.target.value;
    this.setState({form})
  };

  keyDownHandler = e => {
    if (e.key === 'Enter') {
      this.submitHandler()
    }
  };

  keyDownOnEmail = e => {
    if (e.key === 'Enter') {
      this.emailEnteredHandler();
    }
  };

  keyDownOnPhoneNumber = e => {
    if (e.key === 'Enter') {
      this.phoneNumberEnteredHandler();
    }
  };

  submitHandler = async e => {
    const form = {...this.state.form};
    form.firstName = form.firstName.trim();
    form.lastName = form.lastName.trim();
    form.city = form.city.trim();
    if (validator.isEmpty(form.firstName)) return this.setState({validation: {errorMessage: "Enter First Name"}});
    if (validator.isEmpty(form.lastName)) return this.setState({validation: {errorMessage: "Enter Last Name"}});
    if (validator.isEmpty(form.city)) return this.setState({validation: {errorMessage: "Enter City"}});

    try {
      await graphqlService.addNewFriend({
        ...form,
        emails: form.enteredEmails,
        phoneNumbers: form.enteredPhoneNumbers
      });
      this.props.addedNewFriend()
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const state = this.state;

    const redColorStyle = {
      color: "red"
    };

    const enteredEmails = state.form.enteredEmails.map(e => <div key={e}>
      {e} <span onClick={event => this.removeEmailHandler(e)} className="text-danger" style={{cursor: "pointer"}}><i
      className="fas fa-trash"/></span>
    </div>);

    const enteredPhoneNumbers = state.form.enteredPhoneNumbers.map(p => <div key={p}>
      {p} <span onClick={event => this.removePhoneNumberHandler(p)} className="text-danger"
                style={{cursor: "pointer"}}><i className="fas fa-trash"/></span>
    </div>);
    const countries = state.countries.map(c => <option key={c.name}>{c.name}</option>);
    const timezones = state.timezones.map(t => <option key={t.name}>{t.name}</option>);

    return <div className="container Card">
      {state.redirect !== "" ? <Redirect to={state.redirect}/> : null}
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <h1>Add New Friend</h1>
          {state.validation.errorMessage !== "" ? <Alert color="info">
            <div>- {state.validation.errorMessage}</div>
          </Alert> : null}
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-4">
          <FormGroup>
            <Label>First Name </Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.form.firstName} onChange={this.inputChangeHandler} type="text" name="firstName"
                   placeholder="First Name" onKeyDown={this.keyDownHandler}/>
          </FormGroup>
        </div>
        <div className="col-md-4">
          <FormGroup>
            <Label>Last Name </Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.form.lastName} onChange={this.inputChangeHandler} type="text" name="lastName"
                   placeholder="Last Name" onKeyDown={this.keyDownHandler}/>
          </FormGroup>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-4">
          <FormGroup>
            <Label>City </Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.form.city} onChange={this.inputChangeHandler} type="text" name="city"
                   placeholder="City" onKeyDown={this.keyDownHandler}/>
          </FormGroup>
        </div>
        <div className="col-md-4">
          <FormGroup>
            <Label>Country </Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.form.country} onChange={this.inputChangeHandler} type="select" name="country"
                   placeholder="Country" onKeyDown={this.keyDownHandler}>
              {countries}
            </Input>
          </FormGroup>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <FormGroup>
            <Label>Timezone</Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.form.timezone} onChange={this.inputChangeHandler} type="select" name="timezone"
                   placeholder="Timezone" onKeyDown={this.keyDownHandler}>
              {timezones}
            </Input>
          </FormGroup>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <h3>Emails</h3>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-7">
          <FormGroup>
            <Input value={state.form.email} onChange={this.inputChangeHandler} type="email" placeholder="Email"
                   name="email" onKeyDown={this.keyDownOnEmail}/>
          </FormGroup>
        </div>
        <div className="col-md-1">
          <FormGroup>
            <Button onClick={this.emailEnteredHandler} color="info">Add</Button>
          </FormGroup>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <FormGroup>
            {enteredEmails}
          </FormGroup>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8"><h3>Phone Numbers</h3></div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-7">
          <FormGroup>
            <Input value={state.form.phoneNumber} onChange={this.inputChangeHandler} type="text"
                   placeholder="Phone Number" name="phoneNumber" onKeyDown={this.keyDownOnPhoneNumber}/>
          </FormGroup>
        </div>
        <div className="col-md-1">
          <FormGroup>
            <Button onClick={this.phoneNumberEnteredHandler} color="info">Add</Button>
          </FormGroup>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <FormGroup>
            {enteredPhoneNumbers}
          </FormGroup>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <Button onClick={this.submitHandler} type="button" color="info">Create</Button>
        </div>
        <div className="col-md-2"/>
      </div>
    </div>
  }

};