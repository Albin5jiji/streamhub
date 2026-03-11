const API_KEY = "394ef6d6ad2c777fa0488b236afa1616";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";



// ==========================
// TRENDING MOVIES
// ==========================

async function loadTrendingMovies(){

const res = await fetch(
`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
);

const data = await res.json();

renderTrending(data.results);

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



// ==========================
// TRENDING TV
// ==========================

async function loadTrendingTV(){

const res = await fetch(
`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`
);

const data = await res.json();

const grid = document.getElementById("tvTrending");

if(!grid) return;

grid.innerHTML = "";

data.results.slice(0,8).forEach(show => {

grid.innerHTML += `
<div class="movie-card">

<img src="${IMG_URL + show.poster_path}">
<p>${show.name}</p>

</div>
`;

});

}



// ==========================
// SEARCH
// ==========================

async function searchMovies(query){

if(!query) return;

const res = await fetch(
`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
);

const data = await res.json();

renderSearch(data.results);

}

function renderSearch(movies){

const grid = document.getElementById("contentGrid");

if(!grid) return;

grid.innerHTML = "";

movies.forEach(movie => {

grid.innerHTML += `
<div class="content-card" onclick="openMovie(${movie.id})">

<img src="${IMG_URL + movie.poster_path}">

<h4>${movie.title}</h4>
<p>⭐ ${movie.vote_average}</p>

</div>
`;

});

}



const searchInput = document.getElementById("search");

if(searchInput){

searchInput.addEventListener("input", e=>{
searchMovies(e.target.value);
});

}



// ==========================
// MOVIE PAGE
// ==========================

function openMovie(id){

window.location.href = `movie.html?id=${id}`;

}



async function loadMovieDetails(){

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if(!id) return;

const movieRes = await fetch(
`${BASE_URL}/movie/${id}?api_key=${API_KEY}`
);

const movie = await movieRes.json();


const castRes = await fetch(
`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`
);

const castData = await castRes.json();


const videoRes = await fetch(
`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`
);

const videoData = await videoRes.json();


renderMovie(movie);
renderCast(castData.cast);
renderTrailer(videoData.results);
loadProviders(id);
loadRecommendations(id);

}



// ==========================
// RENDER MOVIE
// ==========================

function renderMovie(movie){

const hero = document.getElementById("movieHero");
const details = document.getElementById("movieDetails");

if(!hero || !details) return;

hero.style.backgroundImage =
`url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

details.innerHTML = `

<div class="movie-detail-layout">

<img src="${IMG_URL + movie.poster_path}">

<div>

<h1>${movie.title}</h1>

<p>${movie.overview}</p>

<p>⭐ ${movie.vote_average}</p>

<p>Release Date: ${movie.release_date}</p>

<button onclick="addWatchlist(${movie.id})">
Add to Watchlist
</button>

</div>

</div>

`;

}



// ==========================
// CAST
// ==========================

function renderCast(cast){

const grid = document.getElementById("castGrid");

if(!grid) return;

grid.innerHTML = "";

cast.slice(0,10).forEach(actor => {

if(!actor.profile_path) return;

grid.innerHTML += `

<div class="cast-card">

<img src="https://image.tmdb.org/t/p/w200${actor.profile_path}">
<p>${actor.name}</p>

</div>

`;

});

}



// ==========================
// TRAILER
// ==========================

function renderTrailer(videos){

const trailer = document.getElementById("trailer");

if(!trailer) return;

const yt = videos.find(v => v.type==="Trailer");

if(!yt) return;

trailer.innerHTML = `

<iframe
width="800"
height="450"
src="https://www.youtube.com/embed/${yt.key}"
frameborder="0"
allowfullscreen>
</iframe>

`;

}



// ==========================
// PROVIDERS
// ==========================

async function loadProviders(id){

const res = await fetch(
`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`
);

const data = await res.json();

const providers = data.results?.IN?.flatrate;

if(!providers) return;

const container = document.getElementById("providers");

if(!container) return;

providers.forEach(p=>{

container.innerHTML += `
<img src="https://image.tmdb.org/t/p/w200${p.logo_path}">
`;

});

}



// ==========================
// RECOMMENDATIONS
// ==========================

async function loadRecommendations(id){

const res = await fetch(
`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`
);

const data = await res.json();

const grid = document.getElementById("recommendations");

if(!grid) return;

data.results.slice(0,8).forEach(movie=>{

grid.innerHTML += `
<div class="content-card" onclick="openMovie(${movie.id})">

<img src="${IMG_URL + movie.poster_path}">
<p>${movie.title}</p>

</div>
`;

});

}



// ==========================
// WATCHLIST
// ==========================

function addWatchlist(id){

let list = JSON.parse(localStorage.getItem("watchlist")) || [];

if(!list.includes(id)){

list.push(id);

localStorage.setItem("watchlist",JSON.stringify(list));

alert("Added to watchlist");

}

}



// ==========================
// SUBSCRIPTIONS
// ==========================

function toggleSub(btn){

const card = btn.parentElement;

card.classList.toggle("active");

btn.innerText = card.classList.contains("active")
? "Pause Subscription"
: "Resume Subscription";

}



// ==========================
// PAGE LOAD
// ==========================

document.addEventListener("DOMContentLoaded",()=>{

loadTrendingMovies();
loadTopRated();
loadUpcoming();
loadTrendingTV();
loadMovieDetails();
loadWatchlist();

});

async function loadTopRated(){

const res = await fetch(
`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
);

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

}

async function loadUpcoming(){

const res = await fetch(
`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`
);

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

}

function loadWatchlist(){

const ids = JSON.parse(localStorage.getItem("watchlist")) || [];

const grid = document.getElementById("watchlistGrid");

if(!grid) return;

ids.forEach(async id=>{

const res = await fetch(
`${BASE_URL}/movie/${id}?api_key=${API_KEY}`
);

const movie = await res.json();

grid.innerHTML+=`
<div class="content-card">

<img src="${IMG_URL + movie.poster_path}">
<p>${movie.title}</p>

</div>
`;

});

}