import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import Thumbnail from './Thumbnail';
import FormError from './FormError';
import Search from './Search';
import {
  FaArrowCircleRight,
  FaArrowCircleLeft,
  FaClipboardList,
  FaTable
} from 'react-icons/fa';
import Modal from './Modal';

const API_KEY = '1e571b63';
const modalRoot = document.getElementById('modal-root');

const MvpContext = React.createContext();

function Movies({ movieList, className, children, toggleView }) {
  return (
    <MvpContext.Consumer>
      {context => {
        const {
          addToFavorites,
          checkFavoritesList,
          handleModalClick
        } = context;
        return movieList.map((movie, index) => {
          return (
            <Thumbnail
              key={movie.imdbID}
              movie={movie}
              className={`${index % 2 ? 'odd' : 'even'} ${
                className ? className : ''
              }`}
              addToFavorites={addToFavorites}
              checkFavoritesList={checkFavoritesList}
              handleModalClick={handleModalClick}
              toggleView={toggleView}
            >
              {children}
            </Thumbnail>
          );
        });
      }}
    </MvpContext.Consumer>
  );
}

function formatTitle(title) {
  return title.split('&').join('%26');
}

async function fetchResult(title, fetchPage, apiKey) {
  const moviesReturned = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&s=${formatTitle(
      title
    )}&page=${fetchPage}`
  )
    .then(resp => resp.json())
    .catch(err => console.error);
  const { Response, Search, totalResults, Error } = moviesReturned;
  const moviesWithDetails =
    Response === 'True'
      ? await Promise.all(
          Search.map(
            async item =>
              await (await fetch(
                `https://www.omdbapi.com/?apikey=${apiKey}&i=${item.imdbID}`
              ))
                .json()
                .catch(err => console.error)
          )
        )
      : [];

  return { Response, totalResults, Error, moviesWithDetails };
}

class Mvp extends React.Component {
  state = {
    currentSearch: [],
    favoriteList: [],
    errorMessage: '',
    totalResults: 0,
    isFavoritePage: true,
    fetchPage: 1,
    itemsPerPage: 6,
    currentSearchPage: 1,
    currentFavoritesPage: 1,
    showModal: false,
    clickedMovie: [],
    toggleView: true,
    movieTitle: ''
  };

  checkFavoritesList = imdbID =>
    this.state.favoriteList.some(movie => movie.imdbID === imdbID);

  searchResult = async (title, fetchPage, apiKey, isNewPage) => {
    const fpage = title === this.state.movieTitle ? fetchPage : 1;
    const {
      Response,
      totalResults,
      Error,
      moviesWithDetails
    } = await fetchResult(title, fpage, apiKey);

    /*const {itemsPerPage, totalResults, currentSearch} = this.state;
    if ( itemsPerPage < totalResults && itemsPerPage < currentSearch.length) {
      
    }*/

    this.setState({
      currentSearch:
        Response === 'True'
          ? isNewPage
            ? this.state.currentSearch.concat(moviesWithDetails)
            : moviesWithDetails
          : [],
      errorMessage: Response === 'True' ? '' : Error,
      totalResults: Response === 'True' ? +totalResults : 0,
      isFavoritePage: false,
      movieTitle: title,
      fetchPage: fpage,
      currentSearchPage: fpage === 1 ? 1 : this.state.currentSearchPage
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
      this.changeListShown
    );
  };

  changeListShown = () => {
    const {
      isFavoritePage,
      favoriteList,
      itemsPerPage,
      currentFavoritesPage
    } = this.state;
    const page =
      (currentFavoritesPage - 1) * itemsPerPage === favoriteList.length
        ? currentFavoritesPage - 1
        : currentFavoritesPage;
    this.setState({
      isFavoritePage: favoriteList.length === 0 ? false : isFavoritePage,
      currentFavoritesPage: page || 1
    });
  };

  setPageNumber = p => {
    const {
      isFavoritePage,
      currentSearchPage,
      currentFavoritesPage,
      currentSearch,
      favoriteList,
      itemsPerPage,
      movieTitle,
      fetchPage,
      totalResults
    } = this.state;
    const page = isFavoritePage ? currentFavoritesPage : currentSearchPage;
    const list = isFavoritePage ? favoriteList : currentSearch;

    if (
      (page + p) * itemsPerPage > list.length &&
      totalResults > list.length &&
      !isFavoritePage
    ) {
      this.searchResult(movieTitle, fetchPage + 1, API_KEY, true);
    }

    this.setState({
      [isFavoritePage ? 'currentFavoritesPage' : 'currentSearchPage']: page + p
    });
  };

  handleModalClick = movie => {
    console.log('movie', new Array(movie));
    this.setState({
      showModal: !this.state.showModal,
      clickedMovie: movie ? new Array(movie) : []
    });
  };

  changeView = () => {
    this.setState({
      toggleView: !this.state.toggleView
    });
  };
  render() {
    const {
      currentSearch,
      totalResults,
      errorMessage,
      favoriteList,
      isFavoritePage,
      fetchPage,
      currentSearchPage,
      currentFavoritesPage,
      showModal,
      clickedMovie,
      toggleView,
      itemsPerPage
    } = this.state;
    const page = isFavoritePage ? currentFavoritesPage : currentSearchPage;
    const showNextPageButton =
      totalResults <= page * itemsPerPage ||
      (isFavoritePage && page * itemsPerPage >= favoriteList.length)
        ? true
        : false;

    const movieList = (isFavoritePage ? favoriteList : currentSearch).slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    return (
      <MvpContext.Provider
        value={{
          state: this.state,
          addToFavorites: this.addToFavorites,
          checkFavoritesList: this.checkFavoritesList,
          handleModalClick: this.handleModalClick
        }}
      >
        <>
          {showModal ? (
            <Modal
              handleModalClick={this.handleModalClick}
              modalRoot={modalRoot}
            >
              <div className='modal'>
                <Movies movieList={clickedMovie} className='w-100'>
                  Close
                </Movies>
              </div>
            </Modal>
          ) : null}
          <Search
            searchResult={this.searchResult}
            apiKey={API_KEY}
            fetchPage={fetchPage}
          />
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
              <div className='col-12 text-center mb-2 text-light position-relative'>
                <div className='col-12 position-absolute pr-4 pt-1 text-right'>
                  <span
                    className='float-right text-warning cursor-pointer btn badge text-light btn-outline-warning'
                    onClick={this.changeView}
                  >
                    {!toggleView ? (
                      <FaTable title='Table view' />
                    ) : (
                      <FaClipboardList title='List view' />
                    )}
                  </span>
                </div>
                <span
                  className={`col-4 cursor-pointer ${
                    page === 1 ? 'invisible' : 'visible'
                  }`}
                  title='Previous page'
                >
                  <FaArrowCircleLeft onClick={() => this.setPageNumber(-1)} />
                </span>
                <div className='col-4 d-inline-block'>{page}</div>
                <span
                  className={`col-4  cursor-pointer ${
                    showNextPageButton ? 'invisible' : 'visible'
                  }`}
                  title='Next page'
                >
                  <FaArrowCircleRight onClick={() => this.setPageNumber(1)} />
                </span>
              </div>
              <div
                className={`p-1 ${
                  toggleView ? 'd-flex flex-wrap justify-content-around' : ''
                } `}
              >
                <Movies
                  movieList={movieList}
                  className={`cl-transition ${toggleView ? 'w-49 mb-1' : ''}`}
                  toggleView={toggleView}
                >
                  Show details
                </Movies>
              </div>
            </div>
          ) : null}
          {errorMessage ? <FormError theMessage={errorMessage} /> : null}
        </>
      </MvpContext.Provider>
    );
  }
}

export default MvpContext;

ReactDOM.render(<Mvp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
