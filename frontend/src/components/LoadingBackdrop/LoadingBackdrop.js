import React, {Component} from 'react'
import {Spinner} from 'reactstrap';

export default class LoadingBackdrop extends Component {

  render() {
    const backdropStyles = {
      margin: "0",
      padding: "0",
      position: "fixed",
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0, 0.6)",
      zIndex: "500"
    };

    const spinnerContainerStyles = {
      width: "10rem",
      height: "10rem",
      margin: "auto",
      marginTop: "30vh"
    };

    const spinnerStyles = {
      width: "10rem",
      height: "10rem",
    };

    return <div style={backdropStyles}>
      <div style={spinnerContainerStyles}>
        <Spinner style={spinnerStyles} color="info"/>
      </div>
    </div>
  }

};