import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.el = document.createElement(
      'div'
    ); /*(
      <div className='modal'>
        <p>My modal</p>
        <button onClick={this.props.handleModalClick}>Close</button>
      </div>
    );*/
  }

  componentDidMount = () => {
    this.props.modalRoot.appendChild(this.el);
  };

  componentWillUnmount = () => {
    this.props.modalRoot.removeChild(this.el);
  };

  render() {
    return ReactDOM.createPortal(this.props.children, this.props.modalRoot);
  }
}

export default Modal;
