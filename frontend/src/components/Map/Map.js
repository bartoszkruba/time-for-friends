import React, {Component} from 'react';
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';

class MapComponent extends Component {

  render() {

    const mapStyles = {
      width: '90%',
      height: '90%',
    };

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
        <div className="col-md-10" style={{height: "100vh"}}>
          <Map google={this.props.google}
               zoom={2}
               style={mapStyles}
               initialCenter={{lat: 47.444, lng: -122.176}}>
            <Marker
              name="Twoja Stara"
              position={{lat: 48.00, lng: -122.00}}/>
          </Map>
        </div>
        <div className="col-md-1"/>
      </div>
    </div>
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCsFAebmSpLmEFctzPC7kh9nl8efYDkgac'
})(MapComponent);

