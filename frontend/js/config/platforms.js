export const OTT_URLS = {
  Netflix: "https://www.netflix.com/search?q=",
  "Amazon Prime Video": "https://www.primevideo.com/search/ref=atv_sr_sug_1?k=",
  "Amazon Video": "https://www.primevideo.com/search/ref=atv_sr_sug_1?k=",
  "Prime Video": "https://www.primevideo.com/search/ref=atv_sr_sug_1?k=",
  Hotstar: "https://www.hotstar.com/in/explore?search_query=",
  "Disney Plus Hotstar": "https://www.hotstar.com/in/explore?search_query=",
  "Sony Liv": "https://www.sonyliv.com/search?query=",
  SonyLiv: "https://www.sonyliv.com/search?query=",
  Zee5: "https://www.zee5.com/search?q=",
  JioCinema: "https://www.jiocinema.com/search?q=",
  "Apple TV": "https://tv.apple.com/us/search?q="
};

export const PLATFORM_FILTERS = {
  Netflix: {
    watchProviderIds: "8"
  },
  Prime: {
    watchProviderIds: "119"
  },
  Hotstar: {
    watchProviderIds: "122",
    tvNetworkIds: "3919|8036"
  },
  SonyLiv: {
    watchProviderIds: "237",
    tvNetworkIds: "2646"
  },
  Zee5: {
    watchProviderIds: "232",
    tvNetworkIds: "2590"
  }
};

export const GENRE_FILTERS = {
  Action: {
    movie: 28,
    tv: 10759
  },
  Drama: {
    movie: 18,
    tv: 18
  },
  "Sci-Fi": {
    movie: 878,
    tv: 10765
  }
};

export const PROVIDER_ALIASES = {
  Netflix: ["netflix"],
  Prime: ["prime", "amazon prime", "prime video", "amazon video"],
  Hotstar: ["hotstar", "disney plus hotstar"],
  SonyLiv: ["sony liv", "sonyliv"],
  Zee5: ["zee5", "zee 5"]
};
