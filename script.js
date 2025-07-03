const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchEngineSelect = document.getElementById('search-engine-select');

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

const searchContainer = document.querySelector('.search-container');

searchInput.addEventListener('focus', function() {
    // Add a small delay to allow the virtual keyboard to appear
    setTimeout(() => {
        searchContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
});

function performSearch() {
    const query = searchInput.value.trim();
    if (query === '') return;

    const activeEngine = searchEngineSelect.value;

    let searchUrl;
    switch (activeEngine) {
        case 'google':
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            break;
        case 'bing':
            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
            break;
        case 'duckduckgo':
            searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
            break;
        case 'startpage':
            searchUrl = `https://www.startpage.com/do/dsearch?query=${encodeURIComponent(query)}`;
            break;
        case 'brave':
            searchUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
            break;
    }

    window.open(searchUrl, '_blank');
}
