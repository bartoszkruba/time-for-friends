import React, {Component} from 'react'
import {Spinner} from 'reactstrap';

export default class LoadingBackdrop extends Component {

  render() {
    const backdropStyles = {
      top: "0",
      right: "0",
      margin: "0",
      padding: "0",
      position: "fixed",
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0, 0.6)",
      zIndex: "500",
      animationName: "fadeInOpacity",
      animationIterationCount: "1",
      animationTimingFunction: "ease-in",
      animationDuration: "0.25s",
      transition: "opacity 0.25s linear"
    };

    if (!this.props.show) {
      backdropStyles.display = "none";
    }

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