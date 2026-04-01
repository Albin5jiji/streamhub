export const API_KEY = "394ef6d6ad2c777fa0488b236afa1616";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMG_URL = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

function buildUrl(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

export async function fetchTmdb(path, params = {}) {
  const response = await fetch(buildUrl(path, params));
  return response.json();
}

export function buildImageUrl(path, size = "w500") {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
