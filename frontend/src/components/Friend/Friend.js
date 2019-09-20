import React, {Component, Fragment} from 'react';
import moment from 'moment-timezone'
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
    emails: [],
    phoneNumbers: [],
    currentTime: "",
    currentDate: ""
  };

  sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));

  async componentDidMount() {
    try {
      const response = await graphqlService.friend(this.props._id);
      await this.setState({...response.data.friend, _isMounted: true});

      while (this.state._isMounted) {
        const m = moment.tz(this.state.timezone.name);
        this.setState({currentTime: m.format('HH:mm:ss')});
        this.setState({currentDate: m.format('YYYY.MM.DD')});

        await this.sleep(500);
      }

    } catch (e) {
      console.log(e);
      this.props.showModal();
    }
  }

  componentWillUnmount() {
    this.setState({_isMounted: false})
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
          <h1 className="Card-Header">{state.firstName} {state.lastName}</h1>
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
          <p>{state.timezone.name}</p>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row mt-4">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <h2>Current Time: </h2>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <p>{state.currentTime}</p>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row mt-4">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <h2>Current Date: </h2>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-8">
          <p>{state.currentDate}</p>
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
            <b>City:</b> {state.city}
          </p>
        </div>
        <div className="row-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col md-1">
          <p>
            <b>Country:</b> {state.country}
          </p>
        </div>
        <div className="row-md-1"/>
      </div>
      {state.emails.length > 0 ? <Fragment>
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-8">
            <h2>Emails:</h2>
          </div>
          <div className="col-md-1"/>
        </div>
        {emails} </Fragment> : null}
      {state.phoneNumbers.length > 0 ? <Fragment>
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-8">
            <h2>Phone Numbers:</h2>
          </div>
          <div className="col-md-1"/>
        </div>
        {phoneNumbers}</Fragment> : null}
    </div>
  }
}