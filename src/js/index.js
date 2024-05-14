import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { BASE_URL, options } from './pixabay-api.js';


const galleryEl = document.querySelector('.gallery');
const searchInputEl = document.querySelector('input[name="searchQuery"');
const searchFormEl = document.getElementById('search-form');


const lightbox = new SimpleLightbox('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
});

// *********************************
let totalHits = 0;
let reachedEnd = false;

function renderGallery(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads, }) => {
        return `
         <a href="${largeImageURL}" class="lightbox">
          <div class="photo-card">
           <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
             <p class="info-item">
               <b>Likes</b>
               ${likes}
             </p>
             <p class="info-item">
               <b>Views</b>
               ${views}
             </p>
             <p class="info-item">
               <b>Comments</b>
               ${comments}
             </p>
             <p class="info-item">
               <b>Downloads</b>
               ${downloads}
             </p>
            </div>
           </div>
          </a> `;
      }).join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);

// *********************************

  if (options.params.page * options.params.per_page >= totalHits) {
    if (!reachedEnd) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      reachedEnd = true;
    }
  }
  lightbox.refresh();
}

// *********************************

async function handleSubmit(e) {
  e.preventDefault();
  options.params.q = searchInputEl.value.trim();
  if (options.params.q === '') {
    return;
  }
  options.params.page = 1;
  galleryEl.innerHTML = '';
  reachedEnd = false;

  try {
    const res = await axios.get(BASE_URL, options);
    totalHits = res.data.totalHits;

    const { hits } = res.data;
    console.log(hits);

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      renderGallery(hits);
    }
    searchInputEl.value = '';
  } catch (err) {
    Notify.failure(err);
  }
}

// *********************************

async function loadMore() {
  options.params.page += 1;
  try {
    const res = await axios.get(BASE_URL, options);
    const hits = res.data.hits;
    renderGallery(hits);
  } catch (err) {
    Notify.failure(err);
  }
}
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight) {
    loadMore();
  }
}
searchFormEl.addEventListener('submit', handleSubmit);
window.addEventListener('scroll', handleScroll);