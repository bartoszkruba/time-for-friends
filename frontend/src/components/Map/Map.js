import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from "./Marker/Marker";
import graphqlService from "../../graphql/graphqlService";
import LanguageContext from "../../context/languageContext";

export default class MapComponent extends Component {
  static contextType = LanguageContext;

  state = {
    friends: [],
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 0
  };

  async componentDidMount() {
    if (!this.props.loggedIn) return this.props.redirect("/login");
    try {
      const response = await graphqlService.friendsLocations();
      this.setState({friends: response.data.allFriends})
    } catch (e) {
      console.log(e);
      this.props.showModal();
    }
  }

  render() {
    const text = {};

    // eslint-disable-next-line
    switch (this.context.language) {
      case "se":
        text.header = "Karta";
        break;
      case "us":
        text.header = "Map";
        break;
    }

    const markers = this.state.friends.map(f => <Marker
      key={f._id}
      name={f.firstName + " " + f.lastName}
      location={f.city + ", " + f.country}
      timezone={f.timezone.name}
      lat={f.lat}
      lng={f.lng}
      color="blue"
    />);

    return <div className="container Card top-margin">
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-10">
          <h1 className="Card-Header">{text.header}</h1>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-10" style={{height: '75vh', width: '100%'}}>
          <div>
            <GoogleMapReact
              yesIWantToUseGoogleMapApiInternals
              bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY}}
              style={{width: "100%", height: "500"}}
              defaultCenter={this.state.center}
              defaultZoom={this.state.zoom}
            >
              {markers}
            </GoogleMapReact>
          </div>
        </div>
        <div className="col-md-1"/>
      </div>
    </div>
  }
}

