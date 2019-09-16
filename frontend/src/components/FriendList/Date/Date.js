import React, {Component} from 'react'
import moment from 'moment-timezone'

export default class Date extends Component {
  state = {
    date: "01.01.2019",
    _isMounted: false
  };

  sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));

  async componentDidMount() {
    this.setState({_isMounted: true});
    do {
      const date = moment.tz(this.props.timezone).format('YYYY.MM.DD');
      this.setState({date});
      await this.sleep(1000 * 10);
    } while (this.state._isMounted)
  }

  componentWillUnmount() {
    this.setState({_isMounted: false})
  }

  render() {
    return <span className="Time">{this.state.date}</span>
  }
};
