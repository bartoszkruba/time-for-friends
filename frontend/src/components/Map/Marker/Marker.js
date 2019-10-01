import React, {Component} from 'react';
import './Marker.css';
import moment from "moment-timezone";
import LanguageContext from "../../../context/languageContext";

export default class Marker extends Component {

  static contextType = LanguageContext;

  state = {
    time: ""
  };

  sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));

  async componentDidMount() {
    this._isMounted = true;

    let timeFormat;

    // eslint-disable-next-line
    switch (this.context.language) {
      case "se":
        timeFormat = 'HH:mm:ss';
        break;
      case "us":
        timeFormat = "hh:mm:ss A";
        break;
    }

    while (this._isMounted) {
      this.setState({time: moment.tz(this.props.timezone).format(timeFormat)});
      await this.sleep(1000)
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const props = this.props;
    const text = props.name + '\n' + props.location + '\n' + this.state.time;

    return <div className="marker"
                style={{backgroundColor: props.color, cursor: 'pointer'}}
                title={text}
    />;
  }

}