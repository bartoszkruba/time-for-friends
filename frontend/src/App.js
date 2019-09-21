import React, {Component} from 'react';
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import './App.css';

import Navbar from "./components/Navbar/Navbar";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import Index from './components/Index/Index';
import NewFriendForm from "./components/NewFriendForm/NewFriendForm";
import FriendList from "./components/FriendList/FriendList";
import Friend from "./components/Friend/Friend";
import MapComponent from "./components/Map/Map";
import graphqlService from "./graphql/graphqlService";

export default class App extends Component {

  state = {
    language: "en",
    loggedIn: true,
    redirect: "",
    showModal: false,
  };

  async componentDidMount() {
    try {
      const response = await graphqlService.isAuthenticated();
      this.setState({loggedIn: response.data.isAuthenticated})
    } catch (e) {
      console.log(e);
      this.setState({loggedIn: false});
    }
  }

  showModal = () => this.setState({showModal: true});
  closeModal = () => this.setState({showModal: false});

  successfullRegisterHandler = (_id, email) => {
    this.redirect("/login")
  };

  successfullLoginHandler = token => {
    localStorage.setItem('token', token);
    this.setState({loggedIn: true});
    this.redirect("/friends")
  };

  logoutHandler = async () => {
    localStorage.removeItem('token');
    await this.setState({loggedIn: false});
    this.redirect("/")
  };

  createdNewFriendHandler = () => {
    this.redirect("/friends")
  };

  redirect = page => {
    this.setState({redirect: page});
    this.setState({redirect: ""});
  };

  render() {
    const state = this.state;

    const register = () => <RegisterForm showModal={this.showModal}
                                         language={this.state.language}
                                         registerSuccessfull={this.successfullRegisterHandler}/>;

    const login = () => <LoginForm showModal={this.showModal}
                                   language={this.state.language}
                                   loginSuccessfull={this.successfullLoginHandler}/>;

    const index = () => <Index showModal={this.showModal}
                               language={this.state.language}/>;

    const newFriend = () => <NewFriendForm showModal={this.showModal} loggedIn={state.loggedIn}
                                           language={this.state.language}
                                           addedNewFriend={this.createdNewFriendHandler}/>;

    const friendList = () => <FriendList showModal={this.showModal}
                                         language={this.state.language}
                                         loggedIn={state.loggedIn}/>;

    const friend = ({match}) => <Friend showModal={this.showModal}
                                        language={this.state.language}
                                        _id={match.params.id}/>;

    const mapComponent = () => <MapComponent showModal={this.showModal}
                                             language={this.state.language}/>;

    return (
      <Router>

        {state.redirect !== "" ? <Redirect to={state.redirect}/> : null}

        <div className="App">
          <Modal isOpen={state.showModal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Something Went Wrong!</ModalHeader>
            <ModalBody>
              Please refresh site and try again.
            </ModalBody>
            <ModalFooter>
              <Button color="info" onClick={this.closeModal}>Close</Button>{' '}
            </ModalFooter>
          </Modal>
          <Navbar loggedIn={state.loggedIn} logout={this.logoutHandler}/>
          <div className="top-margin">
            <Route path="/" exact component={index}/>
            <Route path="/register/" exact component={register}/>
            <Route path="/login/" exact component={login}/>
            <Route path="/new-friend" exact component={newFriend}/>
            <Route path="/friends" exact component={friendList}/>
            <Route path="/friend/:id" exact component={friend}/>
            <Route path="/map" exact component={mapComponent}/>
          </div>
        </div>
      </Router>

    );
  }
};
