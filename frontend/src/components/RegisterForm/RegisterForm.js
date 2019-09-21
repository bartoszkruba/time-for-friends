import React, {Component} from 'react';
import {Alert, Button, FormGroup, Input, Label} from 'reactstrap';
import validator from 'validator';
import '../../App.css'
import graphqlService from "../../graphql/graphqlService";

export default class RegisterForm extends Component {
  state = {
    email: "",
    password: "",
    repeatPassword: "",
    validation: {
      email: "",
      password: "",
      repeatPassword: ""
    }
  };

  keyDownHandler = e => {
    if (e.key === 'Enter' && this.areFieldsFilledIn()) {
      this.submitHandler()
    }
  };

  inputChangeHandler = e => {
    const state = {...this.state};
    state[e.target.name] = e.target.value;
    this.setState(state)
  };

  submitHandler = async e => {
    if (this.validateInputs()) {
      try {
        const response = await graphqlService.register(this.state.email, this.state.password);
        this.setState({email: "", password: "", repeatPassword: ""});
        this.props.registerSuccessfull(response.data._id, response.data.email);
      } catch (e) {
        if (e.networkError.result) {
          if (e.networkError.result.errors.length !== 0) {
            const validation = {email: e.networkError.result.errors[0].data[0], password: "", repeatPassword: ""};
            this.setState({validation})
          }
        } else {
          let validation;
          switch (this.props.language) {
            case "se":
              validation = {email: "Något har blivit fel, försök igen", password: "", repeatPassword: ""};
              break;
            case "en":
              validation = {email: "Something went wrong, please try again", password: "", repeatPassword: ""};
              break;
          }
          this.setState({validation})
        }
      }
    }
  };

  validateInputs = () => {
    let dataIsCorrect = true;
    const state = this.state;
    const validation = {email: "", password: "", repeatPassword: ""};

    if (validator.isEmpty(state.password) ||
      !validator.isLength(state.password, {min: 5} ||
        !validator.isAlphanumeric(this.state.password))) {
      dataIsCorrect = false;
      switch (this.props.language) {
        case "se":
          validation.password = "Lösenordet måste vara minst fem tecken lång och endast innehålla bokstäver och siffror";
          break;
        case "en":
          validation.password = "Password need to be at least 5 characters long and contain only letters and digits";
      }
    }

    this.setState({validation});
    return dataIsCorrect;
  };

  areFieldsFilledIn = () => (validator.isEmail(this.state.email) &&
    !validator.isEmpty(this.state.password) &&
    this.state.password === this.state.repeatPassword);

  render() {
    const state = this.state;

    const redColorStyle = {
      color: "red"
    };

    const text = {};

    switch (this.props.language) {
      case "se":
        text.header = "Registrera Nytt Konto";
        text.emailLabel = "E-Post";
        text.passwordLabel = "Lösenord";
        text.repeatPasswordLabel = "Upprepa Lösenord";
        text.signUp = "Registrera Dig";
        break;
      case "en":
        text.header = "Register New Account";
        text.emailLabel = "Email";
        text.passwordLabel = "Password";
        text.repeatPasswordLabel = "Repeat Password";
        text.signUp = "Sign Up";
        break;
    }

    return <div className="container Card align-self-center top-margin">
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <h1 className="Card-Header">{text.header}</h1>
          {(state.validation.email !== "" || state.validation.password !== "" ||
            this.state.validation.repeatPassword !== "") ? <Alert className="mt-4" color="info">
            {this.state.validation.email !== "" ? <div>- {state.validation.email}</div> : null}
            {this.state.validation.password !== "" ? <div>- {state.validation.password}</div> : null}
            {this.state.validation.repeatPassword !== "" ? <div>-{state.validation.repeatPassword}</div> : null}
          </Alert> : null}
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row mt-4">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <FormGroup>
            <Label>{text.emailLabel}</Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.email} onChange={this.inputChangeHandler} type="email" name="email"
                   placeholder={text.emailLabel} onKeyDown={this.keyDownHandler}/>
          </FormGroup>
          <FormGroup>
            <Label>{text.passwordLabel}</Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.password} onChange={this.inputChangeHandler} type="password" name="password"
                   placeholder={text.passwordLabel} onKeyDown={this.keyDownHandler}/>
          </FormGroup>
          <FormGroup>
            <Label>{text.repeatPasswordLabel}</Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.repeatPassword} onChange={this.inputChangeHandler} type="password"
                   name="repeatPassword" placeholder={text.repeatPasswordLabel} onKeyDown={this.keyDownHandler}/>
          </FormGroup>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8 mt-3">
          <Button onClick={this.submitHandler} disabled={!this.areFieldsFilledIn()} type="button" size="lg"
                  color="info">{text.signUp}</Button>
        </div>
        <div className="col-md-2"/>
      </div>
    </div>
  }

}