import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import React, {Component} from "react";
import LanguageContext from "../../context/languageContext";

export default class ErrorModal extends Component {

  static contextType = LanguageContext;

  render() {
    const text = {};

    // eslint-disable-next-line
    switch (this.context.language) {
      case "se":
        text.modalHeader = "Något har blivit fel";
        text.modalBody = "Uppdatera webbsidan och försök igen.";
        text.closeButton = "Stäng";
        break;
      case "us":
        text.modalHeader = "Something went wrong";
        text.modalBody = "Please refresh site and try again.";
        text.closeButton = "Close";
    }

    return <Modal isOpen={this.props.show}>
      <ModalHeader toggle={this.toggle}>{text.modalHeader}</ModalHeader>
      <ModalBody>
        {text.modalBody}
      </ModalBody>
      <ModalFooter>
        <Button color="info" onClick={this.props.close}>{text.closeButton}</Button>{' '}
      </ModalFooter>
    </Modal>
  }
}