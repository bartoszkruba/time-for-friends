import React, {Component, Fragment} from 'react';
import {Link, Redirect} from "react-router-dom";
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import moment from 'moment-timezone'

import Clock from "./Clock/Clock";
import SearchBar from "./SearchBar/SearchBar";

import graphqlService from "../../graphql/graphqlService";

export default class FriendList extends Component {

  state = {
    count: 0,
    page: 1,
    searchBar: {
      firstName: "",
      lastName: "",
      range: {
        min: 0,
        max: 40,
        from: new Date(),
        to: new Date(),
      },
      betweenSwitch: false,
      sorting: "First Name",
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
    this._isMounted = true;
    this.requestFriends(1);
    this.calculateTimePickerRange();
    this.calculateTimes();
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  sleep = ms => new Promise((resolve => setTimeout(resolve, ms)));

  calculateTimePickerRange = async () => {
    while (this._isMounted) {
      const searchBar = {...this.state.searchBar};

      const earliest = new Date(moment.tz("Pacific/Samoa").format("MMM DD, YYYY HH:mm"));
      const latest = new Date(moment.tz("Pacific/Kiritimati").format("MMM DD, YYYY HH:mm"));
      latest.setHours(latest.getHours() + 1);

      searchBar.range.min = earliest.getTime();
      searchBar.range.max = latest.getTime();
      searchBar.range.from = earliest.getTime();
      searchBar.range.to = latest.getTime();

      this.setState({searchBar});

      await this.sleep(60 * 30 * 1000);
    }
  };

  calculateTimes = async () => {
    while (this._isMounted) {
      const state = this.state;
      const searchBar = state.searchBar;
      const newFriends = [];

      const format = "YYYYMMDDHHmmss";
      let from, to;
      if (searchBar.range && searchBar.range.from && searchBar.range.to && searchBar.betweenSwitch) {
        from = moment(searchBar.range.from).format(format);
        to = moment(searchBar.range.to).format(format);
      }

      let timeFormat;
      let dateFormat;

      // eslint-disable-next-line
      switch (this.props.language) {
        case "se":
          timeFormat = 'HH:mm:ss';
          dateFormat = 'DD.MM.YYYY';
          break;
        case "us":
          timeFormat = "hh:mm:ss A";
          dateFormat = "MM.DD.YYYY";
          break;
      }

      // eslint-disable-next-line
      for (const friend of this.state.friends) {
        const m = moment.tz(friend.timezone.name);
        if (from && to) {
          const timestamp = m.format(format);
          if (!(timestamp >= from && timestamp <= to)) {
            continue;
          }
        }

        friend.currentTime = m.format(timeFormat);

        friend.hour = m.hours();
        friend.minute = m.minutes();

        friend.currentDate = m.format(dateFormat);

        const currentMinute = friend.hour * 60 + friend.minute;

        if ((friend.workMarks.to > friend.workMarks.from &&
          currentMinute >= friend.workMarks.from &&
          currentMinute <= friend.workMarks.to) ||
          (friend.workMarks.to < friend.workMarks.from &&
            (currentMinute < friend.workMarks.to || currentMinute > friend.workMarks.from))) {
          friend.working = true;
        }

        if ((friend.sleepMarks.to > friend.sleepMarks.from &&
          currentMinute >= friend.sleepMarks.from &&
          currentMinute < friend.sleepMarks.to) ||
          (friend.sleepMarks.to < friend.sleepMarks.from &&
            (currentMinute < friend.sleepMarks.to || currentMinute >= friend.sleepMarks.from))) {
          friend.sleeping = true;
        }

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

      switch (state.sorting) {
        case "First Name":
        case "Förnamn":
          query.sort = "firstName";
          break;
        case "Country":
        case "Land":
          query.sort = "country";
          break;
        case "Last Name":
        case "Efternamn":
          query.sort = "lastName";
          break;
        default:
          query.sort = "currentTime";
      }

      if (state.range && state.range.from && state.range.to && state.betweenSwitch) {
        query.from = moment(state.range.from).format("YYYYMMDDHHmmss");
        query.to = moment(state.range.to).format("YYYYMMDDHHmmss");
      }

      const response = await graphqlService.friends(query);
      this.setState({friends: response.data.friends.friends, page: page, count: response.data.friends.count})
    } catch (e) {
      console.log(e);
      this.props.showModal();
    }
  };

  deleteFriendHandler = async _id => {
    try {
      await graphqlService.deleteFriend(_id);
      const currentPage = this.state.page;
      const maxPage = Math.ceil((((this.state.count - 1) < 1) ? 1 : (this.state.count - 1)) / 10);
      if (currentPage > maxPage) {
        this.requestFriends(currentPage - 1)
      } else {
        this.requestFriends(currentPage)
      }
    } catch (e) {
      console.log(e);
    }
  };

  searchBarChangedHandler = async e => {
    const searchBar = {...this.state.searchBar};
    if (e.target.name === "betweenSwitch") {
      searchBar.betweenSwitch = !searchBar.betweenSwitch;
    } else {
      searchBar[e.target.name] = e.target.value;
    }

    await this.setState({searchBar});
    this.requestFriends(1)
  };

  rangeChangedHandler = async value => {
    const searchBar = {...this.state.searchBar};
    searchBar.range.from = value[0];
    searchBar.range.to = value[1];

    await this.setState({searchBar});
    this.requestFriends(1);
  };

  requestLastPage = () => {
    const count = (this.state.count === 0) ? 1 : this.state.count;
    this.requestFriends(Math.ceil(count / 10))
  };

  requestNextPage = () => {
    this.requestFriends(this.state.page + 1)
  };

  renderPaginationSites = () => {
    const pages = [];
    const currentPage = this.state.page;
    const maxPage = Math.ceil(((this.state.count === 0) ? 1 : this.state.count) / 10);
    for (let i = currentPage - 3; i <= (currentPage + 3); i++) {
      if (i < 1 || i > maxPage) continue;
      const activeClass = i === this.state.page ? "active-link" : "";
      pages.push(
        <PaginationItem className={"ml-1 mr-1 " + activeClass} key={i} active={i === this.state.page}>
          <PaginationLink onClick={e => this.requestFriends(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>)
    }
    return pages;
  };

  nextPageDisabled = () => {
    const pages = Math.ceil(((this.state.count === 0) ? 1 : this.state.count) / 10);
    return this.state.page >= pages;
  };

  render() {
    const state = this.state;

    let contacts;

    const text = {};

    // eslint-disable-next-line
    switch (this.props.language) {
      case "se":
        text.header = "Filtrera Dina Kontakter";
        break;
      case "us":
        text.header = "Filter Your Contacts";
        break;
    }

    if (state.count > 0) {
      contacts = state.friends.map(f => <div key={f._id} className="container Tile">
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-7">
            <h1>
              <Link style={{textDecoration: "none"}} className="text-white" to={"friend/" + f._id}>
              <span className="Tile-Header">
              {f.firstName} {f.lastName}
              </span>
              </Link>
            </h1>
            <h6 style={{fontWeight: "normal"}}>{f.city}, {f.country}</h6>
            {f.working ? <i className="fas fa-briefcase mt-1"/> : null}
            {f.sleeping ? <i className="fas fa-bed mt-1"/> : null}
          </div>
          <div className="col-md-3 text-md-right">
            <Clock hour={f.hour} minute={f.minute}/>
            {/*<h2>{f.currentTime ? f.currentTime : "-"}</h2>*/}
            <h5>{f.currentDate ? f.currentDate : "-"}</h5>
            <i onClick={e => this.deleteFriendHandler(f._id)} className="Delete-Icon fas fa-trash"
               style={{cursor: "pointer"}}/>
          </div>
          <div className="col-md-1"/>
        </div>
      </div>);
    } else {
      contacts = <div className="container Tile">
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-10">
            <h1>No Contacts</h1>
          </div>
          <div className="col-md-1"/>
        </div>
      </div>
    }

    let pagination;

    if (state.count > 0) {
      pagination = <div className="container Pagination">
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-10 text-center">
            <div className="row">
              <Pagination className="m-auto" aria-label="Page navigation example" style={{fontSize: "110%"}}>
                <PaginationItem className="ml-1 mr-1">
                  <PaginationLink first onClick={e => this.requestFriends(1)}/>
                </PaginationItem>
                <PaginationItem className="ml-1 mr-1">
                  <PaginationLink disabled={this.state.page === 1}
                                  onClick={e => this.requestFriends(this.state.page - 1)}
                                  previous/>
                </PaginationItem>
                {this.renderPaginationSites()}
                <PaginationItem className="ml-1 mr-1">
                  <PaginationLink disabled={this.nextPageDisabled()} onClick={this.requestNextPage} next/>
                </PaginationItem>
                <PaginationItem className="ml-1 mr-1">
                  <PaginationLink last onClick={this.requestLastPage}/>
                </PaginationItem>
              </Pagination>
            </div>
          </div>
          <div className="col-md-1"/>
        </div>
      </div>;
    }

    return <Fragment>
      <div className="container Card">
        {state.redirect !== "" ? <Redirect to={state.redirect}/> : null}
        <div className="row mb-2">
          <div className="col-md-1"/>
          <div className="col-md-10">
            <h1 className="Card-Header">{text.header}</h1>
          </div>
          <div className="col-md-1"/>
        </div>
        <SearchBar
          language={this.props.language}
          rangeChanged={this.rangeChangedHandler}
          formChanged={this.searchBarChangedHandler}
          sortingChanged={this.sortingChangeHandler}
          sorting={state.searchBar.sorting}
          betweenSwtich={state.searchBar.betweenSwitch}
          range={state.searchBar.range}
          firstName={state.searchBar.firstName}
          lastName={state.searchBar.lastName}/>
      </div>
      {pagination}
      {contacts}
      {pagination}
    </Fragment>
  }
};