import { fetchTmdb } from "../api/tmdb.js";
import { OTT_URLS, PLATFORM_FILTERS, PROVIDER_ALIASES, GENRE_FILTERS } from "../config/platforms.js";

export function matchesGenre(item, genre) {
  if (!genre) return true;
  const genreId = GENRE_FILTERS[genre]?.[item.media_type];
  if (!genreId) return true;
  return Array.isArray(item.genre_ids) && item.genre_ids.includes(genreId);
}

export function providerMatchesPlatform(providerName, platformKey) {
  if (!providerName || !platformKey) return false;
  const normalizedProvider = providerName.toLowerCase();
  return (PROVIDER_ALIASES[platformKey] || []).some((alias) => normalizedProvider.includes(alias));
}

export async function fetchIndiaProviders(id, type) {
  const data = await fetchTmdb(`/${type}/${id}/watch/providers`);
  const inData = data.results?.IN;
  let providers = [];

  if (inData) {
    if (inData.flatrate) providers = providers.concat(inData.flatrate);
    if (inData.buy) providers = providers.concat(inData.buy);
    if (inData.rent) providers = providers.concat(inData.rent);
  }

  return {
    link: data.results?.IN?.link || "",
    providers: providers.length > 0 ? providers : null
  };
}

export function getProviderLink(providerName, titleText, fallbackLink) {
  if (!providerName) return fallbackLink || "#";

  const matchedKey = Object.keys(OTT_URLS).find((key) =>
    providerName.toLowerCase().includes(key.toLowerCase())
  );

  if (matchedKey) return OTT_URLS[matchedKey] + encodeURIComponent(titleText);
  if (providerName.toLowerCase().includes("hotstar")) {
    return OTT_URLS.Hotstar + encodeURIComponent(titleText);
  }

  return fallbackLink || "#";
}

export function getUniqueProviders(providers = []) {
  return providers.filter(
    (provider, index) =>
      providers.findIndex((entry) => entry.provider_name === provider.provider_name) === index
  );
}

export function getNetworkFallbackProviders(movieObj) {
  if (!movieObj?.networks?.length) return null;

  for (const network of movieObj.networks) {
    let matchedKey = Object.keys(OTT_URLS).find((key) =>
      network.name.toLowerCase().includes(key.toLowerCase())
    );

    if (!matchedKey && network.name.toLowerCase().includes("hotstar")) matchedKey = "Hotstar";
    if (!matchedKey && network.name.toLowerCase().includes("mtv")) matchedKey = "JioCinema";

    if (matchedKey) {
      return [{ provider_name: matchedKey, logo_path: network.logo_path }];
    }
  }

  return null;
}

export async function matchesPlatform(item, platformKey) {
  if (!platformKey) return true;

  const platformConfig = PLATFORM_FILTERS[platformKey];
  if (!platformConfig) return true;

  try {
    const providerData = await fetchIndiaProviders(item.id, item.media_type);
    const hasMatchingProvider = ["flatrate", "buy", "rent"].some((group) =>
      providerData.providers?.some(
        (provider) => String(provider.provider_id) === platformConfig.watchProviderIds
      )
    );

    if (hasMatchingProvider) return true;

    if (item.media_type === "tv" && platformConfig.tvNetworkIds) {
      const details = await fetchTmdb(`/tv/${item.id}`);
      const networkIds = platformConfig.tvNetworkIds.split("|");
      return details.networks?.some((network) => networkIds.includes(String(network.id))) || false;
    }
  } catch (error) {
    console.error("Failed to validate platform filter for search result", error);
  }

  return false;
}

export async function filterSearchResults(results, genre, platformKey) {
  const genreFiltered = results.filter((item) => matchesGenre(item, genre));
  if (!platformKey) return genreFiltered;

  const matches = await Promise.all(genreFiltered.map((item) => matchesPlatform(item, platformKey)));
  return genreFiltered.filter((_, index) => matches[index]);
}
