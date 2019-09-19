import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
import Geocode from 'react-geocode';
import Marker from "./Marker/Marker";
import graphqlService from "../../graphql/graphqlService";

const GEOCODE_API_KEY = "";
// const GEOCODE_API_KEY = "AIzaSyCsFAebmSpLmEFctzPC7kh9nl8efYDkgac";

export default class MapComponent extends Component {
  state = {
    friends: [],
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 0
  };

  async componentDidMount() {
    Geocode.setApiKey(GEOCODE_API_KEY);
    try {
      const response = await graphqlService.friends({firstName: "", lastName: "", sort: "firstName", page: 1});
      const friends = [];
      for (let friend of response.data.friends.friends) {
        const result = await Geocode.fromAddress(friend.city + ", " + friend.country);
        friend.lat = result.results[0].geometry.location.lat;
        friend.lng = result.results[0].geometry.location.lng;
        friends.push(friend)
      }
      this.setState({friends})
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const markers = this.state.friends.map(f => <Marker
      key={f._id}
      name={f.firstName + " " + f.lastName}
      lat={f.lat}
      lng={f.lng}
      color="blue"
    />);

    return <div className="container Card top-margin">
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-10">
          <h1 className="Card-Header">Map</h1>
        </div>
        <div className="col-md-1"/>
      </div>
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-10" style={{height: '75vh', width: '100%'}}>
          <div>
            <GoogleMapReact
              yesIWantToUseGoogleMapApiInternals
              bootstrapURLKeys={{key: "AIzaSyC14Jm2T-rQD5SzyDTxZ1IFIISrOL6myqo"}}
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

