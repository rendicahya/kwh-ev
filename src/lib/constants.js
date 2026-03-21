export const SPKLU_TARIFF = 2466.78;
export const PBJT_TL = 6660.31;

export const DEFAULTS = {
  batteryCapacity: 60,
  currentBattery: 40,
  tariffPerKwh: 2466.78,
  chargerPower: 7.7,
  targetBattery: 80,
  availableHours: 1,
  availableMinutes: 0,
  budget: 50000,
};

export const EV_PRESETS = [
  { label: 'Aion UT (Standard)', capacity: 44.1 },
  { label: 'Aion UT (Premium)', capacity: 60 },
  { label: 'Aion V (Standard)', capacity: 64.5 },
  { label: 'Aion V (Long Range)', capacity: 75.3 },
  { label: 'Aion Y Plus (Exclusive)', capacity: 50.66 },
  { label: 'Aion Y Plus (Premium)', capacity: 63.2 },
  { label: 'BYD Atto 1', capacity: 30 },
  { label: 'BYD Atto 3 (Standard Range)', capacity: 49.92 },
  { label: 'BYD Atto 3 (Extended Range)', capacity: 60.48 },
  { label: 'BYD Dolphin (Standard Range)', capacity: 44.9 },
  { label: 'BYD Dolphin (Extended Range)', capacity: 60.48 },
  { label: 'BYD Seal (Premium)', capacity: 82.56 },
  { label: 'Chery Omoda E5', capacity: 61 },
  { label: 'Hyundai Ioniq 5 (Standard Range)', capacity: 58 },
  { label: 'Hyundai Ioniq 5 (Long Range)', capacity: 72.6 },
  { label: 'Jaecoo J5 EV', capacity: 60.9 },
  { label: 'Jaecoo J6 EV (Standard Range)', capacity: 65 },
  { label: 'Jaecoo J6 EV (Long Range)', capacity: 69.8 },
  { label: 'MG 4 EV', capacity: 51 },
  { label: 'Neta V-II', capacity: 36.1 },
  { label: 'Tesla Model 3', capacity: 50 },
  { label: 'VinFast VF e34', capacity: 41.9 },
  { label: 'VinFast VF 5', capacity: 37.23 },
  { label: 'VinFast VF 6', capacity: 59.6 },
  { label: 'VinFast VF 7', capacity: 75.3 },
  { label: 'Wuling Air EV (Lite/Standard)', capacity: 17.3 },
  { label: 'Wuling Air EV (Long Range)', capacity: 26.7 },
  { label: 'Wuling BinguoEV', capacity: 31.9 },
  { label: 'Wuling Cloud EV', capacity: 50.6 },
];

export const CHARGER_PRESETS = [
  { label: 'Portable Charger — 8 A', power: 1.76 },
  { label: 'Portable Charger — 13 A', power: 2.86 },
  { label: 'Home Charging AC — 7.7 kW', power: 7.7 },
  { label: 'Home Charging AC — 11 kW', power: 11 },
  { label: 'Home Charging AC — 22 kW', power: 22 },
  { label: 'Fast Charging DC — 25 kW', power: 25 },
  { label: 'Fast Charging DC — 50 kW', power: 50 },
  { label: 'Fast Charging DC — 100 kW', power: 100 },
  { label: 'Ultra Fast Charging DC — 150 kW', power: 150 },
  { label: 'Ultra Fast Charging DC — 200 kW', power: 200 },
  { label: 'Ultra Fast Charging DC — 350 kW', power: 350 },
];

export const HOME_TARIFFS = [
  { label: '900 VA', tariff: 1352 },
  { label: '1.300 VA', tariff: 1444.7 },
  { label: '2.200 VA', tariff: 1444.7 },
  { label: '3.500–5.500 VA', tariff: 1699.53 },
  { label: '6.600 VA ke atas', tariff: 1699.53 },
];