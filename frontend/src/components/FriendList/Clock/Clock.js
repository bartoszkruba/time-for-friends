import React, {Component} from 'react';
import moment from 'moment-timezone';

export default class Clock extends Component {

  state = {
    time: "12:00",
    _isMounted: false
  };

  sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));

  async componentDidMount() {
    this.setState({_isMounted: true});
    do {
      const time = moment.tz(this.props.timezone).format('HH:mm:ss');
      this.setState({time});
      await this.sleep(500);
    } while (this.state._isMounted)
  }

  componentWillUnmount() {
    this.setState({_isMounted: false})
  }

  render() {
    const state = this.state;

    return <span>{state.time}</span>;
  }

}
;