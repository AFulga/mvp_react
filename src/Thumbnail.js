import React, { Component } from 'react';
import { FaFilm, FaStar } from 'react-icons/fa';
import logo from './poster-placeholder.png';
import { GoTrashcan, GoStar, GoMail } from 'react-icons/go';
import MvpContext from '.';

class Thumbnail extends Component {
  render() {
    const {
      Poster,
      Title,
      Runtime,
      Genre,
      Year,
      Director,
      Actors,
      imdbID,
      Plot
    } = this.props.movie;
    //console.log('props', this.props);

    return (
      <MvpContext.Consumer>
        {context => {
          const {
            addToFavorites,
            checkFavoritesList,
            handleModalClick
          } = context;
          return (
            <div
              className={`position-relative img-container p-2 ${this.props.className}`}
            >
              <div className='col-12 cl-star position-absolute text-black-50 text-right'>
                <FaStar
                  title={
                    checkFavoritesList(imdbID)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                  style={{ cursor: 'pointer' }}
                  className={checkFavoritesList(imdbID) ? 'text-warning' : ''}
                  onClick={() => addToFavorites(imdbID)}
                />
              </div>
              <div
                className={`${
                  this.props.toggleView ? 'col-12 text-center' : 'col-4'
                } d-inline-block m-0`}
              >
                <img src={Poster !== 'N/A' ? Poster : logo} alt={Title} />
              </div>
              <div
                className={`${
                  this.props.toggleView
                    ? 'col-12 text-center'
                    : 'col-8 text-left'
                } d-inline-block m-0 align-top`}
              >
                <h4>
                  {Title} ({Year})
                </h4>
                <p
                  className={`${
                    this.props.toggleView ? 'd-none' : ''
                  } cert-runtime-genre`}
                >
                  <time>{` ${Runtime}`}</time>
                  {' - '}
                  {Genre.split(',').map((item, index) => (
                    <>
                      {index % 2 ? <span className='ghost'> | </span> : null}
                      <span>{item}</span>
                    </>
                  ))}
                </p>
                <div
                  className={`${this.props.toggleView ? 'd-none' : ''} outline`}
                >
                  {Plot}
                </div>
                <div
                  className={`${
                    this.props.toggleView ? 'd-none' : ''
                  } txt-block`}
                >
                  <h5 className='inline font-weight-bold'>Director:</h5>
                  <span>{Director}</span>
                </div>
                <div
                  className={`${
                    this.props.toggleView ? 'd-none' : ''
                  } txt-block`}
                >
                  <h5 className='inline font-weight-bold'>Stars:</h5>
                  <span>{Actors}</span>
                </div>
                <button
                  className='btn btn-sm btn-outline-warning badge-dark badge'
                  onClick={() => handleModalClick(this.props.movie)}
                >
                  {this.props.children}
                </button>
              </div>
            </div>
          );
        }}
      </MvpContext.Consumer>
    );
  }
}

export default Thumbnail;
