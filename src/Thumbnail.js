import React, { Component } from 'react';
import { FaFilm, FaStar } from 'react-icons/fa';
import logo from './poster-placeholder.png';
import { GoTrashcan, GoStar, GoMail } from 'react-icons/go';

class Thumbnail extends Component {
  checkFavoritesList = imdbID =>
    this.props.favoriteList.some(movie => movie.imdbID === imdbID);
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
    console.log('props', this.props);
    return (
      <div className={`img-container p-2 ${this.props.className}`}>
        <div className='col-4 d-inline-block m-0'>
          <img
            src={Poster !== 'N/A' ? Poster : logo}
            alt={Title}
            width='140px'
          />
        </div>
        <div className='col-8 d-inline-block m-0 text-left align-top'>
          <div className='col-12 position-absolute text-black-50 text-right'>
            <FaStar
              title={
                this.checkFavoritesList(imdbID)
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
              style={{ cursor: 'pointer' }}
              className={this.checkFavoritesList(imdbID) ? 'text-warning' : ''}
              onClick={() => this.props.addToFavorites(imdbID)}
            />
          </div>
          <h4>
            {Title} ({Year})
          </h4>
          <p className='cert-runtime-genre'>
            <time>{` ${Runtime}`}</time>
            {' - '}
            {Genre.split(',').map((item, index) => (
              <>
                {index % 2 ? <span className='ghost'> | </span> : null}
                <span>{item}</span>
              </>
            ))}
          </p>
          <div className='outline'>{Plot}</div>
          <div className='txt-block'>
            <h5 className='inline font-weight-bold'>Director:</h5>
            <span>{Director}</span>
          </div>
          <div className='txt-block'>
            <h5 className='inline font-weight-bold'>Stars:</h5>
            <span>{Actors}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Thumbnail;
