async function loadRandomSlideshow() {
  const container = document.querySelector("#random-slideshow .slideshow-inner");

  try {
    // Fetch gallery HTML
    const response = await fetch("gallery.html");
    const text = await response.text();

    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    // Extract all img sources
    const images = [...doc.querySelectorAll("img")].map(img => img.src);

    if (images.length === 0) {
      container.innerHTML = "<p>No gallery images available.</p>";
      return;
    }

    // Shuffle & take 5 random images
    const randomFive = images
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    // Build slideshow HTML
    container.innerHTML = randomFive
      .map((src, index) => `<img src="${src}" class="${index === 0 ? "active" : ""}">`)
      .join("");

    // Add dots
    const dotContainer = document.createElement("div");
    dotContainer.className = "slideshow-dots";
    dotContainer.innerHTML = randomFive
      .map((_, i) => `<span class="${i === 0 ? "active" : ""}"></span>`)
      .join("");

    container.after(dotContainer);

    // Slideshow function
    let index = 0;
    const slides = container.querySelectorAll("img");
    const dots = dotContainer.querySelectorAll("span");

    setInterval(() => {
      slides[index].classList.remove("active");
      dots[index].classList.remove("active");

      index = (index + 1) % slides.length;

      slides[index].classList.add("active");
      dots[index].classList.add("active");
    }, 4000);
  } catch (error) {
    container.innerHTML = "<p>Error loading slideshow.</p>";
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", loadRandomSlideshow);
