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

        let timeFormat;
        let dateFormat;

        // eslint-disable-next-line
        switch (this.props.language) {
          case "se":
            timeFormat = "HH:mm:ss";
            dateFormat = "DD.MM.YYYY";
            break;
          case "us":
            timeFormat = "hh:mm:ss A";
            dateFormat = "MM.DD.YYYY";
            break;
        }

        const m = moment.tz(this.state.timezone.name);
        this.setState({currentTime: m.format(timeFormat)});
        this.setState({currentDate: m.format(dateFormat)});

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

    const text = {};

    // eslint-disable-next-line
    switch (this.props.language) {
      case "se":
        text.timezone = "Tidszon";
        text.currentTime = "Nuvarande Klockan";
        text.currentDate = "Nuvarande Datum";
        text.address = "Adress";
        text.city = "Stad";
        text.country = "Land";
        text.phoneNumbers = "Telefonnummer";
        text.emails = "E-postadress";
        break;
      case "us":
        text.timezone = "Timezone";
        text.currentTime = "Current Time";
        text.currentDate = "Current Date";
        text.address = "Address";
        text.city = "City";
        text.country = "Country";
        text.phoneNumbers = "Phone Numbers";
        text.emails = "Emails";
        break;
    }

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
          <h2>{text.timezone}: </h2>
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
          <h2>{text.currentTime}: </h2>
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
          <h2>{text.currentDate}: </h2>
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
          <h2>{text.address}:</h2>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col md-8">
          <p>
            <b>{text.city}:</b> {state.city}
          </p>
        </div>
        <div className="row-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col md-1">
          <p>
            <b>{text.country}:</b> {state.country}
          </p>
        </div>
        <div className="row-md-1"/>
      </div>
      {state.emails.length > 0 ? <Fragment>
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-8">
            <h2>{text.emails}:</h2>
          </div>
          <div className="col-md-1"/>
        </div>
        {emails} </Fragment> : null}
      {state.phoneNumbers.length > 0 ? <Fragment>
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-8">
            <h2>{text.phoneNumbers}:</h2>
          </div>
          <div className="col-md-1"/>
        </div>
        {phoneNumbers}</Fragment> : null}
    </div>
  }
}