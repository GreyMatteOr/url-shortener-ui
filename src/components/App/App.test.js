import api from '../../apiCalls.js';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from './App.js';

describe('App', () => {

  let mockUrl1, mockUrl2, mockUrlData;
  beforeEach( () => {

    mockUrl1 = {
      id: 1,
      long_url: "google.com",
      short_url: "http://localhost:3001/useshorturl/1",
      title: "debug pic"
    }
    mockUrl2 = {
      id: 2,
      long_url: "yahoo.com",
      short_url: "http://localhost:3001/useshorturl/2",
      title: "foobar"
    }
    mockUrlData = {
      urls: [mockUrl1, mockUrl2]
    }

    api.getUrls = jest.fn().mockResolvedValue(mockUrlData);
    api.postUrl = jest.fn().mockResolvedValue({});
    api.deleteUrl = jest.fn().mockResolvedValue({});
  });

  it( 'should render without crashing', () => {
    render( <App /> );

    expect(screen.getByText('URL Shortener')).toBeInTheDocument();
    expect(screen.getByTestId('url-form')).toBeInTheDocument();
    expect(screen.getByTestId('url-container')).toBeInTheDocument();
  });

  it( 'should call `api.getUrls` on load', async () => {
    render( <App /> );

    await waitFor( () => expect(api.getUrls).toBeCalledTimes(1))
  })

  it( 'should display a url Object for each url element it receives', async () => {
    render( <App /> );

    await waitFor( () => expect(api.getUrls).toBeCalledTimes(1))
    expect(screen.getAllByTestId('url-element').length).toEqual(2);
  })

  it( 'should call `api.getUrls` again after a url is deleted', async () => {
    render( <App /> );

    await waitFor( () => expect(api.getUrls).toBeCalledTimes(1))

    let deleteButtons = screen.getAllByText('X');
    userEvent.click(deleteButtons[0]);

    await waitFor( () => expect(api.deleteUrl).toBeCalledTimes(1))
    expect(api.getUrls).toBeCalledTimes(2)
  })

  it( 'should call `api.getUrls` after posting a new url', async () => {
    render( <App /> );

    let titleInput = screen.getByPlaceholderText('Title...');
    let urlInput = screen.getByPlaceholderText('URL to Shorten...');
    let submitBtn = screen.getByText('Shorten Please!');
    userEvent.type(titleInput, 'My Title');
    userEvent.type(urlInput, 'url.com');
    userEvent.click(submitBtn);

    await waitFor( () => expect(api.postUrl).toBeCalledTimes(1))
    expect(api.postUrl).toBeCalledWith('url.com', 'My Title');
    expect(api.getUrls).toBeCalledTimes(2)
  });
})
