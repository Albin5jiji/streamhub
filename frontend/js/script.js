const API_KEY = "394ef6d6ad2c777fa0488b236afa1616";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const ERROR_MSG = '<p style="color:red; text-align:center; padding:20px;">Failed to load movies. Please check your connection.</p>';

// TRENDING MOVIES
async function loadTrendingMovies(){
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();
    renderTrending(data.results);
  } catch (err) {
    const grid = document.getElementById("movieTrending");
    if(grid) grid.innerHTML = ERROR_MSG;
  }
}

function renderTrending(movies){
  const grid = document.getElementById("movieTrending");
  if(!grid) return;
  grid.innerHTML = "";
  movies.slice(0,8).forEach(movie => {
    grid.innerHTML += `
    <div class="movie-card" onclick="openMovie(${movie.id})">
      <img src="${IMG_URL + movie.poster_path}">
      <p>${movie.title}</p>
    </div>
    `;
  });
}

// TRENDING TV
async function loadTrendingTV(){
  try {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
    const data = await res.json();
    const grid = document.getElementById("tvTrending");
    if(!grid) return;
    grid.innerHTML = "";
    data.results.slice(0,8).forEach(show => {
      grid.innerHTML += `
      <div class="movie-card" onclick="openMovie(${show.id}, 'tv')">
        <img src="${IMG_URL + show.poster_path}">
        <p>${show.name}</p>
      </div>
      `;
    });
  } catch (err) {
    const grid = document.getElementById("tvTrending");
    if(grid) grid.innerHTML = ERROR_MSG;
  }
}

// SEARCH
async function searchMovies(query){
  if(!query) return;
  try {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await res.json();
    renderSearch(data.results);
  } catch (err) {
    const grid = document.getElementById("contentGrid");
    if(grid) grid.innerHTML = ERROR_MSG;
  }
}

function renderSearch(movies){
  const grid = document.getElementById("contentGrid");
  if(!grid) return;
  grid.innerHTML = "";
  if(movies.length === 0) {
    grid.innerHTML = '<p>No results found.</p>';
    return;
  }
  movies.forEach(movie => {
    if(!movie.poster_path) return;
    grid.innerHTML += `
    <div class="content-card" onclick="openMovie(${movie.id})">
      <img src="${IMG_URL + movie.poster_path}">
      <h4>${movie.title}</h4>
      <p>⭐ ${movie.vote_average}</p>
    </div>
    `;
  });
}

// NO OLD SEARCH LISTENER

// MOVIE PAGE
function openMovie(id, type = 'movie'){
  window.location.href = `movie.html?id=${id}&type=${type}`;
}

async function loadMovieDetails(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const type = params.get("type") || "movie";
  if(!id) return;
  try {
    const movieRes = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
    const movie = await movieRes.json();

    const castRes = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`);
    const castData = await castRes.json();

    const videoRes = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
    const videoData = await videoRes.json();

    renderMovie(movie, type);
    renderCast(castData.cast);
    renderTrailer(videoData.results);
    loadProviders(id, type, movie);
    loadRecommendations(id, type);
  } catch (err) {
    const details = document.getElementById("movieDetails");
    if(details) details.innerHTML = ERROR_MSG;
  }
}

// RENDER MOVIE
function renderMovie(movie, type = 'movie'){
  const hero = document.getElementById("movieHero");
  const details = document.getElementById("movieDetails");
  if(!hero || !details) return;

  const title = type === 'tv' ? movie.name : movie.title;
  const releaseDate = type === 'tv' ? movie.first_air_date : movie.release_date;

  hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

  // Use movie.homepage as fallback if Providers API fails to give a link
  const fallbackLink = movie.homepage ? movie.homepage : '#';
  const playStyle = "padding:12px 24px; border-radius:8px; font-weight:bold; cursor:pointer; background:linear-gradient(135deg, var(--accent-primary), #fde047); color:#000; border:none; box-shadow:0 0 15px rgba(250,204,21,0.3); transition:0.3s;";

  const list = JSON.parse(localStorage.getItem("watchlist")) || [];
  const key = `${type}_${movie.id}`;
  const inWatchlist = list.includes(key) || list.includes(movie.id);
  const watchText = inWatchlist ? "✓ Added to Watchlist" : "Add to Watchlist";
  const wBg = inWatchlist ? "var(--accent-primary)" : "transparent";
  const wColor = inWatchlist ? "#000" : "#fff";
  const wBorder = inWatchlist ? "var(--accent-primary)" : "#fff";
  const watchStyle = `padding:12px 24px; border-radius:8px; margin-right:15px; cursor:pointer; background:${wBg}; color:${wColor}; border:1px solid ${wBorder}; transition:0.3s; font-weight:bold;`;

  details.innerHTML = `
  <div class="movie-detail-layout">
    <img src="${IMG_URL + movie.poster_path}" class="movie-poster">
    <div>
      <h1 id="movieTitle" style="font-size:42px; margin-bottom:10px; text-shadow:0 2px 10px rgba(0,0,0,0.5);">${title}</h1>
      <p style="margin-bottom:20px; font-size:18px; line-height:1.6; color:#ddd;">${movie.overview}</p>
      <p style="margin-bottom:10px; font-size:18px;">⭐ ${movie.vote_average.toFixed(1)} / 10</p>
      <p style="margin-bottom:30px; color:#aaa;">Release Date: ${releaseDate}</p>
      <div class="movie-actions">
        <button id="watchBtn" style="${watchStyle}" onclick="addWatchlist(${movie.id}, '${type}')">${watchText}</button>
        <button id="playBtn" style="${playStyle}" onclick="window.open('${fallbackLink}', '_blank')">▶ Play ${type === 'tv' ? 'Show' : 'Movie'}</button>
      </div>
    </div>
  </div>
  `;
}

// CAST
function renderCast(cast){
  const grid = document.getElementById("castGrid");
  if(!grid) return;
  grid.innerHTML = "";
  if(!cast || cast.length === 0){
    grid.innerHTML = "<p>No cast information available.</p>";
    return;
  }
  cast.slice(0,10).forEach(actor => {
    if(!actor.profile_path) return;
    grid.innerHTML += `
    <div class="cast-card">
      <img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" style="border-radius:12px;">
      <p style="margin-top:8px">${actor.name}</p>
    </div>
    `;
  });
}

// TRAILER
function renderTrailer(videos){
  const trailer = document.getElementById("trailer");
  if(!trailer) return;
  const yt = videos ? videos.find(v => v.type==="Trailer") : null;
  if(!yt) {
    trailer.innerHTML = "<p>No trailer available.</p>";
    return;
  }
  trailer.innerHTML = `
  <iframe width="800" height="450" src="https://www.youtube.com/embed/${yt.key}" frameborder="0" allowfullscreen style="border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.5);"></iframe>
  `;
}

const OTT_URLS = {
  'Netflix': 'https://www.netflix.com/search?q=',
  'Amazon Prime Video': 'https://www.primevideo.com/search/ref=atv_sr_sug_1?k=',
  'Amazon Video': 'https://www.primevideo.com/search/ref=atv_sr_sug_1?k=',
  'Prime Video': 'https://www.primevideo.com/search/ref=atv_sr_sug_1?k=',
  'Hotstar': 'https://www.hotstar.com/in/explore?search_query=',
  'Disney Plus Hotstar': 'https://www.hotstar.com/in/explore?search_query=',
  'Sony Liv': 'https://www.sonyliv.com/search?query=',
  'SonyLiv': 'https://www.sonyliv.com/search?query=',
  'Zee5': 'https://www.zee5.com/search?q=',
  'JioCinema': 'https://www.jiocinema.com/search?q=',
  'Apple TV': 'https://tv.apple.com/us/search?q='
};

// PROVIDERS
async function loadProviders(id, type = 'movie', movieObj = null){
  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}/watch/providers?api_key=${API_KEY}`);
    const data = await res.json();

    // Force IN (India) regional links
    let link = data.results?.IN?.link;
    const playBtn = document.getElementById("playBtn");

    const inData = data.results?.IN;
    // Combine flatrate, buy, rent into one array, taking flatrate first
    let providers = [];
    if (inData) {
      if (inData.flatrate) providers = providers.concat(inData.flatrate);
      if (inData.buy) providers = providers.concat(inData.buy);
      if (inData.rent) providers = providers.concat(inData.rent);
    }
    if (providers.length === 0) providers = null;

    let topProvider = null;
    let providerLink = link; // Default to TMDB's generic link

    if (providers && providers.length > 0) {
      topProvider = providers[0].provider_name;
    } else if (movieObj && movieObj.networks && movieObj.networks.length > 0) {
      // Fallback to TV networks if watch/providers is empty
      for (let net of movieObj.networks) {
        let nName = net.name;
        let matchedKey = Object.keys(OTT_URLS).find(k => nName.toLowerCase().includes(k.toLowerCase()));
        if (!matchedKey && nName.toLowerCase().includes("hotstar")) matchedKey = 'Hotstar';
        if (!matchedKey && nName.toLowerCase().includes("mtv")) matchedKey = 'JioCinema'; // MTV India is on JioCinema

        if (matchedKey) {
          providers = [{ provider_name: matchedKey, logo_path: net.logo_path }];
          topProvider = matchedKey;
          break;
        }
      }
    }

    if (topProvider) {
      const titleEl = document.getElementById("movieTitle");
      const titleText = titleEl ? titleEl.innerText : '';
      
      let matchedKey = Object.keys(OTT_URLS).find(k => topProvider.toLowerCase().includes(k.toLowerCase()));
      if (matchedKey) {
        providerLink = OTT_URLS[matchedKey] + encodeURIComponent(titleText);
      } else if (topProvider.toLowerCase().includes("hotstar")) {
        providerLink = OTT_URLS['Hotstar'] + encodeURIComponent(titleText);
      }
    }

    // Check release status
    let isReleased = true;
    if(movieObj) {
       if(type === 'movie' && movieObj.status && movieObj.status !== 'Released') isReleased = false;
       if(type === 'tv' && (movieObj.status === 'Planned' || movieObj.status === 'In Production' || movieObj.status === 'Rumored')) isReleased = false;
       
       // Also check release date future
       const rDate = type === 'tv' ? movieObj.first_air_date : movieObj.release_date;
       if(rDate && new Date(rDate) > new Date()) isReleased = false;
    }

    if(playBtn) {
      if(!isReleased) {
        playBtn.innerText = "⏳ Unreleased";
        playBtn.style.background = "#555";
        playBtn.style.cursor = "not-allowed";
        playBtn.style.boxShadow = "none";
        playBtn.onclick = null;
      } else if (!providers) {
        const rDate = type === 'tv' ? movieObj.first_air_date : movieObj.release_date;
        const daysSinceRelease = rDate ? (new Date() - new Date(rDate)) / (24 * 60 * 60 * 1000) : 999;
        
        if (type === 'movie' && daysSinceRelease >= 0 && daysSinceRelease <= 45) {
          playBtn.innerText = "🍿 In Theaters";
        } else {
          playBtn.innerText = "⏳ Coming Soon on OTT";
        }
        playBtn.style.background = "#555";
        playBtn.style.cursor = "not-allowed";
        playBtn.style.boxShadow = "none";
        playBtn.onclick = null;
      } else {
        // Has Providers => Go to Platform
        playBtn.innerText = `▶ Watch on ${topProvider}`;
        playBtn.style.background = "linear-gradient(135deg, var(--accent-primary), #fde047)";
        
        // Use TMDB watch link or direct search link
        const finalLink = providerLink || link || '#';
        playBtn.onclick = () => window.open(finalLink, '_blank');
      }
    }
    
    const container = document.getElementById("providers");
    if(!container) return;
    if(!providers){
       container.innerHTML = "<p>No official streaming platform data available.</p>";
       return;
    }
    
    container.innerHTML = "";
    
    // De-duplicate providers by name
    const uniqueProviders = [];
    providers.forEach(p => {
      if (!uniqueProviders.find(up => up.provider_name === p.provider_name)) {
        uniqueProviders.push(p);
      }
    });

    uniqueProviders.forEach(p=>{
      container.innerHTML += `
      <img src="https://image.tmdb.org/t/p/w200${p.logo_path}" style="border-radius:12px; margin-right:15px; width:60px;" title="${p.provider_name}" alt="${p.provider_name}">
      `;
    });
  } catch (err) {
    console.error("Failed to load providers", err);
  }
}

// RECOMMENDATIONS
async function loadRecommendations(id, type = 'movie'){
  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}/recommendations?api_key=${API_KEY}`);
    const data = await res.json();
    const grid = document.getElementById("recommendations");
    if(!grid) return;
    grid.innerHTML = "";
    data.results.slice(0,8).forEach(movie=>{
      if(!movie.poster_path) return;
      const title = type === 'tv' ? movie.name : movie.title;
      grid.innerHTML += `
      <div class="content-card" onclick="openMovie(${movie.id}, '${type}')">
        <img src="${IMG_URL + movie.poster_path}">
        <p style="margin-top:10px;">${title}</p>
      </div>
      `;
    });
  } catch (err) {
    console.log(err);
  }
}

// WATCHLIST
function addWatchlist(id, type = 'movie'){
  let list = JSON.parse(localStorage.getItem("watchlist")) || [];
  const key = `${type}_${id}`;
  const btn = document.getElementById("watchBtn");

  if(!list.includes(key) && !list.includes(id)){
    list.push(key);
    localStorage.setItem("watchlist",JSON.stringify(list));
    showToast("Added to your Watchlist");
    if(btn) {
      btn.innerText = "✓ Added to Watchlist";
      btn.style.background = "var(--accent-primary)";
      btn.style.color = "#000";
      btn.style.borderColor = "var(--accent-primary)";
    }
  } else {
    list = list.filter(item => item !== key && item !== id);
    localStorage.setItem("watchlist",JSON.stringify(list));
    showToast("Removed from Watchlist", "error");
    if(btn) {
      btn.innerText = "Add to Watchlist";
      btn.style.background = "transparent";
      btn.style.color = "#fff";
      btn.style.borderColor = "#fff";
    }
  }
}

// CUSTOM TOAST NOTIFICATIONS
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = type === "success" ? `✅ ${message}` : `ℹ️ ${message}`;
  
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// SUBSCRIPTIONS
function toggleSub(btn){
  const card = btn.parentElement;
  card.classList.toggle("active");
  btn.innerText = card.classList.contains("active") ? "Pause Subscription" : "+ Add Subscription";
  
  if(card.classList.contains("active")){
    const activeGrid = document.getElementById("activeSubsGrid");
    if(activeGrid) activeGrid.appendChild(card);
    card.querySelector(".billing").innerText = "Next billing: " + getNextMonthDate();
    card.querySelector(".billing").style.color = "#8b8b8b";
  } else {
    const availableGrid = document.getElementById("availableSubsGrid");
    if(availableGrid) availableGrid.appendChild(card);
    card.querySelector(".billing").innerText = "Not Subscribed";
    card.querySelector(".billing").style.color = "#555";
  }

  updateSubscriptionStats();
}

function getNextMonthDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.getDate() + " " + d.toLocaleString('en-US', {month: 'short'}) + " " + d.getFullYear();
}

// PAGE LOAD
document.addEventListener("DOMContentLoaded",()=>{
  loadTrendingMovies();
  loadTopRated();
  loadUpcoming();
  loadTrendingTV();
  loadMovieDetails();
  loadWatchlist();
  loadBrowseMovies();
  updateSubscriptionStats();
});

async function loadTopRated(){
  try {
    const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const data = await res.json();
    const grid = document.getElementById("topRated");
    if(!grid) return;
    grid.innerHTML = "";
    data.results.slice(0,8).forEach(movie => {
      grid.innerHTML += `
      <div class="movie-card" onclick="openMovie(${movie.id})">
        <img src="${IMG_URL + movie.poster_path}">
        <p>${movie.title}</p>
      </div>
      `;
    });
  } catch (err) {
    const grid = document.getElementById("topRated");
    if(grid) grid.innerHTML = ERROR_MSG;
  }
}

async function loadUpcoming(){
  try {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
    const data = await res.json();
    const grid = document.getElementById("upcomingMovies");
    if(!grid) return;
    grid.innerHTML="";
    data.results.slice(0,8).forEach(movie=>{
      grid.innerHTML+=`
      <div class="movie-card" onclick="openMovie(${movie.id})">
        <img src="${IMG_URL + movie.poster_path}">
        <p>${movie.title}</p>
      </div>
      `;
    });
  } catch(err) {
    const grid = document.getElementById("upcomingMovies");
    if(grid) grid.innerHTML=ERROR_MSG;
  }
}

function loadWatchlist(){
  const ids = JSON.parse(localStorage.getItem("watchlist")) || [];
  const grid = document.getElementById("watchlistGrid");
  if(!grid) return;
  grid.innerHTML = "";
  if(ids.length === 0){
    grid.innerHTML = "<p>Your watchlist is empty.</p>";
    return;
  }
  
  ids.forEach(async item =>{
    let type = 'movie';
    let id = item;
    if (typeof item === 'string' && item.includes('_')) {
      const parts = item.split('_');
      type = parts[0];
      id = parts[1];
    }
    try {
      const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
      const movie = await res.json();
      const title = type === 'tv' ? movie.name : movie.title;
      grid.innerHTML+=`
      <div class="content-card" onclick="openMovie(${movie.id}, '${type}')">
        <img src="${IMG_URL + movie.poster_path}" style="border-radius:14px; width:100%;">
        <p style="margin-top:10px;">${title}</p>
      </div>
      `;
    } catch (err) {
      console.error(err);
    }
  });
}

let currentBrowsePage = 1;

async function applyFilters(page = 1) {
  currentBrowsePage = page;
  const searchInput = document.getElementById("search");
  const platformSelect = document.getElementById("platform");
  const genreSelect = document.getElementById("genre");
  const typeSelect = document.getElementById("type");
  
  const grid = document.getElementById("contentGrid");
  if (!grid) return; 

  let searchStr = searchInput ? searchInput.value.trim() : "";
  let platform = platformSelect ? platformSelect.value : "";
  let genre = genreSelect ? genreSelect.value : "";
  let type = typeSelect ? typeSelect.value : "";

  let typesToFetch = [];
  if(type === "Movie") typesToFetch = ["movie"];
  else if(type === "TV") typesToFetch = ["tv"];
  else typesToFetch = ["movie", "tv"];
  
  try {
    const fetchPromises = typesToFetch.map(t => {
      let url = "";
      if (searchStr) {
        url = `${BASE_URL}/search/${t}?api_key=${API_KEY}&query=${encodeURIComponent(searchStr)}&page=${page}`;
      } else {
        url = `${BASE_URL}/discover/${t}?api_key=${API_KEY}&page=${page}&watch_region=IN`;
        if (platform === 'Netflix') url += '&with_watch_providers=8';
        if (platform === 'Prime') url += '&with_watch_providers=119';
        if (platform === 'Hotstar') url += '&with_watch_providers=122';
        
        if (genre === 'Action') url += t === 'tv' ? '&with_genres=10759' : '&with_genres=28';
        if (genre === 'Drama') url += '&with_genres=18';
        if (genre === 'Sci-Fi') url += t === 'tv' ? '&with_genres=10765' : '&with_genres=878';
      }
      return fetch(url).then(r => r.json()).then(data => ({ data, type: t }));
    });

    const resultsArrays = await Promise.all(fetchPromises);
    
    let combinedResults = [];
    let totalResults = 0;
    let maxPage = 0;
    
    resultsArrays.forEach(resObj => {
      if(resObj.data.results) {
        resObj.data.results.forEach(item => item.media_type = resObj.type);
        combinedResults = combinedResults.concat(resObj.data.results);
      }
      if(resObj.data.total_results) totalResults += resObj.data.total_results;
      if(resObj.data.total_pages > maxPage) maxPage = resObj.data.total_pages;
    });
    
    combinedResults.sort((a,b) => b.popularity - a.popularity);

    if(page === 1) grid.innerHTML = "";
    
    const countEl = document.getElementById("resultCount");
    if(countEl && page === 1) countEl.innerText = `Showing ${totalResults} results`;
    
    if(combinedResults.length === 0 && page === 1) {
      grid.innerHTML = '<p>No results found.</p>';
    }
    
    combinedResults.forEach(item => {
      if(!item.poster_path) return;
      const title = item.media_type === "tv" ? item.name : item.title;
      const itemType = item.media_type;
      grid.innerHTML += `
      <div class="content-card" onclick="openMovie(${item.id}, '${itemType}')">
        <img src="${IMG_URL + item.poster_path}">
        <h4>${title}</h4>
        <p>⭐ ${(item.vote_average || 0).toFixed(1)}</p>
      </div>
      `;
    });
    
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if(loadMoreBtn) {
      if(page < maxPage) {
        loadMoreBtn.style.display = "inline-block";
        loadMoreBtn.onclick = () => applyFilters(page + 1);
      } else {
        loadMoreBtn.style.display = "none";
      }
    }
  } catch (err) {
    if(grid) grid.innerHTML = ERROR_MSG;
  }
}

function loadBrowseMovies(page = 1) {
  applyFilters(page);
}

function updateSubscriptionStats(){
  const cards = document.querySelectorAll(".subs-card");
  let active = 0;
  let monthly = 0;
  cards.forEach(card => {
    if(card.classList.contains("active")){
      active++;
      const price = parseInt(card.dataset.price);
      const cycle = card.dataset.cycle;
      if(cycle==="monthly") monthly += price;
      if(cycle==="yearly") monthly += price/12;
    }
  });
  const count = document.getElementById("activeCount");
  const spend = document.getElementById("monthlySpend");
  if(count) count.innerText = active;
  if(spend) spend.innerText = Math.round(monthly);
}