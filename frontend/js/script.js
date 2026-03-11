// SUBSCRIPTIONS
function toggleSub(btn) {

  const card = btn.parentElement;

  card.classList.toggle("active");

  btn.innerText = card.classList.contains("active")
    ? "Pause Subscription"
    : "Resume Subscription";

}



// BROWSE DATA

const content = [

  {
    title: "Inception",
    platform: "Netflix",
    genre: "Sci-Fi",
    type: "Movie",
    image: "../assets/images/inception.jpg"
  },

  {
    title: "Interstellar",
    platform: "Prime",
    genre: "Sci-Fi",
    type: "Movie",
    image: "../assets/images/interstellar.jpeg"
  },

  {
    title: "Dark",
    platform: "Netflix",
    genre: "Drama",
    type: "TV",
    image: "../assets/images/dark.jpeg"
  },

  {
    title: "Loki",
    platform: "Disney+",
    genre: "Action",
    type: "TV",
    image: "../assets/images/loki.jpeg"
  }

];



function applyFilters() {

  const search =
    document.getElementById("search")?.value.toLowerCase() || "";

  const platform =
    document.getElementById("platform")?.value || "";

  const genre =
    document.getElementById("genre")?.value || "";

  const type =
    document.getElementById("type")?.value || "";



  const filtered = content.filter(item =>

    item.title.toLowerCase().includes(search) &&

    (platform === "" || item.platform === platform) &&

    (genre === "" || item.genre === genre) &&

    (type === "" || item.type === type)

  );



  const grid = document.getElementById("contentGrid");
  const count = document.getElementById("resultCount");

  if (!grid) return;



  grid.innerHTML = "";



  filtered.forEach(item => {

    grid.innerHTML += `

      <div class="content-card">

        <img src="${item.image}">

        <h4>${item.title}</h4>

        <p>${item.platform} • ${item.genre} • ${item.type}</p>

      </div>

    `;

  });



  if (count) {
    count.innerText = `Showing ${filtered.length} results`;
  }

}



document.addEventListener("DOMContentLoaded", applyFilters);