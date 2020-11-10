import api from '../../apiCalls.js';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import UrlForm from './UrlForm.js';

describe( 'UrlForm', () => {

  let mockFetch;
  beforeEach( () => {

    mockFetch = jest.fn();
    api.postUrl = jest.fn().mockResolvedValue({});
  })

  it( 'should render without crashing', () => {
    render( <UrlForm />);

    expect(screen.getByTestId('url-form')).toBeInTheDocument();
  })

  it( 'should call `api.postUrl` with user input when `Shorten Please!` is clicked', async () => {
    render( <UrlForm loadContent={mockFetch}/> );

    let titleInput = screen.getByPlaceholderText('Title...');
    let urlInput = screen.getByPlaceholderText('URL to Shorten...');
    let submitBtn = screen.getByText('Shorten Please!');
    userEvent.type(titleInput, 'My Title');
    userEvent.type(urlInput, 'url.com');
    userEvent.click(submitBtn);

    await waitFor( () => expect(api.postUrl).toBeCalledTimes(1) );
    expect(api.postUrl).toBeCalledWith('url.com', 'My Title');
  })

  it( 'should call `loadContent` on successful post response', async () => {
    render( <UrlForm loadContent={mockFetch}/> );

    let titleInput = screen.getByPlaceholderText('Title...');
    let urlInput = screen.getByPlaceholderText('URL to Shorten...');
    let submitBtn = screen.getByText('Shorten Please!');
    userEvent.type(titleInput, 'My Title');
    userEvent.type(urlInput, 'url.com');
    userEvent.click(submitBtn);

    await waitFor( () => expect(api.postUrl).toBeCalledTimes(1) );
    expect(mockFetch).toBeCalledTimes(1);

  })

  it( 'should not call `loadContent` on bad post response', async () => {
    api.postUrl.mockResolvedValue('error')
    render( <UrlForm loadContent={mockFetch}/> );

    let titleInput = screen.getByPlaceholderText('Title...');
    let urlInput = screen.getByPlaceholderText('URL to Shorten...');
    let submitBtn = screen.getByText('Shorten Please!');
    userEvent.type(titleInput, 'My Title');
    userEvent.type(urlInput, 'url.com');
    userEvent.click(submitBtn);

    await waitFor( () => expect(api.postUrl).toBeCalledTimes(1) );
    expect(mockFetch).toBeCalledTimes(0);

  })

  it( 'should clearInputs regardless of response', async () => {
    render( <UrlForm loadContent={mockFetch}/> );

    let titleInput = screen.getByPlaceholderText('Title...');
    let urlInput = screen.getByPlaceholderText('URL to Shorten...');
    let submitBtn = screen.getByText('Shorten Please!');

    // successful response route
    userEvent.type(titleInput, 'My Title');
    userEvent.type(urlInput, 'url.com');
    expect(titleInput.value).toEqual('My Title');
    expect(urlInput.value).toEqual('url.com');
    userEvent.click(submitBtn);
    await waitFor( () => expect(api.postUrl).toBeCalledTimes(1) );
    expect(titleInput.value).toEqual('');
    expect(urlInput.value).toEqual('');

    // bad response route
    api.postUrl.mockResolvedValue('error')
    userEvent.type(titleInput, 'My Title');
    userEvent.type(urlInput, 'url.com');
    expect(titleInput.value).toEqual('My Title');
    expect(urlInput.value).toEqual('url.com');
    userEvent.click(submitBtn);
    await waitFor( () => expect(api.postUrl).toBeCalledTimes(2) );
    expect(titleInput.value).toEqual('');
    expect(urlInput.value).toEqual('');
  })
})
