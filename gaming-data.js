// ========== Gaming page: PC, setup and favourite games ==========
// Edit the lists below; the gaming page builds itself from them.
//
// pcParts: the parts inside the PC.
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

// setup: everything around the PC.
//   icon   an emoji shown on the card
const setup = [
  { icon: "🖥️", name: "Monitor", model: "Add model" },
  { icon: "⌨️", name: "Keyboard", model: "Add model" },
  { icon: "🖱️", name: "Mouse", model: "Add model" },
  { icon: "🎧", name: "Headset", model: "Add model" },
  { icon: "🪑", name: "Chair", model: "Add model" },
];

// favouriteGames: shown as cards.
//   title  the game's name
//   note   optional short line about why you like it
const favouriteGames = [
  { title: "WARDOGS", note: "The game my planned Watcher map tool is for." },
  { title: "Add a game", note: "" },
  { title: "Add a game", note: "" },
];
