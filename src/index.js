import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import * as serviceWorker from './serviceWorker';
import Thumbnail from './Thumbnail';
import FormError from './FormError';
import Search from './Search';

function Movies({ searchList, addToFavorites, favoriteList, isFavoritePage }) {
  const movies = isFavoritePage ? favoriteList : searchList;
  return movies.map((movie, index) => {
    console.log(movie.imdbID);
    return (
      <Thumbnail
        key={movie.imdbID}
        movie={movie}
        className={index % 2 ? 'odd' : 'even'}
        addToFavorites={addToFavorites}
        favoriteList={favoriteList}
      />
    );
  });
}

function formatTitle(title) {
  return title
    .split(' ')
    .join('+')
    .split('&')
    .join('%26');
}

class Mvp extends React.Component {
  state = {
    currentSearch: [],
    favoriteList: [],
    errorMessage: '',
    totalResults: 0,
    isFavoritePage: true
  };
  searchResult = async title => {
    const moviesReturned = await fetch(
      `https://www.omdbapi.com/?apikey=1e571b63&s=${formatTitle(title)}`
    ).then(resp => resp.json());
    console.log(moviesReturned);
    const { Response, Search, totalResults, Error } = moviesReturned;
    const moviesWithDetails =
      Response === 'True'
        ? await Promise.all(
            Search.map(
              async item =>
                await (await fetch(
                  `https://www.omdbapi.com/?apikey=1e571b63&i=${item.imdbID}`
                )).json()
            )
          )
        : [];

    this.setState({
      currentSearch: Response === 'True' ? moviesWithDetails : [],
      errorMessage: Response === 'True' ? '' : Error,
      totalResults: Response === 'True' ? totalResults : 0,
      isFavoritePage: false
    });
  };

  addToFavorites = imdbID => {
    const { currentSearch, favoriteList } = this.state;
    this.setState(
      {
        favoriteList: favoriteList.some(item => item.imdbID === imdbID)
          ? favoriteList.filter(item => item.imdbID !== imdbID)
          : [
              ...favoriteList,
              currentSearch.find(item => item.imdbID === imdbID)
            ]
      },
      this.changePage
    );
  };

  changePage = () =>
    this.setState({
      isFavoritePage:
        this.state.favoriteList.length === 0 ? false : this.state.isFavoritePage
    });
  render() {
    const {
      currentSearch,
      totalResults,
      errorMessage,
      favoriteList,
      isFavoritePage
    } = this.state;
    console.log('currentSearch', currentSearch);
    return (
      <>
        <Search searchResult={this.searchResult} />
        <div className='text-center mt-2'>
          <button
            className={`btn btn-sm btn-outline-warning mr-1 h-auto mt-auto mb-auto cursor-pointer font-weight-bold 
          ${
            currentSearch.length > 0 && favoriteList.length > 0
              ? 'visible'
              : 'invisible'
          }
          `}
            onClick={() => this.setState({ isFavoritePage: !isFavoritePage })}
          >
            {isFavoritePage ? 'Show search list' : 'Show favorites list'}
          </button>
        </div>
        {totalResults ? (
          <div className='mt-1 App rounded pt-1 pr-3 pl-3 pb-3'>
            <Movies
              searchList={isFavoritePage ? favoriteList : currentSearch}
              addToFavorites={this.addToFavorites}
              favoriteList={favoriteList}
            />
          </div>
        ) : null}
        {errorMessage ? <FormError theMessage={errorMessage} /> : null}
      </>
    );
  }
}
//.then(obj => ReactDOM.render(<Thumbnail />)

ReactDOM.render(<Mvp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
