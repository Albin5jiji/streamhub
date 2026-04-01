import { fetchTmdb, IMG_URL } from "../api/tmdb.js";
import { registerNavigationGlobals } from "../utils/navigation.js";

const ERROR_MSG = '<p style="color:red; text-align:center; padding:20px;">Failed to load movies. Please check your connection.</p>';

function renderPosterGrid(containerId, items, type = "movie") {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  grid.innerHTML = "";
  items.slice(0, 8).forEach((item) => {
    if (!item.poster_path) return;
    const title = type === "tv" ? item.name : item.title;
    grid.innerHTML += `
      <div class="movie-card" onclick="openMovie(${item.id}, '${type}')">
        <img src="${IMG_URL + item.poster_path}">
        <p>${title}</p>
      </div>
    `;
  });
}

async function loadTrendingMovies() {
  try {
    const data = await fetchTmdb("/trending/movie/week");
    renderPosterGrid("movieTrending", data.results || []);
  } catch (error) {
    const grid = document.getElementById("movieTrending");
    if (grid) grid.innerHTML = ERROR_MSG;
  }
}

async function loadTrendingTV() {
  try {
    const data = await fetchTmdb("/trending/tv/week");
    renderPosterGrid("tvTrending", data.results || [], "tv");
  } catch (error) {
    const grid = document.getElementById("tvTrending");
    if (grid) grid.innerHTML = ERROR_MSG;
  }
}

async function loadTopRated() {
  try {
    const data = await fetchTmdb("/movie/top_rated");
    renderPosterGrid("topRated", data.results || []);
  } catch (error) {
    const grid = document.getElementById("topRated");
    if (grid) grid.innerHTML = ERROR_MSG;
  }
}

async function loadUpcoming() {
  try {
    const data = await fetchTmdb("/movie/upcoming");
    renderPosterGrid("upcomingMovies", data.results || []);
  } catch (error) {
    const grid = document.getElementById("upcomingMovies");
    if (grid) grid.innerHTML = ERROR_MSG;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  registerNavigationGlobals();
  loadTrendingMovies();
  loadTrendingTV();
  loadTopRated();
  loadUpcoming();
});
