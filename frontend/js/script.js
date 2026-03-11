const API_KEY = "YOUR_TMDB_API_KEY";

const BASE_URL = "https://api.themoviedb.org/3";

const IMG_URL = "https://image.tmdb.org/t/p/w500";

async function loadTrendingMovies() {

  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );

  const data = await res.json();

  renderTrending(data.results);

}

function renderTrending(movies) {

  const grid = document.querySelector(".movie-grid");

  if (!grid) return;

  grid.innerHTML = "";

  movies.slice(0,8).forEach(movie => {

    grid.innerHTML += `
      <div class="movie-card">

        <img src="${IMG_URL + movie.poster_path}">

        <p>${movie.title}</p>

      </div>
    `;

  });

}

// SUBSCRIPTIONS
function toggleSub(btn) {

  const card = btn.parentElement;

  card.classList.toggle("active");

  btn.innerText = card.classList.contains("active")
    ? "Pause Subscription"
    : "Resume Subscription";

}



// BROWSE DATA

const content = [

  {
    title: "Inception",
    platform: "Netflix",
    genre: "Sci-Fi",
    type: "Movie",
    image: "../assets/images/inception.jpg"
  },

  {
    title: "Interstellar",
    platform: "Prime",
    genre: "Sci-Fi",
    type: "Movie",
    image: "../assets/images/interstellar.jpeg"
  },

  {
    title: "Dark",
    platform: "Netflix",
    genre: "Drama",
    type: "TV",
    image: "../assets/images/dark.jpeg"
  },

  {
    title: "Loki",
    platform: "Disney+",
    genre: "Action",
    type: "TV",
    image: "../assets/images/loki.jpeg"
  }

];



function applyFilters() {

  const search =
    document.getElementById("search")?.value.toLowerCase() || "";

  const platform =
    document.getElementById("platform")?.value || "";

  const genre =
    document.getElementById("genre")?.value || "";

  const type =
    document.getElementById("type")?.value || "";



  const filtered = content.filter(item =>

    item.title.toLowerCase().includes(search) &&

    (platform === "" || item.platform === platform) &&

    (genre === "" || item.genre === genre) &&

    (type === "" || item.type === type)

  );



  const grid = document.getElementById("contentGrid");
  const count = document.getElementById("resultCount");

  if (!grid) return;



  grid.innerHTML = "";



  filtered.forEach(item => {

    grid.innerHTML += `

      <div class="content-card">

        <img src="${item.image}">

        <h4>${item.title}</h4>

        <p>${item.platform} • ${item.genre} • ${item.type}</p>

      </div>

    `;

  });



  if (count) {
    count.innerText = `Showing ${filtered.length} results`;
  }

}



document.addEventListener("DOMContentLoaded", applyFilters);

document.addEventListener("DOMContentLoaded", () => {

  loadTrendingMovies();

});