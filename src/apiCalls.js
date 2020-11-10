const api = {
  url: 'http://localhost:3001/api/v1/urls/',

  getUrls: () => {
    return fetch(api.url)
    .then(response => {
      if (response.ok) return response.json();
      return 'error'
    })
  },

  postUrl: (long_url, title) => {
    let body = {long_url, title}
    body = JSON.stringify(body)
    return fetch(api.url, {
      body: JSON.stringify( {long_url, title}),
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (response.ok) return response.json();
      return 'error'
    })
  },

  deleteUrl: (id) => {
    return fetch(api.url + id, {
      method: 'DELETE',
    })
    .then(response => response.ok)
  }
}

export default api;
