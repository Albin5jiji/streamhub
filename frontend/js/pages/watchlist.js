import { IMG_URL, fetchTmdb } from "../api/tmdb.js";
import { registerNavigationGlobals } from "../utils/navigation.js";
import { getWatchlist } from "../utils/storage.js";

async function loadWatchlist() {
  const items = getWatchlist();
  const grid = document.getElementById("watchlistGrid");
  if (!grid) return;

  grid.innerHTML = "";
  if (items.length === 0) {
    grid.innerHTML = "<p>Your watchlist is empty.</p>";
    return;
  }

  for (const item of items) {
    let type = "movie";
    let id = item;

    if (typeof item === "string" && item.includes("_")) {
      [type, id] = item.split("_");
    }

    try {
      const movie = await fetchTmdb(`/${type}/${id}`);
      const title = type === "tv" ? movie.name : movie.title;
      grid.innerHTML += `
        <div class="content-card" onclick="openMovie(${movie.id}, '${type}')">
          <img src="${IMG_URL + movie.poster_path}" style="border-radius:14px; width:100%;">
          <p style="margin-top:10px;">${title}</p>
        </div>
      `;
    } catch (error) {
      console.error(error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  registerNavigationGlobals();
  loadWatchlist();
});
