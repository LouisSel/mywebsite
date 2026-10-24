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
  return `<li data-place="${placeNumber}" tabindex="0"><h3>${escapeHtml(stop.name)}</h3>${note}${photos}</li>`;
}

function renderHoliday(holiday) {
  const hasStops = holiday.stops.length > 0;
  const { stopPlaces } = groupPlaces(holiday.stops);

  const details = document.createElement("details");
  details.className = "holiday";
  details.innerHTML = `
    <summary>
      <img class="flag" src="https://flagcdn.com/${escapeHtml(holiday.flag)}.svg" alt="" width="36" height="27">
      <span class="holiday-country">${escapeHtml(holiday.country)}</span>
      <span class="holiday-meta">${escapeHtml(holiday.year)}</span>
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
  [...holidays]
    .sort((a, b) => {
      if (!yearOf(a) || !yearOf(b)) return yearOf(b) ? 1 : yearOf(a) ? -1 : 0;
      return NEWEST_FIRST ? yearOf(b) - yearOf(a) : yearOf(a) - yearOf(b);
    })
    .forEach((holiday) => holidayList.append(renderHoliday(holiday)));
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
// it flew) and a train halfway along each train ride
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

// Material Design icons ("flight" and "train"), on a 24×24 grid
const TRAVEL_ICONS = {
  plane: "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
  train:
    "M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
};

// Draws a travel icon white with a black outline, at twice its on-screen
// size so it stays sharp
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
