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

// favouriteGames: shown as cards.
//   title  the game's name
//   note   optional short line about why you like it
const favouriteGames = [
  { title: "WARDOGS", note: "The game my planned Watcher map tool is for." },
  { title: "Add a game", note: "" },
  { title: "Add a game", note: "" },
];
