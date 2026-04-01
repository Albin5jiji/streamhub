import { fetchTmdb, IMG_URL } from "../api/tmdb.js";
import { GENRE_FILTERS, PLATFORM_FILTERS } from "../config/platforms.js";
import { registerNavigationGlobals } from "../utils/navigation.js";
import { filterSearchResults } from "../utils/providers.js";

const ERROR_MSG = '<p style="color:red; text-align:center; padding:20px;">Failed to load movies. Please check your connection.</p>';

function applyDiscoverFilters(urlParams, type, platform, genre) {
  const platformConfig = PLATFORM_FILTERS[platform];

  if (platformConfig) {
    if (type === "tv" && platformConfig.tvNetworkIds) {
      urlParams.with_networks = platformConfig.tvNetworkIds;
    } else if (platformConfig.watchProviderIds) {
      urlParams.with_watch_providers = platformConfig.watchProviderIds;
    }
  }

  const genreId = GENRE_FILTERS[genre]?.[type];
  if (genreId) urlParams.with_genres = genreId;
}

async function applyFilters(page = 1) {
  const searchStr = document.getElementById("search")?.value.trim() || "";
  const platform = document.getElementById("platform")?.value || "";
  const genre = document.getElementById("genre")?.value || "";
  const type = document.getElementById("type")?.value || "";
  const grid = document.getElementById("contentGrid");

  if (!grid) return;

  const typesToFetch =
    type === "Movie" ? ["movie"] : type === "TV" ? ["tv"] : ["movie", "tv"];

  try {
    const resultSets = await Promise.all(
      typesToFetch.map(async (mediaType) => {
        const params = { page };

        if (searchStr) {
          params.query = searchStr;
          const data = await fetchTmdb(`/search/${mediaType}`, params);
          return { data, type: mediaType };
        }

        params.watch_region = "IN";
        applyDiscoverFilters(params, mediaType, platform, genre);
        const data = await fetchTmdb(`/discover/${mediaType}`, params);
        return { data, type: mediaType };
      })
    );

    let combinedResults = [];
    let totalResults = 0;
    let maxPage = 0;

    resultSets.forEach(({ data, type: mediaType }) => {
      const results = (data.results || []).map((item) => ({ ...item, media_type: mediaType }));
      combinedResults = combinedResults.concat(results);
      totalResults += data.total_results || 0;
      maxPage = Math.max(maxPage, data.total_pages || 0);
    });

    if (searchStr) {
      combinedResults = await filterSearchResults(combinedResults, genre, platform);
      totalResults = combinedResults.length;
      maxPage = page;
    }

    combinedResults.sort((a, b) => b.popularity - a.popularity);

    if (page === 1) grid.innerHTML = "";

    const countEl = document.getElementById("resultCount");
    if (countEl && page === 1) countEl.innerText = `Showing ${totalResults} results`;

    if (combinedResults.length === 0 && page === 1) {
      grid.innerHTML = "<p>No results found.</p>";
    }

    combinedResults.forEach((item) => {
      if (!item.poster_path) return;
      const title = item.media_type === "tv" ? item.name : item.title;
      grid.innerHTML += `
        <div class="content-card" onclick="openMovie(${item.id}, '${item.media_type}', '${platform}')">
          <img src="${IMG_URL + item.poster_path}">
          <h4>${title}</h4>
          <p>⭐ ${(item.vote_average || 0).toFixed(1)}</p>
        </div>
      `;
    });

    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
      if (page < maxPage) {
        loadMoreBtn.style.display = "inline-block";
        loadMoreBtn.onclick = () => applyFilters(page + 1);
      } else {
        loadMoreBtn.style.display = "none";
      }
    }
  } catch (error) {
    grid.innerHTML = ERROR_MSG;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  registerNavigationGlobals();
  window.applyFilters = applyFilters;
  applyFilters();
});
