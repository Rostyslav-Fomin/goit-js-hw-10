import { fetchBreeds, fetchBreedsbyId } from './cat-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const elements = [];

const refs = {
  select: document.querySelector('select.breed-select'),
  loader: document.querySelector('.loader'),
  catInfoContainer: document.querySelector('.cat-info'),
};

let arrayCats;

fetchBreeds()
  .then(data => {
    arrayCats = data;
    refs.select.classList.remove('visually-hidden');
    refs.loader.classList.add('visually-hidden');

    data.map(element =>
      elements.push({
        text: element.name,
        value: element.id,
      })
    );
    const select = new SlimSelect({
      select: '#single',
      data: elements,
      events: {
        afterChange: newVal => {
          const value = newVal.map(element => element.value).join('');

          refs.loader.classList.remove('visually-hidden');
          refs.catInfoContainer.innerHTML = '';

          fetchBreedsbyId(value)
            .then(data => {
              refs.loader.classList.add('visually-hidden');
              refs.select.classList.remove('visually-hidden');
              refs.catInfoContainer.insertAdjacentHTML(
                'beforeend',
                makeCatInfo(value)
              );

              const catImage = data
                .map(
                  element =>
                    `<img src="${element.url}" alt="${value}" width="300">`
                )
                .join(' ');
              refs.catInfoContainer.insertAdjacentHTML('afterbegin', catImage);
            })
            .catch(error => {
              refs.loader.classList.add('visually-hidden');
              refs.select.classList.add('visually-hidden');
              refs.catInfoContainer.classList.add('visually-hidden');
              Notify.failure(
                'Oops! Something went wrong! Try reloading the page!'
              );
            });
        },
      },
    });
  })
  .catch(error => {
    refs.loader.classList.add('visually-hidden');
    refs.select.classList.add('visually-hidden');
    refs.catInfoContainer.classList.add('visually-hidden');
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  });

function makeCatInfo(id) {
  const catInfo = arrayCats
    .reduce((newArray, element) => {
      if (id === element.id) {
        newArray.push(element);
      }
      return newArray;
    }, [])
    .map(
      element => `<div><h1>${element.name}</h1>
                  <p>${element.description}</p>
                  <p><span>Temperament: </span>${element.temperament}</p><div/>`
    )
    .join('');
  return catInfo;
}