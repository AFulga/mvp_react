import React from 'react';
import { FaSearch } from 'react-icons/fa';

class Search extends React.Component {
  state = {
    searchTitle: ''
  };

  handleChange = e => {
    const val = e.target.value;
    this.setState({
      searchTitle: val.trim().length ? val : ''
    });
  };

  handleEnter = e => {
    if (e.key === 'Enter') {
      this.props.searchResult(this.state.searchTitle);
    }
  };
  render() {
    const { searchResult } = this.props;
    const { searchTitle } = this.state;
    return (
      <div className='input-group md-form form-sm form-1 pl-0'>
        <div className='input-group-prepend'>
          <span
            onClick={() => searchResult(searchTitle)}
            className='input-group-text cyan lighten-2'
            id='basic-text1'
          >
            <FaSearch />
          </span>
        </div>
        <input
          className='form-control my-0 py-1'
          type='text'
          placeholder='Search'
          aria-label='Search'
          onChange={this.handleChange}
          value={this.state.searchTitle}
          onKeyPress={this.handleEnter}
        />
      </div>
    );
  }
}

export default Search;
