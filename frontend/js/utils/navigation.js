export function openMovie(id, type = "movie", sourcePlatform = "") {
  const params = new URLSearchParams({
    id: String(id),
    type
  });

  if (sourcePlatform) params.set("platform", sourcePlatform);
  window.location.href = `movie.html?${params.toString()}`;
}

export function registerNavigationGlobals() {
  window.openMovie = openMovie;
}
