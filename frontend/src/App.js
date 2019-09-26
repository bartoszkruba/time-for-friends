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
import LoadingBackdrop from "./components/LoadingBackdrop/LoadingBackdrop";
import graphqlService from "./graphql/graphqlService";

export default class App extends Component {

  state = {
    language: "us",
    loggedIn: true,
    redirect: "",
    showModal: false,
    showLoadingBackdrop: false
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
  showLoadingBackdrop = () => this.setState({showLoadingBackdrop: true});
  hideLoadingBackdrop = () => this.setState({showLoadingBackdrop: false});

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

  switchLanguageHandler = () => {
    if (this.state.language === "se") this.setState({language: "us"});
    else this.setState({language: "se"});
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

    const register = () => <RegisterForm
      showLoading={this.showLoadingBackdrop}
      hideLoading={this.hideLoadingBackdrop}
      showModal={this.showModal}
      language={state.language}
      registerSuccessfull={this.successfullRegisterHandler}/>;

    const login = () => <LoginForm
      showLoading={this.showLoadingBackdrop}
      hideLoading={this.hideLoadingBackdrop}
      showModal={this.showModal}
      language={state.language}
      loginSuccessfull={this.successfullLoginHandler}/>;

    const index = () => <Index
      showModal={this.showModal}
      language={state.language}/>;

    const newFriend = () => <NewFriendForm
      showLoading={this.showLoadingBackdrop}
      hideLoading={this.hideLoadingBackdrop}
      showModal={this.showModal} loggedIn={state.loggedIn}
      language={state.language}
      addedNewFriend={this.createdNewFriendHandler}/>;

    const friendList = () => <FriendList
      showModal={this.showModal}
      language={state.language}
      loggedIn={state.loggedIn}/>;

    const friend = ({match}) => <Friend
      showModal={this.showModal}
      language={state.language}
      _id={match.params.id}/>;

    const mapComponent = () => <MapComponent
      showModal={this.showModal}
      language={state.language}
      loggedIn={state.loggedIn}/>;

    return <Router>
      <LoadingBackdrop show={state.showLoadingBackdrop}/>
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
        <Navbar language={this.state.language} switchLanguage={this.switchLanguageHandler}
                loggedIn={state.loggedIn} logout={this.logoutHandler}/>
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
    </Router>;
  }
};
