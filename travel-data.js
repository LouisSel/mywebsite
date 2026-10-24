// ========== Holidays shown on the Travel page ==========
// Each holiday is one entry in this list; the page builds the list, the
// bullet points and the route map from it.
//
// To add a holiday: copy the Peru entry and change it.
//   id      short unique name, lowercase, no spaces (e.g. "japan")
//   country name shown in the list
//   flag    two-letter country code (full list: https://flagcdn.com/en/codes.json)
//   year    shown on the right of the list row
//   focusZoom  optional: how far the map zooms in on a stop when you hover
//           it. Default 10 (good for a country); use ~15 for a city trip.
//   stops   the places, in the order you travelled. The map draws a line
//           from each stop to the next: a straight line, or the road route
//           if the holiday has road paths in travel-roads.js.
//
// Each stop:
//   name    shown as the bullet point
//   lat/lng coordinates. Easiest way to get them: right-click the place in
//           Google Maps; the first number is lat, the second is lng.
//           A place you visit twice (e.g. Cusco) needs the same coordinates
//           both times so it shares one marker.
//   by      optional: how you got to this stop from the previous one.
//           "plane" = straight line with a plane icon (no road)
//           "train" = line follows the railway, with a train icon
//           "boat"  = line follows the river (see travel-roads.js)
//           leave it out for travel by road
//   note    optional short text under the name ("" for none)
//   photos  optional pictures, e.g.
//           photos: [
//             { src: "images/peru/cusco-1.jpg", alt: "Plaza de Armas at night" },
//           ]
//           The alt text is also the caption when the photo is enlarged.

const holidays = [
  {
    id: "peru",
    country: "Peru",
    flag: "pe",
    year: "2018",
    stops: [
      { name: "Lima",                      lat: -12.0453, lng: -77.0311, note: "", photos: [] },
      { name: "Arequipa",                  lat: -16.3988, lng: -71.5369, by: "plane", note: "", photos: [] },
      { name: "Puno",                      lat: -15.8402, lng: -70.0270, note: "", photos: [] },
      { name: "Cusco",                     lat: -13.5167, lng: -71.9781, note: "", photos: [] },
      { name: "Machu Picchu",              lat: -13.1631, lng: -72.5450, by: "train", note: "", photos: [] },
      { name: "Cusco",                     lat: -13.5167, lng: -71.9781, by: "train", note: "", photos: [] },
      { name: "Puerto Maldonado",          lat: -12.5939, lng: -69.1885, by: "plane", note: "", photos: [] },
      { name: "Tambopata Research Center", lat: -13.1355, lng: -69.6114, by: "boat", note: "", photos: [] },
      { name: "Puerto Maldonado",          lat: -12.5939, lng: -69.1885, by: "boat", note: "", photos: [] },
      { name: "Lima",                      lat: -12.0453, lng: -77.0311, by: "plane", note: "", photos: [] },
    ],
  },
  {
    id: "paris-2026",
    country: "France",
    flag: "fr",
    year: "2026",
    focusZoom: 15,
    stops: [
      { name: "Staycity Aparthotels, Levallois-Perret", lat: 48.8943, lng: 2.3006, note: "", photos: [] },
      { name: "Eiffel Tower",                           lat: 48.8583, lng: 2.2945, note: "", photos: [] },
      { name: "Paris Expo Porte de Versailles",         lat: 48.8287, lng: 2.2890, note: "", photos: [] },
      { name: "Louvre",                                 lat: 48.8611, lng: 2.3358, note: "", photos: [] },
      { name: "Les Ombres, 27 Quai Jacques Chirac",     lat: 48.8611, lng: 2.2985, note: "", photos: [] },
    ],
  },
  {
    id: "usa-2024",
    country: "United States",
    flag: "us",
    year: "2024",
    // Lines follow the roads: see "usa-2024" in travel-roads.js.
    // West Yellowstone → Boulder is routed through Idaho Falls.
    stops: [
      { name: "Denver",            lat: 39.7392, lng: -104.9849, note: "", photos: [] },
      { name: "Steamboat Springs", lat: 40.4848, lng: -106.8317, note: "", photos: [] },
      { name: "Jackson",           lat: 43.4800, lng: -110.7618, note: "", photos: [] },
      { name: "West Yellowstone",  lat: 44.6632, lng: -111.1012, note: "", photos: [] },
      { name: "Boulder",           lat: 40.0150, lng: -105.2705, note: "", photos: [] },
      { name: "Denver",            lat: 39.7392, lng: -104.9849, note: "", photos: [] },
    ],
  },
  {
    id: "country-two",
    country: "Country Two",
    flag: "it",
    year: "Year",
    stops: [],
  },
  {
    id: "country-three",
    country: "Country Three",
    flag: "no",
    year: "Year",
    stops: [],
  },
];
