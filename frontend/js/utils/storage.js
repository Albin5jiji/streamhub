const WATCHLIST_KEY = "watchlist";

export function getWatchlist() {
  return JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || [];
}

export function setWatchlist(list) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}
