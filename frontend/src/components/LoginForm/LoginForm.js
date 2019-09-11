import React, {Component} from 'react';
import {Button, Form, FormGroup, Input, Label} from "reactstrap";

export default class LoginForm extends Component {

  state = {
    email: "",
    password: ""
  };

  inputChangeHandler = e => {
    const state = {...this.state};
    state[e.target.name] = e.target.value;
    this.setState(state)
  };

  render() {
    const state = this.state;

    return <div className="container">
      <div className="row">
        <div className="col-md-2"/>
        <div className="col-md-8">

          <h1>Log In</h1>
          <Form>
            <FormGroup>
              <Label>Email </Label>
              <Input value={state.email} onChange={this.inputChangeHandler} type="email" name="email"
                     placeholder="Email" onKeyDown={this.keyDownHandler}/>
            </FormGroup>
            <FormGroup>
              <Label>Password </Label>
              <Input value={state.password} onChange={this.inputChangeHandler} type="password" name="password"
                     placeholder="Password" onKeyDown={this.keyDownHandler}/>
            </FormGroup>
            <Button onClick={this.submitHandler} type="button" color="info">Log In</Button>
          </Form>
        </div>
        <div className="col-md-2"/>
      </div>
    </div>
  }

};