import api from '../../apiCalls.js';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import UrlContainer from './/UrlContainer.js';

describe ('UrlContainer', () => {

  let mockFetch, mockUrlData;
  beforeEach( () => {

    mockUrlData = {
      urls: [
        {
          id: 1,
          long_url: "google.com",
          short_url: "http://localhost:3001/useshorturl/1",
          title: "debug pic"
        }
      ]
    }

    api.deleteUrl = jest.fn().mockResolvedValue(true);
    mockFetch = jest.fn().mockResolvedValue( mockUrlData );
  })

  it( 'should render without crashing', () => {
    render( <UrlContainer urls={[]}/> )
    expect(screen.getByTestId('url-container')).toBeInTheDocument();
  })

  it( 'should properly display a url element', () => {
    render( <UrlContainer urls={mockUrlData.urls}/> )

    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('debug pic')).toBeInTheDocument();
    expect(screen.getByText('http://localhost:3001/useshorturl/1')).toBeInTheDocument();
    expect(screen.getByText('google.com')).toBeInTheDocument();

  })

  it( 'should return a url element for each url object received', () => {
    render( <UrlContainer urls={[{}, {}]} /> )

    expect(screen.getAllByTestId('url-element').length).toEqual(2);
  })

  it( 'should make a `deleteUrl` call to the api when the `x` button is clicked', async () => {
    render( <UrlContainer urls={mockUrlData.urls} loadContent={mockFetch}/> )

    let deleteButton = screen.getByText('X');
    userEvent.click(deleteButton);

    await waitFor( () => expect(api.deleteUrl).toBeCalledTimes(1) )
    expect(api.deleteUrl).toBeCalledWith(1)
  })

  it( 'should call `loadContent` when a successful response is receieved back', async () =>{
    render( <UrlContainer urls={mockUrlData.urls} loadContent={mockFetch}/> )

    let deleteButton = screen.getByText('X');
    userEvent.click(deleteButton);

    await waitFor( () => expect(api.deleteUrl).toBeCalledTimes(1) )
    expect(mockFetch).toBeCalledTimes(1)
  })

  it( 'should not call `loadContent` if not', async () =>{
    api.deleteUrl.mockResolvedValue(false)
    render( <UrlContainer urls={mockUrlData.urls} loadContent={mockFetch}/> )

    let deleteButton = screen.getByText('X');
    userEvent.click(deleteButton);

    await waitFor( () => expect(api.deleteUrl).toBeCalledTimes(1) )
    expect(mockFetch).toBeCalledTimes(0)
  })

})
