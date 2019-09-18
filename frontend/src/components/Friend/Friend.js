import React, {Component} from 'react';
import graphqlService from "../../graphql/graphqlService";

export default class Friend extends Component {

  state = {
    firstName: "John",
    lastName: "Doe",
    timezone: {
      name: "Europe/Stockholm"
    },
    city: "Stockholm",
    country: "Sweden",
    emails: [
      "email1@email.com",
      "email2@email.com",
      "email3@email.com"
    ],
    phoneNumbers: [
      "324 23 213",
      "324 23 213",
      "324 23 213"
    ]
  };

  async componentDidMount() {
    try {
      const response = graphqlService.friend(this.props.match.id);
      this.setState({...response.data.friend})
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const state = this.state;

    const emails = state.emails.map(e => <div className="row">
      <div className="col-md-1"/>
      <div className="col-md-8">
        <p>{e}</p>
      </div>
      <div className="col-md-1"/>
    </div>);

    const phoneNumbers = state.phoneNumbers.map(n => <div className="row">
      <div className="col-md-1"/>
      <div className="col-md-8">
        <p>{n}</p>
      </div>
      <div className="col-md-1"/>
    </div>);

    return <div className="container Card">
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <h1>John Doe,</h1>
        </div>
        <div className="row-md-1"/>
      </div>
      <div className="row mt-4">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <h2>Timezone: </h2>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <p>Europe/Stockholm</p>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <h2>Address:</h2>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col md-8">
          <p>
            <b>City:</b> Stockholm
          </p>
        </div>
        <div className="row-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col md-1">
          <p>
            <b>Country:</b> Sweden
          </p>
        </div>
        <div className="row-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <h2>Emails:</h2>
        </div>
        <div className="col-md-1"/>
      </div>
      {emails}
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <h2>Phone Numbers:</h2>
        </div>
        <div className="col-md-1"/>
      </div>
      {phoneNumbers}
    </div>
  }
}