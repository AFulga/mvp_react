import React, { Component } from 'react';

class FormError extends Component {
  render() {
    return (
      <div className='col-12 p-3 text-center text-warning'>
        {this.props.theMessage}
      </div>
    );
  }
}

export default FormError;
