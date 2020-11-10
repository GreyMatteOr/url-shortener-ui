import api from '../../apiCalls';
import React from 'react';
import './UrlContainer.css';

const UrlContainer = props => {
  const urlEls = props.urls.map((url, i) => {
    return (
      <div className="url" key={i} data-testid='url-element'>
        <button onClick={ () => deleteContainer(url.id) }>X</button>
        <h3>{url.title}</h3>
        <a href={url.short_url} target="blank">{url.short_url}</a>
        <p>{url.long_url}</p>
      </div>
    )
  })

  let deleteContainer = (id) => {
    api.deleteUrl(id)
    .then( isSuccess => {
      if (isSuccess) props.loadContent()
    });
  }

  return (
    <section data-testid='url-container'>
      { urlEls.length ? urlEls : <p>No urls yet! Find some to shorten!</p> }
    </section>
  )
}

export default UrlContainer;
