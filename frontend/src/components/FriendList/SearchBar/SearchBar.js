import React, {Component} from 'react';
import {FormGroup, Input} from "reactstrap";

export default class SearchBart extends Component {


  render() {
    return <div className="row">
      <div className="col-md-1"/>
      <div className="col-md-4">
        <FormGroup>
          <Input type="text" name="firstName" placeholder="First Name"/>
        </FormGroup>
      </div>
      <div className="col-md-4">
        <FormGroup>
          <Input type="text" name="lastName" placeholder="Last Name"/>
        </FormGroup>
      </div>
      <div className="col-md-3"/>
    </div>
  }
}