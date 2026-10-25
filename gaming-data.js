// ========== Gaming page: PC, setup and favourite games ==========
// Edit the lists below; the gaming page builds itself from them.
//
// pcParts: the parts inside the PC, shown after clicking the PC in the setup.
//   part   which piece of the drawing lights up on hover. Must be one of:
//          "case", "fans-side", "radiator", "motherboard", "storage", "ram",
//          "cpu", "cpu-cooler", "gpu", "fans-bottom". Leave it out for parts
//          that aren't in the drawing (e.g. the power supply). The CPU sits
//          under the cooler: hovering it hides the cooler so you can see it.
//   name   what the part is
//   model  the exact model, shown in the list and next to the drawing

const pcParts = [
  { part: "cpu", name: "Processor (CPU)", model: "AMD Ryzen 7 9800X3D" },
  { part: "gpu", name: "Graphics card", model: "MSI RTX5080" },
  { part: "cpu-cooler", name: "CPU cooler (AIO)", model: "Corsair iCUE LINK TITAN 360 RX RGB" },
  { part: "motherboard", name: "Motherboard", model: "ASRock X870E Nova WiFi" },
  { part: "ram", name: "Memory (RAM)", model: "G.Skill Trident Z5 Royal Neo 96GB" },
  { part: "storage", name: "Storage", model: "Samsung 990 PRO NVMe M.2 SSD, 2TB" },
  { name: "Power supply", model: "ROG Strix 1000W" },
  { part: "case", name: "Case", model: "HAVN 420 VGPU" },
  { part: "radiator", name: "Radiator & RGB bar", model: "Lian Li Uni Fan TL Wireless 120" },
  { part: "fans-side", name: "Side intake fans", model: "Lian Li Uni Fan TL Wireless 120" },
  { part: "fans-bottom", name: "Bottom intake fans", model: "Lian Li Uni Fan TL Wireless 140 Reverse" },
];

// setup: everything on and around the desk.
//   part   which piece of the setup drawing lights up on hover. Must be one of:
//          "pc", "monitor", "side-monitor", "keyboard", "mouse", "headset",
//          "mic", "webcam", "light", "stream-deck", "controller". Leave it out
//          for things that aren't in the drawing (e.g. the chair). Clicking
//          the PC zooms into the drawing of the PC above.
//   icon   an emoji shown on the card
const setup = [
  { part: "pc", icon: "⚙️", name: "PC", model: "Click to open specifications" },
  { part: "monitor", icon: "🖥️", name: "Main monitor", model: "MSI MAG 273QP QD-OLED X24 26.5 Inch WQHD Gaming Monitor" },
  { part: "side-monitor", icon: "🖥️", name: "Side monitor", model: "Lenovo ThinkVision P27Q-40 27 Zoll WQHD" },
  { part: "keyboard", icon: "⌨️", name: "Keyboard", model: "Rainy 75 Keyboard Electro White" },
  { part: "mouse", icon: "🖱️", name: "Mouse", model: "Logitech G PRO X2 SUPERSTRIKE LIGHTSPEED" },
  { part: "headset", icon: "🎧", name: "Headset", model: "Beyerdynamics DT990 Pro Limited Edition" },
  { part: "mic", icon: "🎙️", name: "Microphone", model: "Trust GXT252" },
  { part: "webcam", icon: "📹", name: "Webcam", model: "Logitech Brio 4K" },
  { part: "light", icon: "💡", name: "Streaming light", model: "Logitech Litra Glow" },
  { part: "stream-deck", icon: "🎛️", name: "Stream Deck", model: "Elgato Stream Deck MK.2" },
  { part: "controller", icon: "🎮", name: "Controller", model: "GameSir G7 Pro" },
];

// favouriteGames: one card per game; clicking a card opens it.
// These are my 10 most played games on Steam. The hours, dates, genres,
// descriptions and covers were taken from Steam on 25 October 2026.
//   title       the game's name
//   note        optional short line shown on the card
//   Everything below is optional and only shows once the card is opened:
//   genre, platform, hours, lastPlayed, since
//               quick facts (since = the year you started playing)
//   about       a few lines about the game
//   cover       a picture of the game, e.g. "images/games/wardogs.jpg"
//   link        the game's website or store page
const favouriteGames = [
  {
    title: "Rocket League",
    note: "Psyonix LLC · 2015",
    genre: "Action, Racing, Sports",
    platform: "PC (Steam)",
    hours: "2,875",
    lastPlayed: "Oct 2026",
    about: "Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls and fluid, physics-driven competition.",
    cover: "images/games/rocket-league.jpg",
    link: "https://store.steampowered.com/app/252950/",
  },
  {
    title: "Tom Clancy's Rainbow Six Siege",
    note: "Ubisoft Montreal · 2015",
    genre: "Action",
    platform: "PC (Steam)",
    hours: "1,549",
    lastPlayed: "Aug 2026",
    about: "Tom Clancy's Rainbow Six Siege is an elite, tactical team-based shooter where superior planning and execution triumph.",
    cover: "images/games/rainbow-six-siege.jpg",
    link: "https://store.steampowered.com/app/359550/",
  },
  {
    title: "REMATCH",
    note: "Sloclap · 2025",
    genre: "Action, Sports",
    platform: "PC (Steam)",
    hours: "1,117",
    lastPlayed: "Sep 2026",
    about: "Control one player in fast-paced online football matches from an immersive third-person perspective. Team up with friends in teams of 3, 4 or 5, show off your skills, and make every move count.",
    cover: "images/games/rematch.jpg",
    link: "https://store.steampowered.com/app/2138720/",
  },
  {
    title: "THE FINALS",
    note: "Embark Studios · 2023",
    genre: "Action",
    platform: "PC (Steam)",
    hours: "348",
    lastPlayed: "Sep 2026",
    about: "THE FINALS is the ultimate free-to-play FPS Game Show. Compete across fast-paced Modes and stunning Arenas, with unparalleled, unscripted destruction that turns the environment into your greatest Weapon. Steal the Show!",
    cover: "images/games/the-finals.jpg",
    link: "https://store.steampowered.com/app/2073850/",
  },
  {
    title: "Apex Legends",
    note: "Respawn · 2020",
    genre: "Action, Adventure",
    platform: "PC (Steam)",
    hours: "221",
    lastPlayed: "Dec 2025",
    about: "Apex Legends is the award-winning, free-to-play Hero Shooter from Respawn Entertainment. Master an ever-growing roster of legendary characters with powerful abilities, and experience strategic squad play and innovative gameplay in the next evolution of Hero Shooter and Battle Royale.",
    cover: "images/games/apex-legends.jpg",
    link: "https://store.steampowered.com/app/1172470/",
  },
  {
    title: "WARDOGS",
    note: "The game my planned Watcher map tool is for.",
    genre: "Action, Simulation",
    platform: "PC (Steam)",
    hours: "176",
    lastPlayed: "Oct 2026",
    about: "WARDOGS is a TACTICAL ALL OUT WARFARE FPS where one hundred players split across three teams fight over the control zone. Set in the derelict industrial mountains of Eastern Europe on a destructible battlefield where teamwork pays and cash is king.",
    cover: "images/games/wardogs.jpg",
    link: "https://store.steampowered.com/app/1867240/",
  },
  {
    title: "ARK: Survival Ascended",
    note: "Studio Wildcard · 2023",
    genre: "Action, Adventure, RPG",
    platform: "PC (Steam)",
    hours: "174",
    lastPlayed: "Jul 2025",
    about: "ARK is reimagined from the ground-up into the next-generation of video game technology with Unreal Engine 5! Form a tribe, tame & breed hundreds of unique dinosaurs and primeval creatures, explore, craft, build, and fight your way to the top of the food-chain. Your new world awaits!",
    cover: "images/games/ark-survival-ascended.jpg",
    link: "https://store.steampowered.com/app/2399830/",
  },
  {
    title: "Grand Theft Auto V",
    note: "Rockstar North · 2015",
    genre: "Action, Adventure",
    platform: "PC (Steam)",
    hours: "161",
    lastPlayed: "Sep 2021",
    about: "Grand Theft Auto V for PC offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond, as well as the chance to experience the game running at 60 frames per second.",
    cover: "images/games/gta-v.jpg",
    link: "https://store.steampowered.com/app/271590/",
  },
  {
    title: "Sid Meier's Civilization VI",
    note: "Firaxis Games · 2016",
    genre: "Strategy",
    platform: "PC (Steam)",
    hours: "142",
    lastPlayed: "Aug 2026",
    about: "Expand your empire, advance your culture and go head-to-head against history’s greatest leaders. Will your civilization stand the test of time?",
    cover: "images/games/civilization-vi.jpg",
    link: "https://store.steampowered.com/app/289070/",
  },
  {
    title: "Forza Horizon 5",
    note: "Playground Games · 2021",
    genre: "Action, Adventure, Racing",
    platform: "PC (Steam)",
    hours: "130",
    lastPlayed: "Jun 2025",
    about: "Explore the vibrant open world landscapes of Mexico with limitless, fun driving action in the world’s greatest cars.",
    cover: "images/games/forza-horizon-5.jpg",
    link: "https://store.steampowered.com/app/1551360/",
  },
];
