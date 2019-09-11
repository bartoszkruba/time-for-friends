import React, {Component} from 'react';
import {Alert, Button, Form, FormGroup, Input, Label} from 'reactstrap';
import validator from 'validator';

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

  inputChangeHandler = e => {
    const state = {...this.state};
    state[e.target.name] = e.target.value;
    this.setState(state)
  };

  submitHandler = e => {
    this.validateInputs();
  };

  validateInputs = () => {
    let dataIsCorrect = true;
    const state = this.state;
    const validation = {email: "", password: "", repeatPassword: ""};

    if (!validator.isEmail(state.email)) {
      dataIsCorrect = false;
      validation.email = "Invalid Email";
    }

    if (validator.isEmpty(state.password) ||
      !validator.isLength(state.password, {min: 5} ||
        !validator.isAlphanumeric(this.state.password))) {
      dataIsCorrect = false;
      validation.password = "Password need to be at least 5 characters long and contain only letters and digits"
    }

    if (this.state.password !== this.state.repeatPassword) {
      dataIsCorrect = false;
      validation.repeatPassword = "Passwords doesn't match";
    }

    this.setState({validation});
    return dataIsCorrect;
  };

  render() {
    const state = this.state;

    const redColorStyle = {
      color: "red"
    };

    return <div className="container">
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">

          <h1>Register</h1>
          {(state.validation.email !== "" || state.validation.password !== "" ||
            this.state.validation.repeatPassword !== "") ? <Alert color="danger">
            {this.state.validation.email !== "" ? <div>- {state.validation.email}</div> : null}
            {this.state.validation.password !== "" ? <div>- {state.validation.password}</div> : null}
            {this.state.validation.repeatPassword !== "" ? <div>- {state.validation.repeatPassword}</div> : null}
          </Alert> : null
          }
          <Form>
            <FormGroup>
              <Label>Email </Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.email} onChange={this.inputChangeHandler} type="email" name="email"
                     placeholder="Email"/>
            </FormGroup>
            <FormGroup>
              <Label>Password </Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.password} onChange={this.inputChangeHandler} type="password" name="password"
                     placeholder="Password"/>
            </FormGroup>
            <FormGroup>
              <Label>Repeat Password</Label>
              <span style={redColorStyle}> *</span>
              <Input value={state.repeatPassword} onChange={this.inputChangeHandler} type="password"
                     name="repeatPassword" placeholder="Repeat Password"/>
            </FormGroup>
            <Button onClick={this.submitHandler} type="button" color="info">Submit</Button>
          </Form>
        </div>
        <div className="col-md-2"/>
      </div>
    </div>
  }

}