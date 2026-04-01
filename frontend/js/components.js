class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="navbar">
        <div class="logo">STREAMHUB</div>
        <nav>
          <a href="index.html">Home</a>
          <a href="browse.html">Browse</a>
          <a href="watchlist.html">Watchlist</a>
          <a href="about.html">About</a>
          <a href="subscriptions.html">Subscriptions</a>
        </nav>
      </header>
    `;
  }
}

class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <p>© 2026 StreamHub. All rights reserved.</p>
      </footer>
    `;
  }
}

customElements.define('custom-navbar', CustomNavbar);
customElements.define('custom-footer', CustomFooter);
