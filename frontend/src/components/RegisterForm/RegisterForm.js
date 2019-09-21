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
          const validation = {email: "Something went wrong, please try again", password: "", repeatPassword: ""};
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
      validation.password = "Password need to be at least 5 characters long and contain only letters and digits"
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

    return <div className="container Card align-self-center top-margin">
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">
          <h1 className="Card-Header">Register New Account</h1>
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
          <FormGroup>
            <Label>Repeat Password</Label>
            <span style={redColorStyle}> *</span>
            <Input value={state.repeatPassword} onChange={this.inputChangeHandler} type="password"
                   name="repeatPassword" placeholder="Repeat Password" onKeyDown={this.keyDownHandler}/>
          </FormGroup>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8 mt-3">
          <Button onClick={this.submitHandler} disabled={!this.areFieldsFilledIn()} type="button" size="lg"
                  color="info">Sign Up</Button>
        </div>
        <div className="col-md-2"/>
      </div>
    </div>
  }

}