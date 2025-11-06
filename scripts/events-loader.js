// events-loader.js
// Load events from events.html and display those within the current week (Mon–Sun)

async function loadWeeklyEvents() {
  const list = document.getElementById("upcoming-events");
  if (!list) return;
  list.innerHTML = "<li>Loading...</li>";

  try {
    const response = await fetch("events.html");
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const eventCells = doc.querySelectorAll(".event-day");

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Adjust to Monday-start week
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((currentDay + 6) % 7)); // go back to Monday
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const eventsThisWeek = [];

    eventCells.forEach(cell => {
      const dayText = cell.textContent.trim();
      const day = parseInt(dayText);
      if (isNaN(day)) return;

      const caption = doc.querySelector("caption")?.textContent.trim();
      if (!caption) return;

      const [monthName, year] = caption.split(" ");
      const date = new Date(`${monthName} ${day}, ${year}`);

      if (date >= monday && date <= sunday) {
        const desc = cell.dataset.event;
        eventsThisWeek.push({
          date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          desc
        });
      }
    });

    // Sort events by date (just in case)
    eventsThisWeek.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (eventsThisWeek.length === 0) {
      list.innerHTML = "<li>No events this week — check back soon!</li>";
    } else {
      list.innerHTML = eventsThisWeek
        .map(e => `<li>${e.date} – ${e.desc}</li>`)
        .join("");
    }
  } catch (err) {
    console.error("Error loading events:", err);
    list.innerHTML = "<li>Could not load events.</li>";
  }
}

document.addEventListener("DOMContentLoaded", loadWeeklyEvents);
