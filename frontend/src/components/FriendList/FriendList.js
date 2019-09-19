import React, {Component, Fragment} from 'react';
import {Link, Redirect} from "react-router-dom";
import SearchBar from "./SearchBar/SearchBar";
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import moment from 'moment-timezone'

import graphqlService from "../../graphql/graphqlService";

export default class FriendList extends Component {

  state = {
    count: 0,
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

      // eslint-disable-next-line
      for (const friend of this.state.friends) {
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
      this.setState({friends: response.data.friends.friends, page: page, count: response.data.friends.count})
    } catch (e) {
      console.log(e);
    }
  };

  deleteFriendHandler = async _id => {
    try {
      await graphqlService.deleteFriend(_id);
      const currentPage = this.state.page;
      const maxPage = Math.ceil((((this.state.count - 1) < 1) ? 1 : (this.state.count - 1)) / 10);
      console.log("maxPage: " + maxPage);
      console.log('currentPage: ' + currentPage);
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

    if (state.count > 0) {
      contacts = state.friends.map(f => <div className="container Tile">
        <div className="row" key={f._id}>
          <div className="col-md-1"/>
          <div className="col-md-7">
            <h1>
              <Link style={{textDecoration: "none"}} className="text-white" to={"friend/" + f._id}>
              <span className="Tile-Header">
              {f.firstName} {f.lastName}
              </span>
              </Link>
            </h1>
          </div>
          <div className="col-md-3 text-right">
            <h2>{f.currentTime}</h2>
          </div>
          <div className="col-md-1"/>
        </div>
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-5">
            <p>{f.city}, {f.country}</p>
          </div>
          <div className="col-md-5 text-right">
            <h5>{f.currentDate}</h5>
          </div>
          <div className="col-md-1"/>
        </div>
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-10 text-right">
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

    const pagination = <div className="container Pagination">
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

    return <Fragment>
      <div className="container Card">
        {state.redirect !== "" ? <Redirect to={state.redirect}/> : null}
        <div className="row mb-2">
          <div className="col-md-1"/>
          <div className="col-md-10">
            <h1 className="Card-Header">Filter Your Contacts</h1>
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
      </div>
      {state.count > 0 ? {pagination} : null}
      {contacts}
      {state.count > 0 ? {pagination} : null}
    </Fragment>
  }
};