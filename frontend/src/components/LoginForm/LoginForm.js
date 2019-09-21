import React, {Component} from 'react';
import {Alert, Button, FormGroup, Input, Label} from "reactstrap";
import validator from 'validator';
import graphqlService from "../../graphql/graphqlService";

export default class LoginForm extends Component {

  state = {
    email: "",
    password: "",
    validation: {
      errorMessage: ""
    }
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
        const response = await graphqlService.login(state.email, state.password);
        this.setState({email: "", password: ""});
        if (response.errors) {
          this.setState({validation: {errorMessage: state.validation.errorMessage = response.errors[0].message}});
        } else {
          this.props.loginSuccessfull(response.data.login.token)
        }
      } catch (e) {
        if (e.networkError.result) {
          this.setState({validation: {errorMessage: e.networkError.result.errors[0].message}})
        } else {
          this.setState({validation: {errorMessage: "Something went wrong, please try again"}})
        }
      }
    }
  };

  validateData = e => {
    const state = this.state;
    if (validator.isEmpty(state.password) ||
      !validator.isLength(state.password, {min: 5} ||
        !validator.isAlphanumeric(this.state.password))) {
      this.setState({validation: {errorMessage: "Invalid Password"}});
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

    return <div className="container Card ">
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <h1 className="Card-Header">Sign In To Your Account</h1>
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
            <Label>Email </Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.email} onChange={this.inputChangeHandler} type="email" name="email"
                   placeholder="Email" onKeyDown={this.keyDownHandler}/>
          </FormGroup>
          <FormGroup>
            <Label>Password </Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.password} onChange={this.inputChangeHandler} type="password" name="password"
                   placeholder="Password" onKeyDown={this.keyDownHandler}/>
          </FormGroup>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row mt-3">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <Button disabled={!this.areFieldsFilledIn()} onClick={this.submitHandler} type="button" size="lg" color="info">
            Sign In
          </Button>
        </div>
        <div className="col-md-2"/>
      </div>
    </div>
  }

};