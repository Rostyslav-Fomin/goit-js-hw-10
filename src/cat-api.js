import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_8IN0W5sfJO45ADz7LE5YYRWsunl26xdjgQQyKznCjlqlkwi64RFJJh9hiAmULW2r';

function fetchBreeds() {
  return fetch('https://api.thecatapi.com/v1/breeds', {
    headers: {
      'x-api-key': axios.defaults.headers.common['x-api-key'],
    },
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.textError)
    }
    return response.json();
  });
}

function fetchBreedsbyId(id) {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${id}`
  ).then(response => {
    return response.json();
  });
}

export { fetchBreeds, fetchBreedsbyId };