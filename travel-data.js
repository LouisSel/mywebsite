// ========== Holidays shown on the Travel page ==========
// Each holiday is one entry in this list; the page builds the list, the
// bullet points and the route map from it.
//
// To add a holiday: copy the Peru entry and change it.
//   id      short unique name, lowercase, no spaces (e.g. "japan")
//   country name shown in the list
//   flag    two-letter country code (full list: https://flagcdn.com/en/codes.json),
//           or two codes for a trip through two countries, e.g. ["no", "dk"]:
//           shown as one flag split diagonally
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
//           "boat"  = line follows the river if one is set up in the route
//                     generator, otherwise straight (e.g. across the sea);
//                     with a boat icon
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
      { name: "Paris Expo Porte de Versailles",         lat: 48.8287, lng: 2.2890, note: "eSports World Cup", photos: [] },
      { name: "Louvre",                                 lat: 48.8611, lng: 2.3358, note: "", photos: [] },
      { name: "Bar Les Ombres",     lat: 48.8611, lng: 2.2985, note: "Great Bar", photos: [] },
    ],
  },
  {
    id: "usa-2024",
    country: "United States",
    flag: "us",
    year: "2024",
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
    id: "usa-2017",
    country: "United States",
    flag: "us",
    year: "2017",
    stops: [
      { name: "New York",        lat: 40.7562, lng: -73.9860, note: "", photos: [] },
      { name: "Washington D.C.", lat: 38.9562, lng: -76.8212, note: "", photos: [] },
    ],
  },
  {
    id: "thailand-2015",
    country: "Thailand",
    flag: "th",
    year: "2015",
    stops: [
      { name: "Bangkok",                          lat: 13.7657, lng: 100.4778, note: "", photos: [] },
      { name: "Boutique Raft Resort River Kwai",  lat: 14.2167, lng: 99.0567, note: "", photos: [] },
      { name: "Bangkok",                          lat: 13.7657, lng: 100.4778, note: "", photos: [] },
      { name: "Four Seasons Resort Koh Samui",    lat: 9.5979, lng: 99.9724, by: "plane", note: "", photos: [] },
      { name: "Sensi Paradise Beach Resort",      lat: 10.0814, lng: 99.8211, by: "boat", note: "", photos: [] },
      { name: "Koh Samui",                        lat: 9.5489, lng: 100.0609, by: "boat", note: "", photos: [] },
      { name: "Kuala Lumpur",                     lat: 3.1446, lng: 101.7226, by: "plane", note: "", photos: [] },
    ],
  },
  {
    id: "florida-2014",
    country: "United States",
    flag: "us",
    year: "2014",
    stops: [
      { name: "Miami",                        lat: 25.7929, lng: -80.1293, note: "", photos: [] },
      { name: "Key West",                     lat: 24.5541, lng: -81.7797, note: "", photos: [] },
      { name: "Dry Tortugas National Park",   lat: 24.6293, lng: -82.8634, by: "plane", note: "", photos: [] },
      { name: "Key West",                     lat: 24.5541, lng: -81.7797, by: "plane", note: "", photos: [] },
      { name: "Tampa / Bush Gardens",         lat: 27.9564, lng: -82.4639, note: "", photos: [] },
      { name: "Disneyland Polynesian Resort", lat: 28.4056, lng: -81.5845, note: "", photos: [] },
      { name: "Cape Canaveral Space Center",  lat: 28.4933, lng: -80.5730, note: "", photos: [] },
      { name: "Palm Beach",                   lat: 26.7056, lng: -80.0373, note: "", photos: [] },
      { name: "Miami",                        lat: 25.7929, lng: -80.1293, note: "", photos: [] },
    ],
  },
  {
    id: "portugal-2019",
    country: "Portugal",
    flag: "pt",
    year: "2019",
    stops: [
      { name: "Lissabon",                   lat: 38.7218, lng: -9.1329, note: "", photos: [] },
      { name: "Salema",                     lat: 37.0661, lng: -8.8236, note: "", photos: [] },
      { name: "Peniche", lat: 39.3642, lng: -9.3332, note: "Surf Camp", photos: [] },
      { name: "Porto",                      lat: 41.1457, lng: -8.6091, note: "", photos: [] },
      { name: "Lissabon",                   lat: 38.7218, lng: -9.1329, note: "", photos: [] },
    ],
  },
  {
    id: "spain-2015",
    country: "Spain",
    flag: "es",
    year: "2015",
    stops: [
      { name: "Almunecar", lat: 36.7483, lng: -3.6700, note: "", photos: [] },
    ],
  },
  {
    id: "spain-2018",
    country: "Spain",
    flag: "es",
    year: "2018",
    stops: [
      { name: "Barcelona", lat: 41.3873, lng: 2.1621, note: "", photos: [] },
    ],
  },
  {
    id: "spain-2026",
    country: "Spain",
    flag: "es",
    year: "2026",
    stops: [
      { name: "Fuerteventura", lat: 28.1677, lng: -14.2224, note: "", photos: [] },
    ],
  },
  {
    id: "ireland-2022",
    country: "Ireland",
    flag: "ie",
    year: "2022",
    focusZoom: 13,
    stops: [
      { name: "Bray",                              lat: 53.1937, lng: -6.1061, note: "", photos: [] },
      { name: "Temple Bar",                        lat: 53.3449, lng: -6.2668, note: "", photos: [] },
      { name: "Guiness Brewery",                   lat: 53.3417, lng: -6.2864, note: "", photos: [] },
      { name: "Shelbourne Park Greyhound Stadium", lat: 53.3411, lng: -6.2305, note: "", photos: [] },
      { name: "Glendalough",                       lat: 53.0121, lng: -6.3225, note: "", photos: [] },
    ],
  },
  {
    id: "Corsica-2017",
    country: "France",
    flag: "fr",
    year: "2017",
    stops: [
      { name: "Ghisonaccia", lat: 41.9950, lng: 9.4439, note: "", photos: [] },
    ],
  },
  {
    id: "Croatia-2022",
    country: "Croatia",
    flag: "hr",
    year: "2022",
    stops: [
      { name: "Pula", lat: 44.8690, lng: 13.8464, note: "Boys trip", photos: [] },
    ],
  },
  {
    id: "Croatia-2023",
    country: "Croatia",
    flag: "hr",
    year: "2023",
    stops: [
      { name: "Crikvenica", lat: 45.1816, lng: 14.6890, note: "", photos: [] },
    ],
  },
  {
    id: "Turkiye-2013",
    country: "Turkiye",
    flag: "tr",
    year: "2013",
    focusZoom: 12,
    stops: [
      { name: "Kusadasi", lat: 37.7765, lng: 27.2947, note: "", photos: [] },
      { name: "Ephesos",  lat: 37.9392, lng: 27.3412, note: "", photos: [] },
    ],
  },
  {
    id: "egpyt-2024",
    country: "Egypt",
    flag: "eg",
    year: "2024",
    focusZoom: 12,
    stops: [
      { name: "Safaga",              lat: 26.8357, lng: 33.9487, note: "Windsurfing", photos: [] },
      { name: "Temple of Luxor",     lat: 25.6998, lng: 32.6414, note: "", photos: [] },
      { name: "Valley of the Kings", lat: 25.7411, lng: 32.6031, note: "", photos: [] },
      { name: "Safaga",              lat: 26.8357, lng: 33.9487, note: "", photos: [] },
    ],
  },
  {
    id: "kreuzfahrt-2025",
    country: "Company cruise",
    flag: ["no", "dk"],
    year: "2025",
    // Sea routes are drawn around the coast: see "kreuzfahrt-2025" in travel-roads.js.
    stops: [
      { name: "Hamburg",      lat: 53.5295, lng: 9.9622, note: "", photos: [] },
      { name: "Kristiansand", lat: 58.1394, lng: 7.9914, by: "boat", note: "", photos: [] },
      { name: "Copenhagen",   lat: 55.6981, lng: 12.6013, by: "boat", note: "", photos: [] },
      { name: "Kiel",         lat: 54.3251, lng: 10.1461, by: "boat", note: "", photos: [] },
    ],
  },
];

// ========== Other countries I've been to ==========
// Countries without a holiday entry above. They are green on the world map
// and counted on the homepage, like the countries of the holidays.
// Two-letter country codes, the same as the flags (full list:
// https://flagcdn.com/en/codes.json). The United Kingdom is "gb", not "uk".
const otherVisitedCountries = [
  "at", // Austria
  "ch", // Switzerland
  "de", // Germany
  "hu", // Hungary
  "nl", // Netherlands
  "se", // Sweden
  "gb", // United Kingdom
  "it", // Italy
];

// ========== Trips I'm planning ==========
// Shown under "Next on the list" on the Travel page.
//   name       shown in the list
//   year       shown after the name
//   countries  two-letter codes of the countries the trip goes to: yellow on
//              the world map (a country you've already been to stays green).
//              Leave it empty ([]) until you know.
const plannedTrips = [
  { name: "Morocco",               year: "2026", countries: ["ma"] },
  { name: "Soelden",               year: "2026", countries: ["at"] },
  { name: "Mauritania",            year: "2027", countries: ["mr"] },
  { name: "Safari through Africa", year: "2027", countries: [""] },
];
