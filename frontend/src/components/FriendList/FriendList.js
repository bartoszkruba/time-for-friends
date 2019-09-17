import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar";
import {Table} from 'reactstrap';
import moment from 'moment-timezone'

import graphqlService from "../../graphql/graphqlService";

export default class FriendList extends Component {

  state = {
    page: 1,
    searchBar: {
      firstName: "",
      lastName: "",
      range: [new Date(), new Date()],
      betweenSwitch: false,
      betweenSwitchLabel: "Off",
      sortingSwitch: false,
      sortingSwitchLabel: "First Name"
    },
    redirect: "",
    friends: []
  };

  async componentDidMount() {
    if (!this.props.isLoggedIn) {
      if (!this.props.loggedIn) {
        return this.setState({redirect: "/login"});
      }
    }

    await this.setState({_isMounted: true});
    this.requestFriends(1);
    this.calculateTimes();
  }

  componentWillUnmount() {
    this.setState({_isMounted: false})
  }

  sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));

  calculateTimes = async () => {
    while (this.state._isMounted) {
      const state = this.state;
      const searchBar = state.searchBar;
      const newFriends = [];

      const format = "YYYYMMDDHHmmss";
      let from, to;
      if (searchBar.range && searchBar.range[0] && searchBar.range[1] && searchBar.betweenSwitch) {
        from = moment(searchBar.range[0]).format(format);
        to = moment(searchBar.range[1]).format(format);
      }

      for (let friend of this.state.friends) {
        const m = moment.tz(friend.timezone.name);
        if (from && to) {
          const timestamp = m.format(format);
          if (!(timestamp >= from && timestamp <= to)) {
            continue;
          }
        }
        friend.currentTime = m.format('HH:mm:ss');
        friend.currentDate = m.format('YYYY.MM.DD');
        newFriends.push(friend);
      }
      this.setState({friends: newFriends});
      await this.sleep(500);
    }
  };

  requestFriends = async page => {
    const state = this.state.searchBar;
    try {
      const query = {
        firstName: `^${state.firstName}`,
        lastName: `^${state.lastName}`,
        page: page
      };

      query.sort = state.sortingSwitch ? "country" : "firstName";

      if (state.range && state.range[0] && state.range[1] && state.betweenSwitch) {
        query.from = moment(state.range[0]).format("YYYYMMDDHHmmss");
        query.to = moment(state.range[1]).format("YYYYMMDDHHmmss");
      }

      const response = await graphqlService.friends(query);
      this.setState({friends: response.data.friends.friends, page: page})
    } catch (e) {
      console.log(e);
    }
  };

  searchBarChangedHandler = async e => {
    const searchBar = {...this.state.searchBar};
    if (e.target.name === "betweenSwitch") {
      searchBar.betweenSwitchLabel = searchBar.betweenSwitch ? "Off" : "On";
      searchBar.betweenSwitch = !searchBar.betweenSwitch;
    } else {
      searchBar[e.target.name] = e.target.value;
    }

    await this.setState({searchBar});
    this.requestFriends(1)
  };

  rangeChangedHandler = async range => {
    const searchBar = {...this.state.searchBar};
    searchBar.range = range;
    await this.setState({searchBar});
    this.requestFriends(1);
  };

  sortingChangeHandler = async e => {
    const searchBar = {...this.state.searchBar};
    searchBar.sortingSwitch = !searchBar.sortingSwitch;
    searchBar.sortingSwitchLabel = searchBar.sortingSwitch ? "Country" : "First Name";
    await this.setState({searchBar});
    this.requestFriends(1);
  };

  render() {
    const state = this.state;
    const rows = state.friends.map(f => <tr key={f._id}>
      <td>{f.firstName}</td>
      <td>{f.lastName}</td>
      <td>{f.city}</td>
      <td>{f.country}</td>
      <td><span className="Time">{f.currentDate ? f.currentDate : "----.--.--"}</span></td>
      <td><span className="Time">{f.currentTime ? f.currentTime : "--:--:--"}</span></td>
    </tr>);

    return <div className="container Card">
      {state.redirect !== "" ? <Redirect to={state.redirect}/> : null}
      <div className="row mb-2">
        <div className="col-md-1"/>
        <div className="col-md-10">
          <h1>My Friends</h1>
        </div>
        <div className="col-md-1"/>
      </div>
      <SearchBar rangeChanged={this.rangeChangedHandler} formChanged={this.searchBarChangedHandler}
                 sortingChanged={this.sortingChangeHandler}
                 betweenSwtich={state.searchBar.betweenSwitch}
                 betweenSwtichLabel={state.searchBar.betweenSwitchLabel}
                 sortingSwitch={state.searchBar.sortingSwitch}
                 sortingSwitchLabel={state.searchBar.sortingSwitchLabel}
                 range={state.searchBar.range}
                 firstName={state.searchBar.firstName}
                 lastName={state.searchBar.lastName}/>
      <div className="row mt-4">
        <div className="col-md-1"/>
        <div className="col-md-10">
          <Table dark>
            <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Country</th>
              <th>Current Date</th>
              <th>Current Time</th>
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
          </Table>
        </div>
        <div className="col-md-1"/>
      </div>
    </div>
  }


};