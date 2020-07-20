window.addEventListener('load', function() {
  window.searchForm = document.getElementById('js-search-form');
  window.searchResultsContainer = document.getElementById('js-search-results');
  window.offlineBanner = document.getElementById('js-offline-banner');

  window.searchForm.addEventListener('submit', performSearch);
  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  updateOnlineStatus();
});

function performSearch(e) {
  e.preventDefault();

  const searchQuery = e.target[0].value;
  const apiPath = `/api/search-videos/${searchQuery}`;

  showSearchLoading();

  fetch(apiPath)
    .then(response => {
      return response.json()
    })
    .then((data) => {
      renderSearchResults(data);
    })
    .catch((e) => {
      searchResultsContainer.innerHTML = `Error occured while fetching data, you might be offline!`;
      e.preventDefault();
    });
}

function showSearchLoading() {
  searchResultsContainer.innerHTML = `<div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>`;  
}

function updateOnlineStatus() {
  console.log(navigator.onLine);

  if(!navigator.onLine) {
    window.offlineBanner.style.display = 'block';
  } else {
    window.offlineBanner.style.display = 'none';
  }
}

function renderSearchResults(searchData) {
  const htmlContent = searchData.map((snippet) => {
    return `
      <div class="demo-card-wide mdl-card mdl-shadow--2dp" >
        <div class="mdl-card__title" style="background: url('${snippet.thumbnails.default.url}') center / cover; height:176px; color: #fff;">
          <h2 class="mdl-card__title-text">${snippet.title}</h2>
        </div>
        <div class="mdl-card__supporting-text">
          ${snippet.description}
        </div>
        <div class="mdl-card__actions mdl-card--border">
          <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="/related-videos/${snippet.videoId}">
           View related videos
        </a>
        </div>
        <div class="mdl-card__menu">
          <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
            <i class="material-icons">share</i>
          </button>
        </div>
      </div>
    `;
  });

  searchResultsContainer.innerHTML = `${htmlContent.join('')}`;
}
