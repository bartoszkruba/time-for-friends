import React, {Component} from 'react';
import {Alert, Button, FormGroup, Input, Label} from "reactstrap";
import validator from 'validator';
import graphqlService from "../../graphql/graphqlService";
import LoadingBackdrop from "../LoadingBackdrop/LoadingBackdrop";
import LanguageContext from "../../context/languageContext";

export default class LoginForm extends Component {

  static contextType = LanguageContext;

  state = {
    email: "",
    password: "",
    validation: {
      errorMessage: ""
    },
    showLoadingBackdrop: false
  };

  inputChangeHandler = e => {
    const state = {...this.state};
    state[e.target.name] = e.target.value;
    this.setState(state)
  };

  keyDownHandler = e => {
    if (e.key === 'Enter' && this.areFieldsFilledIn()) {
      this.submitHandler()
    }
  };

  submitHandler = async e => {
    const state = this.state;

    if (this.validateData()) {
      try {
        // Setting loading backdrop in parent will cause
        // whole component to unmount and mount again
        // which will lead to a lot ot trouble
        // the only working solutions is to duplicate LoadingBackdrop in this component
        // and set state here
        this.setState({showLoadingBackdrop: true});
        const response = await graphqlService.login(state.email, state.password);
        if (response.errors) {
          this.setState({
            showLoadingBackdrop: false,
            validation: {errorMessage: state.validation.errorMessage = response.errors[0].message}
          });
        } else {
          this.setState({showLoadingBackdrop: false, email: "", password: ""});
          this.props.loginSuccessfull(response.data.login.token)
        }
      } catch (e) {
        this.setState({showLoadingBackdrop: false});
        if (e.networkError.result) {
          this.setState({validation: {errorMessage: e.networkError.result.errors[0].message}})
        } else {
          let errorMessage;

          // eslint-disable-next-line
          switch (this.context.language) {
            case "se":
              errorMessage = "Något har blivit fel, försök igen";
              break;
            case "us":
              errorMessage = "Something went wrong, please try again";
              break;
          }

          this.setState({validation: {errorMessage}})
        }
      }
    }
  };

  validateData = e => {
    const state = this.state;
    if (validator.isEmpty(state.password) ||
      !validator.isLength(state.password, {min: 5} ||
        !validator.isAlphanumeric(this.state.password))) {

      let errorMessage;

      // eslint-disable-next-line
      switch (this.context.language) {
        case "se":
          errorMessage = "Ogiltig Lösenord";
          break;
        case "us":
          errorMessage = "Invalid Password";
      }

      this.setState({validation: {errorMessage}});
      return false;
    }
    this.setState({validation: {errorMessage: ""}});
    return true;
  };

  areFieldsFilledIn = () => (validator.isEmail(this.state.email) &&
    !validator.isEmpty(this.state.password));

  render() {
    const state = this.state;

    const redColorStyle = {
      color: "red"
    };

    const text = {};

    // eslint-disable-next-line
    switch (this.context.language) {
      case "se":
        text.header = "Logga In Till Ditt Konto";
        text.emailLabel = "E-Post";
        text.passwordLabel = "Lösenord";
        text.signIn = "Logga In";
        break;
      case "us":
        text.header = "Sign In to Your Account";
        text.emailLabel = "Email";
        text.passwordLabel = "Password";
        text.signIn = "Sign In";
        break;
    }

    return <div className="container Card Full-Height-In-Mobile">
      <LoadingBackdrop show={this.state.showLoadingBackdrop}/>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <h1 className="Card-Header">{text.header}</h1>
          {state.validation.errorMessage !== "" ? <Alert className="mt-4" color="info">
            <div>- {state.validation.errorMessage}</div>
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
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row mt-3">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <Button disabled={!this.areFieldsFilledIn()} onClick={this.submitHandler} type="button" size="lg"
                  color="info">
            {text.signIn}
          </Button>
        </div>
        <div className="col-md-2"/>
      </div>
    </div>
  }

};