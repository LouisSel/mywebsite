// ========== Theme (light / dark) ==========
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");

function getStoredTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage unavailable (e.g. private mode) — theme still applies for this visit
  }
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.setAttribute("data-theme", getStoredTheme() || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ========== Mobile menu ==========
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ========== Header border on scroll ==========
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

// ========== Reveal sections + highlight active nav link ==========
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.2 });

sections.forEach((section) => observer.observe(section));

// ========== Contact form (placeholder) ==========
// This form has no backend. To make it send real messages, connect it to a
// service like Formspree or Netlify Forms, or replace it with a mailto: link.
const form = document.getElementById("contact-form");

// Only the homepage has the form
if (form) {
  const formStatus = form.querySelector(".form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Thanks! Your message has been noted (demo — no backend connected yet).";
    form.reset();
  });
}

// ========== Travel: enlarge location photos ==========
const lightbox = document.getElementById("lightbox");

// Only the travel page has the lightbox
if (lightbox) {
  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");

  // Listen on the whole page, because the photos are added by the holiday list below
  document.addEventListener("click", (event) => {
    const photo = event.target.closest(".location-photos img");
    if (!photo) return;
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt;
    lightboxCaption.textContent = photo.alt;
    lightbox.showModal();
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());

  // Clicking the dark area around the photo closes it too
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

// ========== Home: countries visited ==========
// Counted from the flags in travel-data.js, so it updates with each new holiday.
const countryCount = document.getElementById("country-count");

if (countryCount && typeof holidays !== "undefined") {
  countryCount.textContent = new Set(holidays.flatMap((holiday) => holiday.flag)).size;
}

// ========== Home: photo slideshow ==========
// Shows the photos from slideshow-data.js in random order. Each photo is only
// downloaded shortly before it's shown, so the page stays fast.
const slideshow = document.getElementById("slideshow");
const SLIDE_INTERVAL = 20000; // 20 seconds

if (slideshow && typeof slides !== "undefined" && slides.length > 0) {
  const frame = slideshow.querySelector(".hero-slides");
  const caption = slideshow.querySelector("figcaption");

  const order = [...slides];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  frame.innerHTML = "";
  const images = order.map((slide) => {
    const img = document.createElement("img");
    img.alt = `${slide.place}, ${slide.country}`;
    img.dataset.src = slide.src;
    frame.append(img);
    return img;
  });

  const load = (img) => {
    if (!img.getAttribute("src")) img.src = img.dataset.src;
  };

  let current = 0;
  const show = (index) => {
    images[current].classList.remove("is-active");
    current = index;
    load(images[current]);
    load(images[(current + 1) % images.length]); // preload the next one
    images[current].classList.add("is-active");
    caption.textContent = images[current].alt;
  };

  show(0);
  if (images.length > 1) {
    setInterval(() => show((current + 1) % images.length), SLIDE_INTERVAL);
  }
}

// ========== Gaming: setup and PC drawings, games ==========
// Built from the lists in gaming-data.js. Hovering something in a drawing,
// its label or its row in the list below highlights it everywhere.
// Returns a function that clears the highlight.
function linkDiagram(diagram, list, items) {
  diagram.querySelectorAll(".callout").forEach((callout) => {
    const item = items.find((p) => p.part === callout.dataset.for);
    callout.querySelector(".sub").textContent = item ? item.model : "";
  });

  list.innerHTML = items
    .map((p) => `
      <li${p.part ? ` data-part="${escapeHtml(p.part)}"` : ""}>
        ${p.icon ? `<span class="spec-icon" aria-hidden="true">${escapeHtml(p.icon)}</span>` : ""}
        <span class="spec-name">${escapeHtml(p.name)}</span>
        <span class="spec-model">${escapeHtml(p.model)}</span>
      </li>`)
    .join("");

  const highlight = (id) => {
    diagram.classList.add("focus");
    diagram.classList.toggle("show-cpu", id === "cpu"); // the cooler gets out of the way
    diagram.querySelectorAll(".part, .callout").forEach((el) => {
      el.classList.toggle("on", el.id === id || el.dataset.for === id);
    });
    list.querySelectorAll("li").forEach((li) => li.classList.toggle("on", li.dataset.part === id));
  };
  const clear = () => {
    diagram.classList.remove("focus", "show-cpu");
    [diagram, list].forEach((el) => el.querySelectorAll(".on").forEach((on) => on.classList.remove("on")));
  };

  const hoverables = [
    ...[...diagram.querySelectorAll(".part")].map((el) => [el, el.id]),
    ...[...diagram.querySelectorAll(".callout")].map((el) => [el, el.dataset.for]),
    ...[...list.querySelectorAll("li[data-part]")].map((el) => [el, el.dataset.part]),
  ];
  hoverables.forEach(([el, id]) => {
    el.addEventListener("mouseenter", () => highlight(id));
    el.addEventListener("mouseleave", clear);
    el.addEventListener("click", () => highlight(id)); // tap on touch screens
  });
  return clear;
}

const setupPanel = document.getElementById("setup-panel");

if (setupPanel && typeof setup !== "undefined" && typeof pcParts !== "undefined") {
  const setupDiagram = document.getElementById("setup-diagram");
  const pcDiagram = document.getElementById("pc-diagram");
  const setupList = document.getElementById("setup-list");
  const clearSetup = linkDiagram(setupDiagram, setupList, setup);
  const clearPc = linkDiagram(pcDiagram, document.getElementById("spec-list"), pcParts);

  // Clicking the PC slides the rest of the setup away and zooms in until the
  // PC's outline sits exactly on the case outline of the PC drawing, which
  // then fades in. Both drawings fill the same box, so the zoom is measured
  // once, as a share of that box, and fits any screen size.
  const pc = document.getElementById("pc");
  const backButton = document.getElementById("diagram-back");

  const measureZoom = () => {
    const box = setupDiagram.getBoundingClientRect();
    const from = pc.querySelector("rect").getBoundingClientRect(); // the case outline
    const to = pcDiagram.querySelector("#case rect").getBoundingClientRect();
    const scale = to.width / from.width;
    const shift = (target, start, origin, size) => `${((target - origin - scale * (start - origin)) / size) * 100}%`;
    setupDiagram.style.setProperty("--zoom-scale", scale);
    setupDiagram.style.setProperty("--zoom-x", shift(to.left, from.left, box.left, box.width));
    setupDiagram.style.setProperty("--zoom-y", shift(to.top, from.top, box.top, box.height));
  };

  const showPc = (show) => {
    setupPanel.classList.toggle("zoomed", show);
    document.getElementById("setup-info").hidden = show;
    document.getElementById("pc-info").hidden = !show;
  };

  // Focus only moves along for keyboard users. After a mouse click it would
  // leave the PC outlined in blue once you're back at the desk.
  const zoomIn = (byKeyboard) => {
    if (setupPanel.classList.contains("zoomed")) return;
    if (!setupDiagram.style.getPropertyValue("--zoom-scale")) measureZoom();
    clearSetup();
    showPc(true);
    if (byKeyboard) backButton.focus({ preventScroll: true });
    else pc.blur(); // clicking the PC focused it
  };

  const zoomOut = (byKeyboard) => {
    if (!setupPanel.classList.contains("zoomed")) return;
    clearSetup();
    clearPc();
    showPc(false);
    if (byKeyboard) pc.focus({ preventScroll: true });
  };

  [pc, setupDiagram.querySelector('.callout[data-for="pc"]'), setupList.querySelector('[data-part="pc"]')]
    .filter(Boolean) // the PC's row is missing if it's taken out of gaming-data.js
    .forEach((el) => el.addEventListener("click", () => zoomIn(false)));
  pc.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      zoomIn(true);
    }
  });
  // event.detail is 0 when the button was pressed with Enter or Space
  backButton.addEventListener("click", (event) => zoomOut(event.detail === 0));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") zoomOut(document.activeElement === backButton);
  });
}

// Favourite games: one card each, opening to show the details
const gameList = document.getElementById("game-list");
const GAME_FACTS = [
  ["genre", "Genre"],
  ["platform", "Platform"],
  ["hours", "Hours played"],
  ["lastPlayed", "Last played"],
  ["since", "Playing since"],
];

function renderGame(game) {
  const facts = GAME_FACTS
    .filter(([key]) => game[key])
    .map(([key, label]) => `<div><dt>${label}</dt><dd>${escapeHtml(game[key])}</dd></div>`)
    .join("");
  const details = [
    facts ? `<dl class="game-facts">${facts}</dl>` : "",
    game.about ? `<p class="game-about">${escapeHtml(game.about)}</p>` : "",
    game.link
      ? `<a class="game-link" href="${escapeHtml(game.link)}" target="_blank" rel="noopener">${
          game.link.includes("steampowered.com") ? "View on Steam" : "Visit website"} ↗</a>`
      : "",
  ].join("");
  // The cover doubles as the little picture on the card; without one, the first letter stands in
  const badge = game.cover
    ? `<img class="game-badge" src="${escapeHtml(game.cover)}" alt="" loading="lazy">`
    : `<span class="game-badge" aria-hidden="true">${escapeHtml(game.title.charAt(0))}</span>`;

  return `
    <details class="game">
      <summary>
        ${badge}
        <span class="game-heading">
          <span class="game-title">${escapeHtml(game.title)}</span>
          ${game.note ? `<span class="game-note">${escapeHtml(game.note)}</span>` : ""}
        </span>
        <span class="chevron" aria-hidden="true"></span>
      </summary>
      <div class="game-body">
        ${game.cover ? `<img class="game-cover" src="${escapeHtml(game.cover)}" alt="${escapeHtml(game.title)}" loading="lazy">` : ""}
        <div class="game-info">${details || '<p class="game-about">More about this game coming soon.</p>'}</div>
      </div>
    </details>`;
}

if (gameList && typeof favouriteGames !== "undefined") {
  gameList.innerHTML = favouriteGames.map(renderGame).join("");
}

// ========== Gaming: tabs ==========
// One tab for the setup, one for the favourite games. The open tab is kept in
// the address (#setup or #games), so a link or a refresh opens it again.
const tabs = [...document.querySelectorAll('[role="tab"]')];

if (tabs.length) {
  const selectTab = (tab) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
    history.replaceState(null, "", `#${tab.getAttribute("aria-controls")}`);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    // The arrow keys move between the tabs
    tab.addEventListener("keydown", (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  // Open the tab the address points to, also when a link on the page changes it
  const openLinkedTab = () => {
    const linked = tabs.find((tab) => location.hash === `#${tab.getAttribute("aria-controls")}`);
    if (linked) selectTab(linked);
  };
  openLinkedTab();
  window.addEventListener("hashchange", openLinkedTab);
}

// ========== Travel: holiday list ==========
// Built from the `holidays` list in travel-data.js.
const holidayList = document.getElementById("holiday-list");

function escapeHtml(text) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(text).replace(/[&<>"']/g, (char) => entities[char]);
}

// Stops with the same coordinates (e.g. Cusco twice) share one marker.
// Returns the unique places, and for each stop the number of its place.
function groupPlaces(stops) {
  const places = [];
  const placeNumbers = new Map();
  const stopPlaces = stops.map((stop) => {
    const key = `${stop.lat},${stop.lng}`;
    if (!placeNumbers.has(key)) {
      placeNumbers.set(key, places.length);
      places.push(stop);
    }
    return placeNumbers.get(key);
  });
  return { places, stopPlaces };
}

function renderStop(stop, placeNumber) {
  const note = stop.note ? `<p>${escapeHtml(stop.note)}</p>` : "";
  const photos = stop.photos && stop.photos.length
    ? `<div class="location-photos">${stop.photos
        .map((photo) => `<img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt || "")}" loading="lazy">`)
        .join("")}</div>`
    : "";
  return `<li data-place="${placeNumber}" tabindex="0"><h4>${escapeHtml(stop.name)}</h4>${note}${photos}</li>`;
}

// One flag, or for a trip through two countries (e.g. ["no", "dk"]) both
// flags in one, split diagonally
function flagHtml(flag) {
  const image = (code) => `<img src="https://flagcdn.com/${escapeHtml(code)}.svg" alt="" width="36" height="27">`;
  if (Array.isArray(flag)) {
    return `<span class="flag flag-multi">${flag.slice(0, 2).map(image).join("")}</span>`;
  }
  return image(flag).replace("<img ", '<img class="flag" ');
}

function renderHoliday(holiday) {
  const hasStops = holiday.stops.length > 0;
  const { stopPlaces } = groupPlaces(holiday.stops);

  const details = document.createElement("details");
  details.className = "holiday";
  details.innerHTML = `
    <summary>
      ${flagHtml(holiday.flag)}
      <span class="holiday-country">${escapeHtml(holiday.country)}</span>
      <span class="chevron" aria-hidden="true"></span>
    </summary>
    <div class="holiday-body">
      <div class="route-map">
        ${hasStops
          ? `<div class="route-map-canvas" aria-label="Route map of the ${escapeHtml(holiday.country)} trip"></div>`
          : "<span>Route map coming soon</span>"}
      </div>
      ${hasStops
        ? `<ul class="locations">${holiday.stops.map((stop, i) => renderStop(stop, stopPlaces[i])).join("")}</ul>`
        : '<p class="holiday-empty">Stops coming soon.</p>'}
    </div>`;

  if (hasStops) {
    details.addEventListener("toggle", () => {
      if (details.open) openRouteMap(details, holiday);
    });
  }
  return details;
}

// Holidays are listed by year, newest first (set to false for oldest first).
// Holidays without a year yet (e.g. "Year") go at the end.
const NEWEST_FIRST = true;

function yearOf(holiday) {
  return parseInt(holiday.year, 10) || 0;
}

if (holidayList && typeof holidays !== "undefined") {
  const sorted = [...holidays].sort((a, b) => {
    if (!yearOf(a) || !yearOf(b)) return yearOf(b) ? 1 : yearOf(a) ? -1 : 0;
    return NEWEST_FIRST ? yearOf(b) - yearOf(a) : yearOf(a) - yearOf(b);
  });

  // One heading per year, with that year's holidays underneath
  let currentYear = null;
  let group = null;
  sorted.forEach((holiday) => {
    const year = yearOf(holiday) ? String(yearOf(holiday)) : "Other";
    if (year !== currentYear) {
      currentYear = year;
      const section = document.createElement("section");
      section.className = "holiday-year";
      section.innerHTML = `<h3 class="holiday-year-title">${escapeHtml(year)}</h3><div class="holidays"></div>`;
      holidayList.append(section);
      group = section.querySelector(".holidays");
    }
    group.append(renderHoliday(holiday));
  });
}

// ========== Travel: route maps ==========
// MapLibre GL JS with OpenFreeMap vector tiles: a black map showing only
// roads, with the trip drawn on top. A map is only created the first time
// its holiday is opened.
const ROUTE_COLOR = "#3b82f6";
const FOCUS_ZOOM = 10;
const isTouchDevice = window.matchMedia("(hover: none)").matches;
const routeMaps = new WeakMap(); // holiday <details> element → its map

const MAP_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> ' +
  '© <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> ' +
  'Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>';

// One white road layer. Each layer only appears from `minzoom`, and its
// lines get thicker as you zoom in (`widths` = zoom, width, zoom, width, ...).
function roadLayer(id, classes, minzoom, widths, opacity) {
  return {
    id,
    type: "line",
    source: "openfreemap",
    "source-layer": "transportation",
    minzoom,
    filter: ["in", ["get", "class"], ["literal", classes]],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#ffffff",
      "line-opacity": opacity,
      "line-width": ["interpolate", ["linear"], ["zoom"], ...widths],
    },
  };
}

function routeMapStyle(routeCoords, places, icons) {
  const isActive = ["boolean", ["feature-state", "active"], false];

  return {
    version: 8,
    sources: {
      openfreemap: {
        type: "vector",
        url: "https://tiles.openfreemap.org/planet",
        attribution: MAP_ATTRIBUTION,
      },
      route: {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: routeCoords } },
      },
      stops: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: places.map((place, i) => ({
            type: "Feature",
            id: i,
            properties: { name: place.name },
            geometry: { type: "Point", coordinates: [place.lng, place.lat] },
          })),
        },
      },
      "travel-icons": { type: "geojson", data: icons },
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": "#000000" } },
      // Coastlines: the outline of the sea and of large lakes
      {
        id: "coastline",
        type: "line",
        source: "openfreemap",
        "source-layer": "water",
        filter: ["in", ["get", "class"], ["literal", ["ocean", "lake"]]],
        paint: {
          "line-color": "#8a8f98",
          "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.6, 10, 1.2],
        },
      },
      // Country borders on land (not the sea borders), dashed
      {
        id: "borders",
        type: "line",
        source: "openfreemap",
        "source-layer": "boundary",
        filter: ["all", ["==", ["get", "admin_level"], 2], ["!=", ["get", "maritime"], 1]],
        layout: { "line-join": "round" },
        paint: {
          "line-color": "#8a8f98",
          "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.8, 10, 1.5],
          "line-dasharray": [3, 2],
        },
      },
      // Smallest roads first, so the bigger roads are drawn on top
      roadLayer("roads-minor", ["minor", "service"], 12, [12, 0.4, 14, 1, 16, 2.5], 0.5),
      roadLayer("roads-secondary", ["secondary", "tertiary"], 9, [9, 0.4, 12, 1, 16, 3], 0.7),
      roadLayer("roads-primary", ["primary"], 7, [7, 0.5, 10, 1, 14, 2.5, 16, 4], 0.85),
      roadLayer("roads-major", ["motorway", "trunk"], 0, [4, 0.6, 8, 1.2, 12, 2.5, 16, 5], 1),
      {
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": ROUTE_COLOR, "line-width": 3 },
      },
      {
        id: "travel-icons",
        type: "symbol",
        source: "travel-icons",
        layout: {
          "icon-image": ["get", "icon"],
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      },
      {
        id: "route-stops",
        type: "circle",
        source: "stops",
        paint: {
          "circle-color": ROUTE_COLOR,
          "circle-radius": ["case", isActive, 9, 5],
          "circle-stroke-color": ["case", isActive, "#ffffff", "#000000"],
          "circle-stroke-width": 2,
        },
      },
    ],
  };
}

// Decodes an encoded polyline (precision 5) into [lng, lat] pairs
function decodePolyline(encoded) {
  const coords = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    for (const axis of ["lat", "lng"]) {
      let result = 0;
      let shift = 0;
      let byte;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const delta = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === "lat") lat += delta;
      else lng += delta;
    }
    coords.push([lng / 1e5, lat / 1e5]);
  }
  return coords;
}

// The line drawn on the map: along the road or river where travel-roads.js
// has a path for that leg, otherwise straight from stop to stop. Flights
// are always straight.
function routeLine(holiday) {
  const legs = (typeof roadPaths !== "undefined" && roadPaths[holiday.id]) || [];
  const stops = holiday.stops;
  const coords = [[stops[0].lng, stops[0].lat]];
  for (let i = 1; i < stops.length; i++) {
    const path = legs[i - 1];
    if (path && stops[i].by !== "plane") coords.push(...decodePolyline(path));
    coords.push([stops[i].lng, stops[i].lat]);
  }
  return coords;
}

// The point halfway along a line (measured on the flat map), and the
// direction of the line there, in degrees clockwise from north
function halfway(path) {
  const points = path.map((lngLat) => maplibregl.MercatorCoordinate.fromLngLat(lngLat));
  const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  let remaining = lengths.reduce((sum, length) => sum + length, 0) / 2;
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i] || i === lengths.length - 1) {
      const from = points[i];
      const to = points[i + 1];
      const t = lengths[i] ? Math.min(remaining / lengths[i], 1) : 0;
      const middle = new maplibregl.MercatorCoordinate(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t).toLngLat();
      // y grows southwards on the flat map, hence from.y - to.y
      const bearing = (Math.atan2(to.x - from.x, from.y - to.y) * 180) / Math.PI;
      return { point: [middle.lng, middle.lat], bearing };
    }
    remaining -= lengths[i];
  }
}

// Icons on the line: a plane halfway along each flight (pointing the way
// it flew), and a train or boat halfway along each train or boat ride
function travelIcons(holiday) {
  const legs = (typeof roadPaths !== "undefined" && roadPaths[holiday.id]) || [];
  const features = [];
  holiday.stops.forEach((stop, i) => {
    if (i === 0 || !(stop.by in TRAVEL_ICONS)) return;
    const previous = holiday.stops[i - 1];
    let path = [[previous.lng, previous.lat], [stop.lng, stop.lat]];
    if (stop.by !== "plane" && legs[i - 1]) path = [path[0], ...decodePolyline(legs[i - 1]), path[1]];
    const { point, bearing } = halfway(path);
    features.push({
      type: "Feature",
      properties: { icon: stop.by, bearing: stop.by === "plane" ? bearing : 0 },
      geometry: { type: "Point", coordinates: point },
    });
  });
  return { type: "FeatureCollection", features };
}

// Material Design icons ("flight", "train" and "directions_boat"), on a 24×24 grid
const TRAVEL_ICONS = {
  plane: "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
  train:
    "M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
  boat:
    "M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z",
};

// Draws a travel icon (plane, train or boat) white with a black outline,
// at twice its on-screen size so it stays sharp
function travelIconImage(name) {
  const size = 48;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.scale(size / 24, size / 24);
  const shape = new Path2D(TRAVEL_ICONS[name]);
  ctx.lineJoin = "round";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000000";
  ctx.stroke(shape);
  ctx.fillStyle = "#ffffff";
  ctx.fill(shape);
  return ctx.getImageData(0, 0, size, size);
}

function openRouteMap(details, holiday) {
  const existing = routeMaps.get(details);
  if (existing) {
    // The map was hidden while the holiday was closed, so re-measure it
    existing.map.resize();
    existing.showWholeRoute();
    return;
  }

  const container = details.querySelector(".route-map-canvas");
  if (typeof maplibregl === "undefined") {
    container.textContent = "The map could not be loaded.";
    return;
  }
  routeMaps.set(details, createRouteMap(details, container, holiday));
}

function createRouteMap(details, container, holiday) {
  const list = details.querySelector(".locations");
  const items = [...list.querySelectorAll("li")];
  const { places } = groupPlaces(holiday.stops);
  const routeCoords = routeLine(holiday);
  const bounds = routeCoords.reduce(
    (box, coords) => box.extend(coords),
    new maplibregl.LngLatBounds(routeCoords[0], routeCoords[0])
  );
  const focusZoom = holiday.focusZoom || FOCUS_ZOOM;
  const fitOptions = { padding: 40, maxZoom: focusZoom };

  const map = new maplibregl.Map({
    container,
    style: routeMapStyle(routeCoords, places, travelIcons(holiday)),
    bounds,
    fitBoundsOptions: fitOptions,
    maxZoom: 16,
    attributionControl: false,
    scrollZoom: false, // so scrolling the page doesn't get stuck zooming the map
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
  });
  map.touchZoomRotate.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  map.addControl(new maplibregl.AttributionControl({ compact: false }), "bottom-right");

  // The map asks for each travel icon the first time it draws one
  map.on("styleimagemissing", (event) => {
    if (event.id in TRAVEL_ICONS && !map.hasImage(event.id)) {
      map.addImage(event.id, travelIconImage(event.id), { pixelRatio: 2 });
    }
  });

  // --- Highlighting: one place at a time, on the map and in the list ---
  let highlighted = null;

  function setHighlight(placeNumber, on) {
    if (placeNumber === null) return;
    if (map.getSource("stops")) {
      map.setFeatureState({ source: "stops", id: placeNumber }, { active: on });
    }
    items.forEach((item) => {
      if (Number(item.dataset.place) === placeNumber) item.classList.toggle("is-active", on);
    });
  }

  function highlight(placeNumber) {
    if (placeNumber === highlighted) return;
    setHighlight(highlighted, false);
    highlighted = placeNumber;
    setHighlight(highlighted, true);
  }

  // Re-apply a highlight that happened before the map finished loading
  map.on("load", () => setHighlight(highlighted, true));

  // --- Moving the map ---
  // MapLibre skips these animations for visitors who prefer reduced motion
  let selectedItem = null;

  function focusPlace(item) {
    selectedItem = item;
    const placeNumber = Number(item.dataset.place);
    const place = places[placeNumber];
    highlight(placeNumber);
    map.flyTo({ center: [place.lng, place.lat], zoom: focusZoom, duration: 1200 });
  }

  function showWholeRoute() {
    selectedItem = null;
    highlight(null);
    map.fitBounds(bounds, { ...fitOptions, duration: 1000 });
  }

  // --- Bullet points → map ---
  if (isTouchDevice) {
    // Phones: tap a bullet to select it, tap it again (or anywhere else) to go back
    list.addEventListener("click", (event) => {
      if (event.target.closest(".location-photos")) return; // tapping a photo opens it instead
      const item = event.target.closest("li[data-place]");
      if (!item) return;
      if (item === selectedItem) showWholeRoute();
      else focusPlace(item);
    });

    document.addEventListener("click", (event) => {
      if (selectedItem && !list.contains(event.target) && !container.contains(event.target)) {
        showWholeRoute();
      }
    });
  } else {
    items.forEach((item) => item.addEventListener("mouseenter", () => focusPlace(item)));
    list.addEventListener("mouseleave", showWholeRoute);
  }

  // Keyboard: tabbing onto a bullet works like hovering it. (:focus-visible
  // is only true for keyboard focus, not for a tap or click.)
  items.forEach((item) => item.addEventListener("focus", () => {
    if (item.matches(":focus-visible")) focusPlace(item);
  }));
  list.addEventListener("focusout", (event) => {
    if (!list.contains(event.relatedTarget)) showWholeRoute();
  });

  // --- Markers → bullet points ---
  map.on("mousemove", "route-stops", (event) => {
    map.getCanvas().style.cursor = "pointer";
    highlight(event.features[0].id);
  });
  map.on("mouseleave", "route-stops", () => {
    map.getCanvas().style.cursor = "";
    if (!selectedItem) highlight(null);
  });

  return { map, showWholeRoute };
}

// ========== Footer year ==========
document.getElementById("year").textContent = new Date().getFullYear();
