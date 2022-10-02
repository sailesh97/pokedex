import React from 'react';
import ReactDOM from 'react-dom';

const Modal = (props) => {
    return (
        <React.Fragment>
          {ReactDOM.createPortal(
            props.backdrop.element,
            document.getElementById(props.backdrop.place)
          )}
          {ReactDOM.createPortal(
            props.modal.element,
            document.getElementById(props.modal.place)
          )}
        </React.Fragment>
      );
}

export default Modal;