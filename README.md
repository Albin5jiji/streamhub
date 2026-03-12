# StreamHub 🎬

A unified OTT content discovery platform built as part of a Web Development course project.  
Search for movies and shows, manage a watchlist, and track your streaming subscriptions — all in one place.

---

## What it does

Finding what to watch across a dozen streaming platforms is a pain. StreamHub pulls movie and show data from a single interface so you're not bouncing between Netflix, Prime, and Hotstar just to figure out where something is.

Current features:
- Browse and search movies/shows using the TMDB API
- View metadata: ratings, genres, release dates, overviews
- Unified watchlist to save titles you want to watch
- OTT subscription tracker to manage your active services
- Basic personalized recommendations based on selected genres

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript |
| Data | [TMDB API](https://www.themoviedb.org/documentation/api) |

No frameworks. No build tools. Just the fundamentals — which was the point of the course.

---

## Project Structure

```
streamhub/
├── frontend/
│   ├── index.html        # Landing / home page
│   ├── search.html       # Movie/show search
│   ├── watchlist.html    # Saved titles
│   ├── subscriptions.html# OTT tracker
│   ├── style.css
│   └── script.js
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

No installation needed. Just open it.

1. Clone the repo
   ```bash
   git clone https://github.com/Albin5jiji/streamhub.git
   ```

2. Open `frontend/index.html` in your browser

3. Add your TMDB API key in `script.js`:
   ```js
   const API_KEY = 'your_tmdb_api_key_here';
   ```
   Get a free key at [themoviedb.org](https://www.themoviedb.org/settings/api)

---

## Roadmap

This started as a frontend-only course project. The plan is to grow it into a full-stack application:

- [ ] Node.js + Express backend
- [ ] MongoDB for user accounts and persistent watchlists
- [ ] Real streaming availability data (which platform has what)
- [ ] Region-based filtering (IN/US/UK)
- [ ] Collaborative filtering recommendations
- [ ] Deploy on Vercel / Render

---

## Course Context

Built for the Web Development module as part of B.Tech (CSE) at VIT.  
The scope was intentionally limited to frontend fundamentals — HTML, CSS, and JavaScript — with no frameworks or backend.

---

## Author

**Albin Thomas Jiji**  
[GitHub](https://github.com/Albin5jiji)

---

## License

[MIT](LICENSE)
