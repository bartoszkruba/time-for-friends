import React, {Component} from 'react';
import {FormGroup, Input} from "reactstrap";

export default class SearchBar extends Component {

  render() {
    const props = this.props;

    return <div className="row">
      <div className="col-md-1"/>
      <div className="col-md-4">
        <FormGroup>
          <Input onChange={props.formChanged} value={props.firstName} type="text" name="firstName"
                 placeholder="First Name"/>
        </FormGroup>
      </div>
      <div className="col-md-4">
        <FormGroup>
          <Input onChange={props.formChanged} value={props.lastName} type="text" name="lastName"
                 placeholder="Last Name"/>
        </FormGroup>
      </div>
      <div className="col-md-3"/>
    </div>
  }
}