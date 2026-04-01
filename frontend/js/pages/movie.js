import { BACKDROP_URL, IMG_URL, fetchTmdb } from "../api/tmdb.js";
import { registerNavigationGlobals } from "../utils/navigation.js";
import { getWatchlist, setWatchlist } from "../utils/storage.js";
import { showToast } from "../utils/toast.js";
import {
  fetchIndiaProviders,
  getNetworkFallbackProviders,
  getProviderLink,
  getUniqueProviders,
  providerMatchesPlatform
} from "../utils/providers.js";

const ERROR_MSG = '<p style="color:red; text-align:center; padding:20px;">Failed to load movies. Please check your connection.</p>';

function renderMovie(movie, type = "movie") {
  const hero = document.getElementById("movieHero");
  const details = document.getElementById("movieDetails");
  if (!hero || !details) return;

  const title = type === "tv" ? movie.name : movie.title;
  const releaseDate = type === "tv" ? movie.first_air_date : movie.release_date;
  const fallbackLink = movie.homepage || "#";
  const list = getWatchlist();
  const key = `${type}_${movie.id}`;
  const inWatchlist = list.includes(key) || list.includes(movie.id);
  const watchText = inWatchlist ? "✓ Added to Watchlist" : "Add to Watchlist";
  const wBg = inWatchlist ? "var(--accent-primary)" : "transparent";
  const wColor = inWatchlist ? "#000" : "#fff";
  const wBorder = inWatchlist ? "var(--accent-primary)" : "#fff";
  const watchStyle = `padding:12px 24px; border-radius:8px; margin-right:15px; cursor:pointer; background:${wBg}; color:${wColor}; border:1px solid ${wBorder}; transition:0.3s; font-weight:bold;`;
  const playStyle = "padding:12px 24px; border-radius:8px; font-weight:bold; cursor:pointer; background:linear-gradient(135deg, var(--accent-primary), #fde047); color:#000; border:none; box-shadow:0 0 15px rgba(250,204,21,0.3); transition:0.3s;";

  hero.style.backgroundImage = `url(${BACKDROP_URL}${movie.backdrop_path})`;
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
          <button id="playBtn" style="${playStyle}" onclick="window.open('${fallbackLink}', '_blank')">▶ Play ${type === "tv" ? "Show" : "Movie"}</button>
        </div>
      </div>
    </div>
  `;
}

function renderCast(cast = []) {
  const grid = document.getElementById("castGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (cast.length === 0) {
    grid.innerHTML = "<p>No cast information available.</p>";
    return;
  }

  cast.slice(0, 10).forEach((actor) => {
    if (!actor.profile_path) return;
    grid.innerHTML += `
      <div class="cast-card">
        <img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" style="border-radius:12px;">
        <p style="margin-top:8px">${actor.name}</p>
      </div>
    `;
  });
}

function renderTrailer(videos = []) {
  const trailer = document.getElementById("trailer");
  if (!trailer) return;

  const yt = videos.find((video) => video.type === "Trailer");
  if (!yt) {
    trailer.innerHTML = "<p>No trailer available.</p>";
    return;
  }

  trailer.innerHTML = `
    <iframe width="800" height="450" src="https://www.youtube.com/embed/${yt.key}" frameborder="0" allowfullscreen style="border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.5);"></iframe>
  `;
}

function updatePlayButton(playBtn, label, enabled, onClick) {
  playBtn.innerText = label;
  if (enabled) {
    playBtn.style.background = "linear-gradient(135deg, var(--accent-primary), #fde047)";
    playBtn.style.cursor = "pointer";
    playBtn.style.boxShadow = "0 0 15px rgba(250,204,21,0.3)";
    playBtn.onclick = onClick;
  } else {
    playBtn.style.background = "#555";
    playBtn.style.cursor = "not-allowed";
    playBtn.style.boxShadow = "none";
    playBtn.onclick = null;
  }
}

async function loadProviders(id, type = "movie", movieObj = null, preferredPlatform = "") {
  try {
    const { link, providers: providerList } = await fetchIndiaProviders(id, type);
    let providers = providerList;

    if (!providers) {
      providers = getNetworkFallbackProviders(movieObj);
    }

    let topProvider = null;
    if (providers?.length) {
      const preferredProvider = providers.find((provider) =>
        providerMatchesPlatform(provider.provider_name, preferredPlatform)
      );
      topProvider = preferredProvider ? preferredProvider.provider_name : providers[0].provider_name;
    }

    const playBtn = document.getElementById("playBtn");
    const titleText = document.getElementById("movieTitle")?.innerText || "";
    const providerLink = getProviderLink(topProvider, titleText, link);

    let isReleased = true;
    if (movieObj) {
      if (type === "movie" && movieObj.status && movieObj.status !== "Released") isReleased = false;
      if (type === "tv" && ["Planned", "In Production", "Rumored"].includes(movieObj.status)) isReleased = false;

      const releaseDate = type === "tv" ? movieObj.first_air_date : movieObj.release_date;
      if (releaseDate && new Date(releaseDate) > new Date()) isReleased = false;
    }

    if (playBtn) {
      if (!isReleased) {
        updatePlayButton(playBtn, "⏳ Unreleased", false);
      } else if (!providers) {
        const releaseDate = type === "tv" ? movieObj.first_air_date : movieObj.release_date;
        const daysSinceRelease = releaseDate ? (new Date() - new Date(releaseDate)) / (24 * 60 * 60 * 1000) : 999;
        updatePlayButton(
          playBtn,
          type === "movie" && daysSinceRelease >= 0 && daysSinceRelease <= 45
            ? "🍿 In Theaters"
            : "⏳ Coming Soon on OTT",
          false
        );
      } else {
        updatePlayButton(playBtn, `▶ Watch on ${topProvider}`, true, () => window.open(providerLink || "#", "_blank"));
      }
    }

    const container = document.getElementById("providers");
    if (!container) return;

    if (!providers) {
      container.innerHTML = "<p>No official streaming platform data available.</p>";
      return;
    }

    container.innerHTML = "";
    getUniqueProviders(providers).forEach((provider) => {
      container.innerHTML += `
        <img src="https://image.tmdb.org/t/p/w200${provider.logo_path}" style="border-radius:12px; margin-right:15px; width:60px;" title="${provider.provider_name}" alt="${provider.provider_name}">
      `;
    });
  } catch (error) {
    console.error("Failed to load providers", error);
  }
}

async function loadRecommendations(id, type = "movie") {
  try {
    const data = await fetchTmdb(`/${type}/${id}/recommendations`);
    const grid = document.getElementById("recommendations");
    if (!grid) return;

    grid.innerHTML = "";
    data.results.slice(0, 8).forEach((item) => {
      if (!item.poster_path) return;
      const title = type === "tv" ? item.name : item.title;
      grid.innerHTML += `
        <div class="content-card" onclick="openMovie(${item.id}, '${type}')">
          <img src="${IMG_URL + item.poster_path}">
          <p style="margin-top:10px;">${title}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error(error);
  }
}

function addWatchlist(id, type = "movie") {
  let list = getWatchlist();
  const key = `${type}_${id}`;
  const btn = document.getElementById("watchBtn");

  if (!list.includes(key) && !list.includes(id)) {
    list.push(key);
    setWatchlist(list);
    showToast("Added to your Watchlist");
    if (btn) {
      btn.innerText = "✓ Added to Watchlist";
      btn.style.background = "var(--accent-primary)";
      btn.style.color = "#000";
      btn.style.borderColor = "var(--accent-primary)";
    }
    return;
  }

  list = list.filter((item) => item !== key && item !== id);
  setWatchlist(list);
  showToast("Removed from Watchlist", "error");
  if (btn) {
    btn.innerText = "Add to Watchlist";
    btn.style.background = "transparent";
    btn.style.color = "#fff";
    btn.style.borderColor = "#fff";
  }
}

async function loadMovieDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const type = params.get("type") || "movie";
  const sourcePlatform = params.get("platform") || "";
  if (!id) return;

  try {
    const [movie, castData, videoData] = await Promise.all([
      fetchTmdb(`/${type}/${id}`),
      fetchTmdb(`/${type}/${id}/credits`),
      fetchTmdb(`/${type}/${id}/videos`)
    ]);

    renderMovie(movie, type);
    renderCast(castData.cast || []);
    renderTrailer(videoData.results || []);
    loadProviders(id, type, movie, sourcePlatform);
    loadRecommendations(id, type);
  } catch (error) {
    const details = document.getElementById("movieDetails");
    if (details) details.innerHTML = ERROR_MSG;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  registerNavigationGlobals();
  window.addWatchlist = addWatchlist;
  loadMovieDetails();
});
