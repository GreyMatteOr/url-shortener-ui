import React, { Component } from 'react';
import './App.css';
import api from '../../apiCalls';
import UrlContainer from '../UrlContainer/UrlContainer';
import UrlForm from '../UrlForm/UrlForm';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      urls: []
    }
  }

  componentDidMount() {
    this.loadContent();
  }

  loadContent = () => {
    api.getUrls()
    .then( ({ urls }) => {
      if (urls === 'error') this.setState( {error: true})
      this.setState( {urls} )
    })
    .catch( () => this.setState( {error: true} ) )
  }

  render() {
    return (
      <main className="App">
        <header>
          <h1>URL Shortener</h1>
          <UrlForm loadContent={this.loadContent}/>
        </header>

        <UrlContainer loadContent={this.loadContent} urls={this.state.urls}/>
      </main>
    );
  }
}

export default App;
