export const translations = {
  id: {
    // Header
    appTitle: 'EV Charging Calculator',
    appSubtitle: 'Hitung biaya & waktu pengisian daya',

    // Shared Inputs
    cardVehicleTitle: '🚗 Data Kendaraan & Charging',
    locationLabel: 'Lokasi Charging',
    locationHome: '🏠 Rumah',
    locationSpklu: '⚡ SPKLU',
    spkluInfo: 'Tarif SPKLU: Rp2.466,78/kWh + PBJT-TL 10%',
    homeDayaLabel: 'Daya Listrik Rumah',
    homeInfo: (tariff) => `Tarif: Rp${tariff}/kWh · Tanpa PBJT-TL`,
    evModelLabel: 'Pilih Model EV',
    evCustom: '✏️ Custom',
    batteryCapacityLabel: 'Kapasitas Baterai EV',
    currentBatteryLabel: 'Baterai Saat Ini',
    chargerTypeLabel: 'Tipe Charger',
    chargerPowerLabel: 'Daya Charger',
    efficiencyLabel: 'Efisiensi Pengisian',
    efficiencyConservative: '85% (konservatif)',
    efficiencyOptimal: '95% (optimal)',

    // Tab labels & tooltips
    tabTarget: '🎯 Target Baterai',
    tabTime: '⏱️ Waktu Pengisian',
    tabBudget: '💰 Anggaran',
    tooltipTarget: 'Tentukan target % baterai yang ingin dicapai. App akan menghitung energi, waktu, dan biaya yang dibutuhkan.',
    tooltipTime: 'Masukkan berapa lama waktu yang tersedia untuk mengisi daya. App akan menghitung seberapa penuh baterai dan biayanya.',
    tooltipBudget: 'Masukkan anggaran biaya yang dimiliki. App akan menghitung energi dan % baterai yang bisa didapat.',

    // Mode Target
    targetBatteryLabel: 'Baterai Target',
    warningOver80: 'Pengisian di atas 80% memperlambat laju pengisian dan dapat mempercepat degradasi baterai jangka panjang.',
    energyFromGrid: 'Energi dari PLN',
    energyToBattery: 'Energi ke Baterai',
    chargingTime: 'Waktu Pengisian',
    estimatedRange: 'Estimasi Jarak',
    basedOnBattery: (pct) => `Berdasarkan ${pct}% baterai`,

    // Mode Time
    chargingTimeLabel: 'Waktu Pengisian',
    jamUnit: 'jam',
    menitUnit: 'menit',
    batteryFinal: 'Baterai Akhir',
    chargeCompleteMsg: (time) => `Baterai akan penuh dalam ${time}, lebih cepat dari waktu yang tersedia.`,

    // Mode Budget
    budgetLabel: 'Biaya yang Tersedia',
    budgetPbjtInfo: 'Sudah termasuk PBJT-TL 10%',
    chargingTimeEst: 'Waktu Pengisian',

    // Result
    costBreakdown: 'Rincian Biaya',
    energyCostLabel: 'Biaya Energi',
    pbjtLabel: 'PBJT-TL',
    pbjtDesc: '10% dari biaya energi',
    totalCostLabel: 'Total Biaya',

    // Validation errors
    errorCapacity: 'Kapasitas harus lebih dari 0 kWh.',
    errorChargerPower: 'Daya charger harus lebih dari 0 kW.',
    errorCurrentBattery: 'Baterai saat ini harus antara 0–100%.',
    errorTargetRange: 'Target baterai harus antara 0–100%.',
    errorTargetMin: 'Target harus lebih besar dari baterai saat ini.',
    errorHours: 'Jam tidak boleh negatif.',
    errorMinutes: 'Menit harus antara 0–59.',
    errorTimeEmpty: 'Masukkan waktu yang tersedia.',
    errorBudgetZero: 'Biaya harus lebih dari Rp0.',

    // Misc
    progressBarLabel: 'Segmen berwarna = energi yang akan diisi',
  },

  en: {
    // Header
    appTitle: 'EV Charging Calculator',
    appSubtitle: 'Calculate charging cost & time',

    // Shared Inputs
    cardVehicleTitle: '🚗 Vehicle & Charging Data',
    locationLabel: 'Charging Location',
    locationHome: '🏠 Home',
    locationSpklu: '⚡ SPKLU',
    spkluInfo: 'SPKLU rate: Rp2,466.78/kWh + PBJT-TL 10%',
    homeDayaLabel: 'Home Power Capacity',
    homeInfo: (tariff) => `Rate: Rp${tariff}/kWh · No PBJT-TL`,
    evModelLabel: 'Select EV Model',
    evCustom: '✏️ Custom',
    batteryCapacityLabel: 'EV Battery Capacity',
    currentBatteryLabel: 'Current Battery',
    chargerTypeLabel: 'Charger Type',
    chargerPowerLabel: 'Charger Power',
    efficiencyLabel: 'Charging Efficiency',
    efficiencyConservative: '85% (conservative)',
    efficiencyOptimal: '95% (optimal)',

    // Tab labels & tooltips
    tabTarget: '🎯 Battery Target',
    tabTime: '⏱️ Charging Time',
    tabBudget: '💰 Budget',
    tooltipTarget: 'Set a target battery %. The app will calculate the energy, time, and cost needed.',
    tooltipTime: 'Enter how long you have to charge. The app will calculate how full the battery gets and the cost.',
    tooltipBudget: 'Enter your budget. The app will calculate how much energy and battery % you can get.',

    // Mode Target
    targetBatteryLabel: 'Target Battery',
    warningOver80: 'Charging above 80% slows down the charging rate and may accelerate long-term battery degradation.',
    energyFromGrid: 'Energy from Grid',
    energyToBattery: 'Energy to Battery',
    chargingTime: 'Charging Time',
    estimatedRange: 'Est. Range',
    basedOnBattery: (pct) => `Based on ${pct}% battery`,

    // Mode Time
    chargingTimeLabel: 'Charging Time',
    jamUnit: 'hr',
    menitUnit: 'min',
    batteryFinal: 'Final Battery',
    chargeCompleteMsg: (time) => `Battery will be full in ${time}, faster than the available time.`,

    // Mode Budget
    budgetLabel: 'Available Budget',
    budgetPbjtInfo: 'Includes PBJT-TL 10%',
    chargingTimeEst: 'Charging Time',

    // Result
    costBreakdown: 'Cost Breakdown',
    energyCostLabel: 'Energy Cost',
    pbjtLabel: 'PBJT-TL',
    pbjtDesc: '10% of energy cost',
    totalCostLabel: 'Total Cost',

    // Validation errors
    errorCapacity: 'Capacity must be greater than 0 kWh.',
    errorChargerPower: 'Charger power must be greater than 0 kW.',
    errorCurrentBattery: 'Current battery must be between 0–100%.',
    errorTargetRange: 'Target battery must be between 0–100%.',
    errorTargetMin: 'Target must be greater than current battery.',
    errorHours: 'Hours cannot be negative.',
    errorMinutes: 'Minutes must be between 0–59.',
    errorTimeEmpty: 'Please enter the available charging time.',
    errorBudgetZero: 'Budget must be greater than Rp0.',

    // Misc
    progressBarLabel: 'Colored segment = energy to be charged',
  },
};

export const langStore = (() => {
  const stored = localStorage.getItem('lang') ?? 'id';
  let _lang = stored;
  let _subscribers = [];

  return {
    subscribe(fn) {
      _subscribers.push(fn);
      fn(_lang);
      return () => { _subscribers = _subscribers.filter(s => s !== fn); };
    },
    toggle() {
      _lang = _lang === 'id' ? 'en' : 'id';
      localStorage.setItem('lang', _lang);
      _subscribers.forEach(s => s(_lang));
    },
    get() { return _lang; }
  };
})();

export function t(lang) {
  return translations[lang] ?? translations['id'];
}