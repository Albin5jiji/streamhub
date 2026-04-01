function getNextMonthDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
}

function updateSubscriptionStats() {
  const cards = document.querySelectorAll(".subs-card");
  let active = 0;
  let monthly = 0;

  cards.forEach((card) => {
    if (!card.classList.contains("active")) return;
    active += 1;

    const price = parseInt(card.dataset.price, 10);
    const cycle = card.dataset.cycle;
    if (cycle === "monthly") monthly += price;
    if (cycle === "yearly") monthly += price / 12;
  });

  const count = document.getElementById("activeCount");
  const spend = document.getElementById("monthlySpend");
  if (count) count.innerText = active;
  if (spend) spend.innerText = Math.round(monthly);
}

function toggleSub(button) {
  const card = button.parentElement;
  card.classList.toggle("active");
  button.innerText = card.classList.contains("active") ? "Pause Subscription" : "+ Add Subscription";

  if (card.classList.contains("active")) {
    document.getElementById("activeSubsGrid")?.appendChild(card);
    card.querySelector(".billing").innerText = `Next billing: ${getNextMonthDate()}`;
    card.querySelector(".billing").style.color = "#8b8b8b";
  } else {
    document.getElementById("availableSubsGrid")?.appendChild(card);
    card.querySelector(".billing").innerText = "Not Subscribed";
    card.querySelector(".billing").style.color = "#555";
  }

  updateSubscriptionStats();
}

document.addEventListener("DOMContentLoaded", () => {
  window.toggleSub = toggleSub;
  updateSubscriptionStats();
});
